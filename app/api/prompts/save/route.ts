import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { TargetModel } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { text: string; model: TargetModel; imageUrl?: string; isPublic?: boolean };
  const { text, model, imageUrl, isPublic = false } = body;

  if (!text || !model) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const saved = await prisma.savedPrompt.create({
    data: {
      userId: session.user.id,
      text,
      model,
      imageUrl: imageUrl ?? null,
      isPublic,
    },
  });

  return Response.json(saved, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const prompts = await prisma.savedPrompt.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return Response.json(prompts);
}
