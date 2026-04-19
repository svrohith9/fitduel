import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, ExternalLink } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/env";
import { redirect } from "next/navigation";

export default function SetupPage() {
  if (isSupabaseConfigured()) redirect("/dashboard");

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        className="orb"
        style={{
          width: 520,
          height: 520,
          top: -160,
          right: -120,
          background: "#ff3d7f",
        }}
      />
      <header className="relative z-10 mx-auto w-full max-w-6xl px-6 py-6">
        <Logo />
      </header>
      <main className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 items-center px-6 pb-16">
        <div className="glass-hi w-full rounded-[2rem] p-8 md:p-10">
          <div className="bg-flame-soft mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl">
            <Database className="h-5 w-5 text-flame-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            One-time setup — connect the database.
          </h1>
          <p className="mt-2 text-text-dim">
            FitDuel needs Supabase (free) to store accounts, duels, and sync
            across devices. Takes 2 minutes.
          </p>

          <ol className="mt-6 space-y-4">
            <li className="glass rounded-2xl p-4">
              <div className="text-xs uppercase tracking-wide text-text-muted">Step 1</div>
              <div className="mt-1 font-semibold">Create a free Supabase project</div>
              <a
                href="https://supabase.com/dashboard/new"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-flame-400 hover:underline"
              >
                Open supabase.com <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </li>
            <li className="glass rounded-2xl p-4">
              <div className="text-xs uppercase tracking-wide text-text-muted">Step 2</div>
              <div className="mt-1 font-semibold">
                Copy your Project URL and anon key
              </div>
              <p className="mt-1 text-sm text-text-dim">
                Project settings → API. Paste them into a <code className="rounded bg-white/5 px-1">.env.local</code> file:
              </p>
              <pre className="mt-2 overflow-x-auto rounded-xl border border-white/5 bg-black/40 p-3 text-xs text-text-dim">
{`NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...`}
              </pre>
            </li>
            <li className="glass rounded-2xl p-4">
              <div className="text-xs uppercase tracking-wide text-text-muted">Step 3</div>
              <div className="mt-1 font-semibold">Run the schema</div>
              <p className="mt-1 text-sm text-text-dim">
                Open the Supabase SQL editor, paste{" "}
                <code className="rounded bg-white/5 px-1">supabase/schema.sql</code>
                , click Run.
              </p>
            </li>
            <li className="glass rounded-2xl p-4">
              <div className="text-xs uppercase tracking-wide text-text-muted">Step 4</div>
              <div className="mt-1 font-semibold">Restart the dev server</div>
              <pre className="mt-2 overflow-x-auto rounded-xl border border-white/5 bg-black/40 p-3 text-xs text-text-dim">npm run dev</pre>
            </li>
          </ol>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/">
              <Button variant="outline">Back to landing</Button>
            </Link>
            <a
              href="https://supabase.com/dashboard/new"
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="flame">
                Create Supabase project <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
