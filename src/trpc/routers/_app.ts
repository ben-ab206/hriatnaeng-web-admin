import { router } from "../server";
import { authRouter } from "./auth";
import { roleModulePermissionRouter } from "./role_module_permission";
import { rolesRouter } from "./roles";
import { usersRouter } from "./users";
import { categoriesRouter } from "./categories";
import { peopleRouter } from "./people";
import { topBannerRouters } from "./top-banner";
import { booksRouter } from "./books";
import { podcastsRouter } from "./podcasts";
import { collectionsRouter } from "./collections";
import { sectionsRouter } from "./sections";
import { fileRouter } from "./file_upload";
import { audioRouter } from "./audios";
import { bookContentRouter } from "./bookContent";

export const appRouter = router({
  users: usersRouter,
  auth: authRouter,
  roles: rolesRouter,
  roleModulePermissons: roleModulePermissionRouter,
  categories: categoriesRouter,
  people: peopleRouter,
  topBanner: topBannerRouters,
  books: booksRouter,
  podcasts: podcastsRouter,
  collections: collectionsRouter,
  sections: sectionsRouter,
  fileUpload: fileRouter,
  audios: audioRouter,
  bookContents: bookContentRouter,
});

export type AppRouter = typeof appRouter;
