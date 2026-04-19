import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Shield,
  Trophy,
  Users,
  Sparkles,
  Flame,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { FadeUp, Stagger, StaggerItem } from "@/components/motion/fade-up";

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Ambient orbs */}
      <div
        className="orb"
        style={{
          width: 520,
          height: 520,
          top: -120,
          right: -80,
          background: "#ff3d7f",
        }}
      />
      <div
        className="orb"
        style={{
          width: 460,
          height: 460,
          top: 240,
          left: -140,
          background: "#00f0ff",
          opacity: 0.25,
        }}
      />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-text-dim md:flex">
          <a href="#how" className="hover:text-text transition-colors">How it works</a>
          <a href="#features" className="hover:text-text transition-colors">Features</a>
          <a href="#sync" className="hover:text-text transition-colors">Device sync</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-text-dim hover:text-text transition-colors">
            Sign in
          </Link>
          <Link href="/signup">
            <Button size="sm" variant="flame">
              Get started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        <FadeUp>
          <Badge tone="flame" className="mb-6">
            <Flame className="h-3.5 w-3.5" /> New — Couples & Squad duels
          </Badge>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            Duel your way to{" "}
            <span className="text-flame">healthier.</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.12}>
          <p className="mt-6 max-w-2xl text-lg text-text-dim md:text-xl">
            Challenge your partner, friends, or squad to a mini fitness duel.
            Sync real activity from your phone. Win real wins — together.
          </p>
        </FadeUp>
        <FadeUp delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/signup">
              <Button size="lg" variant="flame">
                Start your first duel <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how">
              <Button size="lg" variant="glass">
                See how it works
              </Button>
            </Link>
          </div>
        </FadeUp>

        {/* Hero stat card */}
        <FadeUp delay={0.3}>
          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: Users, label: "Couples & squads", value: "2–6 people" },
              { icon: Smartphone, label: "Works on", value: "iOS + Android + Web" },
              { icon: Activity, label: "Syncs with", value: "HealthKit & Google Fit" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-3xl p-5 flex items-center gap-4">
                <div className="h-11 w-11 rounded-2xl bg-flame-soft grid place-items-center">
                  <s.icon className="h-5 w-5 text-flame-400" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wide text-text-muted">
                    {s.label}
                  </div>
                  <div className="text-base font-semibold text-text">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <FadeUp>
          <div className="mb-14 flex flex-col items-center text-center">
            <Badge tone="cyan">The duel</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Three steps. One winner. <br />
              <span className="text-cyan-grad">Everyone gets fitter.</span>
            </h2>
          </div>
        </FadeUp>

        <Stagger>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Invite your duo or squad",
                body: "Pair up with your partner, or squad up with 2–6 friends. Pick a duration — 7, 30, or 90 days.",
              },
              {
                n: "02",
                title: "Sync your activity",
                body: "Connect Apple Health or Google Fit. Steps, active minutes, and weigh-ins sync automatically.",
              },
              {
                n: "03",
                title: "Score fairly, win together",
                body: "We score by % progress — not raw kilos — so everyone has a fair shot. Streaks and shields keep it fun.",
              },
            ].map((c) => (
              <StaggerItem key={c.n}>
                <div className="glass h-full rounded-3xl p-7">
                  <div className="text-flame text-sm font-mono tracking-widest">
                    {c.n}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold">{c.title}</h3>
                  <p className="mt-2 text-text-dim leading-relaxed">{c.body}</p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <FadeUp>
          <div className="mb-12 max-w-2xl">
            <Badge tone="gold">Built to motivate</Badge>
            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Small wins, <span className="text-flame">big streaks.</span>
            </h2>
            <p className="mt-4 text-lg text-text-dim">
              Everything is designed to make the healthy choice the fun choice.
            </p>
          </div>
        </FadeUp>

        <Stagger>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Streak Shields",
                body: "Missed a day? Your partner can gift you a shield to keep the streak alive. Support > punishment.",
                tone: "cyan",
              },
              {
                icon: Trophy,
                title: "Fair Scoring",
                body: "Progress is measured by % of your own goal, not raw numbers. A 60kg partner vs 90kg one? Still fair.",
                tone: "flame",
              },
              {
                icon: Sparkles,
                title: "Daily Mini-Duels",
                body: "Auto-generated challenges like ‘first to 10k steps wins’. Quick, fun, competitive.",
                tone: "gold",
              },
              {
                icon: Users,
                title: "Couple or Squad mode",
                body: "Duos earn joint rewards. Squads trash-talk with emoji reactions and a shared leaderboard.",
                tone: "flame",
              },
              {
                icon: Activity,
                title: "Real device data",
                body: "We pull real activity from Apple Health & Google Fit. No manual logging. No cheating.",
                tone: "cyan",
              },
              {
                icon: Flame,
                title: "Stake the pot",
                body: "Put a small stake in. Winner donates to charity or plans the next date night. You pick.",
                tone: "gold",
              },
            ].map((f) => (
              <StaggerItem key={f.title}>
                <div className="glass h-full rounded-3xl p-6 hover:glass-hi transition-all">
                  <div className="bg-flame-soft mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl">
                    <f.icon className="h-5 w-5 text-flame-400" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-text-dim leading-relaxed">
                    {f.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </Stagger>
      </section>

      {/* Device sync */}
      <section id="sync" className="relative z-10 mx-auto max-w-6xl px-6 py-20">
        <FadeUp>
          <div className="glass-hi relative overflow-hidden rounded-[2rem] p-10 md:p-14">
            <div
              className="orb"
              style={{
                width: 320,
                height: 320,
                top: -80,
                right: -40,
                background: "#ff3d7f",
                opacity: 0.35,
              }}
            />
            <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <Badge tone="cyan">
                  <Smartphone className="h-3.5 w-3.5" /> Device sync
                </Badge>
                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                  Your real activity — <br /> not just numbers you typed.
                </h2>
                <p className="mt-4 text-text-dim leading-relaxed">
                  FitDuel syncs with Apple Health on iOS and Google Fit on Android.
                  Steps, active minutes, workouts, and weigh-ins flow in
                  automatically. Everyone plays fair.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge tone="neutral">Apple Health</Badge>
                  <Badge tone="neutral">Google Fit</Badge>
                  <Badge tone="neutral">Samsung Health</Badge>
                  <Badge tone="neutral">Garmin (soon)</Badge>
                </div>
              </div>
              <div className="relative h-64 md:h-80">
                <div className="absolute right-4 top-4 w-48 glass-hi rounded-3xl p-5 rotate-3">
                  <div className="text-xs text-text-muted">Today</div>
                  <div className="mt-1 text-3xl font-bold">12,482</div>
                  <div className="text-xs text-text-dim">steps</div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/10">
                    <div className="h-full w-[83%] rounded-full bg-flame" />
                  </div>
                </div>
                <div className="absolute left-4 bottom-4 w-56 glass-hi rounded-3xl p-5 -rotate-3">
                  <div className="text-xs text-text-muted">Streak</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-3xl font-bold">12</span>
                    <Flame className="h-5 w-5 text-flame-500" />
                  </div>
                  <div className="text-xs text-text-dim">days in a row</div>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center">
        <FadeUp>
          <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
            Ready to <span className="text-flame">throw down?</span>
          </h2>
          <p className="mt-5 text-lg text-text-dim">
            Free to start. One minute to set up your first duel.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/signup">
              <Button size="lg" variant="flame">
                Create your duel <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                I already have an account
              </Button>
            </Link>
          </div>
        </FadeUp>
      </section>

      <footer className="relative z-10 border-t border-white/5 mt-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
          <Logo size="sm" />
          <div className="text-sm text-text-muted">
            © {new Date().getFullYear()} FitDuel. Built to move.
          </div>
        </div>
      </footer>
    </div>
  );
}
