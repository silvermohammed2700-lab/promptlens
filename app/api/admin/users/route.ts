import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "50");
  const search = searchParams.get("search") ?? "";

  const where = search
    ? {
        OR: [
          { email: { contains: search, mode: "insensitive" as const } },
          { name: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        role: true,
        promptsToday: true,
        promptsTotal: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return Response.json({ users, total, page, limit });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as { id: string; plan?: string; role?: string };
  const { id, ...updates } = body;

  const updated = await prisma.user.update({
    where: { id },
    data: updates,
    select: { id: true, plan: true, role: true },
  });

  await prisma.adminAuditLog.create({
    data: {
      adminId: session.user.id!,
      action: "user_updated",
      details: { userId: id, changes: updates },
    },
  });

  return Response.json(updated);
}
