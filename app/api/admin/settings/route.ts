import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { invalidateSettingsCache } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return Response.json(settings);
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as Record<string, unknown>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updated = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: { ...(body as any), updatedBy: session.user.id, updatedAt: new Date() },
    create: { id: "singleton", updatedBy: session.user.id },
  });

  // Audit log
  await prisma.adminAuditLog.create({
    data: {
      adminId: session.user.id!,
      action: "settings_updated",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      details: JSON.parse(JSON.stringify(body)) as any,
    },
  });

  invalidateSettingsCache();
  return Response.json(updated);
}
