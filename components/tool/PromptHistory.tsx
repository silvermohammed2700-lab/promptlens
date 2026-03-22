"use client";
import { useState, useEffect } from "react";
import type { GenerateResponse, TargetModel } from "@/types";
import { trackEvent } from "@/lib/analytics";
import { Badge } from "@/components/ui/Badge";

interface HistoryEntry {
  id: string;
  prompt: string;
  targetModel: TargetModel;
  qualityScore: number;
  imagePreview?: string;
  createdAt: number;
}

const STORAGE_KEY = "promptlens_history";
const MAX_HISTORY = 20;

export function saveToHistory(result: GenerateResponse, imagePreview?: string): void {
  try {
    const existing: HistoryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      prompt: result.prompt,
      targetModel: result.targetModel,
      qualityScore: result.qualityScore,
      imagePreview,
      createdAt: Date.now(),
    };
    const updated = [entry, ...existing].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable — skip silently
  }
}

interface PromptHistoryProps {
  onSelect: (entry: HistoryEntry) => void;
}

export function PromptHistory({ onSelect }: PromptHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as HistoryEntry[];
      setHistory(stored);
    } catch {
      setHistory([]);
    }
  }, [open]);

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  };

  const MODEL_LABELS: Record<string, string> = {
    midjourney: "MJ", dalle3: "D3", "stable-diffusion": "SD",
    flux: "Flux", "nano-banana-2": "NB2", "nano-banana-pro": "NBP", general: "Gen",
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition-colors px-3 py-2 rounded-lg border border-[var(--border)] hover:border-[var(--border-2)] bg-[var(--surface-2)] min-h-[36px]"
      >
        🕐 History
        {history.length > 0 && (
          <span className="bg-[var(--accent)] text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {history.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl z-20 animate-slide-up overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
            <span className="text-sm font-medium text-[var(--text)]">Recent Prompts</span>
            {history.length > 0 && (
              <button onClick={clearHistory} className="text-xs text-[var(--accent-2)] hover:opacity-80">
                Clear all
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-center text-[var(--muted)] text-sm py-8">No history yet</p>
            ) : (
              history.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => {
                    onSelect(entry);
                    setOpen(false);
                    trackEvent({ name: "history_clicked", params: { model: entry.targetModel } });
                  }}
                  className="w-full flex gap-3 px-4 py-3 hover:bg-[var(--surface-2)] transition-colors text-left border-b border-[var(--border)] last:border-0"
                >
                  {entry.imagePreview && (
                    <img src={entry.imagePreview} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-[var(--surface-3)]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="pro">{MODEL_LABELS[entry.targetModel] ?? entry.targetModel}</Badge>
                      <span className="text-xs text-[var(--muted)]">{entry.qualityScore}/100</span>
                    </div>
                    <p className="text-xs text-[var(--muted)] truncate leading-relaxed">{entry.prompt}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
