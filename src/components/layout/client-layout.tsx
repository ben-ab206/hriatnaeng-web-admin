"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthGuard } from "../auth-guard";
import TopNav from "../top-nav";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/auth") || pathname.startsWith("/set-password");
  return (
    <SidebarProvider>
      {!isAuthPage && <AppSidebar />}
      <main className="min-h-screen w-full">
        {/* {!isAuthPage && <SidebarTrigger />} */}
        <AuthGuard>
          <div>
            {!isAuthPage && (
              <div className="w-full flex flex-row p-2 border-b items-center">
                <SidebarTrigger />
                <TopNav />
              </div>
            )}
            <div className="p-5">{children}</div>
          </div>
        </AuthGuard>
      </main>
    </SidebarProvider>
  );
}
