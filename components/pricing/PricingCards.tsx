"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    desc: "Perfect for trying PromptLens",
    badge: null,
    features: [
      "5 prompts per day",
      "3 AI models (Midjourney, DALL-E 3, General)",
      "JPG, PNG, WEBP only",
      "6 output languages",
      "Prompt history (local)",
    ],
    cta: "Get Started Free",
    variant: "secondary" as const,
  },
  {
    id: "pro",
    name: "Pro",
    price: 9,
    desc: "For regular creators",
    badge: "Most Popular",
    features: [
      "200 prompts per day",
      "5 AI models",
      "All 10+ image formats",
      "Batch upload (5 images)",
      "Save & share prompts",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    variant: "primary" as const,
  },
  {
    id: "ultra",
    name: "Ultra",
    price: 19,
    desc: "For power users & professionals",
    badge: null,
    features: [
      "Unlimited prompts",
      "All 7 AI models",
      "Batch upload (20 images)",
      "Text to Prompt (Ultra exclusive)",
      "API access",
      "Priority support",
    ],
    cta: "Upgrade to Ultra",
    variant: "secondary" as const,
  },
];

export function PricingCards() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (planId === "free") return;
    if (!user) { router.push("/signup"); return; }

    setLoading(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setToast({ message: data.error ?? "Failed to start checkout", type: "error" });
      }
    } catch {
      setToast({ message: "Failed to connect to Stripe", type: "error" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = user?.plan === plan.id;
          const isPopular = plan.badge === "Most Popular";
          return (
            <div
              key={plan.id}
              className={`relative bg-[var(--surface)] border rounded-2xl p-6 flex flex-col
                ${isPopular ? "border-[var(--accent)] shadow-lg shadow-[var(--accent)]/10" : "border-[var(--border)]"}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="pro">{plan.badge}</Badge>
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-bold font-syne text-[var(--text)]">{plan.name}</h2>
                <p className="text-[var(--muted)] text-sm mt-1">{plan.desc}</p>
                <div className="mt-4">
                  <span className="text-4xl font-extrabold font-syne text-[var(--text)]">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && <span className="text-[var(--muted)] text-sm ml-1">/month</span>}
                </div>
              </div>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                    <span className="text-[var(--accent-3)] mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-3 text-center text-sm font-medium rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-[var(--muted)]">
                  Current Plan
                </div>
              ) : (
                <Button
                  variant={isPopular ? "primary" : plan.variant}
                  size="lg"
                  className="w-full"
                  onClick={() => handleUpgrade(plan.id)}
                  loading={loading === plan.id}
                  disabled={plan.id === "free"}
                >
                  {plan.id === "free" ? "Free Forever" : plan.cta}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-[var(--muted)] mt-8">
        All plans include a 7-day money-back guarantee. Cancel anytime.
      </p>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
