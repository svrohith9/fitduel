import clsx, { type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function daysBetween(a: Date, b: Date) {
  const ms = Math.abs(b.getTime() - a.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

export function pct(part: number, whole: number) {
  if (whole <= 0) return 0;
  return Math.max(0, Math.min(100, (part / whole) * 100));
}

/* ---------- weight unit helpers (DB is always kg) ---------- */

export type WeightUnit = "kg" | "lbs";

const KG_PER_LB = 0.45359237;

export function kgToLbs(kg: number) {
  return kg / KG_PER_LB;
}
export function lbsToKg(lbs: number) {
  return lbs * KG_PER_LB;
}

export function toDisplay(kg: number | null | undefined, unit: WeightUnit) {
  if (kg == null) return null;
  return unit === "kg" ? kg : kgToLbs(kg);
}

export function formatWeight(
  kg: number | null | undefined,
  unit: WeightUnit,
  opts: { digits?: number; withUnit?: boolean } = {},
) {
  const { digits = 1, withUnit = true } = opts;
  if (kg == null) return withUnit ? `— ${unit}` : "—";
  const v = unit === "kg" ? kg : kgToLbs(kg);
  return withUnit ? `${v.toFixed(digits)} ${unit}` : v.toFixed(digits);
}

export function toKg(value: number, fromUnit: WeightUnit) {
  return fromUnit === "kg" ? value : lbsToKg(value);
}
