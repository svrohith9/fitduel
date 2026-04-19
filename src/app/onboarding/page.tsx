import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { getCurrentProfile } from "@/lib/supabase/queries";
import { isSupabaseConfigured } from "@/lib/env";
import { OnboardingForm } from "./onboarding-form";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) redirect("/setup");

  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.start_weight_kg && profile.goal_weight_kg) redirect("/dashboard");

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
        <div className="glass w-full rounded-[2rem] p-8 md:p-10">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome,{" "}
            <span className="text-flame">{profile.name.split(" ")[0]}.</span>
          </h1>
          <p className="mt-2 text-text-dim">
            Set your starting line and finish line. Switch kg / lbs as you like.
          </p>

          <div className="mt-8">
            <OnboardingForm initialUnit={profile.preferred_unit} />
          </div>
        </div>
      </main>
    </div>
  );
}
