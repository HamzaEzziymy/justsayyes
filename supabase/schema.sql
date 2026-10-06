create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  plan text not null default 'free' check (plan in ('free','premium')), -- Stripe-ready
  created_at timestamptz not null default now()
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete set null, -- null = anonymous creator
  claim_token uuid not null default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[A-Za-z0-9]{7,12}$'),
  sender_name text not null check (char_length(sender_name) between 1 and 40),
  recipient_name text not null check (char_length(recipient_name) between 1 and 40),
  message text not null default 'Will you go on a date with me? ❤️' check (char_length(message) <= 140),
  theme text not null default 'romantic' check (theme in ('cute','romantic','funny','crazy','simple')),
  date_idea text not null default 'coffee',
  status text not null default 'pending' check (status in ('pending','accepted','expired')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.invitations (user_id, created_at desc);

create table public.invitation_events (
  id bigint generated always as identity primary key,
  invitation_id uuid not null references public.invitations on delete cascade,
  event_type text not null check (event_type in ('view','no_click','yes_click','date_selected','invitation_completed')),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index on public.invitation_events (invitation_id, event_type);

create table public.date_preferences (
  invitation_id uuid primary key references public.invitations on delete cascade,
  date date not null,
  time time not null,
  activity text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.invitation_events enable row level security;
alter table public.date_preferences enable row level security;

-- Owners only. Recipients never touch tables directly; they use the RPCs below.
create policy "own profile" on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own invitations" on public.invitations for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own events" on public.invitation_events for select
  using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()));
create policy "own prefs" on public.date_preferences for select
  using (exists (select 1 from public.invitations i where i.id = invitation_id and i.user_id = auth.uid()));
create policy "create invitation" on public.invitations for insert
  with check (user_id is null or user_id = auth.uid());

-- Public RPCs with minimal exposure (no user_id / claim_token leaked)
create or replace function public.get_public_invitation(p_slug text)
returns table (sender_name text, recipient_name text, message text, theme text, date_idea text, status text)
language sql security definer set search_path = public as $$
  select sender_name, recipient_name, message, theme, date_idea,
         case when expires_at < now() then 'expired' else status end
  from invitations where slug = p_slug;
$$;

create or replace function public.record_invitation_event(p_slug text, p_type text)
returns void language plpgsql security definer set search_path = public as $$
declare inv uuid;
begin
  if p_type not in ('view','no_click','yes_click') then raise exception 'invalid event'; end if;
  select id into inv from invitations where slug = p_slug;
  if inv is null then return; end if;
  insert into invitation_events (invitation_id, event_type) values (inv, p_type);
end $$;

create or replace function public.submit_date(p_slug text, p_date date, p_time time, p_activity text)
returns boolean language plpgsql security definer set search_path = public as $$
declare inv uuid;
begin
  if p_activity not in ('coffee','pizza','cinema','sunset','dinner','gaming','beach','surprise','custom') then return false; end if;
  if p_date < current_date then return false; end if;
  select id into inv from invitations where slug = p_slug and status = 'pending' and (expires_at is null or expires_at > now());
  if inv is null then return false; end if;
  insert into date_preferences (invitation_id, date, time, activity) values (inv, p_date, p_time, p_activity);
  update invitations set status = 'accepted', updated_at = now() where id = inv;
  insert into invitation_events (invitation_id, event_type) values (inv, 'date_selected'), (inv, 'invitation_completed');
  return true;
end $$;

grant execute on function public.get_public_invitation(text), public.record_invitation_event(text,text), public.submit_date(text,date,time,text) to anon, authenticated;
