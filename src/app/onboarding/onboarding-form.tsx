"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeightInput } from "@/components/ui/weight-input";
import { cn, type WeightUnit } from "@/lib/utils";
import { completeOnboardingAction } from "@/lib/supabase/actions";

export function OnboardingForm({
  initialUnit,
}: {
  initialUnit: WeightUnit;
}) {
  const router = useRouter();
  const [unit, setUnit] = useState<WeightUnit>(initialUnit);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(fd: FormData) {
    setError(null);
    fd.set("preferred_unit", unit);
    startTransition(async () => {
      const result = await completeOnboardingAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-2">
        <span className="pl-3 text-xs uppercase tracking-wide text-text-dim">
          Units
        </span>
        <div className="flex items-center rounded-full border border-white/10 bg-black/20 p-1">
          {(["kg", "lbs"] as WeightUnit[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors",
                unit === u ? "bg-flame text-white" : "text-text-dim",
              )}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <WeightInput
        key={`start-${unit}`}
        name="start_weight_kg"
        label="Start weight"
        initialUnit={unit}
        showToggle={false}
        required
      />
      <WeightInput
        key={`goal-${unit}`}
        name="goal_weight_kg"
        label="Goal weight"
        initialUnit={unit}
        showToggle={false}
        required
      />

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        fullWidth
        variant="flame"
        disabled={pending}
      >
        {pending ? "Saving…" : (<>Continue <ArrowRight className="h-4 w-4" /></>)}
      </Button>
      <p className="text-center text-xs text-text-muted">
        You can edit these anytime from your profile.
      </p>
    </form>
  );
}
