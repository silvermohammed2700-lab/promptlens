"use client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import type { AdPlacement } from "@/types";

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

export function AdSlot({ placement, className }: AdSlotProps) {
  const { settings } = useSiteSettings();
  const adConfig = settings?.adSettings?.[placement];

  if (!adConfig?.enabled || !adConfig.adCode) return null;

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: adConfig.adCode }}
    />
  );
}
