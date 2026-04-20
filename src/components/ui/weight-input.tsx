"use client";

import { useState } from "react";
import { Scale } from "lucide-react";
import { cn, kgToLbs, lbsToKg, type WeightUnit } from "@/lib/utils";

type Props = {
  /** Hidden input name. The emitted value is always in kg. */
  name: string;
  label?: string;
  initialUnit?: WeightUnit;
  initialKg?: number | null;
  placeholderKg?: number | null;
  /** Hard lower bound in kg (default 20). */
  minKg?: number;
  /** Hard upper bound in kg (default 300). */
  maxKg?: number;
  required?: boolean;
  onChangeKg?: (kg: number | null) => void;
  showToggle?: boolean;
};

function parseWeight(raw: string): number | null {
  if (!raw) return null;
  // Accept comma as decimal separator, strip spaces.
  const cleaned = raw.replace(/\s+/g, "").replace(",", ".");
  if (!/^-?\d*\.?\d*$/.test(cleaned)) return Number.NaN;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : Number.NaN;
}

export function WeightInput({
  name,
  label,
  initialUnit = "kg",
  initialKg,
  placeholderKg,
  minKg = 20,
  maxKg = 300,
  required,
  onChangeKg,
  showToggle = true,
}: Props) {
  const [unit, setUnit] = useState<WeightUnit>(initialUnit);
  const [value, setValue] = useState<string>(() => {
    if (initialKg == null) return "";
    const v = initialUnit === "kg" ? initialKg : kgToLbs(initialKg);
    return v.toFixed(1);
  });
  const [touched, setTouched] = useState(false);

  const parsed = parseWeight(value);
  const isEmpty = value.trim() === "";
  const isNaN = parsed != null && Number.isNaN(parsed);
  const kg =
    parsed == null || Number.isNaN(parsed)
      ? null
      : unit === "kg"
        ? parsed
        : lbsToKg(parsed);

  const outOfRange =
    kg != null && (kg < minKg || kg > maxKg);

  let error: string | null = null;
  if (touched) {
    if (isEmpty && required) error = "Enter your weight.";
    else if (isNaN) error = "Only numbers — e.g. 78.4";
    else if (outOfRange) {
      const lo = unit === "kg" ? minKg : kgToLbs(minKg);
      const hi = unit === "kg" ? maxKg : kgToLbs(maxKg);
      error = `Must be between ${lo.toFixed(0)} and ${hi.toFixed(0)} ${unit}.`;
    }
  }

  function switchUnit(next: WeightUnit) {
    if (next === unit) return;
    if (parsed != null && !Number.isNaN(parsed)) {
      const converted = next === "kg" ? lbsToKg(parsed) : kgToLbs(parsed);
      // Keep one decimal on display-side for readability.
      setValue(converted.toFixed(1));
    }
    setUnit(next);
  }

  const placeholder =
    placeholderKg != null
      ? (unit === "kg" ? placeholderKg : kgToLbs(placeholderKg)).toFixed(1)
      : unit === "kg"
        ? "78.4"
        : "172.8";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={name}
          className="text-xs font-medium tracking-wide text-text-dim uppercase"
        >
          {label}
        </label>
      )}
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "relative flex flex-1 items-center rounded-2xl border bg-white/[0.03] transition-colors",
            error
              ? "border-red-500/60"
              : "border-white/10 focus-within:border-white/30",
          )}
        >
          <span className="pl-4 text-text-muted pointer-events-none">
            <Scale className="h-4 w-4" />
          </span>
          <input
            id={name}
            // Text (not number) so we fully own validation and let users type
            // any precision / comma without browser nags.
            type="text"
            inputMode="decimal"
            autoComplete="off"
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              const p = parseWeight(e.target.value);
              const asKg =
                p == null || Number.isNaN(p)
                  ? null
                  : unit === "kg"
                    ? p
                    : lbsToKg(p);
              onChangeKg?.(asKg);
            }}
            onBlur={() => setTouched(true)}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            className="flex-1 bg-transparent py-3.5 pl-3 pr-3 text-[0.95rem] text-text placeholder:text-text-muted outline-none"
          />
          <span className="pr-4 text-sm font-semibold text-text-dim pointer-events-none">
            {unit}
          </span>
        </div>
        {showToggle && (
          <div className="flex shrink-0 items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
            {(["kg", "lbs"] as WeightUnit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => switchUnit(u)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  unit === u
                    ? "bg-flame text-white"
                    : "text-text-dim hover:text-text",
                )}
              >
                {u}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <span id={`${name}-error`} className="text-xs text-red-400">
          {error}
        </span>
      )}
      {/* Hidden field that always submits kg to the server. */}
      <input
        type="hidden"
        name={name}
        value={kg == null || outOfRange ? "" : kg.toFixed(4)}
      />
    </div>
  );
}
