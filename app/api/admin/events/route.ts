import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const [events, total] = await Promise.all([
    prisma.promptEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.promptEvent.count(),
  ]);

  return Response.json({ events, total });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.promptEvent.deleteMany({});

  await prisma.adminAuditLog.create({
    data: {
      adminId: session.user.id!,
      action: "events_cleared",
      details: { clearedAt: new Date().toISOString() },
    },
  });

  return Response.json({ success: true });
}
