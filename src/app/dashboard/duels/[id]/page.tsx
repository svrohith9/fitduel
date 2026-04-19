import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Trophy,
  Flame,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { FadeUp } from "@/components/motion/fade-up";
import { InviteShare } from "@/components/dashboard/invite-share";
import { LogWeightInline } from "@/components/dashboard/log-weight-inline";
import {
  getCurrentProfile,
  getDuelById,
  getStandingsForDuel,
  getLatestWeighIn,
} from "@/lib/supabase/queries";
import { daysBetween, pct } from "@/lib/utils";

export default async function DuelDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const duel = await getDuelById(id);
  if (!duel) notFound();

  const me = (await getCurrentProfile())!;
  const standings = await getStandingsForDuel(duel);
  const latest = await getLatestWeighIn(me.id);

  const start = new Date(duel.start_date);
  const end = new Date(duel.end_date);
  const now = new Date();
  const total = Math.max(1, daysBetween(start, end));
  const elapsed = daysBetween(start, now);
  const progress = pct(elapsed, total);
  const daysLeft = Math.max(0, total - elapsed);

  const iAmIn = duel.participants.some((p) => p.user_id === me.id);

  return (
    <div className="space-y-6">
      <FadeUp>
        <Link
          href="/dashboard/duels"
          className="inline-flex items-center gap-1.5 text-sm text-text-dim hover:text-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to duels
        </Link>
      </FadeUp>

      <FadeUp delay={0.05}>
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
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={duel.mode === "couple" ? "flame" : "cyan"}>
                {duel.mode === "couple" ? "Couple" : "Squad"}
              </Badge>
              <Badge tone="neutral">
                <CalendarDays className="h-3 w-3" /> {daysLeft}d left
              </Badge>
              <Badge tone="neutral">
                <Users className="h-3 w-3" /> {duel.participants.length}
              </Badge>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              {duel.title}
            </h1>
            {duel.stakes && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-text-dim">
                <Trophy className="h-3.5 w-3.5 text-gold-400" />
                {duel.stakes}
              </p>
            )}
            <div className="mt-5 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-flame-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-text-muted">
              <span>{duel.start_date}</span>
              <span>{duel.end_date}</span>
            </div>
          </div>
        </section>
      </FadeUp>

      <FadeUp delay={0.1}>
        <InviteShare code={duel.invite_code} title={duel.title} />
      </FadeUp>

      {iAmIn && (
        <FadeUp delay={0.12}>
          <LogWeightInline
            placeholderKg={latest?.weight_kg ?? null}
            preferredUnit={me.preferred_unit}
          />
        </FadeUp>
      )}

      <FadeUp delay={0.15}>
        <section className="glass rounded-3xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold-400" />
            <h2 className="font-semibold">Leaderboard</h2>
          </div>
          {standings.length === 0 ? (
            <p className="text-sm text-text-dim">No participants yet.</p>
          ) : (
            <ol className="space-y-3">
              {standings.map((s, i) => (
                <li
                  key={s.profile.id}
                  className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3"
                >
                  <div className="w-6 text-center text-sm font-bold text-text-muted">
                    {i + 1}
                  </div>
                  <Avatar name={s.profile.name} size={40} ring={i === 0} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-semibold">
                        {s.profile.name}
                        {s.profile.id === me.id && (
                          <span className="ml-1 text-xs text-text-muted">(you)</span>
                        )}
                      </span>
                      {i === 0 && s.progressToGoalPct > 0 && (
                        <Badge tone="gold">
                          <Trophy className="h-3 w-3" /> Leader
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-text-dim">
                      <Flame className="h-3 w-3 text-flame-500" />
                      {s.streakDays}d streak · {s.pctLost.toFixed(1)}% lost
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-20 rounded-full bg-white/5 overflow-hidden md:w-28">
                      <div
                        className="h-full bg-flame rounded-full"
                        style={{ width: `${s.progressToGoalPct}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-sm font-semibold">
                      {s.progressToGoalPct.toFixed(0)}%
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      </FadeUp>
    </div>
  );
}
