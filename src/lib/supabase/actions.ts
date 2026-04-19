"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "./server";
import type { DuelGoal, DuelMode } from "@/lib/types";

function randomCode(len = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  const vals = new Uint32Array(len);
  crypto.getRandomValues(vals);
  for (let i = 0; i < len; i++) out += alphabet[vals[i] % alphabet.length];
  return out;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 20);
}

/* ---------------- auth ---------------- */

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!email || !password || !name) {
    return { error: "Please fill in all fields." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) return { error: error.message };
  if (!data.user) return { error: "Signup failed. Please try again." };

  // Profile row is auto-created by the on_auth_user_created trigger
  // (see supabase/auth_trigger.sql). As a fallback in case the trigger
  // isn't installed, try an upsert — it's a no-op if the row exists.
  const fallbackHandle =
    slugify(name) || `user${Date.now().toString(36).slice(-4)}`;
  await supabase
    .from("profiles")
    .upsert(
      { id: data.user.id, handle: fallbackHandle, name },
      { onConflict: "id", ignoreDuplicates: true },
    );

  redirect("/onboarding");
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Email and password required." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("start_weight_kg, goal_weight_kg")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.start_weight_kg || !profile?.goal_weight_kg) {
      redirect("/onboarding");
    }
  }
  redirect("/dashboard");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/* ---------------- onboarding / profile ---------------- */

export async function completeOnboardingAction(formData: FormData) {
  const startWeight = Number(formData.get("start_weight_kg"));
  const goalWeight = Number(formData.get("goal_weight_kg"));
  const unitRaw = String(formData.get("preferred_unit") ?? "kg");
  const unit: "kg" | "lbs" = unitRaw === "lbs" ? "lbs" : "kg";
  if (
    !Number.isFinite(startWeight) ||
    !Number.isFinite(goalWeight) ||
    startWeight <= 0 ||
    goalWeight <= 0
  ) {
    return { error: "Please enter valid weights." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({
      start_weight_kg: startWeight,
      goal_weight_kg: goalWeight,
      preferred_unit: unit,
    })
    .eq("id", user.id);
  if (error) return { error: error.message };

  await supabase.from("weigh_ins").insert({
    user_id: user.id,
    weight_kg: startWeight,
    source: "onboarding",
  });

  redirect("/dashboard");
}

export async function updateProfileAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const handle = String(formData.get("handle") ?? "").trim();
  const unit = String(formData.get("preferred_unit") ?? "kg");
  if (!name || !handle) return { error: "Name and handle required." };
  if (unit !== "kg" && unit !== "lbs")
    return { error: "Invalid unit." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase
    .from("profiles")
    .update({ name, handle: slugify(handle), preferred_unit: unit })
    .eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  return { ok: true };
}

export async function setUnitAction(unit: "kg" | "lbs") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  await supabase
    .from("profiles")
    .update({ preferred_unit: unit })
    .eq("id", user.id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/progress");
  return { ok: true };
}

/* ---------------- duels ---------------- */

export async function createDuelAction(formData: FormData) {
  const title = String(formData.get("title") ?? "Untitled duel").trim();
  const mode = String(formData.get("mode") ?? "couple") as DuelMode;
  const goal = String(formData.get("goal") ?? "weight_loss_pct") as DuelGoal;
  const days = Number(formData.get("days") ?? 30);
  const stakes = String(formData.get("stakes") ?? "").trim() || null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const start = new Date();
  const end = new Date();
  end.setDate(start.getDate() + days);
  const inviteCode = randomCode();

  const { data: duel, error } = await supabase
    .from("duels")
    .insert({
      title,
      mode,
      goal,
      stakes,
      start_date: start.toISOString().slice(0, 10),
      end_date: end.toISOString().slice(0, 10),
      status: "active",
      invite_code: inviteCode,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error || !duel) return { error: error?.message ?? "Could not create duel." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("start_weight_kg")
    .eq("id", user.id)
    .maybeSingle();

  await supabase.from("duel_participants").insert({
    duel_id: duel.id,
    user_id: user.id,
    start_weight_kg: profile?.start_weight_kg ?? null,
  });

  revalidatePath("/dashboard");
  redirect(`/dashboard/duels/${duel.id}`);
}

export async function joinDuelByCodeAction(code: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/invite/${code}`)}`);

  const { data: duel } = await supabase
    .from("duels")
    .select("id")
    .eq("invite_code", code)
    .maybeSingle();
  if (!duel) return { error: "Invite not found." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("start_weight_kg")
    .eq("id", user.id)
    .maybeSingle();

  const { error } = await supabase
    .from("duel_participants")
    .upsert({
      duel_id: duel.id,
      user_id: user.id,
      start_weight_kg: profile?.start_weight_kg ?? null,
    });

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  redirect(`/dashboard/duels/${duel.id}`);
}

/* ---------------- activity + weight ---------------- */

export async function logWeightAction(formData: FormData) {
  const weight = Number(formData.get("weight_kg"));
  if (!Number.isFinite(weight) || weight <= 0) {
    return { error: "Enter a valid weight." };
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { error } = await supabase.from("weigh_ins").insert({
    user_id: user.id,
    weight_kg: weight,
    source: "manual",
  });
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/progress");
  return { ok: true };
}

export async function logActivityAction(formData: FormData) {
  const steps = Number(formData.get("steps") ?? 0);
  const activeMinutes = Number(formData.get("active_minutes") ?? 0);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase.from("activities").upsert(
    {
      user_id: user.id,
      day: today,
      steps: Math.max(0, Math.floor(steps)),
      active_minutes: Math.max(0, Math.floor(activeMinutes)),
      source: "manual",
    },
    { onConflict: "user_id,day" },
  );
  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/progress");
  return { ok: true };
}
