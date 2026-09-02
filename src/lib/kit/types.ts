export type ModuleId = "czerwony" | "szary" | "niebieski" | "czarny" | "inne";

export type Scale =
  | "once"
  | "person"
  | "eater"
  | "kid"
  | "adult"
  | "child"
  | "infant"
  | "pet";

export type ExpiryKind =
  | "none"
  | "meds"
  | "food"
  | "water"
  | "batteries"
  | "wipes"
  | "tablets";

export type Region = "city" | "flood" | "mountains" | "coast" | "industrial";

export type ScenarioId =
  | "flood"
  | "fire"
  | "blackout"
  | "highway"
  | "work"
  | "heating"
  | "storm";

export type PackLayer = "bottom" | "mid" | "top" | "pocket";

export interface CatalogItem {
  id: string;
  name: string;
  module: ModuleId;
  weightGrams: number;
  qty: number;
  qtyByLevel?: Partial<Record<1 | 2 | 3, number>>;
  scale: Scale;
  minLevel: 1 | 2 | 3;
  notes?: string;
  expiry: ExpiryKind;
  expiryMonths?: number;
  tags: string[];
  grabOrder?: number;
  packedLayer?: PackLayer;
}

export interface CustomItem {
  id: string;
  name: string;
  module: ModuleId;
  weightGrams: number;
  qty: number;
}

export interface Profile {
  adults: number;
  children: number;
  infants: number;
  pets: number;
  insulin: boolean;
  epipen: boolean;
  winter: boolean;
  region: Region;
  level: 1 | 2 | 3;
}

export interface IceContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface ResolvedItem {
  id: string;
  name: string;
  module: ModuleId;
  qty: number;
  unitWeight: number;
  weightGrams: number;
  notes?: string;
  expiry: ExpiryKind;
  expiryMonths?: number;
  tags: string[];
  grabOrder?: number;
  packedLayer?: PackLayer;
  custom?: boolean;
  shopUrl?: string;
  shopLabel?: string;
}

export interface KitSnapshot {
  onboarded: boolean;
  profile: Profile;
  packed: Record<string, boolean>;
  custom: CustomItem[];
  expiries: Record<string, string>;
  ice: IceContact[];
  meetingPoint: string;
  reviewEveryMonths: number;
  lastReview: string | null;
  scenario: ScenarioId | null;
  grabDone: string[];
}

export interface KitBackup {
  kind: "plecak-kryzysowy-72h";
  version: number;
  exportedAt: string;
  snapshot: KitSnapshot;
}
