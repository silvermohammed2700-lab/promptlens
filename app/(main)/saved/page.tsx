import type { Metadata } from "next";
import { SavedPromptsClient } from "@/components/saved/SavedPromptsClient";

export const metadata: Metadata = {
  title: "Saved Prompts",
  description: "Your saved PromptLens prompts",
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold font-syne text-[var(--text)] mb-8">Saved Prompts</h1>
      <SavedPromptsClient />
    </div>
  );
}
