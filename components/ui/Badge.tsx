import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "pro" | "ultra" | "free" | "warning" | "success";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const styles = {
    default: "bg-[var(--surface-3)] text-[var(--muted)]",
    free: "bg-[var(--surface-3)] text-[var(--muted)]",
    pro: "bg-[var(--accent)]/20 text-[var(--accent)]",
    ultra: "bg-[var(--accent-2)]/20 text-[var(--accent-2)]",
    warning: "bg-[var(--accent-4)]/20 text-[var(--accent-4)]",
    success: "bg-[var(--accent-3)]/20 text-[var(--accent-3)]",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${styles[variant]}`}>
      {children}
    </span>
  );
}
