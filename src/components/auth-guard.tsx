"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { api } from "@/trpc/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, user, refetch, loading } = useSession();
  const { mutateAsync: setSession } = api.auth.setSessionByToken.useMutation();
  const [isProcessing, setIsProcessing] = useState(true);

  const handleAuth = useCallback(async () => {
    setIsProcessing(true);
    
    if (typeof window === "undefined") return;

    const hash = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(hash);
    const accessToken = urlParams.get("access_token");
    const refreshToken = urlParams.get("refresh_token");

    if (accessToken && refreshToken) {
      try {
        await setSession({ accessToken, refreshToken });
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        await refetch();
        router.replace("/set-password");
        return;
      } catch (error) {
        console.error("Failed to verify access token:", error);
        router.replace("/auth");
        return;
      }
    }

    if (!loading) {
      if (session && user) {
        if (!user.is_active) {
          if (pathname !== "/set-password") {
            router.replace("/auth");
          }
        } else if (pathname.startsWith("/auth")) {
          router.replace("/");
        }
      } else if (!pathname.startsWith("/auth")) {
        router.replace("/auth");
      }
    }

    setIsProcessing(false);
  }, [session, user, pathname, loading, refetch, router, setSession]);

  useEffect(() => {
    handleAuth();
  }, [handleAuth]);

  if (isProcessing || loading) return null;

  return <>{children}</>;
}
