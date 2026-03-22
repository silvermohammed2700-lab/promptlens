"use client";
import type { TargetModel, UserPlan, OutputLanguage } from "@/types";

interface ModelOption {
  id: TargetModel;
  label: string;
  description: string;
  plans: UserPlan[];
  emoji: string;
}

const MODELS: ModelOption[] = [
  { id: "midjourney", label: "Midjourney", description: "Optimized with --v 6.1 parameters", plans: ["free", "pro", "ultra"], emoji: "🎨" },
  { id: "dalle3", label: "DALL-E 3", description: "Vivid natural-language descriptions", plans: ["free", "pro", "ultra"], emoji: "🖌️" },
  { id: "general", label: "General", description: "Works across all AI platforms", plans: ["free", "pro", "ultra"], emoji: "✨" },
  { id: "stable-diffusion", label: "Stable Diffusion", description: "Includes quality tags & negative prompts", plans: ["pro", "ultra"], emoji: "🌊" },
  { id: "flux", label: "Flux", description: "Rich atmospheric descriptions", plans: ["pro", "ultra"], emoji: "⚡" },
  { id: "nano-banana-2", label: "Nano Banana 2", description: "Best for multilingual text in images", plans: ["ultra"], emoji: "🍌" },
  { id: "nano-banana-pro", label: "Nano Banana Pro", description: "Studio-quality expert prompts", plans: ["ultra"], emoji: "🍌✨" },
];

const LANGUAGES: { id: OutputLanguage; label: string; flag: string }[] = [
  { id: "en", label: "English", flag: "🇬🇧" },
  { id: "ar", label: "العربية", flag: "🇸🇦" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
  { id: "es", label: "Español", flag: "🇪🇸" },
  { id: "zh", label: "中文", flag: "🇨🇳" },
];

const DETAIL_LEVELS: { id: "low" | "medium" | "high"; label: string; desc: string }[] = [
  { id: "low", label: "Fast", desc: "Quick generation, shorter prompt" },
  { id: "medium", label: "Balanced", desc: "Good quality + speed" },
  { id: "high", label: "Detailed", desc: "Maximum detail, slower" },
];

interface ModelSelectorProps {
  selected: TargetModel;
  onSelect: (model: TargetModel) => void;
  language: OutputLanguage;
  onLanguageChange: (lang: OutputLanguage) => void;
  detail: "low" | "medium" | "high";
  onDetailChange: (detail: "low" | "medium" | "high") => void;
  userPlan?: UserPlan;
  freeMode?: boolean;
}

export function ModelSelector({
  selected, onSelect, language, onLanguageChange, detail, onDetailChange, userPlan = "free", freeMode = false,
}: ModelSelectorProps) {
  const canAccess = (model: ModelOption) => {
    if (freeMode) return true;
    if (userPlan === "ultra") return true;
    if (userPlan === "pro") return model.plans.includes("pro") || model.plans.includes("free");
    return model.plans.includes("free");
  };

  return (
    <div className="space-y-4">
      {/* Model Grid */}
      <div>
        <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">AI Target Model</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {MODELS.map((model) => {
            const accessible = canAccess(model);
            const isSelected = selected === model.id;
            return (
              <button
                key={model.id}
                type="button"
                onClick={() => accessible && onSelect(model.id)}
                disabled={!accessible}
                className={`relative flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all duration-150 min-h-[36px]
                  ${isSelected
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text)]"
                    : accessible
                      ? "border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-2)] text-[var(--text)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--dim)] cursor-not-allowed opacity-60"
                  }`}
              >
                <span className="text-lg">{model.emoji}</span>
                <span className="text-sm font-medium leading-tight">{model.label}</span>
                <span className="text-xs text-[var(--muted)] leading-tight">{model.description}</span>
                {!accessible && (
                  <span className="absolute top-2 right-2 text-xs bg-[var(--accent)]/20 text-[var(--accent)] px-1.5 py-0.5 rounded-full">
                    {model.plans.includes("ultra") ? "Ultra" : "Pro"}
                  </span>
                )}
                {isSelected && (
                  <span className="absolute top-2 right-2 text-[var(--accent-3)] text-sm">✓</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Language + Detail Row */}
      <div className="flex flex-wrap gap-4">
        {/* Language */}
        <div className="flex-1 min-w-[140px]">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">Output Language</p>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as OutputLanguage)}
              className="w-full appearance-none bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] cursor-pointer min-h-[36px]"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>{l.flag} {l.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Detail Level */}
        <div className="flex-1 min-w-[200px]">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider mb-2">Detail Level</p>
          <div className="flex gap-1">
            {DETAIL_LEVELS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => onDetailChange(d.id)}
                title={d.desc}
                className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-all min-h-[36px]
                  ${detail === d.id
                    ? "bg-[var(--accent)] text-white"
                    : "bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)] hover:border-[var(--border-2)]"
                  }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
