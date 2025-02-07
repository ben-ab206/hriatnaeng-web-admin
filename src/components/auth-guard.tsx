
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { api } from "@/trpc/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Get access token from URL hash
  const getTokens = (): {
    accessToken: string | null;
    refreshToken?: string | null;
  } => {
    if (typeof window === "undefined")
      return { accessToken: null, refreshToken: null };
    const hash = window.location.hash.substring(1);
    const urlParams = new URLSearchParams(hash);
    return {
      accessToken: urlParams.get("access_token"),
      refreshToken: urlParams.get("refresh_token"),
    };
  };

  const { session, user, loading, refetch } = useSession();
  const { mutateAsync: setSession } = api.auth.setSessionByToken.useMutation();

  useEffect(() => {
    const handleAuth = async () => {
      if (loading) return;

      const { accessToken, refreshToken } = getTokens();

      if (accessToken && refreshToken) {
        try {
          await setSession({
            accessToken,
            refreshToken,
          });

          window.history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search
          );

          await refetch();

          router.push("/set-password");
          return;
        } catch (error) {
          console.error("Failed to verify access token:", error);
          router.push("/auth");
          return;
        }
      }

      if (session && user) {
        if (pathname.startsWith("/auth")) {
          router.push("/");
        }
      } else {
        if (!pathname.startsWith("/auth")) {
          router.push("/auth");
        }
      }
    };

    handleAuth();
  }, [session, loading, pathname, router]);

  // Show loading state while checking auth
  if (loading || (!session && !pathname.startsWith("/auth"))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
