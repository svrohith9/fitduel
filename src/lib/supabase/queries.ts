import "server-only";
import { createClient } from "./server";
import type {
  ActivityDay,
  Duel,
  DuelWithParticipants,
  ParticipantStanding,
  Profile,
  WeighIn,
} from "@/lib/types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);
}

/**
 * Returns the current user's profile. If the user exists in auth but has no
 * profiles row yet (e.g. trigger wasn't installed at signup time), this
 * creates one on the fly so the UI never hits a dead-end.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (data) return data as Profile;

  // Fallback: profile row missing — create it now.
  const emailLocal = user.email?.split("@")[0] ?? "user";
  const name =
    (user.user_metadata?.name as string | undefined) ?? emailLocal;
  const baseHandle = slugify(name) || "user";
  let handle = baseHandle;
  for (let i = 0; i < 5; i++) {
    const { error } = await supabase
      .from("profiles")
      .insert({ id: user.id, handle, name });
    if (!error) break;
    handle = `${baseHandle}${Math.floor(Math.random() * 9000 + 1000)}`;
  }
  const { data: fresh } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return (fresh as Profile | null) ?? null;
}

export async function listMyDuels(): Promise<DuelWithParticipants[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: myParts } = await supabase
    .from("duel_participants")
    .select("duel_id")
    .eq("user_id", user.id);
  const duelIds = (myParts ?? []).map((p) => p.duel_id);
  if (duelIds.length === 0) return [];

  const { data: duels } = await supabase
    .from("duels")
    .select("*")
    .in("id", duelIds)
    .order("created_at", { ascending: false });

  if (!duels) return [];

  const { data: allParts } = await supabase
    .from("duel_participants")
    .select("*, profile:profiles(*)")
    .in("duel_id", duelIds);

  return duels.map((d) => ({
    ...(d as Duel),
    participants: (allParts ?? []).filter((p) => p.duel_id === d.id) as DuelWithParticipants["participants"],
  }));
}

export async function getDuelById(
  id: string,
): Promise<DuelWithParticipants | null> {
  const supabase = await createClient();
  const { data: duel } = await supabase
    .from("duels")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!duel) return null;
  const { data: parts } = await supabase
    .from("duel_participants")
    .select("*, profile:profiles(*)")
    .eq("duel_id", id);
  return {
    ...(duel as Duel),
    participants: (parts ?? []) as DuelWithParticipants["participants"],
  };
}

export async function getDuelByInvite(
  code: string,
): Promise<Duel | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("duels")
    .select("*")
    .eq("invite_code", code)
    .maybeSingle();
  return (data as Duel | null) ?? null;
}

export async function getMyWeighIns(limit = 60): Promise<WeighIn[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase
    .from("weigh_ins")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(limit);
  return (data as WeighIn[]) ?? [];
}

export async function getLatestWeighIn(
  userId: string,
): Promise<WeighIn | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("weigh_ins")
    .select("*")
    .eq("user_id", userId)
    .order("logged_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as WeighIn | null) ?? null;
}

export async function getMyActivities(days = 14): Promise<ActivityDay[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { data } = await supabase
    .from("activities")
    .select("*")
    .eq("user_id", user.id)
    .gte("day", since.toISOString().slice(0, 10))
    .order("day", { ascending: true });
  return (data as ActivityDay[]) ?? [];
}

export async function getStandingsForDuel(
  duel: DuelWithParticipants,
): Promise<ParticipantStanding[]> {
  const supabase = await createClient();
  const standings: ParticipantStanding[] = [];

  for (const part of duel.participants) {
    const startWeight =
      part.start_weight_kg ?? part.profile.start_weight_kg ?? null;

    const { data: latest } = await supabase
      .from("weigh_ins")
      .select("*")
      .eq("user_id", part.user_id)
      .order("logged_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const currentWeight = latest?.weight_kg ?? startWeight;

    const { data: acts } = await supabase
      .from("activities")
      .select("day")
      .eq("user_id", part.user_id)
      .order("day", { ascending: false })
      .limit(30);

    let streak = 0;
    if (acts && acts.length) {
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const iso = d.toISOString().slice(0, 10);
        if (acts.some((a) => a.day === iso)) streak++;
        else break;
      }
    }

    let pctLost = 0;
    let progress = 0;
    if (startWeight && currentWeight != null) {
      pctLost = ((startWeight - currentWeight) / startWeight) * 100;
      const goal = part.profile.goal_weight_kg;
      if (goal != null && startWeight > goal) {
        progress =
          ((startWeight - currentWeight) / (startWeight - goal)) * 100;
      }
    }

    standings.push({
      profile: part.profile,
      startWeight,
      currentWeight,
      pctLost,
      progressToGoalPct: Math.max(0, Math.min(100, progress)),
      streakDays: streak,
    });
  }

  standings.sort((a, b) => b.progressToGoalPct - a.progressToGoalPct);
  return standings;
}
