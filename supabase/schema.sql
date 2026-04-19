-- FitDuel — Supabase schema
-- Run this in the Supabase SQL editor after creating a new project.

-- 1. Profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null,
  name text not null,
  avatar_url text,
  start_weight_kg numeric(5,2),
  goal_weight_kg numeric(5,2),
  created_at timestamptz default now()
);

-- 2. Duels
create type duel_mode as enum ('couple', 'squad');
create type duel_goal as enum ('weight_loss_pct', 'steps', 'active_minutes');
create type duel_status as enum ('pending', 'active', 'completed', 'cancelled');

create table if not exists public.duels (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  mode duel_mode not null,
  goal duel_goal not null default 'weight_loss_pct',
  stakes text,
  start_date date not null,
  end_date date not null,
  status duel_status not null default 'pending',
  invite_code text unique not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- 3. Duel participants
create table if not exists public.duel_participants (
  duel_id uuid references public.duels(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  joined_at timestamptz default now(),
  start_weight_kg numeric(5,2),
  primary key (duel_id, user_id)
);

-- 4. Weigh-ins
create table if not exists public.weigh_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  weight_kg numeric(5,2) not null,
  logged_at timestamptz default now(),
  source text default 'manual'
);

-- 5. Activity (daily rollup from HealthKit / Google Fit)
create table if not exists public.activities (
  user_id uuid references public.profiles(id) on delete cascade,
  day date not null,
  steps int default 0,
  active_minutes int default 0,
  calories int default 0,
  source text,
  synced_at timestamptz default now(),
  primary key (user_id, day)
);

-- 6. Streak shields (partner support)
create table if not exists public.streak_shields (
  id uuid primary key default gen_random_uuid(),
  from_user uuid references public.profiles(id),
  to_user uuid references public.profiles(id),
  duel_id uuid references public.duels(id) on delete cascade,
  gifted_at timestamptz default now(),
  used boolean default false
);

-- Row-level security
alter table public.profiles enable row level security;
alter table public.duels enable row level security;
alter table public.duel_participants enable row level security;
alter table public.weigh_ins enable row level security;
alter table public.activities enable row level security;
alter table public.streak_shields enable row level security;

-- Policies: profiles are public-readable, user can update own
create policy "profiles readable by all" on public.profiles for select using (true);
create policy "update own profile" on public.profiles for update using (auth.uid() = id);
create policy "insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Duels: any authenticated user can read (invite_code is the secret for joining).
create policy "auth can read duels" on public.duels for select
  using (auth.role() = 'authenticated');
create policy "insert duels" on public.duels for insert with check (auth.uid() = created_by);

create policy "read duel participants" on public.duel_participants for select using (true);
create policy "join duels" on public.duel_participants for insert
  with check (auth.uid() = user_id);

create policy "own weighins read" on public.weigh_ins for select using (auth.uid() = user_id);
create policy "own weighins write" on public.weigh_ins for insert with check (auth.uid() = user_id);

create policy "own activities read" on public.activities for select using (auth.uid() = user_id);
create policy "own activities upsert" on public.activities for insert with check (auth.uid() = user_id);
create policy "own activities update" on public.activities for update using (auth.uid() = user_id);

create policy "shields read" on public.streak_shields for select
  using (auth.uid() in (from_user, to_user));
create policy "shields gift" on public.streak_shields for insert
  with check (auth.uid() = from_user);

-- Helpful index
create index if not exists idx_activities_user_day on public.activities (user_id, day desc);
create index if not exists idx_weighins_user on public.weigh_ins (user_id, logged_at desc);
