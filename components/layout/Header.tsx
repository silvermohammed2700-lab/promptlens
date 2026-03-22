"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Badge } from "@/components/ui/Badge";

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { settings } = useSiteSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = session?.user as {
    id?: string; name?: string | null; email?: string | null;
    image?: string | null; role?: string; plan?: string;
  } | undefined;

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!user;

  const planBadgeVariant =
    user?.plan === "ultra" ? "ultra" :
    user?.plan === "pro" ? "pro" : "free";

  const navLinks = [
    { href: "/image-to-prompt", label: "Tool" },
    ...(settings?.showPricing !== false ? [{ href: "/pricing", label: "Pricing" }] : []),
    { href: "/blog", label: "Blog" },
    ...(isAuthenticated ? [{ href: "/saved", label: "Saved" }] : []),
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-[16px]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl font-extrabold font-syne text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)]">
            PromptLens
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[36px] flex items-center
                ${pathname === link.href
                  ? "bg-[var(--surface-2)] text-[var(--text)]"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Loading skeleton */}
          {isLoading && (
            <div className="w-24 h-9 bg-[var(--surface-2)] rounded-xl animate-pulse" />
          )}

          {/* Unauthenticated — Sign In + Sign Up */}
          {!isLoading && !isAuthenticated && (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-2)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] rounded-xl transition-all min-h-[36px] flex items-center"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity min-h-[36px] flex items-center shadow-lg shadow-[var(--accent)]/20"
              >
                Sign Up Free
              </Link>
            </div>
          )}

          {/* Authenticated — User menu */}
          {!isLoading && isAuthenticated && (
            <div className="flex items-center gap-2">
              {user?.plan && user.plan !== "free" && (
                <Badge variant={planBadgeVariant as "free" | "pro" | "ultra"}>{user.plan}</Badge>
              )}
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] hover:border-[var(--border-2)] bg-[var(--surface-2)] transition-colors min-h-[36px]"
                >
                  {user?.image ? (
                    <img src={user.image} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                      {(user?.name ?? user?.email ?? "U")[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm text-[var(--text)] hidden sm:block max-w-[120px] truncate">
                    {user?.name ?? user?.email?.split("@")[0] ?? "User"}
                  </span>
                  <span className="text-[var(--muted)] text-xs hidden sm:block">▾</span>
                </button>

                {menuOpen && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-52 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl z-50 animate-slide-up overflow-hidden">
                      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
                        <p className="text-sm font-medium text-[var(--text)] truncate">
                          {user?.name ?? "User"}
                        </p>
                        <p className="text-xs text-[var(--muted)] truncate">{user?.email}</p>
                      </div>
                      <Link
                        href="/saved"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                      >
                        💾 Saved Prompts
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors"
                        >
                          ⚙️ Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-[var(--border)]">
                        <button
                          onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--accent-2)] hover:bg-[var(--surface-2)] transition-colors text-left"
                        >
                          🚪 Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-[var(--muted)] hover:text-[var(--text)] min-h-[36px] min-w-[36px] flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-3 space-y-1 animate-slide-up">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm text-[var(--text)] hover:bg-[var(--surface-2)] rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-2 border-t border-[var(--border)] mt-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 text-sm text-[var(--text)] border border-[var(--border)] rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center px-4 py-2 text-sm bg-[var(--accent)] text-white rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
