"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Footprints, Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WeightInput } from "@/components/ui/weight-input";
import {
  logActivityAction,
  logWeightAction,
} from "@/lib/supabase/actions";
import type { WeightUnit } from "@/lib/utils";

type Props = {
  todaySteps: number;
  todayActiveMin: number;
  currentWeightKg: number | null;
  preferredUnit: WeightUnit;
};

export function LogToday({
  todaySteps,
  todayActiveMin,
  currentWeightKg,
  preferredUnit,
}: Props) {
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState({
    steps: todaySteps ? String(todaySteps) : "",
    active_minutes: todayActiveMin ? String(todayActiveMin) : "",
  });
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(fd: FormData) {
    setError(null);
    startTransition(async () => {
      const promises: Promise<{ error?: string } | void>[] = [];
      if (fd.get("steps") || fd.get("active_minutes")) {
        promises.push(logActivityAction(fd));
      }
      if (weightKg != null) {
        const wfd = new FormData();
        wfd.set("weight_kg", String(weightKg));
        promises.push(logWeightAction(wfd));
      }
      const results = await Promise.all(promises);
      const firstError = results.find(
        (r) => r && "error" in r && r?.error,
      ) as { error?: string } | undefined;
      if (firstError?.error) {
        setError(firstError.error);
        return;
      }
      setOpen(false);
      setWeightKg(null);
    });
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass hover:glass-hi group flex w-full items-center justify-between rounded-3xl p-5 transition-all"
      >
        <div className="flex items-center gap-4">
          <div className="bg-flame grid h-11 w-11 place-items-center rounded-2xl">
            <Check className="h-5 w-5 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold">Log today</div>
            <div className="text-xs text-text-dim">
              Steps, active minutes, weight
            </div>
          </div>
        </div>
        <span className="text-sm text-flame-400 group-hover:text-flame-500 transition-colors">
          Open
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              key="sheet"
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="glass-hi fixed bottom-0 left-1/2 w-[min(520px,100vw)] -translate-x-1/2 rounded-t-[2rem] p-6 md:bottom-1/2 md:rounded-[2rem] md:translate-y-1/2"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-xl font-bold">Log today</h3>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form action={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    name="steps"
                    label="Steps"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    icon={<Footprints className="h-4 w-4" />}
                    value={activity.steps}
                    onChange={(e) =>
                      setActivity({ ...activity, steps: e.target.value })
                    }
                    placeholder="0"
                  />
                  <Input
                    name="active_minutes"
                    label="Active min"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    icon={<Timer className="h-4 w-4" />}
                    value={activity.active_minutes}
                    onChange={(e) =>
                      setActivity({
                        ...activity,
                        active_minutes: e.target.value,
                      })
                    }
                    placeholder="0"
                  />
                </div>
                <WeightInput
                  name="weight_kg"
                  label="Weight (optional)"
                  initialUnit={preferredUnit}
                  placeholderKg={currentWeightKg ?? undefined}
                  onChangeKg={setWeightKg}
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
                  {pending ? "Saving…" : "Save today"}
                </Button>
                <p className="text-center text-xs text-text-muted">
                  Connect Apple Health / Google Fit (coming with the mobile app)
                  to auto-sync.
                </p>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
