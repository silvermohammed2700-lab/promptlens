"use client";

interface ToggleProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Toggle({ enabled, onChange, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-[var(--accent)]" : "bg-[var(--surface-3)]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {label && <span className="sr-only">{label}</span>}
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
