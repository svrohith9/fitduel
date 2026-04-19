-- Auto-create a public.profiles row whenever a new auth.users row is inserted.
-- Run this ONCE in your Supabase SQL editor (new query → paste → Run).

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  gen_handle text;
  gen_name text;
begin
  gen_name := coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  gen_handle := regexp_replace(
    lower(coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))),
    '[^a-z0-9]', '', 'g'
  );
  if gen_handle = '' then
    gen_handle := 'user';
  end if;

  -- ensure uniqueness by appending a short random suffix if taken
  if exists (select 1 from public.profiles where handle = gen_handle) then
    gen_handle := gen_handle || substr(md5(random()::text), 1, 4);
  end if;

  insert into public.profiles (id, handle, name)
  values (new.id, gen_handle, gen_name)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill: create profiles for any existing auth.users that don't have one yet.
insert into public.profiles (id, handle, name)
select
  u.id,
  -- slugified local-part + short random suffix to avoid collisions
  coalesce(
    regexp_replace(lower(split_part(u.email, '@', 1)), '[^a-z0-9]', '', 'g'),
    'user'
  ) || substr(md5(random()::text), 1, 4),
  coalesce(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1))
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
