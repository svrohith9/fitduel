import { redirect } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users } from "lucide-react";
import {
  getCurrentUser,
  getDuelByInvite,
} from "@/lib/supabase/queries";
import { joinDuelByCodeAction } from "@/lib/supabase/actions";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  if (!isSupabaseConfigured()) redirect("/setup");

  const { code } = await params;
  const duel = await getDuelByInvite(code);
  const user = await getCurrentUser();

  async function join() {
    "use server";
    await joinDuelByCodeAction(code);
  }

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        className="orb"
        style={{
          width: 500,
          height: 500,
          top: -160,
          right: -120,
          background: "#ff3d7f",
        }}
      />
      <header className="relative z-10 mx-auto w-full max-w-6xl px-6 py-6">
        <Logo />
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 items-center px-6 pb-16">
        <div className="glass-hi w-full rounded-[2rem] p-8 md:p-10">
          {!duel ? (
            <>
              <h1 className="text-2xl font-bold">Invite not found.</h1>
              <p className="mt-2 text-text-dim">
                The link might be wrong or the duel was removed.
              </p>
              <Link href="/" className="mt-6 inline-block">
                <Button variant="outline">Back home</Button>
              </Link>
            </>
          ) : (
            <>
              <Badge tone={duel.mode === "couple" ? "flame" : "cyan"}>
                {duel.mode === "couple" ? "Couple" : "Squad"} duel
              </Badge>
              <h1 className="mt-3 text-3xl font-bold tracking-tight">
                You&apos;re invited to <span className="text-flame">{duel.title}</span>
              </h1>
              <p className="mt-3 text-text-dim">
                {duel.stakes
                  ? `Stakes: ${duel.stakes}`
                  : "Ready to throw down?"}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-text-muted">
                <Users className="h-3.5 w-3.5" />
                {duel.start_date} → {duel.end_date}
              </div>

              {user ? (
                <form action={join} className="mt-8">
                  <Button type="submit" variant="flame" size="lg" fullWidth>
                    Join duel <ArrowRight className="h-5 w-5" />
                  </Button>
                </form>
              ) : (
                <div className="mt-8 flex flex-col gap-3">
                  <Link
                    href={`/signup?next=${encodeURIComponent(`/invite/${code}`)}`}
                  >
                    <Button variant="flame" size="lg" fullWidth>
                      Create account to join <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link
                    href={`/login?next=${encodeURIComponent(`/invite/${code}`)}`}
                  >
                    <Button variant="outline" size="lg" fullWidth>
                      I already have an account
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
