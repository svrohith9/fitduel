import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";
import { signInAction } from "@/lib/supabase/actions";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  if (!isSupabaseConfigured()) redirect("/setup");
  const params = await searchParams;

  async function action(formData: FormData) {
    "use server";
    const result = await signInAction(formData);
    if (result?.error) {
      redirect(`/login?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div className="glass w-full max-w-md rounded-[2rem] p-8 md:p-10">
      <h1 className="text-3xl font-bold tracking-tight">Welcome back.</h1>
      <p className="mt-2 text-text-dim">Sign in to keep your streak alive.</p>

      <form action={action} className="mt-8 space-y-4">
        <FormError message={params.error} />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@fitduel.app"
          icon={<Mail className="h-4 w-4" />}
          required
          autoComplete="email"
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          icon={<Lock className="h-4 w-4" />}
          required
          autoComplete="current-password"
          minLength={6}
        />
        {params.next && <input type="hidden" name="next" value={params.next} />}

        <SubmitButton size="lg" fullWidth variant="flame" pendingLabel="Signing in…">
          Sign in <ArrowRight className="h-4 w-4" />
        </SubmitButton>
      </form>

      <div className="mt-6 text-center text-sm text-text-dim">
        New here?{" "}
        <Link
          href="/signup"
          className="text-text font-medium hover:text-flame-400 transition-colors"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
