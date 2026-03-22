"use client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function FreeBanner() {
  const { settings } = useSiteSettings();
  if (!settings?.freeMode) return null;

  return (
    <div className="w-full border-b px-4 py-2 text-center" style={{ backgroundColor: "color-mix(in srgb, var(--accent-4) 10%, transparent)", borderColor: "color-mix(in srgb, var(--accent-4) 30%, transparent)" }}>
      <p className="text-[var(--accent-4)] text-sm font-medium">
        🎁 Free Mode Active — All features unlocked for everyone
      </p>
    </div>
  );
}
