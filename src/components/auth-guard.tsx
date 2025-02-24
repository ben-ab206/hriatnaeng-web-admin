// "use client";
// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useSession } from "@/hooks/useSession";
// import { api } from "@/trpc/client";

// export function AuthGuard({ children }: { children: React.ReactNode }) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { session, user, refetch } = useSession();
//   const { mutateAsync: setSession } = api.auth.setSessionByToken.useMutation();

//   useEffect(() => {
//     const handleAuth = async () => {
//       // Handle OAuth tokens if present
//       const hash = window.location.hash.substring(1);
//       const urlParams = new URLSearchParams(hash);
//       const accessToken = urlParams.get("access_token");
//       const refreshToken = urlParams.get("refresh_token");

//       if (accessToken && refreshToken) {
//         try {
//           await setSession({ accessToken, refreshToken });
//           window.history.replaceState(
//             null,
//             document.title,
//             window.location.pathname + window.location.search
//           );
//           await refetch();
//           router.push("/set-password");
//           return;
//         } catch (error) {
//           console.error("Failed to verify access token:", error);
//           router.push("/auth");
//           return;
//         }
//       }

//       // Handle regular auth redirects
//       if (session && user) {
//         if (pathname.startsWith("/auth")) {
//           router.push("/");
//         }
//       } else {
//         if (!pathname.startsWith("/auth")) {
//           router.push("/auth");
//         }
//       }
//     };

//     handleAuth();
//   }, [session, pathname]);

//   // Always render children immediately
//   return <>{children}</>;
// }