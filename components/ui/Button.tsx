"use client";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 min-h-[36px] min-w-[36px]",
          variant === "primary" && "bg-[var(--accent)] text-white hover:opacity-90",
          variant === "secondary" && "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-2)]",
          variant === "ghost" && "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]",
          variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          (disabled || loading) && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        {loading ? <span className="animate-spin mr-2">⟳</span> : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
