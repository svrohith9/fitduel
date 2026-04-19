import Link from "next/link";
import { CalendarDays, Swords, Trophy } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { daysBetween, pct } from "@/lib/utils";
import type {
  DuelWithParticipants,
  ParticipantStanding,
} from "@/lib/types";

export function DuelCard({
  duel,
  standings,
}: {
  duel: DuelWithParticipants;
  standings: ParticipantStanding[];
}) {
  const start = new Date(duel.start_date);
  const end = new Date(duel.end_date);
  const now = new Date();
  const total = Math.max(1, daysBetween(start, end));
  const elapsed = daysBetween(start, now);
  const progress = pct(elapsed, total);
  const daysLeft = Math.max(0, total - elapsed);
  const top = standings.slice(0, 3);

  return (
    <Link
      href={`/dashboard/duels/${duel.id}`}
      className="glass hover:glass-hi group relative block overflow-hidden rounded-3xl p-6 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge tone={duel.mode === "couple" ? "flame" : "cyan"}>
              {duel.mode === "couple" ? "Couple" : "Squad"}
            </Badge>
            <Badge tone="neutral">
              <CalendarDays className="h-3 w-3" /> {daysLeft}d left
            </Badge>
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-tight truncate">
            {duel.title}
          </h3>
          {duel.stakes && (
            <p className="mt-1 text-sm text-text-dim flex items-center gap-1.5">
              <Trophy className="h-3.5 w-3.5 text-gold-400" />
              {duel.stakes}
            </p>
          )}
        </div>
        <Swords className="h-5 w-5 text-text-muted group-hover:text-flame-400 transition-colors" />
      </div>

      <div className="mt-5 space-y-2.5">
        {top.length === 0 && (
          <p className="text-sm text-text-dim">
            Waiting for the first weigh-in to score.
          </p>
        )}
        {top.map((s) => (
          <div key={s.profile.id} className="flex items-center gap-3">
            <Avatar name={s.profile.name} size={32} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-xs text-text-dim">
                <span className="font-medium text-text truncate">
                  {s.profile.name}
                </span>
                <span>{s.progressToGoalPct.toFixed(0)}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                  className="bg-flame h-full rounded-full transition-[width] duration-700"
                  style={{ width: `${s.progressToGoalPct}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        {duel.participants.length > top.length && (
          <div className="text-xs text-text-muted pl-11">
            +{duel.participants.length - top.length} more
          </div>
        )}
      </div>

      <div className="mt-5 h-1 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-flame-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Link>
  );
}
