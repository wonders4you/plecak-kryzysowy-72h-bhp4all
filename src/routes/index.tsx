import { createFileRoute, Link } from "@tanstack/react-router";
import {
  carriers,
  LEVELS,
  MODULES,
  resolveCatalog,
  weightBudgetGrams,
} from "@/lib/kit/catalog";
import { SCENARIOS } from "@/lib/kit/knowledge";
import { MODULE_TONE, useKitStore } from "@/lib/kit/store";
import {
  BackpackLayers,
  householdLine,
  ReadinessRing,
  WeightMeter,
} from "@/components/kit-ui";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Siren } from "lucide-react";
import { addMonths, differenceInDays, format } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

export function Home() {
  const profile = useKitStore((s) => s.profile);
  const packed = useKitStore((s) => s.packed);
  const custom = useKitStore((s) => s.custom);
  const onboarded = useKitStore((s) => s.onboarded);
  const lastReview = useKitStore((s) => s.lastReview);
  const reviewEveryMonths = useKitStore((s) => s.reviewEveryMonths);
  const expiries = useKitStore((s) => s.expiries);
  const scenario = useKitStore((s) => s.scenario);
  const setScenario = useKitStore((s) => s.setScenario);
  const ice = useKitStore((s) => s.ice);

  const items = resolveCatalog(profile, custom, scenario);
  const total = items.reduce((a, i) => a + i.weightGrams, 0);
  const packedW = items
    .filter((i) => packed[i.id])
    .reduce((a, i) => a + i.weightGrams, 0);
  const packedN = items.filter((i) => packed[i.id]).length;
  const pct = items.length ? (packedN / items.length) * 100 : 0;
  const budget = weightBudgetGrams(profile);
  const per = packedW / carriers(profile);
  const level = LEVELS.find((l) => l.id === profile.level);

  const byLayer: Record<string, number> = {};
  for (const i of items) {
    if (i.packedLayer && packed[i.id]) {
      byLayer[i.packedLayer] = (byLayer[i.packedLayer] ?? 0) + 1;
    }
  }

  const nextReview = lastReview
    ? addMonths(new Date(lastReview), reviewEveryMonths)
    : null;
  const reviewDays = nextReview
    ? differenceInDays(nextReview, new Date())
    : null;

  const expiring = items.filter((i) => {
    const d = expiries[i.id];
    if (!d) return false;
    return differenceInDays(new Date(d), new Date()) <= 30;
  }).length;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Gotowość domu
        </p>
        <h1 className="font-display text-4xl leading-none tracking-tight md:text-5xl">
          Trzy doby.
          <span className="block text-forest">Bez paniki.</span>
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          Modularny plecak na pierwsze 72 godziny kryzysu.{" "}
          <Link to="/profil" className="underline underline-offset-2 hover:text-fg">
            Lista pod Twój dom
          </Link>
          ,{" "}
          <Link to="/plecak" className="underline underline-offset-2 hover:text-fg">
            waga na żywo
          </Link>
          ,{" "}
          <Link to="/przeglady" className="underline underline-offset-2 hover:text-fg">
            daty ważności
          </Link>{" "}
          i{" "}
          <Link to="/teraz" className="underline underline-offset-2 hover:text-fg">
            kolejność chwytania
          </Link>
          , gdy trzeba wyjść teraz.{" "}
          <a
            href="https://kams.com.pl/p25214,plecak-awaryjny-17.html"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-fg"
          >
            (inspiracja)
          </a>
        </p>
      </header>

      {!onboarded ? (
        <section className="rounded-xl bg-forest px-5 py-5 text-on-forest shadow-card">
          <p className="font-display text-2xl">Najpierw domownicy</p>
          <p className="mt-2 max-w-md text-sm opacity-80">
            Liczba osób, zwierzęta, zima, region. Z tego składa się lista —
            nie z katalogu sklepu.
          </p>
          <Button
            asChild
            variant="paper"
            className="mt-4 bg-paper text-ink"
          >
            <Link to="/profil">
              Ułóż zestaw
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="rounded-xl bg-paper-2 p-5 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">
                <Link
                  to="/plecak"
                  className="underline-offset-2 hover:text-fg hover:underline"
                >
                  Spakowane
                </Link>
              </p>
              <p className="mt-1 font-display text-2xl">
                {packedN} / {items.length}
              </p>
              <p className="mt-1 text-sm text-muted">
                {householdLine(profile)}
                {level ? ` · ${level.name}` : null}
              </p>
            </div>
            <ReadinessRing value={pct} />
          </div>
          <div className="mt-6">
            <WeightMeter
              packed={packedW}
              total={total}
              budget={budget}
              perCarrier={per}
            />
          </div>
        </div>
        <div className="rounded-xl bg-paper-2 p-5 shadow-card">
          <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-muted">
            Warstwy
          </p>
          <BackpackLayers byLayer={byLayer} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {MODULES.filter((m) => m.id !== "inne").map((m) => {
          const group = items.filter((i) => i.module === m.id);
          const done = group.filter((i) => packed[i.id]).length;
          const p = group.length ? (done / group.length) * 100 : 0;
          return (
            <Link
              key={m.id}
              to="/plecak"
              search={{ modul: m.id }}
              className={cn(
                "relative overflow-hidden rounded-lg p-4 pl-5 shadow-card transition-transform duration-150 hover:-translate-y-0.5",
                MODULE_TONE[m.id].wash,
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-1.5",
                  MODULE_TONE[m.id].fill,
                )}
              />
              <div className="flex items-center justify-between gap-2">
                <p className={cn("font-medium", MODULE_TONE[m.id].text)}>
                  {m.name}
                </p>
                <span className="text-sm tabular-nums text-muted">
                  {done}/{group.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted">{m.hint}</p>
              <Progress
                value={p}
                className="mt-3 bg-fg/10"
                barClassName={MODULE_TONE[m.id].fill}
              />
            </Link>
          );
        })}
      </section>

      <section className="rounded-xl bg-brick px-5 py-6 text-on-brick">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] opacity-80">
          <Siren className="size-4" />
          Kryzys jest teraz
        </p>
        <h2 className="mt-2 font-display text-3xl leading-none">
          Nie pakuj. Chwytaj.
        </h2>
        <p className="mt-3 max-w-lg text-sm opacity-85">
          Osiem kroków w kolejności, w jakiej wychodzisz z domu. Duże pola,
          bez eseju. Lista ICE: {ice.length} kontaktów.
        </p>
        <Button asChild variant="paper" className="mt-5 bg-paper text-ink">
          <Link to="/teraz">
            Tryb ewakuacji
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-2xl">Scenariusz</h2>
          {scenario ? (
            <button
              type="button"
              className="text-sm text-muted underline-offset-2 hover:underline"
              onClick={() => setScenario(null)}
            >
              Wyczyść
            </button>
          ) : null}
        </div>
        <p className="mb-4 max-w-xl text-sm text-muted">
          Zaznacz to, co jest realne u Ciebie. Checklista podświetli rzeczy,
          których nie wolno pominąć.
        </p>
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() =>
                setScenario(scenario === s.id ? null : s.id)
              }
              className={
                scenario === s.id
                  ? "rounded-full bg-forest px-3 py-2 text-sm text-on-forest"
                  : "rounded-full bg-paper-2 px-3 py-2 text-sm text-fg"
              }
            >
              {s.name}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link
          to="/przeglady"
          className="rounded-lg bg-paper-2 p-4 shadow-card"
        >
          <p className="text-xs uppercase tracking-wider text-muted">
            Następny przegląd
          </p>
          <p className="mt-1 font-display text-xl">
            {nextReview
              ? format(nextReview, "d MMMM yyyy", { locale: pl })
              : "Nie ustawiony"}
          </p>
          <p className="mt-1 text-sm text-muted">
            {reviewDays == null
              ? "Oznacz przegląd po spakowaniu."
              : reviewDays < 0
                ? "Przeterminowany. Zrób go dziś."
                : `${reviewDays} dni. ${expiring} pozycji z datą ≤ 30 dni.`}
          </p>
        </Link>
        <Link
          to="/kopia"
          className="rounded-lg bg-paper-2 p-4 shadow-card"
        >
          <p className="text-xs uppercase tracking-wider text-muted">
            Kopia zapasowa
          </p>
          <p className="mt-1 font-display text-xl">Plik na dysku</p>
          <p className="mt-1 text-sm text-muted">
            Pobierz JSON albo wczytaj na innym telefonie. Pamięć przeglądarki
            nie jest archiwum.
          </p>
        </Link>
        <Link
          to="/wiedza"
          className="rounded-lg bg-paper-2 p-4 shadow-card sm:col-span-2"
        >
          <p className="text-xs uppercase tracking-wider text-muted">
            Zasada
          </p>
          <p className="mt-1 font-display text-xl">Mniej znaczy więcej</p>
          <p className="mt-1 text-sm text-muted">
            Czego nie pakować, jak układać warstwy i czemu woda waży za dużo.
          </p>
        </Link>
      </section>
    </div>
  );
}
