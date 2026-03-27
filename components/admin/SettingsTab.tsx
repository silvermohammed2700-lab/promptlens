"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import type { SiteSettings } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const FREE_MODELS = [
  { id: "mistralai/mistral-small-3.1-24b-instruct:free", name: "Mistral Small 3.1 24B ⭐" },
  { id: "google/gemma-3-27b-it:free", name: "Gemma 3 27B" },
  { id: "google/gemma-3-12b-it:free", name: "Gemma 3 12B" },
  { id: "nvidia/nemotron-nano-12b-v2-vl:free", name: "Nvidia Nemotron 12B" },
  { id: "google/gemma-3-4b-it:free", name: "Gemma 3 4B (Fast)" },
];

export function SettingsTab() {
  const { data, mutate } = useSWR<SiteSettings>("/api/admin/settings", fetcher);
  const [form, setForm] = useState<Partial<SiteSettings>>({});
  const [saving, setSaving] = useState(false);
  const [showFreeModeConfirm, setShowFreeModeConfirm] = useState(false);
  const [pendingFreeMode, setPendingFreeMode] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      setToast({ message: "Settings saved successfully!", type: "success" });
      mutate();
    } catch {
      setToast({ message: "Failed to save settings", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleFreeModeToggle = (val: boolean) => {
    if (val) {
      setPendingFreeMode(true);
      setShowFreeModeConfirm(true);
    } else {
      setForm((f) => ({ ...f, freeMode: false }));
    }
  };

  const confirmFreeMode = () => {
    setForm((f) => ({ ...f, freeMode: pendingFreeMode }));
    setShowFreeModeConfirm(false);
  };

  const set = <K extends keyof SiteSettings>(key: K, val: SiteSettings[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold font-syne text-[var(--text)]">Site Settings</h2>

      {/* Free Mode — most prominent */}
      <div className={`p-5 rounded-2xl border-2 ${form.freeMode ? "border-[var(--accent-4)] bg-[var(--accent-4)]/5" : "border-[var(--border)] bg-[var(--surface)]"}`}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[var(--text)] flex items-center gap-2">
              🎁 Free Mode
              {form.freeMode
                ? <span className="text-xs bg-[var(--accent-4)]/20 text-[var(--accent-4)] px-2 py-0.5 rounded-full">Revenue paused — all limits bypassed</span>
                : <span className="text-xs bg-[var(--accent-3)]/20 text-[var(--accent-3)] px-2 py-0.5 rounded-full">Normal billing active</span>
              }
            </p>
            <p className="text-sm text-[var(--muted)] mt-1">Bypass all payment restrictions for all users. Use for promotional campaigns.</p>
          </div>
          <Toggle enabled={form.freeMode ?? false} onChange={handleFreeModeToggle} />
        </div>
      </div>

      {/* Other toggles */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl divide-y divide-[var(--border)]">
        {[
          { key: "maintenanceMode" as const, label: "Maintenance Mode", desc: "Blocks all non-admin access" },
          { key: "allowSignup" as const, label: "Allow New Signups", desc: "Users can create new accounts" },
          { key: "showPricing" as const, label: "Show Pricing Page", desc: "Pricing page is publicly visible" },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between px-5 py-4 gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--text)]">{label}</p>
              <p className="text-xs text-[var(--muted)]">{desc}</p>
            </div>
            <Toggle enabled={!!(form[key])} onChange={(val) => set(key, val as SiteSettings[typeof key])} />
          </div>
        ))}
      </div>

      {/* Numeric limits */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">Plan Daily Limits</h3>
        <div className="grid grid-cols-2 gap-4">
          {[
            { key: "maxFreePrompts" as const, label: "Free Plan (prompts/day)" },
            { key: "maxProPrompts" as const, label: "Pro Plan (prompts/day)" },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs text-[var(--muted)] mb-1.5">{label}</label>
              <input
                type="number"
                value={form[key] ?? ""}
                onChange={(e) => set(key, parseInt(e.target.value) as SiteSettings[typeof key])}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] min-h-[40px]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* AI Model */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[var(--text)]">AI Model</h3>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1.5">Primary Model</label>
          <select
            value={form.aiModel ?? ""}
            onChange={(e) => set("aiModel", e.target.value)}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] min-h-[40px]"
          >
            {FREE_MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-[var(--muted)] mb-1.5">Fallback Model</label>
          <select
            value={form.aiFallbackModel ?? ""}
            onChange={(e) => set("aiFallbackModel", e.target.value)}
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] min-h-[40px]"
          >
            {FREE_MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      {/* Site Name */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
        <label className="block text-xs text-[var(--muted)] mb-1.5">Site Name</label>
        <input
          type="text"
          value={form.siteName ?? ""}
          onChange={(e) => set("siteName", e.target.value)}
          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] min-h-[40px]"
        />
      </div>

      {/* Google Analytics */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
        <label className="block text-xs text-[var(--muted)] mb-1.5">Google Analytics 4 ID</label>
        <input
          type="text"
          placeholder="G-XXXXXXXXXX"
          value={form.googleAnalyticsId ?? ""}
          onChange={(e) => set("googleAnalyticsId", e.target.value)}
          className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] min-h-[40px]"
        />
      </div>

      <Button onClick={handleSave} loading={saving} size="lg">
        💾 Save Settings
      </Button>

      {/* Free mode confirmation dialog */}
      <Modal open={showFreeModeConfirm} onClose={() => setShowFreeModeConfirm(false)} title="Enable Free Mode?">
        <p className="text-sm text-[var(--muted)] mb-6">
          This will bypass all payment restrictions for all users. All plans will have unlimited access. Revenue collection will effectively pause.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={confirmFreeMode} className="flex-1">Yes, Enable Free Mode</Button>
          <Button variant="secondary" onClick={() => setShowFreeModeConfirm(false)} className="flex-1">Cancel</Button>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
