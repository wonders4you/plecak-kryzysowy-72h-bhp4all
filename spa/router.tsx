import { useEffect } from "react";
import {
  Outlet,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { z } from "zod";
import { AppShell } from "@/components/AppShell";
import { useHasHydrated, useKitStore } from "@/lib/kit/store";
import { Home } from "@/routes/index";
import { PlecakPage } from "@/routes/plecak";
import { TerazPage } from "@/routes/teraz";
import { ReviewsPage } from "@/routes/przeglady";
import { ProfilPage } from "@/routes/profil";
import { IcePage } from "@/routes/ice";
import { BackupPage } from "@/routes/kopia";
import { KnowledgePage } from "@/routes/wiedza.index";
import { ArticlePage } from "@/routes/wiedza.$slug";

function Root() {
  useHasHydrated();
  const dark = useKitStore((s) => s.dark);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}

const rootRoute = createRootRoute({ component: Root });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const plecakRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "plecak",
  validateSearch: z.object({
    modul: z
      .enum(["czerwony", "szary", "niebieski", "czarny", "inne"])
      .optional(),
  }),
  component: PlecakPage,
});

const terazRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "teraz",
  component: TerazPage,
});

const przegladyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "przeglady",
  component: ReviewsPage,
});

const profilRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "profil",
  component: ProfilPage,
});

const iceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "ice",
  component: IcePage,
});

const kopiaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "kopia",
  component: BackupPage,
});

const wiedzaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "wiedza",
  component: () => <Outlet />,
});

const wiedzaIndexRoute = createRoute({
  getParentRoute: () => wiedzaRoute,
  path: "/",
  component: KnowledgePage,
});

const wiedzaSlugRoute = createRoute({
  getParentRoute: () => wiedzaRoute,
  path: "$slug",
  component: ArticlePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  plecakRoute,
  terazRoute,
  przegladyRoute,
  profilRoute,
  iceRoute,
  kopiaRoute,
  wiedzaRoute.addChildren([wiedzaIndexRoute, wiedzaSlugRoute]),
]);

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
});
