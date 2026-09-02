import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import {
  HELPLINES,
  MODULE_GUIDES,
  SCENARIOS,
  findArticle,
  relatedArticles,
} from "@/lib/kit/knowledge";
import { CATALOG, MODULES } from "@/lib/kit/catalog";
import { useKitStore } from "@/lib/kit/store";
import { ModuleMark } from "@/components/kit-ui";
import type { ModuleId } from "@/lib/kit/types";
import { ArrowLeft, Phone } from "lucide-react";

export const Route = createFileRoute("/wiedza/$slug")({
  component: ArticlePage,
});

function Back() {
  return (
    <Link
      to="/wiedza"
      className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg"
    >
      <ArrowLeft className="size-4" />
      Wiedza
    </Link>
  );
}

function Related({ slugs }: { slugs: string[] }) {
  const articles = relatedArticles(slugs);
  const scenarios = slugs
    .map((id) => SCENARIOS.find((s) => s.id === id))
    .filter(Boolean);
  const modules = slugs
    .map((id) => MODULES.find((m) => m.id === id))
    .filter(Boolean);
  if (!articles.length && !scenarios.length && !modules.length) return null;
  return (
    <section className="space-y-2">
      <h2 className="font-display text-2xl">Dalej</h2>
      <ul className="space-y-2">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              to="/wiedza/$slug"
              params={{ slug: a.slug }}
              className="text-sm underline underline-offset-2"
            >
              {a.title}
            </Link>
          </li>
        ))}
        {scenarios.map((s) =>
          s ? (
            <li key={s.id}>
              <Link
                to="/wiedza/$slug"
                params={{ slug: s.id }}
                className="text-sm underline underline-offset-2"
              >
                {s.name}
              </Link>
            </li>
          ) : null,
        )}
        {modules.map((m) =>
          m ? (
            <li key={m.id}>
              <Link
                to="/wiedza/$slug"
                params={{ slug: m.id }}
                className="text-sm underline underline-offset-2"
              >
                {m.name}
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </section>
  );
}

export function ArticlePage() {
  const { slug } = useParams({ from: "/wiedza/$slug" });
  const article = findArticle(slug);
  const scenario = SCENARIOS.find((s) => s.id === slug);
  const module = MODULES.find((m) => m.id === slug);
  const setScenario = useKitStore((s) => s.setScenario);

  if (!article && !scenario && !module) throw notFound();

  return (
    <article className="space-y-6">
      <Back />

      {article ? (
        <>
          <p className="text-xs uppercase tracking-wider text-muted">
            {article.kicker} · {article.minutes} min
          </p>
          <h1 className="font-display text-4xl leading-none">{article.title}</h1>
          {article.sections.map((s) => (
            <section key={s.heading ?? s.paras[0]} className="space-y-3">
              {s.heading ? (
                <h2 className="font-display text-2xl">{s.heading}</h2>
              ) : null}
              {s.paras.map((p) => (
                <p key={p} className="text-base leading-relaxed text-fg">
                  {p}
                </p>
              ))}
            </section>
          ))}
          {article.slug === "numery" ? (
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
          ) : null}
          <Related slugs={article.related} />
        </>
      ) : null}

      {scenario ? (
        <>
          <p className="text-xs uppercase tracking-wider text-muted">
            Scenariusz
          </p>
          <h1 className="font-display text-4xl leading-none">{scenario.name}</h1>
          <p className="text-base leading-relaxed text-muted">{scenario.flow}</p>
          <p className="rounded-lg bg-paper-2 px-4 py-3 text-sm leading-relaxed">
            {scenario.stayGo}
          </p>
          <h2 className="font-display text-2xl">Pierwsze 15 minut</h2>
          <ol className="list-decimal space-y-2 pl-5">
            {scenario.first15.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ol>
          <h2 className="font-display text-2xl">Kluczowe</h2>
          <ul className="list-disc space-y-1 pl-5">
            {scenario.key.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <h2 className="font-display text-2xl">Często pomijane</h2>
          <ul className="list-disc space-y-1 pl-5">
            {scenario.missed.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <Link
            to="/plecak"
            onClick={() => setScenario(scenario.id)}
            className="inline-flex min-h-11 items-center text-sm underline underline-offset-2"
          >
            Podświetl na checkliście
          </Link>
          <Related slugs={scenario.related} />
        </>
      ) : null}

      {module ? (
        <>
          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted">
            <ModuleMark id={module.id} />
            Moduł
          </p>
          <h1 className="font-display text-4xl leading-none">{module.name}</h1>
          <p className="text-muted">{module.hint}</p>
          {module.id !== "inne" ? (
            <>
              <p className="text-base leading-relaxed">
                {MODULE_GUIDES[module.id as Exclude<ModuleId, "inne">].why}
              </p>
              <h2 className="font-display text-2xl">Pakuj</h2>
              <ul className="list-disc space-y-1 pl-5">
                {MODULE_GUIDES[module.id as Exclude<ModuleId, "inne">].doList.map(
                  (k) => (
                    <li key={k}>{k}</li>
                  ),
                )}
              </ul>
              <h2 className="font-display text-2xl">Nie rób</h2>
              <ul className="list-disc space-y-1 pl-5">
                {MODULE_GUIDES[module.id as Exclude<ModuleId, "inne">].dont.map(
                  (k) => (
                    <li key={k}>{k}</li>
                  ),
                )}
              </ul>
              <p className="rounded-lg bg-paper-2 px-4 py-3 text-sm">
                {MODULE_GUIDES[module.id as Exclude<ModuleId, "inne">].tip}
              </p>
            </>
          ) : null}
          <h2 className="font-display text-2xl">Z checklisty</h2>
          <ul className="divide-y divide-line overflow-hidden rounded-lg bg-paper-2">
            {CATALOG.filter(
              (i) => i.module === module.id && i.minLevel <= 2,
            ).map((i) => (
              <li key={i.id} className="px-4 py-3">
                <p className="text-sm font-medium">{i.name}</p>
                {i.notes ? (
                  <p className="text-xs text-muted">{i.notes}</p>
                ) : null}
              </li>
            ))}
          </ul>
          <Link
            to="/plecak"
            className="inline-flex min-h-11 items-center text-sm underline underline-offset-2"
          >
            Odhacz w plecaku
          </Link>
        </>
      ) : null}
    </article>
  );
}
