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
    icon: "books",
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
    module: "administrators"
  },
  {
    title: "Categories",
    url: "/categories",
    icon: "categories",
    module: "categories",
  },
  {
    title: "Top Banners",
    url: "/top-banners",
    icon: "topbanners",
    module: "top-banners",
  },
  {
    title: "Collections",
    url: "/collections",
    icon: "settings",
    module: "collections",
  },
  {
    title: "Sections",
    url: "/sections",
    icon: "sections",
    module: "sections"
  }
];
