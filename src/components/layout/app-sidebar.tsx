import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import navigationIcon from "@/configs/navigation-icon.config";
import {
  contentManagementRoutes,
  userManagementRoutes,
} from "@/configs/routes.config";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();

  const isRouteActive = (url: string) => {
    if (url === "/" && pathname === "/") {
      return true;
    }
    return url !== "/" && pathname.startsWith(url);
  };

  return (
    <Sidebar>
      <SidebarHeader>
        {/* <div className="flex flex-row items-center justify-center "> */}
        {/* <Image
            src="/hriatna-eng-logo.png"
            width={80}
            height={80}
            alt="LOGO"
          /> */}
        <h4 className="font-semibold text-xl p-6">Hriatna Eng</h4>
        {/* </div> */}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                {
                  title: "Dashboard",
                  url: "/",
                  icon: "dashboard",
                  module: "dashboard",
                },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isRouteActive(item.url)}
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      {navigationIcon[item.icon]}
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Content Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentManagementRoutes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isRouteActive(item.url)}
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      {navigationIcon[item.icon]}
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>User Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userManagementRoutes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isRouteActive(item.url)}
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      {navigationIcon[item.icon]}
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
