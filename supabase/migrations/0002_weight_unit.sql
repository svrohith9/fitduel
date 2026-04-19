-- Add weight unit preference to profiles. DB always stores weight in kg.
alter table public.profiles
  add column if not exists preferred_unit text not null default 'kg'
  check (preferred_unit in ('kg', 'lbs'));
