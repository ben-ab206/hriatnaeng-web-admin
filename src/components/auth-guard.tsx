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
  const [isTokenProcessed, setIsTokenProcessed] = useState(false);

  // First useEffect only for token processing from URL
  useEffect(() => {
    const processTokenFromUrl = async () => {
      // Only run this logic once
      if (isTokenProcessed) return;

      const hash = window.location.hash.substring(1);
      const urlParams = new URLSearchParams(hash);
      const accessToken = urlParams.get("access_token");
      const refreshToken = urlParams.get("refresh_token");

      if (accessToken && refreshToken) {
        try {
          await setSession({ accessToken, refreshToken });
          // Clear URL hash without causing navigation
          window.history.replaceState(
            null,
            document.title,
            window.location.pathname + window.location.search
          );
          await refetch();

          // Don't cause immediate navigation, just mark tokens as processed
          setIsTokenProcessed(true);
        } catch (error) {
          console.error("Failed to verify access token:", error);
          router.push("/auth");
        }
      } else {
        setIsTokenProcessed(true);
      }
    };

    processTokenFromUrl();
  }, [setSession, refetch, router, isTokenProcessed]);

  // Second useEffect for route protection logic
  useEffect(() => {
    const handleRouteProtection = async () => {
      // Wait until token processing is complete and session is loaded
      if (!isTokenProcessed || loading) {
        return;
      }

      // Handle routing after token is processed and session is loaded
      if (session && user) {
        if (user.is_active === false) {
          if (pathname === "/set-password") {
            // Allow access to set-password for inactive users
            setIsProcessing(false);
          } else if (!pathname.startsWith("/auth")) {
            // Redirect inactive users away from protected routes
            router.replace("/auth");
          } else {
            setIsProcessing(false);
          }
        } else {
          // Active user logic
          if (pathname.startsWith("/auth")) {
            router.replace("/");
          } else {
            setIsProcessing(false);
          }
        }
      } else {
        // No authenticated user
        if (!pathname.startsWith("/auth")) {
          router.replace("/auth");
        } else {
          setIsProcessing(false);
        }
      }
    };

    handleRouteProtection();
  }, [session, user, pathname, loading, router, isTokenProcessed]);

  // Third useEffect specifically to handle redirect to set-password after token processing
  useEffect(() => {
    const handleSetPasswordRedirect = () => {
      // If tokens were processed and we have a session but we're not already on set-password
      if (
        isTokenProcessed &&
        session &&
        user &&
        pathname !== "/set-password" &&
        window.location.hash.includes("access_token")
      ) {
        router.push("/set-password");
      }
    };

    handleSetPasswordRedirect();
  }, [isTokenProcessed, session, user, pathname, router]);

  // Show nothing during processing to prevent flicker
  if (isProcessing || loading || !isTokenProcessed) return null;

  return <>{children}</>;
}
