import { redirect } from "next/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Avatar } from "@/components/ui/avatar";
import { TabBar } from "@/components/dashboard/tab-bar";
import { isSupabaseConfigured } from "@/lib/env";
import { getCurrentProfile } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) redirect("/setup");
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (!profile.start_weight_kg || !profile.goal_weight_kg) {
    redirect("/onboarding");
  }

  return (
    <div className="relative flex min-h-dvh flex-col pb-28">
      <div
        className="orb"
        style={{
          width: 420,
          height: 420,
          top: -140,
          right: -100,
          background: "#ff3d7f",
          opacity: 0.3,
        }}
      />
      <div
        className="orb"
        style={{
          width: 360,
          height: 360,
          top: 300,
          left: -120,
          background: "#00f0ff",
          opacity: 0.2,
        }}
      />

      <header className="relative z-10 mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-5">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="glass grid h-10 w-10 place-items-center rounded-full hover:glass-hi transition-colors"
          >
            <Bell className="h-4 w-4" />
          </button>
          <Link href="/dashboard/profile">
            <Avatar name={profile.name} size={40} ring />
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-3xl flex-1 px-5 pb-12">
        {children}
      </main>

      <TabBar />
    </div>
  );
}
