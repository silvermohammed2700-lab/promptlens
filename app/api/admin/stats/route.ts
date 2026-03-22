import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const [totalUsers, totalPrompts, planCounts, recentEvents] = await Promise.all([
    prisma.user.count(),
    prisma.user.aggregate({ _sum: { promptsTotal: true } }),
    prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),
    prisma.promptEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const distribution = { free: 0, pro: 0, ultra: 0 };
  let paidUsers = 0;
  for (const row of planCounts) {
    const plan = row.plan as keyof typeof distribution;
    distribution[plan] = row._count._all;
    if (plan !== "free") paidUsers += row._count._all;
  }

  return Response.json({
    totalUsers,
    totalPrompts: totalPrompts._sum.promptsTotal ?? 0,
    paidUsers,
    planDistribution: distribution,
    recentEvents,
    mrr: distribution.pro * 9 + distribution.ultra * 19,
  });
}
