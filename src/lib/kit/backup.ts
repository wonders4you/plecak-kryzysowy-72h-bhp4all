import type {
  CustomItem,
  IceContact,
  KitBackup,
  KitSnapshot,
  ModuleId,
  Profile,
  Region,
  ScenarioId,
} from "./types";

export const BACKUP_KIND = "plecak-kryzysowy-72h" as const;
export const BACKUP_VERSION = 1;
export const MAX_BACKUP_BYTES = 512 * 1024;

const MODULES: ModuleId[] = [
  "czerwony",
  "szary",
  "niebieski",
  "czarny",
  "inne",
];
const REGIONS: Region[] = [
  "city",
  "flood",
  "mountains",
  "coast",
  "industrial",
];
const SCENARIOS: ScenarioId[] = [
  "flood",
  "fire",
  "blackout",
  "highway",
  "work",
  "heating",
  "storm",
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function clampInt(v: unknown, min: number, max: number, fallback: number) {
  const n =
    typeof v === "number" && Number.isFinite(v) ? Math.round(v) : fallback;
  return Math.min(max, Math.max(min, n));
}

function asBool(v: unknown, fallback: boolean) {
  return typeof v === "boolean" ? v : fallback;
}

function asString(v: unknown, max: number, fallback = "") {
  if (typeof v !== "string") return fallback;
  return v.slice(0, max);
}

function parseProfile(raw: unknown): Profile {
  const o = isRecord(raw) ? raw : {};
  const region = REGIONS.includes(o.region as Region)
    ? (o.region as Region)
    : "city";
  const level = o.level === 1 || o.level === 2 || o.level === 3 ? o.level : 2;
  return {
    adults: clampInt(o.adults, 1, 8, 1),
    children: clampInt(o.children, 0, 8, 0),
    infants: clampInt(o.infants, 0, 8, 0),
    pets: clampInt(o.pets, 0, 8, 0),
    insulin: asBool(o.insulin, false),
    epipen: asBool(o.epipen, false),
    winter: asBool(o.winter, true),
    region,
    level,
  };
}

function parsePacked(raw: unknown): Record<string, boolean> {
  if (!isRecord(raw)) return {};
  const out: Record<string, boolean> = {};
  let n = 0;
  for (const [k, v] of Object.entries(raw)) {
    if (n >= 500) break;
    if (typeof v === "boolean" && k.length <= 80) {
      out[k] = v;
      n += 1;
    }
  }
  return out;
}

function parseExpiries(raw: unknown): Record<string, string> {
  if (!isRecord(raw)) return {};
  const out: Record<string, string> = {};
  let n = 0;
  for (const [k, v] of Object.entries(raw)) {
    if (n >= 200) break;
    if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v) && k.length <= 80) {
      out[k] = v.slice(0, 32);
      n += 1;
    }
  }
  return out;
}

function parseCustom(raw: unknown): CustomItem[] {
  if (!Array.isArray(raw)) return [];
  const out: CustomItem[] = [];
  for (const row of raw.slice(0, 100)) {
    if (!isRecord(row)) continue;
    const name = asString(row.name, 80).trim();
    if (!name) continue;
    const module = MODULES.includes(row.module as ModuleId)
      ? (row.module as ModuleId)
      : "czarny";
    out.push({
      id: asString(row.id, 80, `c-${out.length}`),
      name,
      module,
      weightGrams: clampInt(row.weightGrams, 0, 20000, 50),
      qty: clampInt(row.qty, 1, 99, 1),
    });
  }
  return out;
}

function parseIce(raw: unknown): IceContact[] {
  if (!Array.isArray(raw)) return [];
  const out: IceContact[] = [];
  for (const row of raw.slice(0, 40)) {
    if (!isRecord(row)) continue;
    const name = asString(row.name, 80).trim();
    const phone = asString(row.phone, 40).trim();
    if (!name || !phone) continue;
    out.push({
      id: asString(row.id, 80, `ice-${out.length}`),
      name,
      phone,
      relation: asString(row.relation, 40, "kontakt"),
    });
  }
  return out;
}

function parseGrab(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is string => typeof x === "string" && x.length <= 40)
    .slice(0, 20);
}

function parseScenario(raw: unknown): ScenarioId | null {
  if (raw === null || raw === undefined || raw === "") return null;
  return SCENARIOS.includes(raw as ScenarioId) ? (raw as ScenarioId) : null;
}

export function parseSnapshot(raw: unknown): KitSnapshot {
  const o = isRecord(raw) ? raw : {};
  const last =
    typeof o.lastReview === "string" && /^\d{4}-\d{2}-\d{2}/.test(o.lastReview)
      ? o.lastReview.slice(0, 32)
      : null;
  return {
    onboarded: asBool(o.onboarded, true),
    profile: parseProfile(o.profile),
    packed: parsePacked(o.packed),
    custom: parseCustom(o.custom),
    expiries: parseExpiries(o.expiries),
    ice: parseIce(o.ice),
    meetingPoint: asString(o.meetingPoint, 200),
    reviewEveryMonths: clampInt(o.reviewEveryMonths, 1, 24, 6),
    lastReview: last,
    scenario: parseScenario(o.scenario),
    grabDone: parseGrab(o.grabDone),
  };
}

export type ParseBackupResult =
  | { ok: true; backup: KitBackup }
  | { ok: false; error: string };

export function parseBackupText(text: string): ParseBackupResult {
  if (text.length > MAX_BACKUP_BYTES) {
    return { ok: false, error: "Plik jest za duży (max 512 kB)." };
  }
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, error: "To nie jest poprawny JSON." };
  }
  if (!isRecord(json)) {
    return { ok: false, error: "To nie jest plik kopii 72h." };
  }

  let source: unknown;
  let exportedAt: string;

  if (json.kind === BACKUP_KIND && isRecord(json.snapshot)) {
    source = json.snapshot;
    exportedAt =
      typeof json.exportedAt === "string"
        ? json.exportedAt
        : new Date().toISOString();
  } else if (isRecord(json.state) && isRecord(json.state.profile)) {
    source = json.state;
    exportedAt = new Date().toISOString();
  } else if (isRecord(json.profile)) {
    source = json;
    exportedAt = new Date().toISOString();
  } else {
    return {
      ok: false,
      error: "To nie jest kopia 72h. Wybierz plik pobrany z tej aplikacji.",
    };
  }

  const snapshot = parseSnapshot(source);
  return {
    ok: true,
    backup: {
      kind: BACKUP_KIND,
      version: BACKUP_VERSION,
      exportedAt,
      snapshot,
    },
  };
}

export function buildBackup(snapshot: KitSnapshot): KitBackup {
  return {
    kind: BACKUP_KIND,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    snapshot,
  };
}

export function stringifyBackup(snapshot: KitSnapshot): string {
  return `${JSON.stringify(buildBackup(snapshot), null, 2)}\n`;
}

export function backupFilename(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `plecak-72h-${y}-${m}-${d}.json`;
}

export function downloadTextFile(filename: string, text: string) {
  const blob = new Blob([text], { type: "application/json;charset=utf-8" });
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

export async function shareBackupFile(filename: string, text: string) {
  const file = new File([text], filename, { type: "application/json" });
  if (!navigator.canShare?.({ files: [file] })) return false;
  await navigator.share({
    files: [file],
    title: "Kopia 72h",
    text: "Plecak kryzysowy — kopia zapasowa",
  });
  return true;
}

export function canShareFiles() {
  if (typeof navigator === "undefined" || typeof File === "undefined") {
    return false;
  }
  try {
    const probe = new File(["{}"], "probe.json", { type: "application/json" });
    return Boolean(navigator.canShare?.({ files: [probe] }));
  } catch {
    return false;
  }
}
