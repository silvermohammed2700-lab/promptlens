import { getSiteSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return Response.json({
      freeMode: settings.freeMode,
      maintenanceMode: settings.maintenanceMode,
      siteName: settings.siteName,
      showPricing: settings.showPricing,
      allowSignup: settings.allowSignup,
      adSettings: settings.adSettings,
    });
  } catch {
    return Response.json({
      freeMode: false,
      maintenanceMode: false,
      siteName: "PromptLens",
      showPricing: true,
      allowSignup: true,
      adSettings: {},
    });
  }
}
