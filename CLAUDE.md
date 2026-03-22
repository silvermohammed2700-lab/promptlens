# CLAUDE.md
# PromptLens — Full Project Instructions

## Cursor & Claude Code Instructions
- Build one step at a time and wait for my confirmation before moving to the next step
- Always show the file path before writing any code
- When you need credentials (Supabase URL, OpenRouter key, etc.), stop and ask me
- Never write placeholder or mock code — write production-ready code only
- Never use "any" TypeScript types
- One component per file
- Always add loading and error states to every async operation
- Test on 375px mobile width minimum

---

## Project Overview

You are building "PromptLens" — a production-ready Image to Prompt SaaS web application.
PromptLens converts any image into optimized AI prompts for Midjourney, DALL-E 3,
Stable Diffusion, Flux, Nano Banana 2, Nano Banana Pro, and General use.
Full-stack SaaS with authentication, subscription plans, admin panel,
analytics, ad management, and concurrency protection.

---

## Tech Stack

Frontend:
- Next.js 14 (App Router)
- TypeScript (strict mode, no any types)
- Tailwind CSS
- SWR for data fetching
- Zustand for global state

Backend:
- Next.js API Routes (all server logic here)
- Prisma ORM -> Supabase PostgreSQL
- NextAuth.js v5 (Email + Google OAuth)
- Stripe for subscriptions

Database:
- Supabase (PostgreSQL) at https://supabase.com
- Prisma as ORM layer

AI:
- OpenRouter API (free models to start)
- Default model: "meta-llama/llama-3.2-11b-vision-instruct:free"
- Fallback model: "google/gemini-2.0-flash-exp:free"
- Admin can switch models from dashboard
- Later: swap to Anthropic Claude when ready

Analytics: Google Analytics 4 + Microsoft Clarity
Deployment: Vercel

---

## Project Structure

promptlens/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/
│   │   ├── page.tsx
│   │   ├── pricing/page.tsx
│   │   └── saved/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── generate/route.ts
│   │   ├── describe/route.ts
│   │   ├── compare/route.ts
│   │   ├── prompts/
│   │   │   ├── save/route.ts
│   │   │   └── share/[id]/route.ts
│   │   ├── admin/
│   │   │   ├── users/route.ts
│   │   │   ├── stats/route.ts
│   │   │   ├── settings/route.ts
│   │   │   └── queue-status/route.ts
│   │   ├── settings/public/route.ts
│   │   └── webhooks/stripe/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Toggle.tsx
│   │   ├── Toast.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   ├── tool/
│   │   ├── ImageUploader.tsx
│   │   ├── ModelSelector.tsx
│   │   ├── PromptResult.tsx
│   │   ├── PromptHistory.tsx
│   │   └── CompareView.tsx
│   ├── admin/
│   │   ├── AdminLayout.tsx
│   │   ├── OverviewTab.tsx
│   │   ├── UsersTab.tsx
│   │   ├── RevenueTab.tsx
│   │   ├── AdsTab.tsx
│   │   ├── VisitorsTab.tsx
│   │   ├── EventsTab.tsx
│   │   └── SettingsTab.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── FreeBanner.tsx
│   └── ads/
│       ├── AdSlot.tsx
│       └── InterstitialAd.tsx
├── lib/
│   ├── prisma.ts
│   ├── openrouter.ts
│   ├── auth.ts
│   ├── stripe.ts
│   ├── settings.ts
│   ├── rateLimit.ts
│   └── analytics.ts
├── hooks/
│   ├── useUser.ts
│   ├── useSiteSettings.ts
│   └── usePromptGeneration.ts
├── types/
│   └── index.ts
├── prisma/
│   └── schema.prisma
└── .env.local

---

## Database Schema (Supabase + Prisma)

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  plan          String    @default("free")
  role          String    @default("user")
  promptsToday  Int       @default(0)
  promptsTotal  Int       @default(0)
  savedPrompts  Json      @default("[]")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
  events        PromptEvent[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model PromptEvent {
  id        String   @id @default(cuid())
  userId    String?
  event     String
  params    Json     @default("{}")
  createdAt DateTime @default(now())
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
}

model SavedPrompt {
  id        String   @id @default(cuid())
  userId    String
  text      String
  model     String
  imageUrl  String?
  shareId   String?  @unique @default(cuid())
  isPublic  Boolean  @default(false)
  createdAt DateTime @default(now())
}

model SiteSettings {
  id               String   @id @default("singleton")
  freeMode         Boolean  @default(false)
  maintenanceMode  Boolean  @default(false)
  siteName         String   @default("PromptLens")
  maxFreePrompts   Int      @default(5)
  maxProPrompts    Int      @default(200)
  showPricing      Boolean  @default(true)
  allowSignup      Boolean  @default(true)
  aiModel          String   @default("meta-llama/llama-3.2-11b-vision-instruct:free")
  aiFallbackModel  String   @default("google/gemini-2.0-flash-exp:free")
  adSettings       Json     @default("{}")
  updatedAt        DateTime @updatedAt
  updatedBy        String?
}

model AdminAuditLog {
  id        String   @id @default(cuid())
  adminId   String
  action    String
  details   Json     @default("{}")
  createdAt DateTime @default(now())
}

---

## Environment Variables

DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
OPENROUTER_API_KEY=""
OPENROUTER_BASE_URL="https://openrouter.ai/api/v1"
STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PRO_PRICE_ID=""
STRIPE_ULTRA_PRICE_ID=""
NEXT_PUBLIC_GA4_ID=""
NEXT_PUBLIC_CLARITY_ID=""
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""

---

## Subscription Plans

Free:  5 prompts/day  | 3 models (Midjourney, DALL-E 3, General) | JPG/PNG/WEBP only
Pro:   $9/mo  | 200 prompts/day | 5 models | all 10+ formats | batch 5 images | save + share prompts
Ultra: $19/mo | unlimited prompts | all 7 models | batch 20 images | Text to Prompt | API access

All limits are bypassed when freeMode = true in SiteSettings.
ALWAYS enforce limits server-side. Never trust client-side plan checks.

---

## AI Models

Build a tailored system prompt for each target AI image model:

Midjourney:
  End prompt with: --ar X:Y --v 6.1 --style raw

Stable Diffusion:
  Include negative prompts + quality tags like (masterpiece:1.2)

Flux:
  Rich natural-language scene descriptions, atmosphere-focused

DALL-E 3:
  Vivid descriptive natural language, no special parameters

Nano Banana 2 (Gemini 3.1 Flash Image):
  Structure: subject / scene / lighting / colors / text elements / style / camera / quality
  Excels at: multilingual text in images, character consistency, physics accuracy

Nano Banana Pro (Gemini 3 Pro Image):
  Expert multi-layer: subject, scene composition, professional lighting (key/fill/rim),
  color grading, textures, camera specs (85mm, f/1.8), art direction
  End with: "Studio-quality render, 4K ultra HD, photorealistic detail"

General:
  Universal prompt that works across all platforms

Output languages supported: English, Arabic, French, German, Spanish, Chinese

---

## Image Processing (Client Side)

Supported formats: JPG, PNG, WEBP, GIF, BMP, TIFF, AVIF, HEIC, SVG, ICO (10+ formats)
Non-native formats auto-convert to JPEG via Canvas API before sending to API
Max image size: 5MB — reject with 413 before processing

async function convertToJpeg(file: File): Promise<{ base64: string; mimeType: string }> {
  const MAX = 2048;
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await new Promise(res => { img.onload = res; });
  let { width: w, height: h } = img;
  if (w > MAX || h > MAX) {
    if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
    else { w = Math.round(w * MAX / h); h = MAX; }
  }
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  URL.revokeObjectURL(img.src);
  return new Promise(res => {
    canvas.toBlob(blob => {
      const reader = new FileReader();
      reader.onload = e => res({
        base64: (e.target!.result as string).split(",")[1],
        mimeType: "image/jpeg"
      });
      reader.readAsDataURL(blob!);
    }, "image/jpeg", 0.92);
  });
}

---

## Concurrency & Rate Limit Handling

The site must handle 100+ simultaneous users gracefully.

--- Layer 1: OpenRouter Queue (lib/openrouter.ts) ---

const MAX_CONCURRENT = 10;
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

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);
    if (response.status === 429) {
      if (attempt === maxRetries - 1) throw new Error("RATE_LIMIT_EXCEEDED");
      await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      continue;
    }
    if (response.status === 503 || response.status === 502) {
      if (attempt === maxRetries - 1) throw new Error("SERVICE_UNAVAILABLE");
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }
    return response;
  }
  throw new Error("MAX_RETRIES_EXCEEDED");
}

export async function generatePromptFromImage(
  base64Image: string,
  mimeType: string,
  systemPrompt: string,
  userMessage: string,
  modelId?: string
): Promise<string> {
  const settings = await getSiteSettings();
  const model = modelId ?? settings.aiModel ?? FREE_MODELS[0].id;
  await acquireSlot();
  try {
    const response = await fetchWithRetry(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
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
      }
    );
    if (!response.ok) {
      if (model !== settings.aiFallbackModel) {
        return generatePromptFromImage(
          base64Image, mimeType, systemPrompt, userMessage, settings.aiFallbackModel
        );
      }
      throw new Error(`API_ERROR_${response.status}`);
    }
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() ?? "";
  } finally {
    releaseSlot();
  }
}

export function getQueueStatus() {
  return {
    active: activeRequests,
    waiting: waitingQueue.length,
    maxConcurrent: MAX_CONCURRENT,
  };
}

export const FREE_MODELS = [
  { id: "meta-llama/llama-3.2-11b-vision-instruct:free", name: "Llama 3.2 Vision 11B", vision: true },
  { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash", vision: true },
  { id: "microsoft/phi-3.5-vision-instruct:free", name: "Phi-3.5 Vision", vision: true },
];

--- Layer 2: Supabase Connection Pooling (lib/prisma.ts) ---

import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

Always use DATABASE_URL with port 6543 + pgbouncer=true + connection_limit=1
Always use DIRECT_URL with port 5432 for migrations only

--- Layer 3: API Route Protection (every image API route) ---

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const estimatedBytes = (base64.length * 3) / 4;
if (estimatedBytes > MAX_IMAGE_SIZE) {
  return Response.json({ error: "Image too large. Maximum 5MB." }, { status: 413 });
}

--- Layer 4: Per-User Rate Limiting (lib/rateLimit.ts) ---

interface RateLimitEntry { count: number; resetAt: number; }
const ipLimits = new Map<string, RateLimitEntry>();
const userLimits = new Map<string, RateLimitEntry>();

function checkLimit(
  map: Map<string, RateLimitEntry>,
  key: string,
  maxRequests: number,
  windowMs: number
) {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || now > entry.resetAt) {
    map.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }
  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }
  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now };
}

export const checkIpLimit = (ip: string) => checkLimit(ipLimits, ip, 10, 60_000);
export const checkUserLimit = (userId: string) => checkLimit(userLimits, userId, 20, 60_000);

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of ipLimits) if (now > entry.resetAt) ipLimits.delete(key);
  for (const [key, entry] of userLimits) if (now > entry.resetAt) userLimits.delete(key);
}, 5 * 60_000);

--- Layer 5: Frontend UX During High Load (hooks/usePromptGeneration.ts) ---

type GenerationStatus =
  | "idle" | "uploading" | "queued"
  | "generating" | "retrying" | "done" | "error";

const STATUS_MESSAGES: Record<GenerationStatus, string> = {
  idle: "",
  uploading: "Preparing image...",
  queued: "High demand — your request is queued, please wait...",
  generating: "Analyzing image and generating prompt...",
  retrying: "High demand — retrying automatically...",
  done: "Prompt ready!",
  error: "Something went wrong. Please try again.",
};

On 429 response: set status to "queued" and auto-retry after 3 seconds.
Never show a raw error message to the user during high load.

--- Layer 6: Admin Queue Monitor (app/api/admin/queue-status/route.ts) ---

import { getQueueStatus } from "@/lib/openrouter";
export async function GET() {
  // verify admin role first
  return Response.json(getQueueStatus());
}

Show in Admin Overview tab:
- Active requests / max (e.g. 7/10)
- Waiting queue depth (e.g. 23 waiting)
- Color-coded capacity bar: green < 50%, yellow 50-80%, red > 80%
- Refresh every 5 seconds with SWR

---

## Site Settings & Free Mode

--- Settings Cache (lib/settings.ts) ---

let cachedSettings: any = null;
let cacheTime = 0;
const CACHE_TTL = 30_000;

export async function getSiteSettings() {
  const now = Date.now();
  if (cachedSettings && now - cacheTime < CACHE_TTL) return cachedSettings;
  cachedSettings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!cachedSettings) {
    cachedSettings = await prisma.siteSettings.create({ data: { id: "singleton" } });
  }
  cacheTime = now;
  return cachedSettings;
}

export function invalidateSettingsCache() {
  cachedSettings = null;
  cacheTime = 0;
}

--- Free Mode Logic in every API route ---

const settings = await getSiteSettings();

if (settings.maintenanceMode && session?.user?.role !== "admin") {
  return Response.json({ error: "Site is under maintenance" }, { status: 503 });
}

if (!settings.freeMode && session?.user) {
  const limits = {
    free: settings.maxFreePrompts,
    pro: settings.maxProPrompts,
    ultra: Infinity
  };
  const limit = limits[user.plan as keyof typeof limits] ?? limits.free;
  if (user.promptsToday >= limit) {
    return Response.json(
      { error: "Daily limit reached", upgradeUrl: "/pricing" },
      { status: 429 }
    );
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { promptsToday: { increment: 1 }, promptsTotal: { increment: 1 } }
  });
}

--- Free Mode Frontend Behavior ---

Fetch /api/settings/public on app load using SWR with 60s cache.
When freeMode is true:
- Show yellow banner below header: "🎁 Free Mode Active — All features unlocked for everyone"
- Hide all upgrade buttons and pricing banners
- Unlock all 7 AI models for everyone
- Remove daily usage bar and limit warnings
- freeMode never changes user.plan in DB — only bypasses enforcement temporarily

--- Admin Settings Tab Controls ---

1. FREE MODE TOGGLE
   - Large prominent toggle with yellow/warning styling when ON
   - Requires confirmation dialog before enabling: "This will bypass all payment restrictions for all users. Continue?"
   - When ON: show badge "Revenue paused — all limits bypassed"
   - When OFF: show badge "Normal billing active"
   - Every toggle logged to AdminAuditLog: adminId + action + timestamp + previousValue

2. MAINTENANCE MODE — toggle
3. ALLOW NEW SIGNUPS — toggle
4. SHOW PRICING PAGE — toggle
5. FREE PLAN DAILY LIMIT — number input (default 5)
6. PRO PLAN DAILY LIMIT — number input (default 200)
7. AI MODEL — dropdown from FREE_MODELS + custom model ID input
8. SITE NAME — text input

Save button: POST /api/admin/settings -> invalidateSettingsCache() -> success toast

--- Admin Settings API (app/api/admin/settings/route.ts) ---

export async function POST(req: Request) {
  // verify admin role
  const body = await req.json();

  if ("freeMode" in body) {
    const current = await getSiteSettings();
    if (current.freeMode !== body.freeMode) {
      await prisma.adminAuditLog.create({
        data: {
          adminId: session.user.id,
          action: body.freeMode ? "FREE_MODE_ENABLED" : "FREE_MODE_DISABLED",
          details: { previous: current.freeMode, new: body.freeMode }
        }
      });
    }
  }

  const updated = await prisma.siteSettings.update({
    where: { id: "singleton" },
    data: { ...body, updatedBy: session.user.id }
  });

  invalidateSettingsCache();
  return Response.json(updated);
}

---

## Admin Panel (route: /admin, role="admin" only)

7 tabs:

1. Overview
   - KPIs: total users, total prompts, MRR, paid users
   - Plan distribution bar chart (free / pro / ultra)
   - Recent events log (last 10)
   - Usage stats: prompts, uploads, copies, compares
   - Live queue status widget (refreshes every 5s)

2. Visitors
   - Prompts by AI model (bar chart)
   - GA4 / Clarity / Search Console ID configuration fields
   - Save button reloads to apply

3. Users
   - Searchable table: name, email, plan, total prompts, joined date, status
   - Actions per row: upgrade to Pro, upgrade to Ultra, delete

4. Revenue
   - KPIs: MRR, ARR, Pro subscribers count, Ultra subscribers count
   - Paid subscribers list with avatar + plan + monthly amount
   - Stripe setup instructions card

5. Ad Manager
   - 5 placement cards: top_leaderboard, below_hero, below_result, sticky_bottom, sidebar_right
   - Each card: enable/disable toggle, platform dropdown, publisher ID input, ad code textarea
   - All changes auto-saved to SiteSettings.adSettings

6. Events Log
   - Chronological list of all PromptEvent records
   - Columns: time, event name, params
   - Clear all button

7. Settings
   - All controls described in Site Settings section above

---

## Ad System

5 configurable placements stored in SiteSettings.adSettings (JSON):

top_leaderboard   728x90     Top of page
below_hero        300x250    After headline section
below_result      Responsive After prompt output
sticky_bottom     Responsive Fixed bottom bar with X close button
sidebar_right     160x600    Desktop right sidebar only

Supported ad platforms: AdSense, Media.net, Ezoic, PropellerAds, MGID, Taboola, Custom HTML/JS

Interstitial ad:
- Triggered after every prompt generation
- Full-screen overlay with backdrop blur
- 5-second countdown timer before close button becomes active
- Admin can enable/disable and set ad code from Admin Panel

---

## SEO

Target keywords:
"image to prompt"
"convert image to prompt"
"midjourney prompt from image"
"stable diffusion prompt generator from image"
"free image to prompt converter"
"ai image prompt generator"
"photo to prompt"
"picture to ai prompt"

Every page must have:
- Dynamic title and meta description
- JSON-LD structured data: WebApplication, FAQPage, HowTo, BreadcrumbList
- hreflang tags for 6 languages: en, ar, fr, de, es, zh
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter Card tags
- Canonical URL

Homepage SEO sections:
- FAQ section (8 questions and answers)
- How It Works (4 steps)
- Features grid (8 features)
- Footer with keyword tag cloud

---

## Analytics

Track all events to GA4 + Microsoft Clarity + PromptEvent table in Supabase:

image_uploaded      { format, size, converted }
format_converted    { from, to }
url_loaded          { type }
prompt_generated    { model, detail, language, quality_score }
describe_generated  { language }
compare_clicked     { models }
prompt_copied       { length }
history_clicked     { model }
free_mode_toggled   { enabled_by, timestamp }

---

## UI/UX Design System

Theme: Dark

Colors:
  background   #07070f
  surface      #0f0f1a
  surface-2    #161624
  surface-3    #1e1e30
  border       #25253a
  border-2     #32324e
  accent       #7c5cfc   (purple — primary)
  accent-2     #fc5c7d   (pink)
  accent-3     #5cfcbc   (green)
  accent-4     #fcb75c   (gold)
  text         #eeeeff
  muted        #6868a0
  dim          #3a3a60

Fonts:
  Headings:       Syne, weight 800 (Google Fonts)
  Labels/code:    Space Mono, weight 400/700 (Google Fonts)

Design rules:
  - Mobile-first, fully responsive (375px minimum width)
  - Minimum 36px tap targets on all interactive elements
  - Sticky header with backdrop-filter: blur(16px)
  - Animated gradient progress bar for loading states
  - Toast notifications for all async action results
  - Cards animate in with slide-up keyframe
  - Every async operation must have both loading and error states
  - No hover-only interactions — must work on touch devices

---

## Competitor Advantages (vs imagetoprompt.org)

7 AI models vs their 5
10+ image formats vs their 2
6 output languages vs their 1
Model comparison feature (they don't have it)
Prompt quality score 0-100 (they don't have it)
Integrated image description mode
Prompt history with thumbnails
Full SaaS: auth + subscriptions + admin panel
Free Mode toggle for promotional campaigns
Concurrency protection for 100+ simultaneous users

---

## Development Priority Order

Step 1:  Project scaffold — Next.js 14 + TypeScript + Tailwind + Prisma setup
Step 2:  Supabase connection — run prisma db push and prisma generate
Step 3:  Core tool — image upload + OpenRouter API + prompt generation working end-to-end
Step 4:  Image format conversion — Canvas API for HEIC, AVIF, BMP, TIFF, SVG, ICO
Step 5:  All 7 AI model system prompts with tailored instructions
Step 6:  Authentication — NextAuth v5 + email/password + Google OAuth
Step 7:  Plan limits enforcement — server-side only, never trust client
Step 8:  Concurrency protection — queue + exponential retry + per-user rate limiting
Step 9:  Stripe subscriptions + webhook handler
Step 10: Admin panel — all 7 tabs including Settings
Step 11: Free Mode toggle — full implementation frontend + backend
Step 12: SEO — meta tags + JSON-LD structured data + sitemap.xml + robots.txt
Step 13: Analytics — GA4 + Clarity + internal PromptEvent tracking
Step 14: Ad system — 5 placements + interstitial with countdown
Step 15: Advanced features — batch upload (Pro/Ultra), Text to Prompt (Ultra), share links
Step 16: Performance optimization + Vercel deployment

After completing each step, stop and wait for my confirmation before proceeding.

---

## Supabase Setup Steps

1. Create new project at supabase.com
2. Go to Settings > Database > Connection string
3. Copy Transaction mode URL (port 6543) -> DATABASE_URL (add ?pgbouncer=true&connection_limit=1)
4. Copy Session mode URL (port 5432) -> DIRECT_URL
5. Run: npx prisma db push
6. Run: npx prisma generate
7. Enable Row Level Security on all tables in Supabase dashboard

---

## Capacity Reference

With free OpenRouter plan:
  ~20 prompts/minute
  ~1,200 prompts/hour
  ~28,800 prompts/day

After upgrading OpenRouter ($10/month):
  ~200 prompts/minute
  ~12,000 prompts/hour
  ~288,000 prompts/day

How 100 concurrent users are handled:
  Vercel spawns 100 serverless functions in parallel         OK
  Supabase handles via pgbouncer connection pooling          OK
  Per-user rate limiter blocks spam (max 20 req/min)         OK
  Queue limits OpenRouter to 10 concurrent calls             OK
  90 excess requests wait in queue instead of failing        OK
  429 from OpenRouter triggers 1s, 2s, 4s backoff retry      OK
  Fallback model used if primary model fails                 OK
  User sees "queued" message instead of error                OK
  Admin sees live queue depth in dashboard                   OK

---

## Critical Rules

NEVER expose API keys to the client — all AI calls go through /api routes
ALWAYS enforce plan limits server-side — never trust client-side checks
ALWAYS validate and sanitize all file uploads server-side
USE TypeScript strictly — no "any" types anywhere
ONE component per file — keep components small and focused
ADD loading and error states to every async operation
USE Prisma transactions for operations touching multiple tables
CACHE SiteSettings for 30 seconds server-side to avoid DB hammering
LOG every admin action to AdminAuditLog table
INVALIDATE settings cache immediately after any settings update
REQUIRE confirmation dialog before enabling Free Mode
TEST on 375px mobile width minimum
ASK before making any major architectural decisions
WAIT for my confirmation after completing each step