import Link from "next/link";
import { Plus, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DuelCard } from "@/components/dashboard/duel-card";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/fade-up";
import {
  getStandingsForDuel,
  listMyDuels,
} from "@/lib/supabase/queries";

export default async function DuelsPage() {
  const duels = await listMyDuels();
  const withStandings = await Promise.all(
    duels.map(async (d) => ({ duel: d, standings: await getStandingsForDuel(d) })),
  );
  const active = withStandings.filter((d) => d.duel.status === "active");
  const past = withStandings.filter((d) => d.duel.status !== "active");

  return (
    <div className="space-y-6">
      <FadeUp>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Duels</h1>
            <p className="mt-1 text-sm text-text-dim">
              Active and past challenges.
            </p>
          </div>
          <Link href="/dashboard/duels/new">
            <Button variant="flame" size="sm">
              <Plus className="h-4 w-4" /> New
            </Button>
          </Link>
        </div>
      </FadeUp>

      {active.length === 0 && past.length === 0 ? (
        <FadeUp delay={0.05}>
          <div className="glass flex flex-col items-center rounded-3xl p-12 text-center">
            <div className="bg-flame-soft mb-4 grid h-14 w-14 place-items-center rounded-2xl">
              <Swords className="h-6 w-6 text-flame-400" />
            </div>
            <h3 className="text-xl font-semibold">No duels yet.</h3>
            <p className="mt-1 max-w-md text-sm text-text-dim">
              A duel is a time-boxed challenge. Create one, share the invite
              link, and start.
            </p>
            <Link href="/dashboard/duels/new" className="mt-6">
              <Button variant="flame">
                <Plus className="h-4 w-4" /> Create a duel
              </Button>
            </Link>
          </div>
        </FadeUp>
      ) : (
        <>
          {active.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm uppercase tracking-wide text-text-muted">
                Active
              </h2>
              <Stagger delayStep={0.08}>
                <div className="grid gap-4 md:grid-cols-2">
                  {active.map(({ duel, standings }) => (
                    <StaggerItem key={duel.id}>
                      <DuelCard duel={duel} standings={standings} />
                    </StaggerItem>
                  ))}
                </div>
              </Stagger>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm uppercase tracking-wide text-text-muted">
                Past
              </h2>
              <Stagger delayStep={0.08}>
                <div className="grid gap-4 md:grid-cols-2">
                  {past.map(({ duel, standings }) => (
                    <StaggerItem key={duel.id}>
                      <DuelCard duel={duel} standings={standings} />
                    </StaggerItem>
                  ))}
                </div>
              </Stagger>
            </section>
          )}
        </>
      )}
    </div>
  );
}
