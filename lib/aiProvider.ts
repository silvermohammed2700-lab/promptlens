/**
 * Multi-provider AI system with automatic fallback.
 *
 * Priority order:
 *   1. Google Gemini 1.5 Flash  — 1,500 req/day free
 *   2. Groq llama-4-scout-17b   — 1,000 req/day, 30 req/min free
 *   3. OpenRouter               — multiple free vision models with rotation
 */

import { FREE_VISION_MODELS } from "@/lib/openrouter";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AIProvider = "gemini" | "groq" | "openrouter";

export interface ProviderResult {
  text: string;
  provider: AIProvider;
  model: string;
}

// ─── Groq Rate Limit Tracking ─────────────────────────────────────────────────

const GROQ_DAILY_LIMIT = 1000;
const GROQ_DAILY_WARNING = 950; // 95% of limit
const GROQ_RPM_LIMIT = 30;
const GROQ_TPM_LIMIT = 30_000;
const GROQ_TOKENS_PER_REQUEST = 500; // estimated tokens per image request

interface GroqDailyCounter {
  count: number;
  date: string; // YYYY-MM-DD UTC
}

interface GroqMinuteWindow {
  requests: number[];   // timestamps (ms) of requests in last 60s
  tokens: number[];     // [timestamp, tokens] pairs flattened — use tokenTimestamps
  tokenTimestamps: { ts: number; tokens: number }[];
}

const groqDaily: GroqDailyCounter = { count: 0, date: "" };
const groqWindow: GroqMinuteWindow = { requests: [], tokens: [], tokenTimestamps: [] };

function getUtcDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function resetDailyIfNeeded(): void {
  const today = getUtcDateString();
  if (groqDaily.date !== today) {
    groqDaily.count = 0;
    groqDaily.date = today;
  }
}

function pruneMinuteWindow(): void {
  const now = Date.now();
  const cutoff = now - 60_000;
  groqWindow.requests = groqWindow.requests.filter((ts) => ts > cutoff);
  groqWindow.tokenTimestamps = groqWindow.tokenTimestamps.filter((e) => e.ts > cutoff);
}

function getGroqRequestsThisMinute(): number {
  pruneMinuteWindow();
  return groqWindow.requests.length;
}

function getGroqTokensThisMinute(): number {
  pruneMinuteWindow();
  return groqWindow.tokenTimestamps.reduce((sum, e) => sum + e.tokens, 0);
}

function recordGroqRequest(tokens = GROQ_TOKENS_PER_REQUEST): void {
  const now = Date.now();
  groqWindow.requests.push(now);
  groqWindow.tokenTimestamps.push({ ts: now, tokens });
  resetDailyIfNeeded();
  groqDaily.count++;
}

async function waitForGroqTokenBudget(): Promise<void> {
  const tokensUsed = getGroqTokensThisMinute();
  const remaining = GROQ_TPM_LIMIT - tokensUsed;
  if (remaining < 1000) {
    // Wait until the oldest token usage expires from the window
    const oldest = groqWindow.tokenTimestamps[0];
    if (oldest) {
      const waitMs = Math.max(0, oldest.ts + 60_000 - Date.now() + 500);
      console.warn(`[groq] Token budget low (${remaining} remaining). Waiting ${waitMs}ms...`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

export function getGroqStatus() {
  resetDailyIfNeeded();
  pruneMinuteWindow();
  const used = groqDaily.count;
  const remaining = Math.max(0, GROQ_DAILY_LIMIT - used);
  const pct = Math.round((used / GROQ_DAILY_LIMIT) * 100);
  return {
    used,
    remaining,
    dailyLimit: GROQ_DAILY_LIMIT,
    pct,
    requestsThisMinute: getGroqRequestsThisMinute(),
    tokensThisMinute: getGroqTokensThisMinute(),
    rpmLimit: GROQ_RPM_LIMIT,
  };
}

// ─── Concurrency Queue (safe under 30 req/min) ────────────────────────────────

const MAX_CONCURRENT = 8;
let activeRequests = 0;
const waitingQueue: Array<() => void> = [];

function acquireSlot(): Promise<void> {
  return new Promise((resolve) => {
    if (activeRequests < MAX_CONCURRENT) {
      activeRequests++;
      resolve();
    } else {
      waitingQueue.push(() => { activeRequests++; resolve(); });
    }
  });
}

function releaseSlot(): void {
  activeRequests--;
  if (waitingQueue.length > 0) {
    const next = waitingQueue.shift();
    if (next) next();
  }
}

export function getQueueStatus() {
  return { active: activeRequests, waiting: waitingQueue.length, maxConcurrent: MAX_CONCURRENT };
}

// ─── Provider 1: Google Gemini 1.5 Flash ─────────────────────────────────────

async function callGemini(
  base64Image: string,
  mimeType: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{
          role: "user",
          parts: [
            { inline_data: { mime_type: mimeType, data: base64Image } },
            { text: userMessage },
          ],
        }],
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 },
      }),
    }
  );

  if (response.status === 429) throw new Error("RATE_LIMIT");
  if (!response.ok) {
    const err = await response.text().catch(() => "");
    throw new Error(`Gemini ${response.status}: ${err.slice(0, 200)}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    error?: { message: string };
  };

  if (data.error) throw new Error(`Gemini: ${data.error.message}`);
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!text) throw new Error("Gemini returned empty response");
  return text;
}

// ─── Provider 2: Groq (with full rate limit management) ───────────────────────

const GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MAX_RETRIES = 3;

async function callGroq(
  base64Image: string,
  mimeType: string,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  // Check daily limit
  resetDailyIfNeeded();
  if (groqDaily.count >= GROQ_DAILY_WARNING) {
    throw new Error("Daily limit almost reached, resets at midnight UTC");
  }
  if (groqDaily.count >= GROQ_DAILY_LIMIT) {
    throw new Error("RATE_LIMIT");
  }

  // Check RPM limit
  if (getGroqRequestsThisMinute() >= GROQ_RPM_LIMIT - 2) {
    throw new Error("RATE_LIMIT");
  }

  // Wait if token budget is low
  await waitForGroqTokenBudget();

  for (let attempt = 0; attempt < GROQ_MAX_RETRIES; attempt++) {
    const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } },
              { type: "text", text: userMessage },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (response.status === 429) {
      // Respect the Retry-After header
      const retryAfter = parseInt(response.headers.get("retry-after") ?? "10", 10);
      const waitSec = isNaN(retryAfter) ? 10 : Math.min(retryAfter, 60);
      console.warn(`[groq] 429 rate limited. Retry-After: ${waitSec}s (attempt ${attempt + 1}/${GROQ_MAX_RETRIES})`);
      if (attempt === GROQ_MAX_RETRIES - 1) throw new Error("RATE_LIMIT");
      await new Promise((r) => setTimeout(r, waitSec * 1000));
      continue;
    }

    if (!response.ok) {
      const err = await response.text().catch(() => "");
      throw new Error(`Groq ${response.status}: ${err.slice(0, 200)}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      error?: { message: string };
      usage?: { total_tokens?: number };
    };

    if (data.error) throw new Error(`Groq: ${data.error.message}`);

    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) throw new Error("Groq returned empty response");

    // Record successful request with actual token usage
    recordGroqRequest(data.usage?.total_tokens ?? GROQ_TOKENS_PER_REQUEST);
    return text;
  }

  throw new Error("RATE_LIMIT");
}

// ─── Provider 3: OpenRouter (with model rotation) ────────────────────────────

async function callOpenRouter(
  base64Image: string,
  mimeType: string,
  systemPrompt: string,
  userMessage: string
): Promise<{ text: string; model: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  for (const model of FREE_VISION_MODELS) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXTAUTH_URL ?? "http://localhost:3000",
        "X-Title": "PromptLens",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } },
              { type: "text", text: userMessage },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (response.status === 429 || response.status === 404 || response.status >= 500) continue;
    if (!response.ok) continue;

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (text) return { text, model };
  }

  throw new Error("All AI providers are temporarily rate limited. Please try again in a moment.");
}

// ─── Main Multi-Provider Function ─────────────────────────────────────────────

export async function generateWithFallback(
  base64Image: string,
  mimeType: string,
  systemPrompt: string,
  userMessage: string
): Promise<ProviderResult> {
  await acquireSlot();

  try {
    // 1️⃣ Try Gemini first
    if (process.env.GEMINI_API_KEY) {
      try {
        const text = await callGemini(base64Image, mimeType, systemPrompt, userMessage);
        return { text, provider: "gemini", model: "gemini-1.5-flash" };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        const isRateLimit = msg === "RATE_LIMIT" || msg.includes("429") || msg.includes("quota");
        console.warn(`[aiProvider] Gemini ${isRateLimit ? "rate limited" : `failed: ${msg}`} → trying Groq`);
      }
    }

    // 2️⃣ Try Groq
    if (process.env.GROQ_API_KEY) {
      try {
        const text = await callGroq(base64Image, mimeType, systemPrompt, userMessage);
        return { text, provider: "groq", model: GROQ_MODEL };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        const isRateLimit = msg === "RATE_LIMIT" || msg.includes("429") || msg.includes("Daily limit");
        console.warn(`[aiProvider] Groq ${isRateLimit ? "rate limited" : `failed: ${msg}`} → trying OpenRouter`);
      }
    }

    // 3️⃣ Try OpenRouter with model rotation
    const { text, model } = await callOpenRouter(base64Image, mimeType, systemPrompt, userMessage);
    return { text, provider: "openrouter", model };

  } finally {
    releaseSlot();
  }
}
