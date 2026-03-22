"use client";
import { useState } from "react";
import type { GenerateResponse } from "@/types";
import { trackEvent } from "@/lib/analytics";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

interface PromptResultProps {
  result: GenerateResponse;
  onSave?: () => void;
  onShare?: () => void;
  canSave?: boolean;
}

function QualityBar({ score }: { score: number }) {
  const color = score >= 80 ? "var(--accent-3)" : score >= 50 ? "var(--accent-4)" : "var(--accent-2)";
  const label = score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Basic";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-medium font-mono-custom tabular-nums" style={{ color }}>
        {score}/100 · {label}
      </span>
    </div>
  );
}

export function PromptResult({ result, onSave, onShare, canSave = false }: PromptResultProps) {
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
      trackEvent({ name: "prompt_copied", params: { length: result.prompt.length } });
      setToast({ message: "Prompt copied to clipboard!", type: "success" });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setToast({ message: "Failed to copy. Please select and copy manually.", type: "error" });
    }
  };

  const MODEL_LABELS: Record<string, string> = {
    midjourney: "Midjourney", dalle3: "DALL-E 3", "stable-diffusion": "Stable Diffusion",
    flux: "Flux", "nano-banana-2": "Nano Banana 2", "nano-banana-pro": "Nano Banana Pro", general: "General",
  };

  return (
    <div className="animate-slide-up bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Generated Prompt</span>
          <Badge variant="pro">{MODEL_LABELS[result.targetModel] ?? result.targetModel}</Badge>
        </div>
        <div className="flex items-center gap-2">
          {canSave && onSave && (
            <Button variant="ghost" size="sm" onClick={onSave}>
              💾 Save
            </Button>
          )}
          {onShare && (
            <Button variant="ghost" size="sm" onClick={onShare}>
              🔗 Share
            </Button>
          )}
          <Button
            variant={copied ? "secondary" : "primary"}
            size="sm"
            onClick={handleCopy}
          >
            {copied ? "✓ Copied!" : "📋 Copy"}
          </Button>
        </div>
      </div>

      {/* Prompt Text */}
      <div className="p-4">
        <p className="text-[var(--text)] font-mono-custom text-sm leading-relaxed whitespace-pre-wrap break-words select-all">
          {result.prompt}
        </p>
      </div>

      {/* Quality Score */}
      <div className="px-4 pb-4">
        <p className="text-xs text-[var(--muted)] mb-2 uppercase tracking-wider">Prompt Quality Score</p>
        <QualityBar score={result.qualityScore} />
      </div>

      {/* Word count */}
      <div className="px-4 pb-4 flex items-center gap-4 text-xs text-[var(--muted)]">
        <span>{result.prompt.split(/\s+/).filter(Boolean).length} words</span>
        <span>{result.prompt.length} characters</span>
        <span>AI model: {result.model.split("/").pop()?.replace(":free", "") ?? result.model}</span>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
