import { createFileRoute, Link } from "@tanstack/react-router";
import { GRAB_STEPS } from "@/lib/kit/knowledge";
import { useKitStore } from "@/lib/kit/store";
import { Progress } from "@/components/ui/progress";
import { cn, telHref } from "@/lib/utils";
import { Check, Phone, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/teraz")({ component: TerazPage });

export function TerazPage() {
  const done = useKitStore((s) => s.grabDone);
  const toggle = useKitStore((s) => s.toggleGrab);
  const reset = useKitStore((s) => s.resetGrab);
  const ice = useKitStore((s) => s.ice);
  const meeting = useKitStore((s) => s.meetingPoint);

  const n = GRAB_STEPS.length;
  const current = GRAB_STEPS.find((s) => !done.includes(s.id)) ?? null;
  const pct = (done.length / n) * 100;
  const finished = done.length === n;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brick">
          Ewakuacja
        </p>
        <h1 className="font-display text-4xl leading-none">Teraz</h1>
        <p className="mt-2 max-w-lg text-muted">
          Kolejność chwytania, nie pakowania. Zaznacz, wyjdź. Nie wracaj po
          pamiątki.
        </p>
      </header>

      <div>
        <div className="mb-2 flex justify-between text-sm tabular-nums text-muted">
          <span>
            {done.length} / {n}
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1 hover:text-fg"
            onClick={reset}
          >
            <RotateCcw className="size-3.5" />
            Od nowa
          </button>
        </div>
        <Progress value={pct} barClassName="bg-brick" />
      </div>

      {ice.length || meeting ? (
        <div className="rounded-lg border border-brick/30 bg-brick/10 px-4 py-3 text-sm">
          {meeting ? (
            <p>
              <span className="text-muted">Punkt zbiórki: </span>
              {meeting}
            </p>
          ) : null}
          {ice[0] ? (
            <a
              href={telHref(ice[0].phone)}
              className="mt-1 inline-flex items-center gap-2 font-medium text-brick"
            >
              <Phone className="size-4" />
              {ice[0].name} · {ice[0].phone}
            </a>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-muted">
          Dodaj kontakty ICE, zanim będą potrzebne.{" "}
          <Link to="/ice" className="underline underline-offset-2">
            Otwórz ICE
          </Link>
        </p>
      )}

      {finished ? (
        <section className="rounded-xl bg-forest px-5 py-8 text-center text-on-forest">
          <p className="font-display text-3xl">Wychodzisz.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm opacity-85">
            Zamknij gaz i wodę tylko jeśli masz 30 sekund. Drzwi. Idź do punktu
            zbiórki.
          </p>
        </section>
      ) : current ? (
        <button
          type="button"
          onClick={() => toggle(current.id)}
          className="block w-full rounded-xl bg-paper-2 p-6 text-left shadow-card"
        >
          <p className="text-xs uppercase tracking-wider text-muted">
            Następny krok
          </p>
          <h2 className="mt-2 font-display text-3xl leading-none">
            {current.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {current.body}
          </p>
          <span className="mt-6 inline-flex min-h-12 items-center rounded-md bg-brick px-4 text-sm font-medium text-on-brick">
            Zrobione — dalej
          </span>
        </button>
      ) : null}

      <ol className="space-y-2">
        {GRAB_STEPS.map((step, i) => {
          const on = done.includes(step.id);
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => toggle(step.id)}
                className={cn(
                  "flex w-full min-h-14 items-start gap-3 rounded-lg px-4 py-3 text-left",
                  on ? "bg-paper-2/60 text-muted" : "bg-paper-2",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs tabular-nums",
                    on
                      ? "bg-forest text-on-forest"
                      : "bg-ink text-paper",
                  )}
                >
                  {on ? <Check className="size-4" /> : i + 1}
                </span>
                <span>
                  <span
                    className={cn("block font-medium", on && "line-through")}
                  >
                    {step.title}
                  </span>
                  <span className="block text-sm text-muted">{step.body}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <p className="text-sm text-muted">
        Jeśli pakujesz spokojnie, wróć do{" "}
        <Link to="/plecak" className="underline underline-offset-2">
          checklisty
        </Link>
        .
      </p>
    </div>
  );
}
