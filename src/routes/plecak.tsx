import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { useMemo, useState } from "react";
import {
  carriers,
  MODULES,
  resolveCatalog,
  weightBudgetGrams,
} from "@/lib/kit/catalog";
import { MODULE_TONE, useKitStore } from "@/lib/kit/store";
import { SCENARIOS } from "@/lib/kit/knowledge";
import type { ModuleId } from "@/lib/kit/types";
import { itemLine, ModuleChip, ModuleRail, WeightMeter } from "@/components/kit-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, fallbackCopy, formatGrams } from "@/lib/utils";
import { Copy, ExternalLink, Printer, RotateCcw, Search, Trash2 } from "lucide-react";

const searchSchema = z.object({
  modul: z
    .enum(["czerwony", "szary", "niebieski", "czarny", "inne"])
    .optional(),
});

export const Route = createFileRoute("/plecak")({
  validateSearch: searchSchema,
  component: PlecakPage,
});

export function PlecakPage() {
  const { modul } = useSearch({ from: "/plecak" });
  const navigate = useNavigate();
  const profile = useKitStore((s) => s.profile);
  const packed = useKitStore((s) => s.packed);
  const custom = useKitStore((s) => s.custom);
  const togglePacked = useKitStore((s) => s.togglePacked);
  const resetPacked = useKitStore((s) => s.resetPacked);
  const addCustom = useKitStore((s) => s.addCustom);
  const removeCustom = useKitStore((s) => s.removeCustom);
  const scenario = useKitStore((s) => s.scenario);
  const region = profile.region;

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "done">("all");
  const [copied, setCopied] = useState("");
  const [draft, setDraft] = useState({
    name: "",
    weightGrams: "50",
    module: "czarny" as ModuleId,
  });

  const items = resolveCatalog(profile, custom, scenario);
  const visible = useMemo(() => {
    return items.filter((i) => {
      if (modul && i.module !== modul) return false;
      if (filter === "open" && packed[i.id]) return false;
      if (filter === "done" && !packed[i.id]) return false;
      if (q && !i.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [items, modul, filter, packed, q]);

  const total = items.reduce((a, i) => a + i.weightGrams, 0);
  const packedW = items
    .filter((i) => packed[i.id])
    .reduce((a, i) => a + i.weightGrams, 0);

  function copyList() {
    const lines = ["=== PLECAK 72h ===", ""];
    for (const m of MODULES) {
      const group = items.filter((i) => i.module === m.id);
      if (!group.length) continue;
      lines.push(`[${m.name.toUpperCase()}]`);
      for (const i of group) {
        lines.push(`    [${packed[i.id] ? "x" : " "}] ${itemLine(i)}`);
      }
      lines.push("");
    }
    lines.push("=== PRZEGLĄD CO 6 MIESIĘCY ===");
    const text = lines.join("\n");

    const ok = () => {
      setCopied("Skopiowano");
      setTimeout(() => setCopied(""), 2000);
    };
    const fail = () => {
      setCopied("Zaznacz i Ctrl+C");
      setTimeout(() => setCopied(""), 2500);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(ok).catch(() => {
        fallbackCopy(text) ? ok() : fail();
      });
    } else {
      fallbackCopy(text) ? ok() : fail();
    }
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Checklista
          </p>
          <h1 className="font-display text-4xl leading-none">Plecak</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" />
            Drukuj
          </Button>
          <Button variant="outline" onClick={copyList}>
            <Copy className="size-4" />
            {copied || "Kopiuj"}
          </Button>
          <Button variant="ghost" onClick={resetPacked}>
            <RotateCcw className="size-4" />
            Odznacz
          </Button>
        </div>
      </header>

      <div
        id="waga-sticky"
        className="sticky top-16 z-10 -mx-4 bg-paper/95 px-4 py-2 backdrop-blur md:top-0 print:static print:mx-0 print:bg-transparent print:px-0 print:py-0"
      >
        <div className="rounded-xl bg-paper-2 p-4 shadow-card md:p-5">
          <WeightMeter
            packed={packedW}
            total={total}
            budget={weightBudgetGrams(profile)}
            perCarrier={packedW / carriers(profile)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Szukaj pozycji…"
            className="pl-10"
            aria-label="Szukaj w checklistie"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(
            [
              ["all", "Wszystkie"],
              ["open", "Do spakowania"],
              ["done", "Spakowane"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-2 text-sm",
                filter === id
                  ? "bg-forest text-on-forest"
                  : "bg-paper-2 text-fg",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/plecak", search: { modul: undefined } })
            }
            className={cn(
              "min-h-11 shrink-0 rounded-full px-3 py-2 text-sm",
              !modul ? "bg-ink text-paper" : "bg-paper-2",
            )}
          >
            Moduły
          </button>
          {MODULES.map((m) => (
            <button
              key={m.id}
              type="button"
              className="shrink-0"
              onClick={() =>
                navigate({
                  to: "/plecak",
                  search: { modul: modul === m.id ? undefined : m.id },
                })
              }
            >
              <ModuleChip id={m.id} active={modul === m.id}>
                {m.short}
              </ModuleChip>
            </button>
          ))}
        </div>
      </div>

      {scenario ? (
        <p className="rounded-lg bg-forest/10 px-4 py-3 text-sm">
          Scenariusz:{" "}
          <span className="font-medium">
            {SCENARIOS.find((s) => s.id === scenario)?.name}
          </span>
          . Zielone znaczniki „Kluczowe” — tego nie pomijaj. Zmień na{" "}
          <Link to="/" className="underline underline-offset-2">
            starcie
          </Link>
          .
        </p>
      ) : null}

      <div className="space-y-8">
        {MODULES.filter(
          (m) => !modul || m.id === modul,
        ).map((m) => {
          const group = visible
            .filter((i) => i.module === m.id)
            .slice()
            .sort((a, b) => {
              const rank = (item: typeof a) => {
                if (scenario && item.tags.includes(scenario)) return 0;
                if (region !== "city" && item.tags.includes(region)) return 1;
                return 2;
              };
              return rank(a) - rank(b);
            });
          if (!group.length) return null;
          return (
            <section
              key={m.id}
              className="overflow-hidden rounded-xl bg-paper-2 shadow-card"
            >
              <h2
                className={cn(
                  "flex items-center gap-3 px-4 py-3 font-display text-2xl",
                  MODULE_TONE[m.id].wash,
                )}
              >
                <ModuleRail id={m.id} />
                <span className={cn("min-w-0 flex-1", MODULE_TONE[m.id].text)}>
                  {m.name}
                </span>
                <span
                  className={cn(
                    "ml-auto shrink-0 rounded-full px-2.5 py-1 font-sans text-xs font-medium uppercase tracking-wider",
                    MODULE_TONE[m.id].fill,
                    MODULE_TONE[m.id].on,
                  )}
                >
                  {m.short}
                </span>
              </h2>
              <ul className="divide-y divide-line">
                {group.map((item) => {
                  const hot = !!(scenario && item.tags.includes(scenario));
                  const regional =
                    !hot && region !== "city" && item.tags.includes(region);
                  return (
                    <li key={item.id}>
                      <div
                        className={cn(
                          "flex items-start gap-3 border-l-4 px-4 py-3",
                          MODULE_TONE[m.id].edge,
                          packed[item.id] && "opacity-60",
                          hot && "bg-forest/12",
                          regional && "bg-ink/5",
                        )}
                      >
                        <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                          <input
                            type="checkbox"
                            className={cn(
                              "mt-1 size-5 shrink-0",
                              MODULE_TONE[m.id].accent,
                            )}
                            checked={!!packed[item.id]}
                            onChange={() => togglePacked(item.id)}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span
                                className={cn(
                                  "text-sm font-medium",
                                  packed[item.id] && "line-through",
                                )}
                              >
                                {itemLine(item)}
                              </span>
                              {hot ? (
                                <span className="rounded-full bg-forest px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-on-forest">
                                  Kluczowe
                                </span>
                              ) : null}
                              {regional ? (
                                <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-paper">
                                  Region
                                </span>
                              ) : null}
                            </span>
                            <span className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted">
                              <span className="tabular-nums">
                                {formatGrams(item.weightGrams)}
                              </span>
                              {item.notes ? <span>{item.notes}</span> : null}
                            </span>
                          </span>
                        </label>
                        {item.shopUrl ? (
                          <a
                            href={item.shopUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-0.5 inline-flex shrink-0 items-center gap-1 text-xs text-muted underline-offset-2 hover:text-fg hover:underline"
                            aria-label={`Sklep KAMS: ${item.shopLabel}`}
                          >
                            <ExternalLink className="size-3.5" />
                            {item.shopLabel}
                          </a>
                        ) : null}
                        {item.custom ? (
                          <button
                            type="button"
                            className="mt-0.5 text-muted hover:text-brick"
                            aria-label="Usuń własną pozycję"
                            onClick={() => removeCustom(item.id)}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      <section className="rounded-xl bg-paper-2 p-5 shadow-card">
        <h2 className="font-display text-xl">Własna pozycja</h2>
        <p className="mt-1 text-sm text-muted">
          Leki, które znasz tylko Ty. Zostaje na tym urządzeniu.
        </p>
        <form
          className="mt-4 grid gap-3 sm:grid-cols-[1fr_7rem_8rem_auto]"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.name.trim()) return;
            addCustom({
              name: draft.name.trim(),
              weightGrams: Math.max(1, Number(draft.weightGrams) || 50),
              qty: 1,
              module: draft.module,
            });
            setDraft({ name: "", weightGrams: "50", module: draft.module });
          }}
        >
          <div>
            <Label htmlFor="c-name">Nazwa</Label>
            <Input
              id="c-name"
              value={draft.name}
              onChange={(e) =>
                setDraft((d) => ({ ...d, name: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="c-w">Waga (g)</Label>
            <Input
              id="c-w"
              type="number"
              min={1}
              value={draft.weightGrams}
              onChange={(e) =>
                setDraft((d) => ({ ...d, weightGrams: e.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor="c-m">Moduł</Label>
            <select
              id="c-m"
              className="mt-0 flex h-11 w-full rounded-md border border-line bg-paper px-3 text-sm"
              value={draft.module}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  module: e.target.value as ModuleId,
                }))
              }
            >
              {MODULES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.short}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Dodaj
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
