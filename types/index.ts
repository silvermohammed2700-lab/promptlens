// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserPlan = "free" | "pro" | "ultra";
export type UserRole = "user" | "admin";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  plan: UserPlan;
  role: UserRole;
  promptsToday: number;
  promptsTotal: number;
  createdAt: Date;
}

// ─── AI Models ───────────────────────────────────────────────────────────────

export type TargetModel =
  | "midjourney"
  | "stable-diffusion"
  | "flux"
  | "dalle3"
  | "nano-banana-2"
  | "nano-banana-pro"
  | "general";

export interface AIModel {
  id: string;
  name: string;
  vision: boolean;
}

export interface TargetModelOption {
  id: TargetModel;
  label: string;
  description: string;
  plans: UserPlan[];
}

// ─── Prompt Generation ───────────────────────────────────────────────────────

export type OutputLanguage = "en" | "ar" | "fr" | "de" | "es" | "zh";

export interface GenerateRequest {
  base64Image: string;
  mimeType: string;
  targetModel: TargetModel;
  language: OutputLanguage;
  detail?: "low" | "medium" | "high";
}

export interface GenerateResponse {
  prompt: string;
  qualityScore: number;
  model: string;
  targetModel: TargetModel;
}

export type GenerationStatus =
  | "idle"
  | "uploading"
  | "queued"
  | "generating"
  | "retrying"
  | "done"
  | "error";

// ─── Saved Prompts ───────────────────────────────────────────────────────────

export interface SavedPrompt {
  id: string;
  userId: string;
  text: string;
  model: TargetModel;
  imageUrl: string | null;
  shareId: string | null;
  isPublic: boolean;
  createdAt: Date;
}

// ─── Site Settings ───────────────────────────────────────────────────────────

export interface SiteSettings {
  id: string;
  freeMode: boolean;
  maintenanceMode: boolean;
  siteName: string;
  maxFreePrompts: number;
  maxProPrompts: number;
  showPricing: boolean;
  allowSignup: boolean;
  aiModel: string;
  aiFallbackModel: string;
  adSettings: AdSettings;
  updatedAt: Date;
  updatedBy: string | null;
}

export type AdPlatform =
  | "adsense"
  | "medianet"
  | "ezoic"
  | "propellerads"
  | "mgid"
  | "taboola"
  | "custom";

export type AdPlacement =
  | "top_leaderboard"
  | "below_hero"
  | "below_result"
  | "sticky_bottom"
  | "sidebar_right";

export interface AdConfig {
  enabled: boolean;
  platform: AdPlatform;
  publisherId: string;
  adCode: string;
}

export type AdSettings = Partial<Record<AdPlacement, AdConfig>>;

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  totalPrompts: number;
  mrr: number;
  paidUsers: number;
  planDistribution: {
    free: number;
    pro: number;
    ultra: number;
  };
}

export interface QueueStatus {
  active: number;
  waiting: number;
  maxConcurrent: number;
}

export interface PromptEvent {
  id: string;
  userId: string | null;
  event: string;
  params: Record<string, unknown>;
  createdAt: Date;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  action: string;
  details: Record<string, unknown>;
  createdAt: Date;
}

// ─── Analytics Events ────────────────────────────────────────────────────────

export type AnalyticsEvent =
  | { name: "image_uploaded"; params: { format: string; size: number; converted: boolean } }
  | { name: "format_converted"; params: { from: string; to: string } }
  | { name: "url_loaded"; params: { type: string } }
  | { name: "prompt_generated"; params: { model: string; detail: string; language: string; quality_score: number; provider?: string; ai_model?: string } }
  | { name: "describe_generated"; params: { language: string } }
  | { name: "compare_clicked"; params: { models: string[] } }
  | { name: "prompt_copied"; params: { length: number } }
  | { name: "history_clicked"; params: { model: string } }
  | { name: "free_mode_toggled"; params: { enabled_by: string; timestamp: string } };
