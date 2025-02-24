import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import navigationIcon from "@/configs/navigation-icon.config";
import { routes } from "@/configs/routes.config";
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isRouteActive(item.url)}
                    tooltip={item.title}
                  >
                    <a href={item.url}>
                      {navigationIcon[item.icon]}
                      <span>{item.title}</span>
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
