export const MODULES = {
  DASHBOARD: "dashboard",
  USERS: "users",
  ADMINISTRATORS: "administrators",
  SETTINGS: "settings",
  CATEGORIES: "categories"
} as const;

export type ModuleName = keyof typeof MODULES;
