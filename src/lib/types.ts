export type DuelMode = "couple" | "squad";
export type DuelGoal = "weight_loss_pct" | "steps" | "active_minutes";
export type DuelStatus = "pending" | "active" | "completed" | "cancelled";

export type WeightUnit = "kg" | "lbs";

export type Profile = {
  id: string;
  handle: string;
  name: string;
  avatar_url: string | null;
  start_weight_kg: number | null;
  goal_weight_kg: number | null;
  preferred_unit: WeightUnit;
  created_at: string;
};

export type Duel = {
  id: string;
  title: string;
  mode: DuelMode;
  goal: DuelGoal;
  stakes: string | null;
  start_date: string;
  end_date: string;
  status: DuelStatus;
  invite_code: string;
  created_by: string | null;
  created_at: string;
};

export type DuelParticipant = {
  duel_id: string;
  user_id: string;
  joined_at: string;
  start_weight_kg: number | null;
};

export type WeighIn = {
  id: string;
  user_id: string;
  weight_kg: number;
  logged_at: string;
  source: string | null;
};

export type ActivityDay = {
  user_id: string;
  day: string;
  steps: number;
  active_minutes: number;
  calories: number;
  source: string | null;
  synced_at: string;
};

export type DuelWithParticipants = Duel & {
  participants: (DuelParticipant & { profile: Profile })[];
};

export type ParticipantStanding = {
  profile: Profile;
  startWeight: number | null;
  currentWeight: number | null;
  pctLost: number;
  progressToGoalPct: number;
  streakDays: number;
};
