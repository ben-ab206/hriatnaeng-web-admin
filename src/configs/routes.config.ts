import { NavItem } from "@/@types/nav-item";

const userManagementRoutes: NavItem[] = [
  {
    title: "Administrators",
    url: "/administrators",
    icon: "settings",
    module: "administrators",
  },
  {
    title: "Settings",
    url: "/settings",
    icon: "settings",
    module: "settings",
  },
];

const contentManagementRoutes: NavItem[] = [
  {
    title: "Books",
    url: "/books",
    icon: "books",
    module: "books",
  },
  {
    title: "Categories",
    url: "/categories",
    icon: "categories",
    module: "categories",
  },
  {
    title: "People",
    url: "/people",
    icon: "categories",
    module: "people",
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
    module: "sections",
  },
];

export { contentManagementRoutes, userManagementRoutes };
