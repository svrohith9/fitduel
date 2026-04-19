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
  min?: number;
  max?: number;
  required?: boolean;
  onChangeKg?: (kg: number | null) => void;
  showToggle?: boolean;
};

export function WeightInput({
  name,
  label,
  initialUnit = "kg",
  initialKg,
  placeholderKg,
  min = 20,
  max = 300,
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

  const parsed = value === "" ? null : Number(value);
  const kg =
    parsed == null || Number.isNaN(parsed)
      ? null
      : unit === "kg"
        ? parsed
        : lbsToKg(parsed);

  function switchUnit(next: WeightUnit) {
    if (next === unit) return;
    if (parsed != null && !Number.isNaN(parsed)) {
      const converted = next === "kg" ? lbsToKg(parsed) : kgToLbs(parsed);
      setValue(converted.toFixed(1));
    }
    setUnit(next);
  }

  const minInUnit = unit === "kg" ? min : kgToLbs(min);
  const maxInUnit = unit === "kg" ? max : kgToLbs(max);
  const ph =
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
        <div className="relative flex flex-1 items-center rounded-2xl border border-white/10 bg-white/[0.03] transition-colors focus-within:border-white/30">
          <span className="pl-4 text-text-muted pointer-events-none">
            <Scale className="h-4 w-4" />
          </span>
          <input
            id={name}
            type="number"
            step="0.1"
            min={minInUnit}
            max={maxInUnit}
            inputMode="decimal"
            required={required}
            placeholder={ph}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              const n = Number(e.target.value);
              const asKg = Number.isNaN(n)
                ? null
                : unit === "kg"
                  ? n
                  : lbsToKg(n);
              onChangeKg?.(asKg);
            }}
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
      {/* Hidden field that always submits kg to the server. */}
      <input
        type="hidden"
        name={name}
        value={kg == null ? "" : kg.toFixed(4)}
      />
    </div>
  );
}
