import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface Props {
  params: { shareId: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const saved = await prisma.savedPrompt.findUnique({
    where: { shareId: params.shareId },
    select: { text: true },
  });
  if (!saved) return { title: "Shared Prompt" };
  return {
    title: "Shared Prompt",
    description: saved.text.slice(0, 160),
  };
}

export default async function SharePage({ params }: Props) {
  const saved = await prisma.savedPrompt.findUnique({
    where: { shareId: params.shareId, isPublic: true },
  });

  if (!saved) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold font-syne mb-6">Shared Prompt</h1>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2">
          {saved.model} prompt
        </p>
        <p className="text-[var(--text)] font-mono-custom text-sm leading-relaxed whitespace-pre-wrap">
          {saved.text}
        </p>
      </div>
    </div>
  );
}
