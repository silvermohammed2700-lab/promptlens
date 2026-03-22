"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
      {/* Google */}
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={handleGoogle}
        loading={googleLoading}
      >
        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs text-[var(--muted)]">or</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--dim)] focus:outline-none focus:border-[var(--accent)] transition-colors min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--muted)] mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--dim)] focus:outline-none focus:border-[var(--accent)] transition-colors min-h-[44px]"
          />
        </div>

        {error && (
          <p className="text-sm text-[var(--accent-2)] bg-[var(--accent-2)]/10 border border-[var(--accent-2)]/20 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-[var(--muted)]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[var(--accent)] hover:opacity-80">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
