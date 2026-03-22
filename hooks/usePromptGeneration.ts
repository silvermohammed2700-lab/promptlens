"use client";

import { useState, useCallback } from "react";
import type { GenerateRequest, GenerateResponse, GenerationStatus, TargetModel, OutputLanguage } from "@/types";

const STATUS_MESSAGES: Record<GenerationStatus, string> = {
  idle: "",
  uploading: "Preparing image...",
  queued: "High demand — your request is queued, please wait...",
  generating: "Analyzing image and generating prompt...",
  retrying: "High demand — retrying automatically...",
  done: "Prompt ready!",
  error: "Something went wrong. Please try again.",
};

export function usePromptGeneration() {
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusMessage = STATUS_MESSAGES[status];

  const generate = useCallback(
    async (
      base64Image: string,
      mimeType: string,
      targetModel: TargetModel,
      language: OutputLanguage,
      detail: "low" | "medium" | "high" = "high"
    ) => {
      setStatus("generating");
      setError(null);
      setResult(null);

      try {
        const base64 = base64Image;

        const attempt = async (): Promise<GenerateResponse> => {
          const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              base64Image: base64,
              mimeType: mimeType,
              targetModel,
              language,
              detail,
            } satisfies GenerateRequest),
          });

          if (response.status === 429) {
            setStatus("queued");
            await new Promise((r) => setTimeout(r, 3000));
            setStatus("retrying");
            return attempt();
          }

          if (!response.ok) {
            const data = (await response.json()) as { error?: string };
            throw new Error(data.error ?? "Generation failed");
          }

          return response.json() as Promise<GenerateResponse>;
        };

        const data = await attempt();
        setResult(data);
        setStatus("done");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("error");
      }
    },
    []
  );

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  return { status, statusMessage, result, error, generate, reset };
}

