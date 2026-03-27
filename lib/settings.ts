import { prisma } from "@/lib/prisma";
import type { SiteSettings } from "@/types";

let cachedSettings: SiteSettings | null = null;
let cacheTime = 0;
const CACHE_TTL = 30_000;

export async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now();
  if (cachedSettings && now - cacheTime < CACHE_TTL) return cachedSettings;

  let settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });

  // Ensure aiModel is set to a working vision model
  const VISION_MODELS = [
    "mistralai/mistral-small-3.1-24b-instruct:free",
    "google/gemma-3-27b-it:free",
    "google/gemma-3-12b-it:free",
    "nvidia/nemotron-nano-12b-v2-vl:free",
    "google/gemma-3-4b-it:free",
  ];
  if (!VISION_MODELS.includes(settings.aiModel)) {
    settings = await prisma.siteSettings.update({
      where: { id: "singleton" },
      data: {
        aiModel: "mistralai/mistral-small-3.1-24b-instruct:free",
        aiFallbackModel: "google/gemma-3-12b-it:free",
      },
    });
  }

  cachedSettings = settings as unknown as SiteSettings;
  cacheTime = now;
  return cachedSettings;
}

export function invalidateSettingsCache(): void {
  cachedSettings = null;
  cacheTime = 0;
}
