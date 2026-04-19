import Link from "next/link";
import { Flame, Trophy, UserPlus, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/fade-up";
import {
  getCurrentProfile,
  getStandingsForDuel,
  listMyDuels,
} from "@/lib/supabase/queries";

export default async function GroupPage() {
  const me = (await getCurrentProfile())!;
  const duels = await listMyDuels();
  const active = duels.filter((d) => d.status === "active");

  // Aggregate unique members across all duels (excluding me)
  const memberMap = new Map<string, { profile: typeof me; duels: string[] }>();
  for (const d of duels) {
    for (const p of d.participants) {
      if (p.user_id === me.id) continue;
      const existing = memberMap.get(p.user_id);
      if (existing) existing.duels.push(d.title);
      else memberMap.set(p.user_id, { profile: p.profile, duels: [d.title] });
    }
  }
  const members = Array.from(memberMap.values());

  const primary = active[0];
  const standings = primary ? await getStandingsForDuel(primary) : [];

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your squad</h1>
            <p className="mt-1 text-sm text-text-dim">
              {members.length + 1} member{members.length === 0 ? "" : "s"} · {active.length} active duel{active.length === 1 ? "" : "s"}
            </p>
          </div>
          {primary ? (
            <Link href={`/dashboard/duels/${primary.id}`}>
              <Button variant="glass" size="sm">
                <UserPlus className="h-4 w-4" /> Invite
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/duels/new">
              <Button variant="glass" size="sm">
                <UserPlus className="h-4 w-4" /> Start & invite
              </Button>
            </Link>
          )}
        </div>
      </FadeUp>

      {!primary ? (
        <FadeUp delay={0.05}>
          <div className="glass flex flex-col items-center rounded-3xl p-12 text-center">
            <div className="bg-flame-soft mb-4 grid h-14 w-14 place-items-center rounded-2xl">
              <Users className="h-6 w-6 text-flame-400" />
            </div>
            <h3 className="text-xl font-semibold">No squad yet.</h3>
            <p className="mt-1 max-w-md text-sm text-text-dim">
              Create a duel and share the invite link — people who join become
              your squad.
            </p>
            <Link href="/dashboard/duels/new" className="mt-6">
              <Button variant="flame">Start a duel</Button>
            </Link>
          </div>
        </FadeUp>
      ) : (
        <>
          <FadeUp delay={0.05}>
            <section className="glass-hi rounded-[2rem] p-6">
              <div className="mb-5 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold-400" />
                <h2 className="font-semibold truncate">
                  Leaderboard — {primary.title}
                </h2>
              </div>
              <Stagger delayStep={0.06}>
                <ol className="space-y-3">
                  {standings.map((s, i) => (
                    <StaggerItem key={s.profile.id}>
                      <li className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-3 border border-white/5">
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
                            {s.streakDays}d streak
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-20 rounded-full bg-white/5 overflow-hidden md:w-24">
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
                    </StaggerItem>
                  ))}
                </ol>
              </Stagger>
            </section>
          </FadeUp>

          {members.length > 0 && (
            <FadeUp delay={0.1}>
              <section className="glass rounded-3xl p-6">
                <h2 className="mb-4 font-semibold">All members</h2>
                <ul className="space-y-3">
                  {members.map((m) => (
                    <li key={m.profile.id} className="flex items-center gap-3">
                      <Avatar name={m.profile.name} size={36} />
                      <div className="flex-1 text-sm">
                        <div className="font-medium">{m.profile.name}</div>
                        <div className="text-xs text-text-dim truncate">
                          Shared: {m.duels.join(", ")}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </FadeUp>
          )}
        </>
      )}
    </div>
  );
}
