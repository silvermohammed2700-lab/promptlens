"use client";
import { useState } from "react";
import useSWR from "swr";
import { Badge } from "@/components/ui/Badge";
import { Toast } from "@/components/ui/Toast";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface User {
  id: string; name: string | null; email: string; image: string | null;
  plan: string; role: string; promptsToday: number; promptsTotal: number; createdAt: string;
}

interface UsersResponse { users: User[]; total: number; }

export function UsersTab() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const query = new URLSearchParams({ page: String(page), limit: "50", ...(search ? { search } : {}) });
  const { data, mutate } = useSWR<UsersResponse>(`/api/admin/users?${query}`, fetcher);

  const updateUser = async (id: string, updates: { plan?: string; role?: string }) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setToast({ message: "User updated successfully", type: "success" });
      mutate();
    } catch {
      setToast({ message: "Failed to update user", type: "error" });
    }
  };

  const planVariant = (plan: string) =>
    plan === "ultra" ? "ultra" : plan === "pro" ? "pro" : "free";

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-syne text-[var(--text)]">Users</h2>
        <span className="text-sm text-[var(--muted)]">{data?.total ?? 0} total</span>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        placeholder="Search by name or email..."
        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] min-h-[44px]"
      />

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                <th className="text-left px-4 py-3 text-xs text-[var(--muted)] font-medium">User</th>
                <th className="text-left px-4 py-3 text-xs text-[var(--muted)] font-medium">Plan</th>
                <th className="text-left px-4 py-3 text-xs text-[var(--muted)] font-medium">Prompts</th>
                <th className="text-left px-4 py-3 text-xs text-[var(--muted)] font-medium">Joined</th>
                <th className="text-left px-4 py-3 text-xs text-[var(--muted)] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data?.users?.map((user) => (
                <tr key={user.id} className="hover:bg-[var(--surface-2)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img src={user.image} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                          {(user.name ?? user.email)[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-[var(--text)] font-medium">{user.name ?? "—"}</p>
                        <p className="text-xs text-[var(--muted)]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={planVariant(user.plan) as "free" | "pro" | "ultra"}>{user.plan}</Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)] font-mono-custom text-xs">{user.promptsTotal}</td>
                  <td className="px-4 py-3 text-[var(--muted)] text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.plan !== "pro" && (
                        <button onClick={() => updateUser(user.id, { plan: "pro" })} className="text-xs text-[var(--accent)] hover:opacity-80 px-2 py-1 rounded border border-[var(--accent)]/30 hover:border-[var(--accent)] transition-colors min-h-[28px]">→ Pro</button>
                      )}
                      {user.plan !== "ultra" && (
                        <button onClick={() => updateUser(user.id, { plan: "ultra" })} className="text-xs text-[var(--accent-2)] hover:opacity-80 px-2 py-1 rounded border border-[var(--accent-2)]/30 hover:border-[var(--accent-2)] transition-colors min-h-[28px]">→ Ultra</button>
                      )}
                      {user.plan !== "free" && (
                        <button onClick={() => updateUser(user.id, { plan: "free" })} className="text-xs text-[var(--muted)] hover:opacity-80 px-2 py-1 rounded border border-[var(--border)] transition-colors min-h-[28px]">→ Free</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!data?.users?.length && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)] text-sm">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
