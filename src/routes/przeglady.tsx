import { createFileRoute } from "@tanstack/react-router";
import { resolveCatalog } from "@/lib/kit/catalog";
import {
  downloadIcs,
  expiryEvent,
  googleCalendarUrl,
  reviewEvent,
} from "@/lib/kit/calendar";
import { useKitStore } from "@/lib/kit/store";
import { ModuleMark } from "@/components/kit-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addMonths, differenceInDays, format, isValid, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarPlus, Download } from "lucide-react";

export const Route = createFileRoute("/przeglady")({
  component: ReviewsPage,
});

function status(iso?: string) {
  if (!iso) return "brak" as const;
  const d = parseISO(iso);
  if (!isValid(d)) return "brak" as const;
  const days = differenceInDays(d, new Date());
  if (days < 0) return "po" as const;
  if (days <= 30) return "soon" as const;
  return "ok" as const;
}

export function ReviewsPage() {
  const profile = useKitStore((s) => s.profile);
  const custom = useKitStore((s) => s.custom);
  const expiries = useKitStore((s) => s.expiries);
  const setExpiry = useKitStore((s) => s.setExpiry);
  const lastReview = useKitStore((s) => s.lastReview);
  const setLastReview = useKitStore((s) => s.setLastReview);
  const months = useKitStore((s) => s.reviewEveryMonths);
  const setMonths = useKitStore((s) => s.setReviewEveryMonths);
  const clearExpiry = useKitStore((s) => s.clearExpiry);

  const items = resolveCatalog(profile, custom).filter(
    (i) => i.expiry !== "none",
  );

  const next = lastReview ? addMonths(new Date(lastReview), months) : null;
  const days = next ? differenceInDays(next, new Date()) : null;
  const calDate = next ?? addMonths(new Date(), months);
  const review = reviewEvent(calDate, months);
  const dated = items
    .filter((i) => expiries[i.id])
    .map((i) => expiryEvent(i.id, i.name, expiries[i.id]));

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Rotacja
        </p>
        <h1 className="font-display text-4xl leading-none">Przeglądy</h1>
        <p className="mt-2 max-w-lg text-muted">
          Leki, racje, woda, baterie i tabletki. Co sześć miesięcy albo nigdy.
        </p>
      </header>

      <section className="rounded-xl bg-paper-2 p-5 shadow-card">
        <p className="text-xs uppercase tracking-wider text-muted">
          Kalendarz zestawu
        </p>
        <p className="mt-1 font-display text-2xl">
          {next
            ? format(next, "d MMMM yyyy", { locale: pl })
            : "Ustaw pierwszy przegląd"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {days == null
            ? "Po spakowaniu odhacz przegląd — przypomnienie za 6 miesięcy."
            : days < 0
              ? "Termin minął. Otwórz plecak dziś."
              : `${days} dni do kolejnego otwarcia.`}
        </p>
        <Button
          className="mt-4"
          onClick={() => setLastReview(new Date().toISOString())}
        >
          Zrobione dziś
        </Button>
        <div className="mt-4 flex flex-wrap gap-2">
          {[3, 6, 12].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setMonths(n)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm",
                months === n
                  ? "bg-forest text-on-forest"
                  : "bg-paper text-fg",
              )}
            >
              co {n} mies.
            </button>
          ))}
        </div>

        <div className="mt-6 border-t border-line pt-4">
          <p className="text-sm text-muted">
            Wpisz {format(calDate, "d MMMM yyyy", { locale: pl })} do kalendarza.
            Powtórka co {months} mies. Alarm 7 dni wcześniej w pliku .ics.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button variant="outline" asChild>
              <a
                href={googleCalendarUrl(review)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarPlus className="size-4" />
                Google Calendar
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                downloadIcs("przeglad-plecaka-72h.ics", [review])
              }
            >
              <Download className="size-4" />
              Plik .ics
            </Button>
            {dated.length > 0 ? (
              <Button
                variant="ghost"
                onClick={() =>
                  downloadIcs("plecak-72h-daty.ics", [review, ...dated])
                }
              >
                Wszystkie daty ({dated.length + 1})
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      <ul className="divide-y divide-line overflow-hidden rounded-lg bg-paper-2 shadow-card">
        {items.map((item) => {
          const iso = expiries[item.id];
          const st = status(iso);
          const ev = iso ? expiryEvent(item.id, item.name, iso) : null;
          return (
            <li
              key={item.id}
              className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <ModuleMark id={item.module} />
                  {item.name}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    st === "po" && "text-brick",
                    st === "soon" && "text-warn",
                    st === "ok" && "text-muted",
                    st === "brak" && "text-muted",
                  )}
                >
                  {st === "brak" &&
                    `Brak daty · typowo ${item.expiryMonths ?? 12} mies.`}
                  {st === "ok" &&
                    iso &&
                    `Do ${format(parseISO(iso), "d MMM yyyy", { locale: pl })}`}
                  {st === "soon" && "Kończy się w ciągu 30 dni"}
                  {st === "po" && "Przeterminowane — wymień"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Input
                  type="date"
                  className="h-11 max-w-48"
                  value={iso ? iso.slice(0, 10) : ""}
                  onChange={(e) => {
                    if (!e.target.value) {
                      clearExpiry(item.id);
                      return;
                    }
                    setExpiry(item.id, `${e.target.value}T12:00:00.000Z`);
                  }}
                  aria-label={`Data ważności: ${item.name}`}
                />
                {ev ? (
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={googleCalendarUrl(ev)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Google Calendar: ${item.name}`}
                    >
                      <CalendarPlus className="size-4" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
