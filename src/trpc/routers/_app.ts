import { router } from "../server";
import { authRouter } from "./auth";
import { roleModulePermissionRouter } from "./role_module_permission";
import { rolesRouter } from "./roles";
import { usersRouter } from "./users";
import { topBannerRouters } from "./top-banner";
import { booksRouter } from "./books";
import { podcastsRouter } from "./podcasts";
import { collectionsRouter } from "./collections";

export const appRouter = router({
  users: usersRouter,
  auth: authRouter,
  roles: rolesRouter,
  roleModulePermissons: roleModulePermissionRouter,
  topBanner: topBannerRouters,
  books: booksRouter,
  podcasts: podcastsRouter,
  collections: collectionsRouter
});

export type AppRouter = typeof appRouter;
