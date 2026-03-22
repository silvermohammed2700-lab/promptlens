import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prompt = await prisma.savedPrompt.findUnique({ where: { id } });
  if (!prompt || prompt.userId !== session.user.id) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.savedPrompt.delete({ where: { id } });
  return Response.json({ success: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { isPublic?: boolean };
  const prompt = await prisma.savedPrompt.findUnique({ where: { id } });
  if (!prompt || prompt.userId !== session.user.id) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.savedPrompt.update({
    where: { id },
    data: { isPublic: body.isPublic },
  });
  return Response.json(updated);
}
