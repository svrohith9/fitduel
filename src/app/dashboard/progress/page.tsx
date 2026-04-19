import { ProgressRing } from "@/components/ui/progress-ring";
import { StatsTile } from "@/components/dashboard/stats-tile";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/fade-up";
import { LogWeightInline } from "@/components/dashboard/log-weight-inline";
import { formatWeight, toDisplay } from "@/lib/utils";
import {
  getCurrentProfile,
  getLatestWeighIn,
  getMyActivities,
  getMyWeighIns,
} from "@/lib/supabase/queries";
import { Footprints, Timer, Target, Flame } from "lucide-react";

export default async function ProgressPage() {
  const profile = (await getCurrentProfile())!;
  const unit = profile.preferred_unit;
  const activities = await getMyActivities(7);
  const latest = await getLatestWeighIn(profile.id);
  const weighIns = await getMyWeighIns(60);

  const startKg = profile.start_weight_kg ?? 0;
  const goalKg = profile.goal_weight_kg ?? 0;
  const currentKg = latest?.weight_kg ?? startKg;
  const totalGap = Math.max(0, startKg - goalKg);
  const doneKg = Math.max(0, startKg - currentKg);
  const goalPct = totalGap > 0 ? Math.min(100, (doneKg / totalGap) * 100) : 0;

  const today = new Date();
  const days: { day: string; label: string; steps: number; activeMin: number }[] =
    [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const a = activities.find((x) => x.day === iso);
    days.push({
      day: iso,
      label: d.toLocaleDateString("en", { weekday: "short" }).slice(0, 3),
      steps: a?.steps ?? 0,
      activeMin: a?.active_minutes ?? 0,
    });
  }
  const maxSteps = Math.max(10000, ...days.map((d) => d.steps));
  const avgSteps =
    days.reduce((s, d) => s + d.steps, 0) / Math.max(1, days.length);
  const avgActive =
    days.reduce((s, d) => s + d.activeMin, 0) / Math.max(1, days.length);

  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    if (activities.some((a) => a.day === iso)) streak++;
    else break;
  }

  const toGoKg = Math.max(0, currentKg - goalKg);

  return (
    <div className="space-y-6">
      <FadeUp>
        <h1 className="text-3xl font-bold tracking-tight">Your progress</h1>
        <p className="mt-1 text-sm text-text-dim">
          Weight, activity, and streaks.
        </p>
      </FadeUp>

      <FadeUp delay={0.05}>
        <section className="glass-hi flex items-center gap-6 rounded-[2rem] p-6 md:p-8">
          <ProgressRing
            value={goalPct}
            size={140}
            label={`${goalPct.toFixed(0)}%`}
            sub="of goal"
          />
          <div>
            <div className="text-xs uppercase tracking-wide text-text-muted">
              Start → now → goal
            </div>
            <div className="mt-2 flex items-baseline gap-2 text-3xl font-bold tracking-tight">
              <span className="text-text-dim">
                {(toDisplay(startKg, unit) ?? 0).toFixed(1)}
              </span>
              <span>→</span>
              <span className="text-flame">
                {(toDisplay(currentKg, unit) ?? 0).toFixed(1)}
              </span>
              <span>→</span>
              <span className="text-text-dim">
                {(toDisplay(goalKg, unit) ?? 0).toFixed(1)}
              </span>
              <span className="text-sm font-normal text-text-muted">{unit}</span>
            </div>
            <div className="mt-2 text-sm text-text-dim">
              {formatWeight(doneKg, unit)} down · {formatWeight(toGoKg, unit)} to go
            </div>
          </div>
        </section>
      </FadeUp>

      <FadeUp delay={0.08}>
        <LogWeightInline
          placeholderKg={latest?.weight_kg ?? null}
          preferredUnit={unit}
        />
      </FadeUp>

      <FadeUp delay={0.1}>
        <section className="glass rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">This week — steps</h2>
            <span className="text-xs text-text-muted">
              {days.every((d) => d.steps === 0)
                ? "no entries yet"
                : `goal 10k/day`}
            </span>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {days.map((d) => {
              const h = maxSteps > 0 ? (d.steps / maxSteps) * 100 : 0;
              return (
                <div
                  key={d.day}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="relative flex flex-1 w-full items-end">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-flame-600 to-flame-400 transition-all"
                      style={{ height: `${h}%`, minHeight: d.steps ? 4 : 0 }}
                    />
                  </div>
                  <span className="text-[11px] text-text-muted">{d.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      </FadeUp>

      <Stagger delayStep={0.06}>
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StaggerItem>
            <StatsTile
              icon={Footprints}
              label="Avg steps"
              value={Math.round(avgSteps).toLocaleString()}
              sub="/ day"
              tone="flame"
            />
          </StaggerItem>
          <StaggerItem>
            <StatsTile
              icon={Timer}
              label="Active min"
              value={String(Math.round(avgActive))}
              sub="/ day"
              tone="cyan"
            />
          </StaggerItem>
          <StaggerItem>
            <StatsTile
              icon={Flame}
              label="Streak"
              value={`${streak}d`}
              tone="gold"
            />
          </StaggerItem>
          <StaggerItem>
            <StatsTile
              icon={Target}
              label="Weigh-ins"
              value={String(weighIns.length)}
              tone="flame"
            />
          </StaggerItem>
        </section>
      </Stagger>
    </div>
  );
}
