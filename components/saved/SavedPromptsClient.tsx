"use client";
import useSWR from "swr";
import type { SavedPrompt } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const MODEL_LABELS: Record<string, string> = {
  midjourney: "Midjourney", dalle3: "DALL-E 3", "stable-diffusion": "Stable Diffusion",
  flux: "Flux", "nano-banana-2": "Nano Banana 2", "nano-banana-pro": "Nano Banana Pro", general: "General",
};

export function SavedPromptsClient() {
  const { data: prompts, mutate } = useSWR<SavedPrompt[]>("/api/prompts/save", fetcher);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const copyPrompt = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setToast({ message: "Copied to clipboard!", type: "success" });
  };

  const deletePrompt = async (id: string) => {
    try {
      await fetch(`/api/prompts/save/${id}`, { method: "DELETE" });
      mutate();
      setToast({ message: "Prompt deleted", type: "success" });
    } catch {
      setToast({ message: "Failed to delete", type: "error" });
    }
  };

  if (!prompts) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[var(--surface)] border border-[var(--border)] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (prompts.length === 0) {
    return (
      <div className="text-center py-16 bg-[var(--surface)] border border-[var(--border)] border-dashed rounded-2xl">
        <p className="text-4xl mb-4">💾</p>
        <p className="text-[var(--muted)]">No saved prompts yet. Generate a prompt and click Save!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {prompts.map((p) => (
          <div key={p.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--border-2)] transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
              <div className="flex items-center gap-2">
                <Badge variant="pro">{MODEL_LABELS[p.model] ?? p.model}</Badge>
                <span className="text-xs text-[var(--muted)]">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => copyPrompt(p.text)} className="text-xs text-[var(--accent)] hover:opacity-80 px-2 py-1 rounded border border-[var(--accent)]/30 min-h-[28px]">📋 Copy</button>
                <button onClick={() => deletePrompt(p.id)} className="text-xs text-[var(--accent-2)] hover:opacity-80 px-2 py-1 rounded border border-[var(--accent-2)]/30 min-h-[28px]">🗑️</button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm font-mono-custom text-[var(--text)] leading-relaxed line-clamp-3">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
