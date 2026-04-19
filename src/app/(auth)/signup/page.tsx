import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { FormError } from "@/components/ui/form-error";
import { signUpAction } from "@/lib/supabase/actions";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!isSupabaseConfigured()) redirect("/setup");
  const params = await searchParams;

  async function action(formData: FormData) {
    "use server";
    const result = await signUpAction(formData);
    if (result?.error) {
      redirect(`/signup?error=${encodeURIComponent(result.error)}`);
    }
  }

  return (
    <div className="glass w-full max-w-md rounded-[2rem] p-8 md:p-10">
      <h1 className="text-3xl font-bold tracking-tight">
        Start your <span className="text-flame">first duel.</span>
      </h1>
      <p className="mt-2 text-text-dim">Takes less than a minute.</p>

      <form action={action} className="mt-8 space-y-4">
        <FormError message={params.error} />
        <Input
          name="name"
          label="Your name"
          placeholder="Alex"
          icon={<User className="h-4 w-4" />}
          required
          autoComplete="name"
        />
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
          placeholder="At least 6 characters"
          icon={<Lock className="h-4 w-4" />}
          required
          minLength={6}
          autoComplete="new-password"
        />

        <SubmitButton size="lg" fullWidth variant="flame" pendingLabel="Creating account…">
          Create account <ArrowRight className="h-4 w-4" />
        </SubmitButton>

        <p className="text-center text-xs text-text-muted">
          By continuing you agree to our Terms & Privacy.
        </p>
      </form>

      <div className="mt-6 text-center text-sm text-text-dim">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-text font-medium hover:text-flame-400 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
