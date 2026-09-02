import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LEVELS, REGIONS } from "@/lib/kit/catalog";
import { useKitStore } from "@/lib/kit/store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/profil")({ component: ProfilPage });

function Stepper({
  label,
  value,
  onChange,
  min = 0,
  max = 8,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-paper-2 px-4 py-3">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-md border border-line"
          aria-label={`Mniej: ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center font-display text-xl tabular-nums">
          {value}
        </span>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-md border border-line"
          aria-label={`Więcej: ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

function Toggle({
  label,
  hint,
  on,
  onChange,
}: {
  label: string;
  hint: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={cn(
        "rounded-lg px-4 py-3 text-left",
        on ? "bg-forest text-on-forest" : "bg-paper-2",
      )}
    >
      <span className="block text-sm font-medium">{label}</span>
      <span className={cn("block text-xs", on ? "opacity-80" : "text-muted")}>
        {hint}
      </span>
    </button>
  );
}

export function ProfilPage() {
  const profile = useKitStore((s) => s.profile);
  const setProfile = useKitStore((s) => s.setProfile);
  const setOnboarded = useKitStore((s) => s.setOnboarded);
  const navigate = useNavigate();

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Profil
        </p>
        <h1 className="font-display text-4xl leading-none">Domownicy</h1>
        <p className="mt-2 max-w-lg text-muted">
          Lista i waga liczą się od tego. Nic nie wychodzi z telefonu.
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="font-display text-2xl">Kto wychodzi</h2>
        <Stepper
          label="Dorośli"
          value={profile.adults}
          min={1}
          onChange={(n) => setProfile({ adults: n })}
        />
        <Stepper
          label="Dzieci"
          value={profile.children}
          onChange={(n) => setProfile({ children: n })}
        />
        <Stepper
          label="Niemowlęta"
          value={profile.infants}
          onChange={(n) => setProfile({ infants: n })}
        />
        <Stepper
          label="Zwierzęta"
          value={profile.pets}
          onChange={(n) => setProfile({ pets: n })}
        />
      </section>

      <section className="grid gap-2 sm:grid-cols-3">
        <Toggle
          label="Zima / mróz"
          hint="Śpiwór, czapka, karimata"
          on={profile.winter}
          onChange={(v) => setProfile({ winter: v })}
        />
        <Toggle
          label="Insulina"
          hint="Chłodzenie i zapas"
          on={profile.insulin}
          onChange={(v) => setProfile({ insulin: v })}
        />
        <Toggle
          label="EpiPen"
          hint="Anafilaksja"
          on={profile.epipen}
          onChange={(v) => setProfile({ epipen: v })}
        />
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl">Region</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setProfile({ region: r.id })}
              className={cn(
                "rounded-lg px-4 py-3 text-left",
                profile.region === r.id
                  ? "bg-forest text-on-forest"
                  : "bg-paper-2",
              )}
            >
              <span className="block text-sm font-medium">{r.name}</span>
              <span
                className={cn(
                  "block text-xs",
                  profile.region === r.id ? "opacity-80" : "text-muted",
                )}
              >
                {r.hint}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-2xl">Poziom</h2>
        <div className="grid gap-2">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setProfile({ level: l.id })}
              className={cn(
                "rounded-lg px-4 py-4 text-left",
                profile.level === l.id
                  ? "bg-ink text-paper"
                  : "bg-paper-2",
              )}
            >
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-xl">{l.name}</span>
                <span className="text-sm opacity-70">
                  {l.hours} · {l.weight}
                </span>
              </span>
              <span
                className={cn(
                  "mt-1 block text-sm",
                  profile.level === l.id ? "opacity-75" : "text-muted",
                )}
              >
                {l.for}
              </span>
            </button>
          ))}
        </div>
      </section>

      <Button
        size="lg"
        className="w-full sm:w-auto"
        onClick={() => {
          setOnboarded(true);
          void navigate({ to: "/plecak" });
        }}
      >
        Zapisz i otwórz checklistę
      </Button>

      <p className="text-sm text-muted">
        Przenosisz zestaw na inny telefon?{" "}
        <Link to="/kopia" className="underline underline-offset-2">
          Pobierz kopię JSON
        </Link>
        .
      </p>
    </div>
  );
}
