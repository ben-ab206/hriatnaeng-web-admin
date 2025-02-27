"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { api } from "@/trpc/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, user, refetch, loading } = useSession();
  const { mutateAsync: setSession } = api.auth.setSessionByToken.useMutation();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      setIsProcessing(true);

      // Extract access & refresh token from the URL hash
      const hash = window.location.hash.substring(1);
      const urlParams = new URLSearchParams(hash);
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");

      if (accessToken && refreshToken) {
        try {
          await setSession({ accessToken, refreshToken });
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

      if (!loading) {
        if (session && user) {
          if (user.is_active === false) {
            if (pathname === "/set-password") {
              setIsProcessing(false);
              return;
            } else if (!pathname.startsWith("/auth")) {
              router.replace("/auth");
              return;
            }
          } else {
            if (pathname.startsWith("/auth")) {
              router.replace("/");
              return;
            }
          }
        } else {
          if (!pathname.startsWith("/auth")) {
            router.replace("/auth");
            return;
          }
        }
      }

      setIsProcessing(false);
    };

    handleAuth();
  }, [session, user, pathname, loading, refetch, router, setSession]);

  if (isProcessing || loading) return null;

  return <>{children}</>;
}
