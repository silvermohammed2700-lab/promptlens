"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface ProviderInfo {
  name: string; id: string; tier: string; dailyLimit: number | null;
  count: number; pct: number; configured: boolean; color: string;
}
interface ProviderStatus { providers: ProviderInfo[]; total: number; }

interface Stats {
  totalUsers: number;
  totalPrompts: number;
  mrr: number;
  paidUsers: number;
  planDistribution: { free: number; pro: number; ultra: number };
  recentEvents: Array<{ id: string; event: string; createdAt: string; params: Record<string, unknown>; user?: { name?: string; email?: string } }>;
}

interface GroqStatus {
  used: number; remaining: number; dailyLimit: number; pct: number;
  requestsThisMinute: number; tokensThisMinute: number; rpmLimit: number;
}
interface QueueStatus {
  active: number; waiting: number; maxConcurrent: number; groq?: GroqStatus;
}

export function OverviewTab() {
  const { data: stats } = useSWR<Stats>("/api/admin/stats", fetcher, { refreshInterval: 30000 });
  const { data: queue } = useSWR<QueueStatus>("/api/admin/queue-status", fetcher, { refreshInterval: 5000 });
  const { data: providerStatus } = useSWR<ProviderStatus>("/api/admin/provider-status", fetcher, { refreshInterval: 30000 });

  const total = stats ? stats.planDistribution.free + stats.planDistribution.pro + stats.planDistribution.ultra : 0;
  const queuePct = queue ? (queue.active / queue.maxConcurrent) * 100 : 0;
  const queueColor = queuePct < 50 ? "var(--accent-3)" : queuePct < 80 ? "var(--accent-4)" : "var(--accent-2)";

  const KPIs = [
    { label: "Total Users", value: stats?.totalUsers ?? "—", emoji: "👥" },
    { label: "Total Prompts", value: stats?.totalPrompts ?? "—", emoji: "✨" },
    { label: "MRR", value: stats ? `$${stats.mrr}` : "—", emoji: "💰" },
    { label: "Paid Users", value: stats?.paidUsers ?? "—", emoji: "⭐" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold font-syne text-[var(--text)]">Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIs.map((kpi) => (
          <div key={kpi.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-2xl mb-1">{kpi.emoji}</p>
            <p className="text-2xl font-bold font-syne text-[var(--text)]">{kpi.value}</p>
            <p className="text-xs text-[var(--muted)] mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Plan Distribution */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Plan Distribution</h3>
          {stats && (
            <div className="space-y-3">
              {[
                { plan: "Free", count: stats.planDistribution.free, color: "var(--muted)" },
                { plan: "Pro", count: stats.planDistribution.pro, color: "var(--accent)" },
                { plan: "Ultra", count: stats.planDistribution.ultra, color: "var(--accent-2)" },
              ].map(({ plan, count, color }) => (
                <div key={plan}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--muted)]">{plan}</span>
                    <span className="text-[var(--text)]">{count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)</span>
                  </div>
                  <div className="h-2 bg-[var(--surface-3)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%", backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Queue Status */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Live Queue Status <span className="text-xs text-[var(--muted)]">(refreshes every 5s)</span></h3>
          {queue ? (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--muted)]">Active requests</span>
                  <span style={{ color: queueColor }}>{queue.active} / {queue.maxConcurrent}</span>
                </div>
                <div className="h-3 bg-[var(--surface-3)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${queuePct}%`, backgroundColor: queueColor }} />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--muted)]">Waiting in queue</span>
                <span className="font-mono-custom font-bold" style={{ color: queue.waiting > 0 ? "var(--accent-4)" : "var(--accent-3)" }}>
                  {queue.waiting}
                </span>
              </div>
              <div className="text-xs text-[var(--muted)]">
                Capacity: {queuePct < 50 ? "🟢 Normal" : queuePct < 80 ? "🟡 Moderate" : "🔴 High load"}
              </div>
            </div>
          ) : (
            <p className="text-[var(--muted)] text-sm">Loading queue status...</p>
          )}
        </div>

        {/* Groq API Status */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[var(--text)] mb-4">Groq API Status <span className="text-xs text-[var(--muted)]">(refreshes every 5s)</span></h3>
          {queue?.groq ? (() => {
            const g = queue.groq;
            const barColor = g.pct < 70 ? "var(--accent-3)" : g.pct < 90 ? "var(--accent-4)" : "var(--accent-2)";
            const statusLabel = g.pct < 70 ? "🟢 Normal" : g.pct < 90 ? "🟡 Approaching limit" : "🔴 Near daily limit";
            return (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--muted)]">Requests today</span>
                    <span style={{ color: barColor }} className="font-mono-custom font-bold">
                      {g.used} / {g.dailyLimit.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2.5 bg-[var(--surface-3)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${g.pct}%`, backgroundColor: barColor }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[var(--surface-2)] rounded-lg p-2">
                    <p className="text-[var(--muted)]">Remaining today</p>
                    <p className="font-mono-custom font-bold text-[var(--text)]">{g.remaining.toLocaleString()}</p>
                  </div>
                  <div className="bg-[var(--surface-2)] rounded-lg p-2">
                    <p className="text-[var(--muted)]">Req this minute</p>
                    <p className="font-mono-custom font-bold text-[var(--text)]">{g.requestsThisMinute} / {g.rpmLimit}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--muted)]">{statusLabel} · Resets midnight UTC</p>
              </div>
            );
          })() : (
            <p className="text-[var(--muted)] text-sm">Loading Groq status...</p>
          )}
        </div>
      </div>

      {/* AI Provider Status */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-[var(--text)] mb-4">
          AI Provider Status <span className="text-xs text-[var(--muted)] font-normal">— last {providerStatus?.total ?? 0} generations</span>
        </h3>
        <div className="space-y-3">
          {providerStatus?.providers.map((p) => (
            <div key={p.id}>
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: p.configured ? p.color : "var(--dim)" }} />
                  <span className="text-[var(--text)] font-medium">{p.name}</span>
                  <span className="text-[var(--dim)] text-xs">{p.tier}</span>
                  {!p.configured && <span className="text-[var(--accent-2)] text-xs">⚠ not configured</span>}
                </div>
                <span className="text-[var(--muted)]">
                  {p.count} uses ({p.pct}%)
                  {p.dailyLimit && <span className="text-[var(--dim)]"> · {p.dailyLimit.toLocaleString()}/day limit</span>}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--surface-3)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, backgroundColor: p.color }} />
              </div>
            </div>
          ))}
          {!providerStatus && <p className="text-sm text-[var(--muted)]">Loading provider status...</p>}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text)]">Recent Events</h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {stats?.recentEvents?.map((ev) => (
            <div key={ev.id} className="px-5 py-3 flex items-center gap-4">
              <span className="text-xs font-mono-custom text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded">{ev.event}</span>
              <span className="text-xs text-[var(--muted)] flex-1">{ev.user?.email ?? "anonymous"}</span>
              <span className="text-xs text-[var(--dim)]">{new Date(ev.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
          {!stats?.recentEvents?.length && (
            <p className="px-5 py-4 text-sm text-[var(--muted)]">No events yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
