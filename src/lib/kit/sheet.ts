import { LEVELS, MODULES, REGIONS, resolveCatalog } from "./catalog";
import type { KitSnapshot, Profile } from "./types";
import { fallbackCopy } from "@/lib/utils";

export const SHEETS_CREATE_URL =
  "https://docs.google.com/spreadsheets/create";

export const HEADER = [
  "Sekcja",
  "Moduł",
  "Nazwa",
  "Ilość",
  "Waga_g",
  "Spakowane",
  "Data_ważności",
  "Telefon",
  "Relacja",
  "Uwagi",
] as const;

type Row = string[];

function csvCell(value: string) {
  if (/[";,\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function tsvCell(value: string) {
  return value.replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function moduleName(id: string) {
  return MODULES.find((m) => m.id === id)?.name ?? id;
}

function household(p: Profile) {
  const bits = [p.adults === 1 ? "1 dorosły" : `${p.adults} dorosłych`];
  if (p.children)
    bits.push(p.children === 1 ? "1 dziecko" : `${p.children} dzieci`);
  if (p.infants)
    bits.push(p.infants === 1 ? "1 niemowlę" : `${p.infants} niemowląt`);
  if (p.pets)
    bits.push(p.pets === 1 ? "1 zwierzę" : `${p.pets} zwierząt`);
  return bits.join(" · ");
}

export function rowsFromSnapshot(snapshot: KitSnapshot): Row[] {
  const p = snapshot.profile;
  const level = LEVELS.find((l) => l.id === p.level)?.name ?? String(p.level);
  const region = REGIONS.find((r) => r.id === p.region)?.name ?? p.region;
  const items = resolveCatalog(p, snapshot.custom, snapshot.scenario);
  const rows: Row[] = [];

  for (const item of items) {
    rows.push([
      "plecak",
      moduleName(item.module),
      item.name,
      String(item.qty),
      String(item.weightGrams),
      snapshot.packed[item.id] ? "tak" : "nie",
      (snapshot.expiries[item.id] ?? "").slice(0, 10),
      "",
      "",
      item.custom ? "własna pozycja" : (item.notes ?? ""),
    ]);
  }

  for (const c of snapshot.ice) {
    rows.push([
      "ice",
      "",
      c.name,
      "1",
      "",
      "",
      "",
      c.phone,
      c.relation,
      "",
    ]);
  }

  rows.push(
    [
      "info",
      "",
      "Domownicy",
      String(p.adults + p.children + p.infants),
      "",
      "",
      "",
      "",
      "",
      household(p),
    ],
    ["info", "", "Poziom", String(p.level), "", "", "", "", "", level],
    ["info", "", "Region", "", "", "", "", "", "", region],
    [
      "info",
      "",
      "Punkt zbiórki",
      "",
      "",
      "",
      "",
      "",
      "",
      snapshot.meetingPoint,
    ],
  );

  return rows;
}

export function snapshotToCsv(snapshot: KitSnapshot): string {
  const body = rowsFromSnapshot(snapshot)
    .map((row) => row.map(csvCell).join(";"))
    .join("\r\n");
  return `\uFEFF${HEADER.join(";")}\r\n${body}\r\n`;
}

export function snapshotToTsv(snapshot: KitSnapshot): string {
  const body = rowsFromSnapshot(snapshot)
    .map((row) => row.map(tsvCell).join("\t"))
    .join("\n");
  return `${HEADER.join("\t")}\n${body}\n`;
}

export function copySheetTsv(tsv: string): boolean {
  if (navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(tsv).catch(() => {});
  }
  return fallbackCopy(tsv);
}

export function copyTableDom(table: HTMLTableElement): boolean {
  try {
    const sel = window.getSelection();
    if (!sel) return false;
    const range = document.createRange();
    range.selectNode(table);
    sel.removeAllRanges();
    sel.addRange(range);
    const ok = document.execCommand("copy");
    sel.removeAllRanges();
    return ok;
  } catch {
    return false;
  }
}

export function sheetFilename(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `plecak-72h-${y}-${m}-${d}.csv`;
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
