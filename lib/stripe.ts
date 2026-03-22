import Stripe from "stripe";

// Lazily initialised so the build succeeds without Stripe keys configured.
// At runtime, calling stripe will throw a clear error if the key is missing.
function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set. Add it to your environment variables.");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, { typescript: true });
}

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const PLANS = {
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
    price: 9,
    promptsPerDay: 200,
    models: 5,
    batchSize: 5,
  },
  ultra: {
    name: "Ultra",
    priceId: process.env.STRIPE_ULTRA_PRICE_ID ?? "",
    price: 19,
    promptsPerDay: Infinity,
    models: 7,
    batchSize: 20,
  },
} as const;
