"use client";

import useSWR from "swr";
import type { UserProfile } from "@/types";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<UserProfile>(
    "/api/user/me",
    fetcher,
    { revalidateOnFocus: false }
  );

  return {
    user: data,
    isLoading,
    isError: !!error,
    mutate,
  };
}
