import { getSiteSettings } from "@/lib/settings";
import type { AIModel } from "@/types";

// ─── All confirmed free vision models (in quality order) ─────────────────────

export const FREE_VISION_MODELS = [
  "mistralai/mistral-small-3.1-24b-instruct:free",
  "google/gemma-3-27b-it:free",
  "google/gemma-3-12b-it:free",
  "nvidia/nemotron-nano-12b-v2-vl:free",
  "google/gemma-3-4b-it:free",
];

export const FREE_MODELS: AIModel[] = [
  { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "Mistral Small 3.1 24B", vision: true },
  { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B", vision: true },
  { id: "google/gemma-3-12b-it:free", name: "Gemma 3 12B", vision: true },
  { id: "nvidia/nemotron-nano-12b-v2-vl:free", name: "Nvidia Nemotron 12B", vision: true },
  { id: "google/gemma-3-4b-it:free", name: "Gemma 3 4B (Fast)", vision: true },
];

// ─── API Key Rotation ─────────────────────────────────────────────────────────

function getApiKeys(): string[] {
  const multi = process.env.OPENROUTER_API_KEYS;
  if (multi) return multi.split(",").map((k) => k.trim()).filter(Boolean);
  const single = process.env.OPENROUTER_API_KEY;
  return single ? [single] : [];
}

let keyIndex = 0;
function getNextApiKey(): string {
  const keys = getApiKeys();
  if (keys.length === 0) throw new Error("No OpenRouter API key configured");
  const key = keys[keyIndex % keys.length];
  keyIndex = (keyIndex + 1) % keys.length;
  return key!;
}

// ─── Concurrency Queue ────────────────────────────────────────────────────────

const MAX_CONCURRENT = 10;
let activeRequests = 0;
const waitingQueue: Array<() => void> = [];

function acquireSlot(): Promise<void> {
  return new Promise((resolve) => {
    if (activeRequests < MAX_CONCURRENT) {
      activeRequests++;
      resolve();
    } else {
      waitingQueue.push(() => {
        activeRequests++;
        resolve();
      });
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

// ─── Single model attempt ─────────────────────────────────────────────────────

async function callModel(
  model: string,
  base64Image: string,
  mimeType: string,
  systemPrompt: string,
  userMessage: string
): Promise<{ ok: boolean; text: string; status: number }> {
  const apiKey = getNextApiKey();
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

  if (!response.ok) {
    return { ok: false, text: "", status: response.status };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  return { ok: true, text, status: 200 };
}

// ─── Main Generate Function (with model rotation on 429) ─────────────────────

export async function generatePromptFromImage(
  base64Image: string,
  mimeType: string,
  systemPrompt: string,
  userMessage: string,
  modelId?: string
): Promise<string> {
  const settings = await getSiteSettings();
  await acquireSlot();

  try {
    // If a specific model is requested, try it first then fall back
    const primaryModel = modelId ?? settings.aiModel ?? FREE_VISION_MODELS[0]!;

    // Build the rotation list: primary model first, then all other free vision models
    const rotationList = [
      primaryModel,
      ...FREE_VISION_MODELS.filter((m) => m !== primaryModel),
    ];

    let lastError = "Generation failed. Please try again.";

    for (const model of rotationList) {
      try {
        const result = await callModel(model, base64Image, mimeType, systemPrompt, userMessage);

        if (result.ok && result.text) {
          return result.text;
        }

        if (result.status === 429) {
          // Rate limited on this model — try next one immediately
          lastError = "Rate limit reached — trying next model...";
          continue;
        }

        if (result.status === 404 || result.status === 400) {
          // Model not found or bad request — try next
          continue;
        }

        if (result.status >= 500) {
          // Server error — try next
          continue;
        }

      } catch {
        // Network error — try next model
        continue;
      }
    }

    throw new Error(lastError);
  } finally {
    releaseSlot();
  }
}

// ─── Queue Status ─────────────────────────────────────────────────────────────

export function getQueueStatus() {
  return {
    active: activeRequests,
    waiting: waitingQueue.length,
    maxConcurrent: MAX_CONCURRENT,
  };
}
