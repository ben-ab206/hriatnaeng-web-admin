
"use client";

import { api } from "@/trpc/client";

export function useSession() {
  const { data, isLoading, error, refetch } = api.auth.getSession.useQuery();

  if (error) {
    console.error("Error fetching session:", error);
  }

  return {
    session: data?.session || null,
    user: data?.user || null,
    loading: isLoading,
    refetch: refetch
  };
}
