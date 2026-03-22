"use client";
import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type = "info", onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const colors = {
    success: "border-[var(--accent-3)] text-[var(--accent-3)]",
    error: "border-[var(--accent-2)] text-[var(--accent-2)]",
    info: "border-[var(--accent)] text-[var(--accent)]",
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 bg-[var(--surface)] border ${colors[type]} rounded-lg px-4 py-3 shadow-lg max-w-sm animate-slide-up`}>
      <p className="text-sm text-[var(--text)]">{message}</p>
    </div>
  );
}
