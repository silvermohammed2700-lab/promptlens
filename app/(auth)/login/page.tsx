import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your PromptLens account",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold font-syne text-[var(--text)]">Welcome back</h1>
        <p className="text-[var(--muted)] mt-2">Sign in to your PromptLens account</p>
      </div>
      <LoginForm />
    </div>
  );
}
