"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { api } from "@/trpc/client";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, user, refetch, loading } = useSession(); // Ensure isLoading is available
  const { mutateAsync: setSession } = api.auth.setSessionByToken.useMutation();
  const [isProcessing, setIsProcessing] = useState(true); // Prevent unnecessary UI flickers

  useEffect(() => {
    const handleAuth = async () => {
      setIsProcessing(true); // Prevent unnecessary renders

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

      // Ensure we only redirect when session is fully loaded
      if (!loading) {
        if (session && user) {
          if (pathname.startsWith("/auth")) {
            router.replace("/");
          }
        } else {
          if (!pathname.startsWith("/auth")) {
            router.replace("/auth");
          }
        }
      }

      setIsProcessing(false); // Allow rendering after auth check
    };

    handleAuth();
  }, [session, user, pathname, loading]);

  // Prevent rendering until session check is done
  if (isProcessing || loading) return null;

  return <>{children}</>;
}
