"use client";
import { useState, useEffect } from "react";

interface InterstitialAdProps {
  adCode: string;
  onClose: () => void;
}

export function InterstitialAd({ adCode, onClose }: InterstitialAdProps) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 w-full max-w-lg mx-4 relative">
        <div dangerouslySetInnerHTML={{ __html: adCode }} />
        <button
          onClick={onClose}
          disabled={countdown > 0}
          className="mt-4 w-full py-2 rounded-lg bg-[var(--surface-2)] text-[var(--muted)] disabled:opacity-50"
        >
          {countdown > 0 ? `Close in ${countdown}s` : "Close"}
        </button>
      </div>
    </div>
  );
}
