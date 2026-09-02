import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useKitStore } from "@/lib/kit/store";
import { downloadIcePdf, householdLine } from "@/lib/kit/ice-card";
import type { IceContact, Profile } from "@/lib/kit/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { telHref } from "@/lib/utils";
import { Download, Phone, Printer, Trash2 } from "lucide-react";

export const Route = createFileRoute("/ice")({ component: IcePage });

const ALARM = [
  { num: "112", name: "Alarmowy" },
  { num: "999", name: "Pogotowie" },
  { num: "998", name: "Straż" },
  { num: "997", name: "Policja" },
] as const;

function IceSheet({
  meeting,
  ice,
  profile,
}: {
  meeting: string;
  ice: IceContact[];
  profile: Profile;
}) {
  const house = householdLine(profile);
  return (
    <section
      id="ice-sheet"
      className="ice-sheet rounded-xl border border-line bg-paper p-5 shadow-card"
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
        In case of emergency
      </p>
      <h2 className="font-display text-4xl leading-none">ICE</h2>
      <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted">
        Punkt zbiórki
      </p>
      <p className="mt-1 font-display text-2xl leading-snug">
        {meeting.trim() || "— dopisz przed schowaniem karty —"}
      </p>
      <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted">
        Kontakty
      </p>
      {ice.length ? (
        <ul className="mt-2 divide-y divide-line">
          {ice.map((c) => (
            <li key={c.id} className="py-3">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted">{c.relation}</p>
              <p className="mt-1 font-display text-2xl tabular-nums tracking-wide">
                {c.phone}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted">
          Brak wpisów. Dopisz kogoś, zanim wydrukujesz.
        </p>
      )}
      {house ? (
        <>
          <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted">
            Dom
          </p>
          <p className="mt-1 text-sm">{house}</p>
        </>
      ) : null}
      <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted">
        Numery
      </p>
      <ul className="mt-2 grid grid-cols-2 gap-2">
        {ALARM.map((h) => (
          <li key={h.num} className="rounded-md bg-paper-2 px-3 py-2">
            <p className="font-display text-2xl leading-none tabular-nums">
              {h.num}
            </p>
            <p className="mt-1 text-xs text-muted">{h.name}</p>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-xs text-muted">
        72h · karta do worka z dokumentami
      </p>
    </section>
  );
}

export function IcePage() {
  const ice = useKitStore((s) => s.ice);
  const setIce = useKitStore((s) => s.setIce);
  const meeting = useKitStore((s) => s.meetingPoint);
  const setMeeting = useKitStore((s) => s.setMeetingPoint);
  const profile = useKitStore((s) => s.profile);
  const [draft, setDraft] = useState({ name: "", phone: "", relation: "" });
  const [busy, setBusy] = useState(false);

  function add(e: FormEvent) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.phone.trim()) return;
    const next: IceContact = {
      id: crypto.randomUUID(),
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      relation: draft.relation.trim() || "kontakt",
    };
    setIce([...ice, next]);
    setDraft({ name: "", phone: "", relation: "" });
  }

  async function savePdf() {
    setBusy(true);
    try {
      await downloadIcePdf({ meeting, ice, profile });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className="no-print flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
            In case of emergency
          </p>
          <h1 className="font-display text-4xl leading-none">ICE</h1>
          <p className="mt-2 max-w-lg text-muted">
            Numery i punkt zbiórki na papierze w plecaku — i tutaj, na wypadek
            gdy telefon jeszcze działa.
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" />
            Drukuj
          </Button>
          <Button variant="outline" onClick={savePdf} disabled={busy}>
            <Download className="size-4" />
            {busy ? "PDF…" : "Pobierz PDF"}
          </Button>
        </div>
      </header>

      <IceSheet meeting={meeting} ice={ice} profile={profile} />

      <section className="no-print rounded-xl bg-paper-2 p-5 shadow-card">
        <Label htmlFor="meet">Punkt zbiórki rodziny</Label>
        <Input
          id="meet"
          className="mt-2"
          placeholder="Np. parking przy szkole, dom ciotki"
          value={meeting}
          onChange={(e) => setMeeting(e.target.value)}
        />
      </section>

      <ul className="no-print space-y-2">
        {ice.map((c) => (
          <li
            key={c.id}
            className="flex items-center gap-3 rounded-lg bg-paper-2 px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-muted">
                {c.relation} · {c.phone}
              </p>
            </div>
            <a
              href={telHref(c.phone)}
              className="flex size-11 items-center justify-center rounded-md bg-forest text-on-forest"
              aria-label={`Zadzwoń do ${c.name}`}
            >
              <Phone className="size-4" />
            </a>
            <button
              type="button"
              className="flex size-11 items-center justify-center text-muted hover:text-brick"
              aria-label={`Usuń ${c.name}`}
              onClick={() => setIce(ice.filter((x) => x.id !== c.id))}
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        ))}
      </ul>

      <form
        onSubmit={add}
        className="no-print grid gap-3 rounded-xl bg-paper-2 p-5 shadow-card sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <p className="font-display text-xl">Nowy kontakt</p>
        </div>
        <div>
          <Label htmlFor="n">Imię</Label>
          <Input
            id="n"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="p">Telefon</Label>
          <Input
            id="p"
            type="tel"
            inputMode="tel"
            value={draft.phone}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="r">Relacja</Label>
          <Input
            id="r"
            placeholder="Partner, rodzic, sąsiad"
            value={draft.relation}
            onChange={(e) =>
              setDraft({ ...draft, relation: e.target.value })
            }
          />
        </div>
        <Button type="submit" className="sm:col-span-2">
          Dodaj
        </Button>
      </form>
    </div>
  );
}
