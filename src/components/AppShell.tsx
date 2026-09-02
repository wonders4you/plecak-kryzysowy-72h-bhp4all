import { Link, useRouterState } from "@tanstack/react-router";
import {
  Backpack,
  BookOpen,
  CalendarClock,
  HardDrive,
  LayoutDashboard,
  Menu,
  Moon,
  Phone,
  Siren,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useKitStore } from "@/lib/kit/store";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { to: "/", label: "Start", icon: LayoutDashboard },
  { to: "/plecak", label: "Plecak", icon: Backpack },
  { to: "/teraz", label: "Teraz", icon: Siren },
  { to: "/przeglady", label: "Daty", icon: CalendarClock },
] as const;

const MORE = [
  { to: "/profil", label: "Domownicy", icon: UserRound },
  { to: "/wiedza", label: "Wiedza", icon: BookOpen },
  { to: "/ice", label: "ICE", icon: Phone },
  { to: "/kopia", label: "Kopia", icon: HardDrive },
] as const;

function NavLink({
  to,
  label,
  icon: Icon,
  onClick,
  variant,
}: {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  onClick?: () => void;
  variant: "side" | "bottom";
}) {
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });
  const active =
    to === "/"
      ? pathname === "/"
      : pathname === to || pathname.startsWith(`${to}/`);
  if (variant === "bottom") {
    return (
      <Link
        to={to}
        onClick={onClick}
        className={cn(
          "flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium",
          active ? "text-forest" : "text-muted",
        )}
      >
        <Icon className="size-5" strokeWidth={active ? 2.2 : 1.7} />
        {label}
      </Link>
    );
  }
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium",
        active
          ? "bg-forest text-on-forest"
          : "text-fg hover:bg-paper-2",
      )}
    >
      <Icon className="size-4 shrink-0" />
      {label}
    </Link>
  );
}

function SiteCredit({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-1 text-center text-xs text-muted", className)}>
      <p>
        Autor:{" "}
        <a
          href="https://wonders4you.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-fg hover:underline"
        >
          wonders4you
        </a>
        {" · "}
        licencja MIT
      </p>
      <p>
        <a
          href="https://bhp4all.pl"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-fg hover:underline"
        >
          BHP4ALL
        </a>
        {" "}
        — wiedza BHP
      </p>
      <p>
        Inspiracja:{" "}
        <a
          href="https://kams.com.pl/p25214,plecak-awaryjny-17.html"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:text-fg hover:underline"
        >
          Plecak awaryjny
        </a>
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const dark = useKitStore((s) => s.dark);
  const setDark = useKitStore((s) => s.setDark);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-10 min-h-dvh bg-paper text-fg">
      <div
        aria-hidden
        className="no-print sticky top-0 z-50 h-1.5 w-full bg-forest"
      />
      <a
        href="#main"
        className="sr-only no-print focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-forest focus:px-3 focus:py-2 focus:text-on-forest"
      >
        Przejdź do treści
      </a>

      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-line bg-paper px-3 py-5 md:flex">
        <Link to="/" className="mb-8 px-2">
          <p className="font-display text-3xl leading-none tracking-tight">
            72h
          </p>
          <p className="mt-1 text-xs text-muted">Plecak kryzysowy</p>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {PRIMARY.map((item) => (
            <NavLink key={item.to} {...item} variant="side" />
          ))}
          <div className="my-3 h-px bg-line" />
          {MORE.map((item) => (
            <NavLink key={item.to} {...item} variant="side" />
          ))}
        </nav>
        <Button
          variant="ghost"
          className="mt-4 justify-start"
          onClick={() => setDark(!dark)}
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {dark ? "Dzień" : "Noc"}
        </Button>
      </aside>

      <header className="no-print sticky top-0 z-20 flex h-16 items-center justify-between border-b border-line bg-paper/90 px-4 backdrop-blur md:hidden">
        <Link to="/" className="font-display text-2xl leading-none">
          72h
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={dark ? "Motyw dzienny" : "Motyw nocny"}
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </header>

      {open ? (
        <div className="no-print fixed inset-0 z-20 bg-paper pt-16 md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {[...PRIMARY, ...MORE].map((item) => (
              <NavLink
                key={item.to}
                {...item}
                variant="side"
                onClick={() => setOpen(false)}
              />
            ))}
          </nav>
        </div>
      ) : null}

      <main
        id="main"
        className="mx-auto min-h-dvh max-w-3xl px-4 pb-28 pt-6 md:ml-56 md:max-w-4xl md:pb-16 md:pt-10"
      >
        {children}
        <footer className="no-print mt-16 border-t border-line pt-4 text-center">
          <SiteCredit />
        </footer>
      </main>

      <nav className="no-print fixed inset-x-0 bottom-0 z-20 flex border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {PRIMARY.map((item) => (
          <NavLink key={item.to} {...item} variant="bottom" />
        ))}
      </nav>
    </div>
  );
}
