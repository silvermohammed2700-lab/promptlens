"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";
import type { SiteSettings } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function VisitorsTab() {
  const { data: settings } = useSWR<SiteSettings>("/api/admin/settings", fetcher);
  const [ga4Id, setGa4Id] = useState("");
  const [clarityId, setClarityId] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (settings) {
      setGa4Id((settings as SiteSettings & { ga4Id?: string }).ga4Id ?? "");
      setClarityId((settings as SiteSettings & { clarityId?: string }).clarityId ?? "");
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ga4Id, clarityId }),
      });
      if (!res.ok) throw new Error("Failed");
      setToast({ message: "Analytics settings saved!", type: "success" });
    } catch {
      setToast({ message: "Failed to save", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold font-syne text-[var(--text)]">Visitors & Analytics</h2>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Analytics Integration</h3>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1.5">Google Analytics 4 Measurement ID</label>
          <input
            type="text"
            value={ga4Id}
            onChange={(e) => setGa4Id(e.target.value)}
            placeholder="G-XXXXXXXXXX"
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--dim)] focus:outline-none focus:border-[var(--accent)] min-h-[40px]"
          />
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1.5">Microsoft Clarity Project ID</label>
          <input
            type="text"
            value={clarityId}
            onChange={(e) => setClarityId(e.target.value)}
            placeholder="xxxxxxxxxx"
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--dim)] focus:outline-none focus:border-[var(--accent)] min-h-[40px]"
          />
        </div>
        <Button onClick={handleSave} loading={saving} size="sm">Save Analytics IDs</Button>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-3">Setup Instructions</h3>
        <div className="space-y-2 text-sm text-[var(--muted)]">
          <p>1. Create a GA4 property at <span className="text-[var(--accent)]">analytics.google.com</span></p>
          <p>2. Copy your Measurement ID (G-XXXXXXXXXX) and paste above</p>
          <p>3. Create a Clarity project at <span className="text-[var(--accent)]">clarity.microsoft.com</span></p>
          <p>4. Copy your Project ID and paste above</p>
          <p>5. Also add these as <code className="font-mono-custom text-xs bg-[var(--surface-2)] px-1 rounded">NEXT_PUBLIC_GA4_ID</code> and <code className="font-mono-custom text-xs bg-[var(--surface-2)] px-1 rounded">NEXT_PUBLIC_CLARITY_ID</code> in .env.local</p>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
