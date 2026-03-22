import { prisma } from "@/lib/prisma";
import type { AnalyticsEvent } from "@/types";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  // GA4
  if (window.gtag) {
    window.gtag("event", event.name, event.params);
  }

  // Microsoft Clarity
  if (window.clarity) {
    window.clarity("event", event.name);
  }
}

export async function trackServerEvent(
  event: AnalyticsEvent,
  userId?: string
): Promise<void> {
  try {
    await prisma.promptEvent.create({
      data: {
        userId: userId ?? null,
        event: event.name,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        params: JSON.parse(JSON.stringify(event.params)) as any,
      },
    });
  } catch {
    // Non-critical — never let analytics failures break the app
  }
}
