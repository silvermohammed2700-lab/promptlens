"use client";
import { useState, useCallback } from "react";
import { ImageUploader } from "@/components/tool/ImageUploader";
import { ModelSelector } from "@/components/tool/ModelSelector";
import { PromptResult } from "@/components/tool/PromptResult";
import { PromptHistory, saveToHistory } from "@/components/tool/PromptHistory";
import { CompareView } from "@/components/tool/CompareView";
import { AdSlot } from "@/components/ads/AdSlot";
import { Button } from "@/components/ui/Button";
import { usePromptGeneration } from "@/hooks/usePromptGeneration";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useUser } from "@/hooks/useUser";
import type { TargetModel, OutputLanguage, GenerateResponse } from "@/types";

type ActiveTab = "generate" | "describe" | "compare";

export function HomeTool() {
  const [base64Image, setBase64Image] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [targetModel, setTargetModel] = useState<TargetModel>("midjourney");
  const [language, setLanguage] = useState<OutputLanguage>("en");
  const [detail, setDetail] = useState<"low" | "medium" | "high">("high");
  const [activeTab, setActiveTab] = useState<ActiveTab>("generate");
  const [historyResult, setHistoryResult] = useState<GenerateResponse | null>(null);

  const { status, statusMessage, result, error, generate, reset } = usePromptGeneration();
  const { settings } = useSiteSettings();
  const { user } = useUser();

  const displayResult = historyResult ?? result;

  const handleImageReady = useCallback((b64: string, mime: string, _file: File) => {
    setBase64Image(b64);
    setMimeType(mime);
    setImagePreview(`data:image/jpeg;base64,${b64}`);
    setHistoryResult(null);
    reset();
  }, [reset]);

  const handleGenerate = async () => {
    if (!base64Image) return;
    setHistoryResult(null);
    await generate(base64Image, mimeType, targetModel, language, detail);
  };

  // Save to history when result arrives
  if (result && result !== historyResult) {
    saveToHistory(result, imagePreview);
  }

  const isGenerating = ["uploading", "queued", "generating", "retrying"].includes(status);

  const TABS: { id: ActiveTab; label: string; emoji: string }[] = [
    { id: "generate", label: "Generate Prompt", emoji: "✨" },
    { id: "describe", label: "Describe Image", emoji: "📝" },
    { id: "compare", label: "Compare Models", emoji: "⚡" },
  ];

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
      {/* Tab Bar */}
      <div className="flex border-b border-[var(--border)] bg-[var(--surface-2)] overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 min-h-[44px]
              ${activeTab === tab.id
                ? "border-[var(--accent)] text-[var(--text)]"
                : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
              }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center px-4">
          <PromptHistory onSelect={(entry) => {
            setHistoryResult({
              prompt: entry.prompt,
              targetModel: entry.targetModel,
              qualityScore: entry.qualityScore,
              model: "",
            });
          }} />
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Image Uploader */}
        <ImageUploader onImageReady={handleImageReady} disabled={isGenerating} />

        {activeTab === "generate" && (
          <>
            {/* Model Selector */}
            <ModelSelector
              selected={targetModel}
              onSelect={setTargetModel}
              language={language}
              onLanguageChange={setLanguage}
              detail={detail}
              onDetailChange={setDetail}
              userPlan={user?.plan as "free" | "pro" | "ultra" | undefined}
              freeMode={settings?.freeMode}
            />

            {/* Usage bar for free users */}
            {user && !settings?.freeMode && user.plan === "free" && (
              <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-3">
                <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-2">
                  <span>Daily usage</span>
                  <span>{user.promptsToday} / 5 prompts</span>
                </div>
                <div className="h-1.5 bg-[var(--surface-3)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (user.promptsToday / 5) * 100)}%` }}
                  />
                </div>
                {user.promptsToday >= 5 && (
                  <p className="mt-2 text-xs text-[var(--accent-2)]">
                    Daily limit reached. <a href="/pricing" className="text-[var(--accent)] underline">Upgrade to Pro</a> for 200/day.
                  </p>
                )}
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={!base64Image || isGenerating || (user?.plan === "free" && user.promptsToday >= 5 && !settings?.freeMode)}
              loading={isGenerating}
              size="lg"
              className="w-full text-base font-semibold font-syne"
            >
              {isGenerating ? statusMessage : "✨ Generate Prompt"}
            </Button>

            {/* Status messages during generation */}
            {isGenerating && (
              <div className="space-y-2">
                <div className="h-1 bg-[var(--surface-3)] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] rounded-full animate-pulse" style={{ width: "60%" }} />
                </div>
                <p className="text-sm text-center text-[var(--muted)] animate-pulse">{statusMessage}</p>
              </div>
            )}

            {/* Error state */}
            {status === "error" && error && (
              <div className="bg-[var(--accent-2)]/10 border border-[var(--accent-2)]/30 rounded-xl p-4 text-sm text-[var(--accent-2)]">
                <p className="font-medium mb-1">⚠️ Generation failed</p>
                <p className="text-[var(--muted)]">{error}</p>
                <button onClick={reset} className="mt-2 text-[var(--accent)] hover:opacity-80 text-xs">Try again</button>
              </div>
            )}

            {/* Result */}
            {displayResult && (
              <>
                <AdSlot placement="below_result" className="flex justify-center" />
                <PromptResult
                  result={displayResult}
                  canSave={!!user}
                />
              </>
            )}
          </>
        )}

        {activeTab === "describe" && (
          <DescribeTab base64Image={base64Image} mimeType={mimeType} language={language} onLanguageChange={setLanguage} />
        )}

        {activeTab === "compare" && (
          <CompareView base64Image={base64Image} mimeType={mimeType} language={language} detail={detail} />
        )}
      </div>
    </div>
  );
}

// ─── Describe Tab ─────────────────────────────────────────────────────────────

function DescribeTab({
  base64Image, mimeType, language = "en",
}: {
  base64Image: string; mimeType: string;
  language?: OutputLanguage; onLanguageChange?: (l: OutputLanguage) => void;
}) {
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const describe = async () => {
    if (!base64Image) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/describe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image, mimeType, language }),
      });
      const data = (await res.json()) as { description?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Failed to describe");
      setDescription(data.description ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--muted)]">Get a detailed plain-language description of your image — not a prompt, but a full description.</p>
      <Button onClick={describe} disabled={!base64Image || loading} loading={loading} size="md">
        📝 Describe Image
      </Button>
      {error && <p className="text-sm text-[var(--accent-2)]">⚠️ {error}</p>}
      {description && (
        <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-xl p-4 animate-slide-up">
          <p className="text-sm text-[var(--text)] leading-relaxed">{description}</p>
          <button
            onClick={() => navigator.clipboard.writeText(description)}
            className="mt-3 text-xs text-[var(--accent)] hover:opacity-80"
          >
            📋 Copy description
          </button>
        </div>
      )}
    </div>
  );
}
