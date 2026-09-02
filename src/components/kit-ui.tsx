import { MODULES } from "@/lib/kit/catalog";
import { MODULE_TONE } from "@/lib/kit/store";
import type { ModuleId, Profile, ResolvedItem } from "@/lib/kit/types";
import { cn, formatKg } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { ReactNode } from "react";

export function ModuleMark({
  id,
  className,
}: {
  id: ModuleId;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-3.5 shrink-0 rounded-sm",
        MODULE_TONE[id].fill,
        className,
      )}
    />
  );
}

export function ModuleRail({
  id,
  className,
}: {
  id: ModuleId;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-7 w-1.5 shrink-0 rounded-full",
        MODULE_TONE[id].fill,
        className,
      )}
    />
  );
}

export function ModuleChip({
  id,
  children,
  active = false,
  className,
}: {
  id: ModuleId;
  children: ReactNode;
  active?: boolean;
  className?: string;
}) {
  const tone = MODULE_TONE[id];
  return (
    <span
      className={cn(
        "inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium",
        active ? cn(tone.fill, tone.on) : cn("bg-paper-2 text-fg", tone.text),
        className,
      )}
    >
      <ModuleMark id={id} className="size-3" />
      {children}
    </span>
  );
}

export function ModuleLabel({ id }: { id: ModuleId }) {
  const m = MODULES.find((x) => x.id === id);
  return (
    <span className={cn("inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider", MODULE_TONE[id].text)}>
      <ModuleMark id={id} />
      {m?.short ?? id}
    </span>
  );
}

export function WeightMeter({
  packed,
  total,
  budget,
  perCarrier,
}: {
  packed: number;
  total: number;
  budget: number;
  perCarrier: number;
}) {
  const over = perCarrier > 15000;
  const vsBudget = budget === 0 ? 0 : (total / budget) * 100;
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-3xl tabular-nums leading-none text-fg">
            {formatKg(packed)}
          </p>
          <p className="mt-1 text-sm text-muted">
            spakowane z {formatKg(total)} · cel {formatKg(budget)}
          </p>
        </div>
        <p
          className={cn(
            "text-right text-sm tabular-nums",
            over ? "text-brick" : "text-muted",
          )}
        >
          {formatKg(perCarrier)}
          <span className="block text-xs">na niosącego</span>
        </p>
      </div>
      <Progress
        value={vsBudget}
        barClassName={over ? "bg-brick" : "bg-forest"}
      />
      {over ? (
        <p className="text-sm text-brick">
          Powyżej 15 kg na osobę plecak przestaje być pomocą.
        </p>
      ) : null}
    </div>
  );
}

export function ReadinessRing({
  value,
  size = 112,
}: {
  value: number;
  size?: number;
}) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label={`Gotowość ${Math.round(v)} procent`}
    >
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-paper-2"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-forest"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl tabular-nums leading-none">
          {Math.round(v)}
        </span>
        <span className="text-xs text-muted">%</span>
      </div>
    </div>
  );
}

export function householdLine(p: Profile): string {
  const bits: string[] = [];
  bits.push(
    p.adults === 1 ? "1 dorosły" : `${p.adults} dorosłych`,
  );
  if (p.children)
    bits.push(
      p.children === 1 ? "1 dziecko" : `${p.children} dzieci`,
    );
  if (p.infants)
    bits.push(
      p.infants === 1 ? "1 niemowlę" : `${p.infants} niemowląt`,
    );
  if (p.pets)
    bits.push(
      p.pets === 1 ? "1 zwierzę" : `${p.pets} zwierząt`,
    );
  return bits.join(" · ");
}

export function itemLine(item: ResolvedItem): string {
  const q =
    item.qty > 1 ? `${item.qty.toLocaleString("pl-PL")} × ` : "";
  return `${q}${item.name}`;
}

export function BackpackLayers({
  byLayer,
}: {
  byLayer: Record<string, number>;
}) {
  const layers = [
    { id: "pocket", label: "Kieszenie", h: "h-8" },
    { id: "top", label: "Góra", h: "h-14" },
    { id: "mid", label: "Środek", h: "h-16" },
    { id: "bottom", label: "Dół", h: "h-20" },
  ];
  const max = Math.max(1, ...layers.map((l) => byLayer[l.id] ?? 0));
  return (
    <div className="mx-auto w-40">
      <div className="mx-auto mb-2 h-6 w-16 rounded-t-full border border-line bg-paper-2" />
      <div className="overflow-hidden rounded-b-3xl rounded-t-lg border border-line bg-paper-2">
        {layers.map((l) => {
          const n = byLayer[l.id] ?? 0;
          const fill = n / max;
          return (
            <div
              key={l.id}
              className={cn(
                "relative border-b border-line last:border-b-0",
                l.h,
              )}
            >
              <div
                className="absolute inset-y-0 left-0 bg-forest/25"
                style={{ width: `${Math.round(fill * 100)}%` }}
              />
              <div className="relative flex h-full items-center justify-between px-3 text-xs">
                <span>{l.label}</span>
                <span className="tabular-nums text-muted">{n}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
