import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/motion/fade-up";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { LogOut, Smartphone } from "lucide-react";
import { redirect } from "next/navigation";
import {
  signOutAction,
  updateProfileAction,
} from "@/lib/supabase/actions";
import {
  getCurrentProfile,
  getMyActivities,
} from "@/lib/supabase/queries";
import { formatWeight } from "@/lib/utils";

export default async function ProfilePage() {
  const profile = (await getCurrentProfile())!;
  const unit = profile.preferred_unit;
  const activities = await getMyActivities(30);

  let streak = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    if (activities.some((a) => a.day === iso)) streak++;
    else break;
  }

  return (
    <div className="space-y-6">
      <FadeUp>
        <section className="glass-hi rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center gap-5">
            <Avatar name={profile.name} size={72} ring />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{profile.name}</h1>
              <p className="text-sm text-text-dim">@{profile.handle}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {streak > 0 && <Badge tone="flame">{streak}-day streak</Badge>}
                <Badge tone="neutral">
                  {formatWeight(profile.start_weight_kg, unit)} →{" "}
                  {formatWeight(profile.goal_weight_kg, unit)}
                </Badge>
              </div>
            </div>
          </div>
        </section>
      </FadeUp>

      <FadeUp delay={0.05}>
        <form
          action={async (fd) => {
            "use server";
            const r = await updateProfileAction(fd);
            if (r?.error) {
              redirect(
                `/dashboard/profile?error=${encodeURIComponent(r.error)}`,
              );
            }
          }}
          className="glass rounded-3xl p-5 space-y-4"
        >
          <h2 className="font-semibold">Edit profile</h2>
          <Input name="name" label="Name" defaultValue={profile.name} required />
          <Input
            name="handle"
            label="Handle"
            defaultValue={profile.handle}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide text-text-dim uppercase">
              Weight unit
            </label>
            <div className="flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1 w-fit">
              {(["kg", "lbs"] as const).map((u) => (
                <label
                  key={u}
                  className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    unit === u
                      ? "bg-flame text-white"
                      : "text-text-dim hover:text-text"
                  }`}
                >
                  <input
                    type="radio"
                    name="preferred_unit"
                    value={u}
                    defaultChecked={unit === u}
                    className="sr-only"
                  />
                  {u}
                </label>
              ))}
            </div>
          </div>

          <SubmitButton variant="flame" size="sm" pendingLabel="Saving…">
            Save
          </SubmitButton>
        </form>
      </FadeUp>

      <FadeUp delay={0.08}>
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5">
              <Smartphone className="h-4 w-4 text-text-dim" />
            </div>
            <div className="flex-1">
              <div className="font-medium">Apple Health / Google Fit</div>
              <div className="text-xs text-text-dim">
                Auto-sync arrives with the mobile app (Capacitor wrapper). Log
                manually for now.
              </div>
            </div>
            <Badge tone="neutral">Soon</Badge>
          </div>
        </div>
      </FadeUp>

      <FadeUp delay={0.1}>
        <form action={signOutAction}>
          <Button type="submit" variant="outline" fullWidth>
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </form>
      </FadeUp>

      <p className="pt-2 text-center text-xs text-text-muted">
        FitDuel · v0.3 · made to move
      </p>
    </div>
  );
}
