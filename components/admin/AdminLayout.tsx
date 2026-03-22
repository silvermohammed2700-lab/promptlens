"use client";
import { ReactNode } from "react";
import Link from "next/link";

type AdminTab = "overview" | "visitors" | "users" | "revenue" | "ads" | "events" | "settings";

const TABS: { id: AdminTab; label: string; emoji: string }[] = [
  { id: "overview", label: "Overview", emoji: "📊" },
  { id: "visitors", label: "Visitors", emoji: "👥" },
  { id: "users", label: "Users", emoji: "👤" },
  { id: "revenue", label: "Revenue", emoji: "💰" },
  { id: "ads", label: "Ad Manager", emoji: "📢" },
  { id: "events", label: "Events Log", emoji: "📋" },
  { id: "settings", label: "Settings", emoji: "⚙️" },
];

interface AdminLayoutProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: ReactNode;
}

export function AdminLayout({ activeTab, onTabChange, children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-[var(--border)] bg-[var(--surface)] hidden md:flex flex-col">
        <div className="px-4 py-5 border-b border-[var(--border)]">
          <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">Admin Panel</p>
        </div>
        <nav className="flex-1 px-2 py-3 space-y-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left min-h-[40px]
                ${activeTab === tab.id
                  ? "bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                }`}
            >
              <span>{tab.emoji}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-[var(--border)]">
          <Link href="/" className="text-xs text-[var(--muted)] hover:text-[var(--accent)]">← Back to site</Link>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[var(--surface)] border-t border-[var(--border)] flex overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-2 flex-1 min-w-[60px] text-xs transition-colors
              ${activeTab === tab.id ? "text-[var(--accent)]" : "text-[var(--muted)]"}`}
          >
            <span className="text-lg">{tab.emoji}</span>
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
