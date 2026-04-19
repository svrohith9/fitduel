"use client";

import { useState, useTransition } from "react";
import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WeightInput } from "@/components/ui/weight-input";
import { logWeightAction } from "@/lib/supabase/actions";
import type { WeightUnit } from "@/lib/utils";

type Props = {
  placeholderKg?: number | null;
  preferredUnit: WeightUnit;
};

export function LogWeightInline({ placeholderKg, preferredUnit }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();
  const [kg, setKg] = useState<number | null>(null);

  function onSubmit(fd: FormData) {
    if (kg == null) return;
    setError(null);
    setOk(false);
    startTransition(async () => {
      const result = await logWeightAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setOk(true);
        setTimeout(() => setOk(false), 2000);
      }
    });
  }

  return (
    <div className="glass rounded-3xl p-5">
      <div className="mb-3 flex items-center gap-2">
        <Scale className="h-4 w-4 text-flame-400" />
        <h3 className="font-semibold">Log today&apos;s weight</h3>
      </div>
      <form action={onSubmit} className="flex items-start gap-2">
        <div className="flex-1">
          <WeightInput
            name="weight_kg"
            initialUnit={preferredUnit}
            placeholderKg={placeholderKg ?? undefined}
            onChangeKg={setKg}
          />
        </div>
        <Button type="submit" variant="flame" disabled={pending || kg == null}>
          {pending ? "Saving…" : "Log"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      {ok && <p className="mt-2 text-sm text-emerald-400">Logged ✓</p>}
    </div>
  );
}
