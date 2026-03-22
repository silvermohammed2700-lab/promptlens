"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Stats {
  mrr: number;
  paidUsers: number;
  planDistribution: { free: number; pro: number; ultra: number };
}

export function RevenueTab() {
  const { data: stats } = useSWR<Stats>("/api/admin/stats", fetcher);

  const arr = (stats?.mrr ?? 0) * 12;
  const proCount = stats?.planDistribution.pro ?? 0;
  const ultraCount = stats?.planDistribution.ultra ?? 0;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold font-syne text-[var(--text)]">Revenue</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "MRR", value: `$${stats?.mrr ?? 0}`, emoji: "💰" },
          { label: "ARR", value: `$${arr}`, emoji: "📈" },
          { label: "Pro Subscribers", value: proCount, emoji: "⭐" },
          { label: "Ultra Subscribers", value: ultraCount, emoji: "🚀" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-2xl mb-1">{kpi.emoji}</p>
            <p className="text-2xl font-bold font-syne text-[var(--text)]">{kpi.value}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Stripe Setup</h3>
        <div className="space-y-3 text-sm text-[var(--muted)]">
          <p>1. Create a Stripe account at <span className="text-[var(--accent)]">stripe.com</span></p>
          <p>2. Create two products: <strong className="text-[var(--text)]">Pro ($9/mo)</strong> and <strong className="text-[var(--text)]">Ultra ($19/mo)</strong></p>
          <p>3. Copy the price IDs and add to <code className="font-mono-custom text-xs bg-[var(--surface-2)] px-1.5 py-0.5 rounded">.env.local</code></p>
          <p>4. Set up webhook endpoint: <code className="font-mono-custom text-xs bg-[var(--surface-2)] px-1.5 py-0.5 rounded">/api/stripe/webhook</code></p>
          <p>5. Add webhook secret to <code className="font-mono-custom text-xs bg-[var(--surface-2)] px-1.5 py-0.5 rounded">STRIPE_WEBHOOK_SECRET</code></p>
        </div>
      </div>

      {(proCount + ultraCount) === 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border-2)] border-dashed rounded-xl p-8 text-center">
          <p className="text-4xl mb-3">💰</p>
          <p className="text-[var(--muted)]">No paid subscribers yet. Set up Stripe to start collecting revenue.</p>
        </div>
      )}
    </div>
  );
}
