"use client";

import useSWR from "swr";
import type { SiteSettings } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSiteSettings() {
  const { data, error, isLoading } = useSWR<SiteSettings>(
    "/api/settings/public",
    fetcher,
    {
      refreshInterval: 60_000,
      revalidateOnFocus: false,
    }
  );

  return {
    settings: data,
    isLoading,
    isError: !!error,
  };
}
