import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get provider usage from recent events
  const recentEvents = await prisma.promptEvent.findMany({
    where: { event: "prompt_generated" },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { params: true, createdAt: true },
  });

  const providerCounts = { gemini: 0, groq: 0, openrouter: 0, unknown: 0 };
  for (const ev of recentEvents) {
    const params = ev.params as Record<string, unknown>;
    const provider = (params.provider as string) ?? "unknown";
    if (provider in providerCounts) {
      providerCounts[provider as keyof typeof providerCounts]++;
    } else {
      providerCounts.unknown++;
    }
  }

  const total = recentEvents.length;

  return Response.json({
    providers: [
      {
        name: "Gemini 1.5 Flash",
        id: "gemini",
        tier: "Primary",
        dailyLimit: 1500,
        count: providerCounts.gemini,
        pct: total > 0 ? Math.round((providerCounts.gemini / total) * 100) : 0,
        configured: !!process.env.GEMINI_API_KEY,
        color: "var(--accent-3)",
      },
      {
        name: "Groq LLaVA",
        id: "groq",
        tier: "Secondary",
        dailyLimit: 14400,
        count: providerCounts.groq,
        pct: total > 0 ? Math.round((providerCounts.groq / total) * 100) : 0,
        configured: !!process.env.GROQ_API_KEY,
        color: "var(--accent)",
      },
      {
        name: "OpenRouter",
        id: "openrouter",
        tier: "Fallback",
        dailyLimit: null,
        count: providerCounts.openrouter,
        pct: total > 0 ? Math.round((providerCounts.openrouter / total) * 100) : 0,
        configured: !!process.env.OPENROUTER_API_KEY,
        color: "var(--accent-4)",
      },
    ],
    total,
  });
}
