"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Heart,
  Flame,
  Footprints,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createDuelAction } from "@/lib/supabase/actions";

type Mode = "couple" | "squad";
type Goal = "weight_loss_pct" | "steps" | "active_minutes";

export default function NewDuelPage() {
  const [mode, setMode] = useState<Mode>("couple");
  const [days, setDays] = useState(30);
  const [goal, setGoal] = useState<Goal>("weight_loss_pct");
  const [title, setTitle] = useState("Spring Cut");
  const [stakes, setStakes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("title", title);
      fd.set("mode", mode);
      fd.set("goal", goal);
      fd.set("days", String(days));
      fd.set("stakes", stakes);
      const result = await createDuelAction(fd);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Create a <span className="text-flame">duel</span>
        </h1>
        <p className="mt-1 text-sm text-text-dim">
          Four quick picks. Share an invite link afterwards.
        </p>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="mb-3 text-xs uppercase tracking-wide text-text-muted">
          Mode
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ModeCard
            active={mode === "couple"}
            icon={<Heart className="h-5 w-5" />}
            label="Couple"
            hint="2 people"
            onClick={() => setMode("couple")}
          />
          <ModeCard
            active={mode === "squad"}
            icon={<Users className="h-5 w-5" />}
            label="Squad"
            hint="3–6 people"
            onClick={() => setMode("squad")}
          />
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="mb-3 text-xs uppercase tracking-wide text-text-muted">
          Duration
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={cn(
                "rounded-2xl border py-4 text-center transition-all",
                days === d
                  ? "bg-flame border-transparent text-white shadow-[0_8px_30px_-8px_rgba(255,61,127,0.5)]"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20",
              )}
            >
              <div className="text-2xl font-bold">{d}</div>
              <div className="text-xs opacity-80">days</div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="mb-3 text-xs uppercase tracking-wide text-text-muted">
          Win condition
        </div>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
          <GoalCard
            active={goal === "weight_loss_pct"}
            icon={<Flame className="h-5 w-5" />}
            label="% weight loss"
            hint="Fair across body types"
            onClick={() => setGoal("weight_loss_pct")}
          />
          <GoalCard
            active={goal === "steps"}
            icon={<Footprints className="h-5 w-5" />}
            label="Total steps"
            hint="Simple & fun"
            onClick={() => setGoal("steps")}
          />
          <GoalCard
            active={goal === "active_minutes"}
            icon={<Timer className="h-5 w-5" />}
            label="Active minutes"
            hint="Intensity matters"
            onClick={() => setGoal("active_minutes")}
          />
        </div>
      </div>

      <div className="glass rounded-3xl p-5 space-y-4">
        <Input
          label="Title"
          placeholder="Spring Cut"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          label="Stakes (optional)"
          placeholder="Loser plans date night"
          value={stakes}
          onChange={(e) => setStakes(e.target.value)}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          variant="flame"
          size="lg"
          fullWidth
          onClick={onSubmit}
          disabled={pending}
        >
          {pending ? "Creating…" : (<>Create & invite <ArrowRight className="h-5 w-5" /></>)}
        </Button>
      </div>
    </motion.div>
  );
}

function ModeCard({
  active,
  icon,
  label,
  hint,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-flame-500/50 bg-flame-soft ring-flame"
          : "border-white/10 bg-white/[0.03] hover:border-white/20",
      )}
    >
      <div
        className={cn(
          "grid h-10 w-10 place-items-center rounded-xl",
          active ? "bg-flame text-white" : "bg-white/10 text-text-dim",
        )}
      >
        {icon}
      </div>
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-xs text-text-dim">{hint}</div>
      </div>
    </button>
  );
}

function GoalCard({
  active,
  icon,
  label,
  hint,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all",
        active
          ? "border-flame-500/50 bg-flame-soft"
          : "border-white/10 bg-white/[0.03] hover:border-white/20",
      )}
    >
      <div
        className={cn(
          "grid h-9 w-9 place-items-center rounded-xl",
          active ? "bg-flame text-white" : "bg-white/10 text-text-dim",
        )}
      >
        {icon}
      </div>
      <div className="font-semibold text-sm">{label}</div>
      <div className="text-xs text-text-dim">{hint}</div>
    </button>
  );
}
