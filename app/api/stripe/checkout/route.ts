import { auth } from "@/lib/auth";
import { stripe, PLANS } from "@/lib/stripe";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = (await req.json()) as { plan: "pro" | "ultra" };
  const planConfig = PLANS[plan];

  if (!planConfig?.priceId) {
    return Response.json({ error: "Invalid plan" }, { status: 400 });
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${baseUrl}/dashboard?upgraded=true`,
    cancel_url: `${baseUrl}/pricing`,
    metadata: { userId: session.user.id, plan },
    customer_email: session.user.email ?? undefined,
  });

  return Response.json({ url: checkoutSession.url });
}
