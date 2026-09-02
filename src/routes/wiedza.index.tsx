import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ARTICLES,
  DONT_PACK,
  FACTS,
  FAQ,
  HELPLINES,
  PACK_LAYERS,
  SCENARIOS,
  articleLead,
} from "@/lib/kit/knowledge";
import { MODULES } from "@/lib/kit/catalog";
import { ModuleMark } from "@/components/kit-ui";
import { Input } from "@/components/ui/input";
import { ArrowRight, Phone } from "lucide-react";

export const Route = createFileRoute("/wiedza/")({
  component: KnowledgePage,
});

const TOC = [
  { id: "numery", label: "Numery" },
  { id: "artykuly", label: "Artykuły" },
  { id: "moduly", label: "Moduły" },
  { id: "scenariusze", label: "Scenariusze" },
  { id: "warstwy", label: "Warstwy" },
  { id: "nie-pakuj", label: "Nie pakuj" },
  { id: "faq", label: "Pytania" },
] as const;

function hay(parts: (string | undefined)[]) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

export function KnowledgePage() {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();

  const articles = useMemo(() => {
    if (!needle) return ARTICLES;
    return ARTICLES.filter((a) =>
      hay([
        a.title,
        a.kicker,
        ...a.sections.flatMap((s) => [s.heading, ...s.paras]),
      ]).includes(needle),
    );
  }, [needle]);

  const scenarios = useMemo(() => {
    if (!needle) return SCENARIOS;
    return SCENARIOS.filter((s) =>
      hay([s.name, s.flow, s.stayGo, ...s.key, ...s.missed, ...s.first15]).includes(
        needle,
      ),
    );
  }, [needle]);

  const modules = useMemo(() => {
    const list = MODULES.filter((m) => m.id !== "inne");
    if (!needle) return list;
    return list.filter((m) => hay([m.name, m.short, m.hint]).includes(needle));
  }, [needle]);

  const faq = useMemo(() => {
    if (!needle) return FAQ;
    return FAQ.filter((f) => hay([f.q, f.a]).includes(needle));
  }, [needle]);

  const empty =
    needle &&
    articles.length === 0 &&
    scenarios.length === 0 &&
    modules.length === 0 &&
    faq.length === 0;

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Podręcznik
        </p>
        <h1 className="font-display text-4xl leading-none">Wiedza</h1>
        <p className="mt-2 max-w-lg text-muted">
          72 godziny bez taktycznego teatru. Woda, łączność, czad, dzieci,
          numery. Potem checklista.
        </p>
        <div className="mt-5">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Szukaj: czad, woda, 112, dziecko…"
            aria-label="Szukaj w wiedzy"
          />
        </div>
        <nav className="mt-3 flex flex-wrap gap-2" aria-label="Spis">
          {TOC.map((t) => (
            <a
              key={t.id}
              href={`#${t.id}`}
              className="inline-flex min-h-11 items-center rounded-full bg-paper-2 px-3 text-sm"
            >
              {t.label}
            </a>
          ))}
        </nav>
      </header>

      <section aria-label="Szybkie fakty">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.k} className="rounded-lg bg-paper-2 px-3 py-3">
              <p className="font-display text-2xl leading-none">{f.k}</p>
              <p className="mt-1 text-xs text-muted">{f.v}</p>
            </div>
          ))}
        </div>
      </section>

      {empty ? (
        <p className="text-muted">Nic nie pasuje. Inne słowo albo wyczyść szukajkę.</p>
      ) : null}

      <section id="numery" className="scroll-mt-20 space-y-3">
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-2xl">Numery</h2>
          <Link
            to="/wiedza/$slug"
            params={{ slug: "numery" }}
            className="text-sm underline underline-offset-2"
          >
            Kiedy dzwonić
          </Link>
        </div>
        <p className="text-sm text-muted">
          112 bez karty SIM. Reszta — żeby nie zatykać alarmowego gazem i
          brakiem prądu.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {HELPLINES.map((h) => (
            <a
              key={h.num}
              href={`tel:${h.num}`}
              className="flex min-h-11 items-center gap-3 rounded-lg bg-paper-2 px-4 py-3"
            >
              <Phone className="size-4 shrink-0 text-muted" />
              <span className="font-display text-2xl leading-none tabular-nums">
                {h.num}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium">{h.name}</span>
                <span className="block text-xs text-muted">{h.when}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {articles.length ? (
        <section id="artykuly" className="scroll-mt-20 space-y-3">
          <h2 className="font-display text-2xl">Artykuły</h2>
          <div className="grid gap-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                to="/wiedza/$slug"
                params={{ slug: a.slug }}
                className="group rounded-xl bg-paper-2 p-5 shadow-card"
              >
                <p className="text-xs uppercase tracking-wider text-muted">
                  {a.kicker} · {a.minutes} min
                </p>
                <p className="mt-1 flex items-center justify-between gap-3 font-display text-2xl">
                  {a.title}
                  <ArrowRight className="size-4 shrink-0 opacity-40 transition-transform duration-150 group-hover:translate-x-0.5" />
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {articleLead(a)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {modules.length ? (
        <section id="moduly" className="scroll-mt-20">
          <h2 className="mb-3 font-display text-2xl">Moduły</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {modules.map((m) => (
              <Link
                key={m.id}
                to="/wiedza/$slug"
                params={{ slug: m.id }}
                className="rounded-lg bg-paper-2 p-4"
              >
                <p className="flex items-center gap-2 font-medium">
                  <ModuleMark id={m.id} />
                  {m.name}
                </p>
                <p className="mt-1 text-sm text-muted">{m.hint}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {scenarios.length ? (
        <section id="scenariusze" className="scroll-mt-20">
          <h2 className="mb-3 font-display text-2xl">Scenariusze</h2>
          <div className="grid gap-2">
            {scenarios.map((s) => (
              <Link
                key={s.id}
                to="/wiedza/$slug"
                params={{ slug: s.id }}
                className="rounded-lg bg-paper-2 p-4"
              >
                <p className="font-medium">{s.name}</p>
                <p className="mt-1 text-sm text-muted">{s.flow}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {!needle ? (
        <section id="warstwy" className="scroll-mt-20">
          <h2 className="mb-3 font-display text-2xl">Warstwy pakowania</h2>
          <ol className="space-y-2">
            {PACK_LAYERS.map((l) => (
              <li key={l.id} className="rounded-lg bg-paper-2 px-4 py-3">
                <p className="font-medium">{l.name}</p>
                <p className="text-sm text-muted">
                  {l.why} · {l.items}
                </p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {!needle ? (
        <section id="nie-pakuj" className="scroll-mt-20">
          <h2 className="mb-3 font-display text-2xl">Czego nie pakować</h2>
          <div className="space-y-4">
            {DONT_PACK.map((block) => (
              <div key={block.title} className="rounded-lg bg-paper-2 p-4">
                <p className="font-display text-xl">{block.title}</p>
                <ul className="mt-2 space-y-2 text-sm">
                  {block.rows.map(([no, why, instead]) => (
                    <li key={no}>
                      <span className="font-medium">{no}</span>
                      <span className="text-muted"> — {why}. </span>
                      <span>Zamiast: {instead}.</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {faq.length ? (
        <section id="faq" className="scroll-mt-20">
          <h2 className="mb-3 font-display text-2xl">Pytania</h2>
          <div className="space-y-2">
            {faq.map((f) => (
              <details key={f.q} className="rounded-lg bg-paper-2 px-4 py-3">
                <summary className="min-h-11 cursor-pointer list-none font-medium">
                  {f.q}
                </summary>
                <p className="mt-2 pb-2 text-sm leading-relaxed text-muted">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <p className="text-sm text-muted">
        Inspiracja:{" "}
        <a
          href="https://kams.com.pl/p25214,plecak-awaryjny-17.html"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          Plecak Awaryjny 17
        </a>
        {" · "}
        <a
          href="https://kams.com.pl/a840,co-zrobic-gdy-zabraknie-pradu-na-3-dni-sprawdzony-plan-awaryjny.html"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          3 dni bez prądu
        </a>
        . Źródło:{" "}
        <a
          href="https://wonders4you.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          wonders4you
        </a>
        , licencja MIT.
      </p>
    </div>
  );
}
