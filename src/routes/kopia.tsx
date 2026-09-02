import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  backupFilename,
  canShareFiles,
  downloadTextFile,
  parseBackupText,
  shareBackupFile,
  stringifyBackup,
} from "@/lib/kit/backup";
import {
  copySheetTsv,
  copyTableDom,
  downloadCsv,
  HEADER,
  rowsFromSnapshot,
  sheetFilename,
  SHEETS_CREATE_URL,
  snapshotToCsv,
  snapshotToTsv,
} from "@/lib/kit/sheet";
import { useShallow } from "zustand/react/shallow";
import { pickSnapshot, useKitStore } from "@/lib/kit/store";
import type { KitBackup } from "@/lib/kit/types";
import { householdLine } from "@/components/kit-ui";
import { Button } from "@/components/ui/button";
import { fallbackCopy } from "@/lib/utils";
import { format, isValid, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import {
  Check,
  Copy,
  Download,
  FileSpreadsheet,
  FolderUp,
  Share2,
  Table2,
} from "lucide-react";

export const Route = createFileRoute("/kopia")({ component: BackupPage });

function packedCount(packed: Record<string, boolean>) {
  return Object.values(packed).filter(Boolean).length;
}

function formatWhen(iso: string) {
  const d = parseISO(iso);
  if (!isValid(d)) return iso;
  return format(d, "d MMMM yyyy, HH:mm", { locale: pl });
}

function SnapshotFacts({
  backup,
  label,
  showDate = true,
}: {
  backup: KitBackup;
  label: string;
  showDate?: boolean;
}) {
  const s = backup.snapshot;
  return (
    <div className="rounded-xl bg-paper-2 p-5 shadow-card">
      <p className="text-xs font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl">
        {householdLine(s.profile)}
      </p>
      {showDate ? (
        <p className="mt-1 text-sm text-muted">
          Zapis z {formatWhen(backup.exportedAt)}
        </p>
      ) : null}
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted">Odhaczone</dt>
          <dd className="font-medium tabular-nums">
            {packedCount(s.packed)} poz.
          </dd>
        </div>
        <div>
          <dt className="text-muted">ICE</dt>
          <dd className="font-medium tabular-nums">{s.ice.length}</dd>
        </div>
        <div>
          <dt className="text-muted">Własne rzeczy</dt>
          <dd className="font-medium tabular-nums">{s.custom.length}</dd>
        </div>
        <div>
          <dt className="text-muted">Daty ważności</dt>
          <dd className="font-medium tabular-nums">
            {Object.keys(s.expiries).length}
          </dd>
        </div>
      </dl>
      {s.meetingPoint ? (
        <p className="mt-3 text-sm text-muted">
          Zbiórka: {s.meetingPoint}
        </p>
      ) : null}
    </div>
  );
}

export function BackupPage() {
  const snapshot = useKitStore(useShallow(pickSnapshot));
  const applySnapshot = useKitStore((s) => s.applySnapshot);
  const fileRef = useRef<HTMLInputElement>(null);
  const pasteRef = useRef<HTMLTextAreaElement>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [paste, setPaste] = useState("");
  const [pending, setPending] = useState<KitBackup | null>(null);
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [shareOk, setShareOk] = useState(false);
  const [sheetCopied, setSheetCopied] = useState(false);
  const [sheetGuide, setSheetGuide] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);
  const tsvRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setShareOk(canShareFiles());
  }, []);

  const currentBackup = useMemo(
    () => ({
      kind: "plecak-kryzysowy-72h" as const,
      version: 1,
      exportedAt: new Date().toISOString(),
      snapshot,
    }),
    [snapshot],
  );

  const json = useMemo(() => stringifyBackup(snapshot), [snapshot]);
  const csv = useMemo(() => snapshotToCsv(snapshot), [snapshot]);
  const tsv = useMemo(() => snapshotToTsv(snapshot), [snapshot]);
  const sheetRows = useMemo(() => rowsFromSnapshot(snapshot), [snapshot]);
  const kitRows = sheetRows.filter((row) => row[0] === "plecak");
  const filename = backupFilename();
  const csvName = sheetFilename();

  function flash(ok: boolean, text: string) {
    setNotice({ ok, text });
  }

  function copySheet(): boolean {
    const fromDom = tableRef.current ? copyTableDom(tableRef.current) : false;
    const fromTsv = copySheetTsv(tsv);
    const ok = fromDom || fromTsv;
    if (ok) {
      setSheetCopied(true);
      window.setTimeout(() => setSheetCopied(false), 2200);
    }
    return ok;
  }

  function exportFile() {
    downloadTextFile(filename, json);
    flash(
      true,
      `Pobrano ${filename}. Trzymaj poza telefonem — chmura, pendrive, wydruk.`,
    );
  }

  function exportCsv() {
    downloadCsv(csvName, csv);
    flash(
      true,
      `Pobrano ${csvName}. W Google Sheets: Plik → Importuj → prześlij ten CSV.`,
    );
  }

  function toGoogleSheets() {
    const copied = copySheet();
    downloadCsv(csvName, csv);
    window.open(SHEETS_CREATE_URL, "_blank", "noopener,noreferrer");
    setSheetGuide(true);
    flash(
      true,
      copied
        ? `Skopiowano ${kitRows.length} pozycji i pobrano CSV. Arkusz Google jest pusty, dopóki nie wkleisz w A1 albo nie zaimportujesz pliku.`
        : `Pobrano ${csvName}. W Arkuszu: Plik → Importuj → Prześlij ten plik.`,
    );
  }

  function copyJson() {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
      flash(true, "JSON w schowku. Wklej do pliku, jeśli przeglądarka nie pobiera.");
    };
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(json).then(done).catch(() => {
        if (fallbackCopy(json)) done();
        else flash(false, "Nie udało się skopiować.");
      });
    } else if (fallbackCopy(json)) {
      done();
    } else {
      flash(false, "Nie udało się skopiować.");
    }
  }

  async function shareFile() {
    try {
      const ok = await shareBackupFile(filename, json);
      if (ok) flash(true, "Wysłano plik.");
      else exportFile();
    } catch {
      flash(false, "Anulowano.");
    }
  }

  function ingest(text: string) {
    const result = parseBackupText(text);
    if (!result.ok) {
      setPending(null);
      flash(false, result.error);
      return;
    }
    setPending(result.backup);
    setNotice(null);
  }

  function onFile(list: FileList | null) {
    const file = list?.[0];
    if (!file) return;
    if (file.size > 512 * 1024) {
      flash(false, "Plik jest za duży (max 512 kB).");
      return;
    }
    void file.text().then(ingest, () => flash(false, "Nie da się odczytać pliku."));
    if (fileRef.current) fileRef.current.value = "";
  }

  function confirmImport() {
    if (!pending) return;
    applySnapshot(pending.snapshot);
    setPending(null);
    setPaste("");
    setPasteOpen(false);
    flash(true, "Wczytano kopię. Sprawdź checklistę i ICE.");
  }

  return (
    <div className="space-y-10">
      <header>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Archiwum
        </p>
        <h1 className="font-display text-4xl leading-none">Kopia</h1>
        <p className="mt-2 max-w-lg text-muted">
          Pamięć przeglądarki to nie sejf. Plik JSON możesz trzymać na dysku,
          wysłać na drugi telefon albo schować do worka z dokumentami.
        </p>
      </header>

      <SnapshotFacts
        backup={currentBackup}
        label="Teraz na tym urządzeniu"
        showDate={false}
      />

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Pobierz</h2>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button onClick={exportFile}>
            <Download className="size-4" />
            Pobierz plik JSON
          </Button>
          <Button variant="outline" onClick={copyJson}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Skopiowano" : "Kopiuj JSON"}
          </Button>
          {shareOk ? (
            <Button variant="outline" onClick={() => void shareFile()}>
              <Share2 className="size-4" />
              Wyślij plik
            </Button>
          ) : null}
        </div>
        <p className="text-sm text-muted">
          Nazwa: {filename}. Nie ma w nim haseł — są numery ICE i skład domu.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-2xl">Wczytaj</h2>
        <p className="text-sm text-muted">
          Zastąpi profil, checklistę, daty i kontakty na tym urządzeniu. Motyw
          jasny/ciemny zostaje.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => fileRef.current?.click()}
          >
            <FolderUp className="size-4" />
            Wybierz plik
          </Button>
          <Button
            variant="ghost"
            onClick={() => setPasteOpen((v) => !v)}
          >
            {pasteOpen ? "Ukryj wklejanie" : "Wklej JSON"}
          </Button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json,text/plain"
          className="hidden"
          aria-label="Plik kopii JSON"
          onChange={(e) => onFile(e.target.files)}
        />
        {pasteOpen ? (
          <div className="space-y-2">
            <textarea
              id="kopia-paste"
              ref={pasteRef}
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              rows={8}
              spellCheck={false}
              placeholder='{"kind":"plecak-kryzysowy-72h", ...}'
              className="w-full rounded-md border border-line bg-paper px-3 py-3 font-mono text-xs text-fg placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
            />
            <Button
              variant="outline"
              disabled={!paste.trim() && !pasteRef.current?.value?.trim()}
              onClick={() => ingest(pasteRef.current?.value || paste)}
            >
              Sprawdź wklejony tekst
            </Button>
          </div>
        ) : null}
      </section>

      {pending ? (
        <section className="space-y-4 rounded-xl bg-brick/10 p-5">
          <SnapshotFacts backup={pending} label="W pliku — zastąpi obecne dane" />
          <p className="text-sm">
            Tej operacji nie da się cofnąć, chyba że masz inną kopię.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button id="kopia-replace" variant="brick" onClick={confirmImport}>
              Zastąp dane na tym urządzeniu
            </Button>
            <Button variant="ghost" onClick={() => setPending(null)}>
              Anuluj
            </Button>
          </div>
        </section>
      ) : null}

      <section id="arkusz" className="space-y-3">
        <h2 className="font-display text-2xl">Arkusz</h2>
        <p className="text-sm text-muted">
          Google zawsze otwiera pusty plik. Twoje pozycje wchodzą dopiero po
          wklejeniu albo imporcie CSV — nie wczytasz tego z powrotem do
          aplikacji; do tego służy JSON.
        </p>
        <ol className="grid gap-2 sm:grid-cols-3">
          <li className="rounded-lg bg-paper-2 px-4 py-3 text-sm shadow-card">
            <p className="font-display text-xl leading-none">1</p>
            <p className="mt-2">Kopiuj tabelę albo pobierz CSV.</p>
          </li>
          <li className="rounded-lg bg-paper-2 px-4 py-3 text-sm shadow-card">
            <p className="font-display text-xl leading-none">2</p>
            <p className="mt-2">Otwórz Google Sheets (zostanie puste).</p>
          </li>
          <li className="rounded-lg bg-paper-2 px-4 py-3 text-sm shadow-card">
            <p className="font-display text-xl leading-none">3</p>
            <p className="mt-2">
              Kliknij A1 i wklej, albo Plik → Importuj → Prześlij CSV.
            </p>
          </li>
        </ol>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button variant="outline" onClick={toGoogleSheets} id="kopia-sheets">
            <Table2 className="size-4" />
            Google Sheets
          </Button>
          <Button
            variant="outline"
            id="kopia-copy-sheet"
            onClick={() => {
              const ok = copySheet();
              setSheetGuide(true);
              flash(
                ok,
                ok
                  ? `Skopiowano ${kitRows.length} pozycji. W arkuszu: A1 → wklej.`
                  : "Nie poszło. Zaznacz tabelę albo skopiuj tekst poniżej.",
              );
            }}
          >
            {sheetCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {sheetCopied ? "Skopiowano tabelę" : "Kopiuj tabelę"}
          </Button>
          <Button variant="outline" onClick={exportCsv}>
            <FileSpreadsheet className="size-4" />
            Pobierz CSV
          </Button>
        </div>
        {sheetGuide ? (
          <div className="rounded-xl bg-forest px-5 py-4 text-on-forest">
            <p className="font-display text-xl">Arkusz jest pusty, aż wkleisz</p>
            <p className="mt-2 text-sm opacity-90">
              W nowej karcie kliknij komórkę A1 i wklej ({kitRows.length} pozycji
              + ICE). Jeśli po logowaniu Google wklejka jest pusta — wróć tu,
              kliknij Kopiuj tabelę i wklej jeszcze raz.
            </p>
            <p className="mt-2 text-sm opacity-90">
              Albo: Plik → Importuj → Prześlij → {csvName} → Importuj dane →
              Zamień arkusz.
            </p>
          </div>
        ) : null}
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Podgląd · {kitRows.length} pozycji
        </p>
        <div className="overflow-hidden rounded-xl bg-paper-2 shadow-card">
          <div className="max-h-96 overflow-auto">
            <table
              id="arkusz-tabela"
              ref={tableRef}
              className="w-max min-w-full text-left text-xs"
            >
              <thead className="sticky top-0 bg-paper-2">
                <tr className="border-b border-line text-muted">
                  {HEADER.slice(0, 7).map((h) => (
                    <th key={h} className="px-3 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sheetRows
                  .filter((row) => row[0] !== "info")
                  .map((row, i) => (
                    <tr
                      key={`${row[0]}-${row[2]}-${i}`}
                      className="border-b border-line last:border-0"
                    >
                      {row.slice(0, 7).map((cell, j) => (
                        <td
                          key={HEADER[j]}
                          className="max-w-48 truncate px-3 py-2"
                        >
                          {cell || "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <label
            htmlFor="arkusz-tsv"
            className="text-xs font-medium uppercase tracking-wider text-muted"
          >
            Tekst do wklejenia
          </label>
          <textarea
            id="arkusz-tsv"
            ref={tsvRef}
            readOnly
            value={tsv}
            rows={6}
            spellCheck={false}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-2 w-full rounded-md border border-line bg-paper px-3 py-3 font-mono text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/40"
          />
          <Button
            variant="ghost"
            className="mt-2"
            onClick={() => {
              tsvRef.current?.focus();
              tsvRef.current?.select();
              const ok = copySheetTsv(tsv);
              setSheetCopied(ok);
              flash(
                ok,
                ok
                  ? "Tekst w schowku. W arkuszu wklej w A1."
                  : "Zaznacz pole powyżej i skopiuj ręcznie (Ctrl+C).",
              );
            }}
          >
            <Copy className="size-4" />
            Kopiuj tekst
          </Button>
        </div>
      </section>

      {notice ? (
        <p
          role="status"
          className={
            notice.ok ? "text-sm text-forest" : "text-sm text-brick"
          }
        >
          {notice.text}{" "}
          {notice.ok && notice.text.startsWith("Wczytano") ? (
            <Link to="/plecak" className="underline underline-offset-2">
              Otwórz plecak
            </Link>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
