import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { getSiteSettings } from "@/lib/settings";

export async function POST(req: Request) {
  try {
    const settings = await getSiteSettings();
    if (!settings.allowSignup) {
      return Response.json({ error: "Sign ups are currently disabled" }, { status: 403 });
    }

    const body = (await req.json()) as { name?: string; email: string; password: string };
    const { name, email, password } = body;

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const hashed = await hash(password, 12);
    const user = await prisma.user.create({
      data: { name: name ?? null, email, password: hashed },
      select: { id: true, email: true, name: true },
    });

    return Response.json(user, { status: 201 });
  } catch (err) {
    console.error("[register] Error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
