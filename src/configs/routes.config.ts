import { NavItem } from "@/@types/nav-item";

export const routes: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: "dashboard",
    module: "dashboard",
  },
  {
    title: "Books",
    url: "/books",
    icon: "settings",
    module: "books",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: "settings",
    module: "settings",
  },
  {
    title: "Administrators",
    url: "/administrators",
    icon: "settings",
    module: "administrators",
  },
  {
    title: "Top Banners",
    url: "/top-banners",
    icon: "settings",
    module: "top-banners",
  },
  {
    title: "Collections",
    url: "/collections",
    icon: "settings",
    module: "collections",
  },
];
