import Link from "next/link";
import {
  Flame,
  Footprints,
  Timer,
  Plus,
  ArrowRight,
  Target,
  Swords,
} from "lucide-react";
import { ProgressRing } from "@/components/ui/progress-ring";
import { StatsTile } from "@/components/dashboard/stats-tile";
import { DuelCard } from "@/components/dashboard/duel-card";
import { Button } from "@/components/ui/button";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/fade-up";
import { LogToday } from "@/components/dashboard/log-today";
import { formatWeight, toDisplay } from "@/lib/utils";
import {
  getCurrentProfile,
  getLatestWeighIn,
  getMyActivities,
  getStandingsForDuel,
  listMyDuels,
} from "@/lib/supabase/queries";

export default async function DashboardHome() {
  const profile = (await getCurrentProfile())!;
  const latest = await getLatestWeighIn(profile.id);
  const duels = await listMyDuels();
  const activeDuels = duels.filter((d) => d.status === "active");
  const activities = await getMyActivities(7);
  const today = new Date().toISOString().slice(0, 10);
  const todayAct = activities.find((a) => a.day === today);

  // Streak: count consecutive days ending today with activity
  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    if (activities.some((a) => a.day === iso)) streak++;
    else break;
  }

  const unit = profile.preferred_unit;
  const startKg = profile.start_weight_kg ?? 0;
  const goalKg = profile.goal_weight_kg ?? 0;
  const currentKg = latest?.weight_kg ?? startKg;
  const totalGap = Math.max(0, startKg - goalKg);
  const done = Math.max(0, startKg - currentKg);
  const goalPct = totalGap > 0 ? Math.min(100, (done / totalGap) * 100) : 0;
  const lostInUnit = toDisplay(startKg - currentKg, unit) ?? 0;

  const standingsByDuel = await Promise.all(
    activeDuels.map(async (d) => ({
      duel: d,
      standings: await getStandingsForDuel(d),
    })),
  );

  return (
    <div className="space-y-8">
      <FadeUp>
        <section className="glass-hi relative overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div
            className="orb"
            style={{
              width: 260,
              height: 260,
              top: -60,
              right: -40,
              background: "#ff3d7f",
              opacity: 0.35,
            }}
          />
          <div className="relative grid items-center gap-6 md:grid-cols-[auto_1fr]">
            <ProgressRing
              value={goalPct}
              size={148}
              label={`${goalPct.toFixed(0)}%`}
              sub="to goal"
            />
            <div>
              <p className="text-text-dim text-sm">Hi {profile.name.split(" ")[0]},</p>
              {lostInUnit > 0 ? (
                <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                  You&apos;re <span className="text-flame">{lostInUnit.toFixed(1)} {unit}</span> down. Keep pushing.
                </h1>
              ) : (
                <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                  Log today to <span className="text-flame">start your streak.</span>
                </h1>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-text-dim">
                <Flame className="h-4 w-4 text-flame-500" />
                <span>
                  <span className="font-semibold text-text">{streak}-day streak</span>
                  {streak > 0 ? " — don't break it." : " — start it today."}
                </span>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      <section>
        <FadeUp>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Today</h2>
            <span className="text-xs text-text-muted">manual entry (for now)</span>
          </div>
        </FadeUp>
        <Stagger delayStep={0.06}>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StaggerItem>
              <StatsTile
                icon={Footprints}
                label="Steps"
                value={(todayAct?.steps ?? 0).toLocaleString()}
                sub="today"
                tone="flame"
              />
            </StaggerItem>
            <StaggerItem>
              <StatsTile
                icon={Timer}
                label="Active min"
                value={String(todayAct?.active_minutes ?? 0)}
                sub="today"
                tone="cyan"
              />
            </StaggerItem>
            <StaggerItem>
              <StatsTile icon={Flame} label="Streak" value={`${streak}d`} tone="gold" />
            </StaggerItem>
            <StaggerItem>
              <StatsTile
                icon={Target}
                label="Weight"
                value={formatWeight(currentKg, unit)}
                sub={`goal ${formatWeight(goalKg, unit, { withUnit: false })}`}
                tone="flame"
              />
            </StaggerItem>
          </div>
        </Stagger>
      </section>

      <FadeUp>
        <LogToday
          todaySteps={todayAct?.steps ?? 0}
          todayActiveMin={todayAct?.active_minutes ?? 0}
          currentWeightKg={latest?.weight_kg ?? null}
          preferredUnit={unit}
        />
      </FadeUp>

      <section>
        <FadeUp>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Active duels</h2>
            <Link
              href="/dashboard/duels"
              className="text-sm text-text-dim hover:text-text transition-colors inline-flex items-center gap-1"
            >
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </FadeUp>
        {standingsByDuel.length === 0 ? (
          <FadeUp>
            <div className="glass flex flex-col items-center rounded-3xl p-10 text-center">
              <div className="bg-flame-soft mb-4 grid h-12 w-12 place-items-center rounded-2xl">
                <Swords className="h-5 w-5 text-flame-400" />
              </div>
              <h3 className="text-lg font-semibold">No active duels yet.</h3>
              <p className="mt-1 max-w-sm text-sm text-text-dim">
                Create one and send the invite link to your partner or squad.
              </p>
              <Link href="/dashboard/duels/new" className="mt-5">
                <Button variant="flame">
                  <Plus className="h-4 w-4" /> Start your first duel
                </Button>
              </Link>
            </div>
          </FadeUp>
        ) : (
          <Stagger delayStep={0.08}>
            <div className="grid gap-4 md:grid-cols-2">
              {standingsByDuel.map(({ duel, standings }) => (
                <StaggerItem key={duel.id}>
                  <DuelCard duel={duel} standings={standings} />
                </StaggerItem>
              ))}
            </div>
          </Stagger>
        )}
      </section>

      {standingsByDuel.length > 0 && (
        <FadeUp>
          <Link href="/dashboard/duels/new">
            <div className="glass hover:glass-hi group flex items-center justify-between rounded-3xl p-5 transition-all">
              <div className="flex items-center gap-4">
                <div className="bg-flame grid h-11 w-11 place-items-center rounded-2xl">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Start a new duel</div>
                  <div className="text-xs text-text-dim">
                    Pair up with your partner or squad
                  </div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-text-muted group-hover:text-flame-400 transition-colors" />
            </div>
          </Link>
        </FadeUp>
      )}
    </div>
  );
}
