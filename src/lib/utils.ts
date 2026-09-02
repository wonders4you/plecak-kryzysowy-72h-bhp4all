import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatKg(grams: number): string {
  const kg = grams / 1000;
  return `${kg.toLocaleString("pl-PL", { maximumFractionDigits: 1, minimumFractionDigits: kg < 10 ? 1 : 0 })} kg`;
}

export function formatGrams(grams: number): string {
  if (grams >= 1000) return formatKg(grams);
  return `${Math.round(grams).toLocaleString("pl-PL")} g`;
}

export function telHref(phone: string): string | undefined {
  const n = phone.replace(/[^\d+]/g, "");
  return n ? `tel:${n}` : undefined;
}

export function fallbackCopy(text: string): boolean {
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}
