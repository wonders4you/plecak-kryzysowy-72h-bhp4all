import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";
import type {
  CustomItem,
  IceContact,
  KitSnapshot,
  ModuleId,
  Profile,
  ScenarioId,
} from "./types";

export const DEFAULT_PROFILE: Profile = {
  adults: 1,
  children: 0,
  infants: 0,
  pets: 0,
  insulin: false,
  epipen: false,
  winter: true,
  region: "city",
  level: 2,
};

interface KitState {
  onboarded: boolean;
  dark: boolean;
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
  setOnboarded: (v: boolean) => void;
  setDark: (v: boolean) => void;
  setProfile: (p: Partial<Profile>) => void;
  togglePacked: (id: string) => void;
  setPacked: (id: string, v: boolean) => void;
  resetPacked: () => void;
  addCustom: (item: Omit<CustomItem, "id">) => void;
  removeCustom: (id: string) => void;
  setExpiry: (id: string, iso: string) => void;
  clearExpiry: (id: string) => void;
  setIce: (ice: IceContact[]) => void;
  setMeetingPoint: (v: string) => void;
  setLastReview: (iso: string) => void;
  setReviewEveryMonths: (n: number) => void;
  setScenario: (s: ScenarioId | null) => void;
  toggleGrab: (id: string) => void;
  resetGrab: () => void;
  applySnapshot: (snap: KitSnapshot) => void;
}

export function pickSnapshot(s: {
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
}): KitSnapshot {
  return {
    onboarded: s.onboarded,
    profile: s.profile,
    packed: s.packed,
    custom: s.custom,
    expiries: s.expiries,
    ice: s.ice,
    meetingPoint: s.meetingPoint,
    reviewEveryMonths: s.reviewEveryMonths,
    lastReview: s.lastReview,
    scenario: s.scenario,
    grabDone: s.grabDone,
  };
}

export const useKitStore = create<KitState>()(
  persist(
    (set) => ({
      onboarded: false,
      dark: false,
      profile: DEFAULT_PROFILE,
      packed: {},
      custom: [],
      expiries: {},
      ice: [],
      meetingPoint: "",
      reviewEveryMonths: 6,
      lastReview: null,
      scenario: null,
      grabDone: [],
      setOnboarded: (v) => set({ onboarded: v }),
      setDark: (v) => {
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", v);
        }
        set({ dark: v });
      },
      setProfile: (p) =>
        set((s) => ({ profile: { ...s.profile, ...p } })),
      togglePacked: (id) =>
        set((s) => ({ packed: { ...s.packed, [id]: !s.packed[id] } })),
      setPacked: (id, v) =>
        set((s) => ({ packed: { ...s.packed, [id]: v } })),
      resetPacked: () => set({ packed: {} }),
      addCustom: (item) =>
        set((s) => ({
          custom: [
            ...s.custom,
            { ...item, id: `c-${crypto.randomUUID()}` },
          ],
        })),
      removeCustom: (id) =>
        set((s) => ({ custom: s.custom.filter((x) => x.id !== id) })),
      setExpiry: (id, iso) =>
        set((s) => ({ expiries: { ...s.expiries, [id]: iso } })),
      clearExpiry: (id) =>
        set((s) => {
          const next = { ...s.expiries };
          delete next[id];
          return { expiries: next };
        }),
      setIce: (ice) => set({ ice }),
      setMeetingPoint: (v) => set({ meetingPoint: v }),
      setLastReview: (iso) => set({ lastReview: iso }),
      setReviewEveryMonths: (n) =>
        set({ reviewEveryMonths: Math.min(24, Math.max(1, Math.round(n))) }),
      setScenario: (scenario) => set({ scenario }),
      toggleGrab: (id) =>
        set((s) => ({
          grabDone: s.grabDone.includes(id)
            ? s.grabDone.filter((x) => x !== id)
            : [...s.grabDone, id],
        })),
      resetGrab: () => set({ grabDone: [] }),
      applySnapshot: (snap) =>
        set({
          onboarded: snap.onboarded,
          profile: { ...DEFAULT_PROFILE, ...snap.profile },
          packed: snap.packed,
          custom: snap.custom,
          expiries: snap.expiries,
          ice: snap.ice,
          meetingPoint: snap.meetingPoint,
          reviewEveryMonths: snap.reviewEveryMonths,
          lastReview: snap.lastReview,
          scenario: snap.scenario,
          grabDone: snap.grabDone,
        }),
    }),
    { name: "kit-72h-v1", skipHydration: true },
  ),
);

export function useHasHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const persistApi = useKitStore.persist;
    if (!persistApi) {
      setHydrated(true);
      return;
    }
    const result = persistApi.rehydrate();
    void Promise.resolve(result).then(() => setHydrated(true));
  }, []);
  return hydrated;
}

export type ModuleTone = {
  fill: string;
  text: string;
  on: string;
  wash: string;
  accent: string;
  edge: string;
};

export const MODULE_TONE: Record<ModuleId, ModuleTone> = {
  czerwony: {
    fill: "bg-mod-red",
    text: "text-mod-red",
    on: "text-on-mod-red",
    wash: "bg-mod-red/15",
    accent: "accent-mod-red",
    edge: "border-mod-red",
  },
  szary: {
    fill: "bg-mod-ash",
    text: "text-mod-ash",
    on: "text-on-mod-ash",
    wash: "bg-mod-ash/15",
    accent: "accent-mod-ash",
    edge: "border-mod-ash",
  },
  niebieski: {
    fill: "bg-mod-blue",
    text: "text-mod-blue",
    on: "text-on-mod-blue",
    wash: "bg-mod-blue/15",
    accent: "accent-mod-blue",
    edge: "border-mod-blue",
  },
  czarny: {
    fill: "bg-mod-black",
    text: "text-mod-black",
    on: "text-on-mod-black",
    wash: "bg-mod-black/15",
    accent: "accent-mod-black",
    edge: "border-mod-black",
  },
  inne: {
    fill: "bg-steel",
    text: "text-steel",
    on: "text-on-mod-steel",
    wash: "bg-steel/15",
    accent: "accent-steel",
    edge: "border-steel",
  },
};
