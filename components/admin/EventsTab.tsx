"use client";
import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface PromptEvent {
  id: string; event: string; params: Record<string, unknown>;
  createdAt: string; user?: { name?: string; email?: string };
}

export function EventsTab() {
  const { data, mutate } = useSWR<{ events: PromptEvent[]; total: number }>("/api/admin/events", fetcher);
  const [clearing, setClearing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const clearAll = async () => {
    if (!confirm("Clear all events? This cannot be undone.")) return;
    setClearing(true);
    try {
      await fetch("/api/admin/events", { method: "DELETE" });
      setToast({ message: "All events cleared", type: "success" });
      mutate();
    } catch {
      setToast({ message: "Failed to clear events", type: "error" });
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-syne text-[var(--text)]">Events Log</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--muted)]">{data?.total ?? 0} events</span>
          <Button variant="danger" size="sm" onClick={clearAll} loading={clearing}>Clear All</Button>
        </div>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                <th className="text-left px-4 py-3 text-xs text-[var(--muted)] font-medium">Time</th>
                <th className="text-left px-4 py-3 text-xs text-[var(--muted)] font-medium">Event</th>
                <th className="text-left px-4 py-3 text-xs text-[var(--muted)] font-medium">User</th>
                <th className="text-left px-4 py-3 text-xs text-[var(--muted)] font-medium">Params</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data?.events?.map((ev) => (
                <tr key={ev.id} className="hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-4 py-3 text-xs text-[var(--muted)] font-mono-custom whitespace-nowrap">
                    {new Date(ev.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono-custom bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-1 rounded">
                      {ev.event}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--muted)]">
                    {ev.user?.email ?? "anonymous"}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--dim)] font-mono-custom max-w-[200px] truncate">
                    {JSON.stringify(ev.params)}
                  </td>
                </tr>
              ))}
              {!data?.events?.length && (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-[var(--muted)] text-sm">No events recorded yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
