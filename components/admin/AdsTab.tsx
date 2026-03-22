"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { SiteSettings, AdPlacement, AdPlatform, AdConfig } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const PLACEMENTS: { id: AdPlacement; label: string; size: string; desc: string }[] = [
  { id: "top_leaderboard", label: "Top Leaderboard", size: "728x90", desc: "Top of page, above fold" },
  { id: "below_hero", label: "Below Hero", size: "300x250", desc: "After headline section" },
  { id: "below_result", label: "Below Result", size: "Responsive", desc: "After prompt output" },
  { id: "sticky_bottom", label: "Sticky Bottom", size: "Responsive", desc: "Fixed bottom bar" },
  { id: "sidebar_right", label: "Sidebar Right", size: "160x600", desc: "Desktop right sidebar" },
];

const PLATFORMS: AdPlatform[] = ["adsense", "medianet", "ezoic", "propellerads", "mgid", "taboola", "custom"];

export function AdsTab() {
  const { data, mutate } = useSWR<SiteSettings>("/api/admin/settings", fetcher);
  const [adSettings, setAdSettings] = useState<Partial<Record<AdPlacement, AdConfig>>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (data?.adSettings) setAdSettings(data.adSettings as Partial<Record<AdPlacement, AdConfig>>);
  }, [data]);

  const updateAd = (placement: AdPlacement, updates: Partial<AdConfig>) => {
    setAdSettings((prev) => ({
      ...prev,
      [placement]: { ...(prev[placement] ?? { enabled: false, platform: "custom", publisherId: "", adCode: "" }), ...updates },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adSettings }),
      });
      if (!res.ok) throw new Error("Failed");
      setToast({ message: "Ad settings saved!", type: "success" });
      mutate();
    } catch {
      setToast({ message: "Failed to save ad settings", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-syne text-[var(--text)]">Ad Manager</h2>
        <Button onClick={handleSave} loading={saving} size="sm">💾 Save All</Button>
      </div>

      <div className="space-y-4">
        {PLACEMENTS.map((placement) => {
          const config = adSettings[placement.id];
          return (
            <div key={placement.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface-2)]">
                <div>
                  <p className="font-medium text-[var(--text)]">{placement.label}</p>
                  <p className="text-xs text-[var(--muted)]">{placement.size} · {placement.desc}</p>
                </div>
                <Toggle
                  enabled={config?.enabled ?? false}
                  onChange={(val) => updateAd(placement.id, { enabled: val })}
                />
              </div>
              {(config?.enabled) && (
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-[var(--muted)] mb-1">Platform</label>
                      <select
                        value={config?.platform ?? "custom"}
                        onChange={(e) => updateAd(placement.id, { platform: e.target.value as AdPlatform })}
                        className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] min-h-[36px]"
                      >
                        {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-[var(--muted)] mb-1">Publisher ID</label>
                      <input
                        type="text"
                        value={config?.publisherId ?? ""}
                        onChange={(e) => updateAd(placement.id, { publisherId: e.target.value })}
                        placeholder="pub-XXXXXXXX"
                        className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--dim)] focus:outline-none focus:border-[var(--accent)] min-h-[36px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--muted)] mb-1">Ad Code / Script</label>
                    <textarea
                      value={config?.adCode ?? ""}
                      onChange={(e) => updateAd(placement.id, { adCode: e.target.value })}
                      placeholder="Paste your ad code here..."
                      rows={4}
                      className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs font-mono-custom text-[var(--text)] placeholder:text-[var(--dim)] focus:outline-none focus:border-[var(--accent)] resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
