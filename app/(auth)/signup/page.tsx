import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your free PromptLens account",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold font-syne text-[var(--text)]">Create account</h1>
        <p className="text-[var(--muted)] mt-2">Start converting images to prompts for free</p>
      </div>
      <SignupForm />
    </div>
  );
}
