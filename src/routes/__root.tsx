import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/AppShell";
import { useHasHydrated, useKitStore } from "@/lib/kit/store";
import { useEffect } from "react";
import appCss from "../styles.css?url";

const APP_NAME = "72h — Plecak kryzysowy";

const THEME_BOOT = `(function(){try{var r=localStorage.getItem('kit-72h-v1');if(!r)return;var s=JSON.parse(r);if(s&&s.state&&s.state.dark)document.documentElement.classList.add('dark');}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Plecak kryzysowy na 72 godziny: checklista z wagą, profil domu, daty ważności i tryb ewakuacji.",
      },
      { name: "theme-color", content: "#2F4A3C" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
});

function RootDocument() {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="antialiased">
        <PreviewHostBridge />
        <AuthProvider>
          <HydratedShell>
            <Outlet />
          </HydratedShell>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function HydratedShell({ children }: { children: React.ReactNode }) {
  useHasHydrated();
  const dark = useKitStore((s) => s.dark);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return <AppShell>{children}</AppShell>;
}
