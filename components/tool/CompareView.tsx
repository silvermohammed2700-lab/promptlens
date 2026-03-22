"use client";
import { useState } from "react";
import type { TargetModel, OutputLanguage, GenerateResponse } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { trackEvent } from "@/lib/analytics";

interface CompareViewProps {
  base64Image: string;
  mimeType: string;
  language: OutputLanguage;
  detail: "low" | "medium" | "high";
}

const COMPARE_MODELS: TargetModel[] = ["midjourney", "dalle3", "stable-diffusion", "flux", "general"];

interface CompareResult {
  model: TargetModel;
  prompt: string;
  qualityScore: number;
  loading: boolean;
  error: string | null;
}

const MODEL_LABELS: Record<TargetModel, string> = {
  midjourney: "Midjourney", dalle3: "DALL-E 3", "stable-diffusion": "Stable Diffusion",
  flux: "Flux", "nano-banana-2": "Nano Banana 2", "nano-banana-pro": "Nano Banana Pro", general: "General",
};

export function CompareView({ base64Image, mimeType, language, detail }: CompareViewProps) {
  const [results, setResults] = useState<CompareResult[]>([]);
  const [running, setRunning] = useState(false);
  const [selectedModels, setSelectedModels] = useState<TargetModel[]>(["midjourney", "dalle3", "general"]);

  const toggleModel = (model: TargetModel) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : prev.length < 4 ? [...prev, model] : prev
    );
  };

  const runCompare = async () => {
    if (selectedModels.length < 2) return;
    setRunning(true);
    trackEvent({ name: "compare_clicked", params: { models: selectedModels } });

    const initial = selectedModels.map((model) => ({
      model, prompt: "", qualityScore: 0, loading: true, error: null,
    }));
    setResults(initial);

    await Promise.all(
      selectedModels.map(async (model) => {
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64Image, mimeType, targetModel: model, language, detail }),
          });
          const data = (await res.json()) as GenerateResponse & { error?: string };
          setResults((prev) =>
            prev.map((r) =>
              r.model === model
                ? { ...r, loading: false, prompt: data.prompt ?? "", qualityScore: data.qualityScore ?? 0, error: data.error ?? null }
                : r
            )
          );
        } catch {
          setResults((prev) =>
            prev.map((r) => r.model === model ? { ...r, loading: false, error: "Failed to generate" } : r)
          );
        }
      })
    );
    setRunning(false);
  };

  const copyPrompt = async (text: string) => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">
          Select 2–4 models to compare
        </p>
        <div className="flex flex-wrap gap-2">
          {COMPARE_MODELS.map((model) => (
            <button
              key={model}
              type="button"
              onClick={() => toggleModel(model)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-all min-h-[36px]
                ${selectedModels.includes(model)
                  ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text)]"
                  : "border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] hover:border-[var(--border-2)]"
                }`}
            >
              {MODEL_LABELS[model]}
              {selectedModels.includes(model) && <span className="ml-1 text-[var(--accent-3)]">✓</span>}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={runCompare}
        disabled={selectedModels.length < 2 || running || !base64Image}
        loading={running}
        size="md"
      >
        ⚡ Compare {selectedModels.length} Models
      </Button>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
          {results.map((r) => (
            <div key={r.model} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
                <Badge variant="pro">{MODEL_LABELS[r.model]}</Badge>
                {!r.loading && !r.error && (
                  <span className="text-xs text-[var(--muted)]">Score: <strong className="text-[var(--accent-3)]">{r.qualityScore}/100</strong></span>
                )}
              </div>
              <div className="p-4 min-h-[120px]">
                {r.loading ? (
                  <div className="flex items-center gap-2 text-[var(--muted)] text-sm">
                    <span className="animate-spin">⟳</span> Generating...
                  </div>
                ) : r.error ? (
                  <p className="text-[var(--accent-2)] text-sm">{r.error}</p>
                ) : (
                  <>
                    <p className="text-sm font-mono-custom text-[var(--text)] leading-relaxed whitespace-pre-wrap break-words">
                      {r.prompt}
                    </p>
                    <button
                      onClick={() => copyPrompt(r.prompt)}
                      className="mt-3 text-xs text-[var(--accent)] hover:opacity-80 transition-opacity"
                    >
                      📋 Copy
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
