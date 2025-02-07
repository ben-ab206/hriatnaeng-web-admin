import { NavItem } from "@/@types/nav-item";

export const routes: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: "dashboard",
    module: "dashboard",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: "settings",
    module: "settings"
  },
  {
    title: "Administrators",
    url: "/administrators",
    icon: "settings",
    module: "administrators"
  }
];
