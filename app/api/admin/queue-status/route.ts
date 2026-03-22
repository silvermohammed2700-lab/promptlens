import { auth } from "@/lib/auth";
import { getQueueStatus, getGroqStatus } from "@/lib/aiProvider";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  return Response.json({
    ...getQueueStatus(),
    groq: getGroqStatus(),
  });
}
