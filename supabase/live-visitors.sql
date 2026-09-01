-- Baran Candle Shop — Live Visitors System
-- Run this file in Supabase SQL Editor before enabling the live counter.

create extension if not exists pgcrypto;

create table if not exists public.live_visitors (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text not null unique,
  page_path text,
  language text,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.visitor_events (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  session_id text,
  event_type text not null,
  page_path text,
  language text,
  created_at timestamptz not null default now()
);

create index if not exists live_visitors_last_seen_idx on public.live_visitors(last_seen_at desc);
create index if not exists live_visitors_visitor_id_idx on public.live_visitors(visitor_id);
create index if not exists visitor_events_created_at_idx on public.visitor_events(created_at desc);
create index if not exists visitor_events_visitor_id_idx on public.visitor_events(visitor_id);

alter table public.live_visitors enable row level security;
alter table public.visitor_events enable row level security;

create or replace function public.track_live_visitor(
  p_visitor_id text,
  p_session_id text,
  p_page_path text default '/',
  p_language text default null,
  p_user_agent text default null
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare active_count integer;
begin
  if coalesce(length(trim(p_visitor_id)),0)=0 then raise exception 'visitor_id is required'; end if;
  if coalesce(length(trim(p_session_id)),0)=0 then raise exception 'session_id is required'; end if;

  insert into public.live_visitors(visitor_id,session_id,page_path,language,user_agent,first_seen_at,last_seen_at)
  values(p_visitor_id,p_session_id,coalesce(p_page_path,'/'),p_language,left(p_user_agent,500),now(),now())
  on conflict(session_id) do update set
    visitor_id=excluded.visitor_id,
    page_path=coalesce(excluded.page_path,live_visitors.page_path),
    language=coalesce(excluded.language,live_visitors.language),
    user_agent=coalesce(excluded.user_agent,live_visitors.user_agent),
    last_seen_at=now();

  delete from public.live_visitors where last_seen_at < now() - interval '5 minutes';

  select count(*) into active_count from public.live_visitors
  where last_seen_at >= now() - interval '90 seconds';

  return jsonb_build_object('success',true,'active_visitors',active_count);
end;
$$;

create or replace function public.visitor_heartbeat(
  p_session_id text,
  p_page_path text default null
) returns jsonb
language plpgsql security definer set search_path = public
as $$
declare active_count integer;
begin
  update public.live_visitors set last_seen_at=now(),page_path=coalesce(p_page_path,page_path)
  where session_id=p_session_id;

  delete from public.live_visitors where last_seen_at < now() - interval '5 minutes';

  select count(*) into active_count from public.live_visitors
  where last_seen_at >= now() - interval '90 seconds';

  return jsonb_build_object('success',true,'active_visitors',active_count);
end;
$$;

create or replace function public.track_page_view(
  p_visitor_id text,
  p_session_id text default null,
  p_page_path text default '/',
  p_language text default null
) returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.visitor_events(visitor_id,session_id,event_type,page_path,language)
  values(p_visitor_id,p_session_id,'page_view',coalesce(p_page_path,'/'),p_language);
  return true;
end;
$$;

create or replace function public.track_unique_visitor(
  p_visitor_id text,
  p_session_id text default null,
  p_page_path text default '/',
  p_language text default null
) returns boolean
language plpgsql security definer set search_path = public
as $$
begin
  insert into public.visitor_events(visitor_id,session_id,event_type,page_path,language)
  values(p_visitor_id,p_session_id,'unique_visit',coalesce(p_page_path,'/'),p_language);
  return true;
end;
$$;

create or replace function public.get_live_visitor_count()
returns integer language sql security definer stable set search_path=public
as $$
  select count(*)::integer from public.live_visitors
  where last_seen_at >= now() - interval '90 seconds';
$$;

create or replace function public.get_today_page_views()
returns bigint language sql security definer stable set search_path=public
as $$
  select count(*) from public.visitor_events
  where event_type='page_view' and created_at >= date_trunc('day',now());
$$;

create or replace function public.get_today_unique_visitors()
returns bigint language sql security definer stable set search_path=public
as $$
  select count(distinct visitor_id) from public.visitor_events
  where event_type='unique_visit' and created_at >= date_trunc('day',now());
$$;

create or replace function public.get_visitor_statistics()
returns jsonb language sql security definer stable set search_path=public
as $$
  select jsonb_build_object(
    'live_visitors',public.get_live_visitor_count(),
    'today_page_views',public.get_today_page_views(),
    'today_unique_visitors',public.get_today_unique_visitors(),
    'updated_at',now()
  );
$$;

create or replace function public.cleanup_old_visitor_events()
returns integer language plpgsql security definer set search_path=public
as $$
declare deleted_count integer;
begin
  delete from public.visitor_events where created_at < now() - interval '90 days';
  get diagnostics deleted_count=row_count;
  delete from public.live_visitors where last_seen_at < now() - interval '5 minutes';
  return deleted_count;
end;
$$;

revoke all on public.live_visitors from anon,authenticated;
revoke all on public.visitor_events from anon,authenticated;

grant execute on function public.track_live_visitor(text,text,text,text,text) to anon,authenticated;
grant execute on function public.visitor_heartbeat(text,text) to anon,authenticated;
grant execute on function public.track_page_view(text,text,text,text) to anon,authenticated;
grant execute on function public.track_unique_visitor(text,text,text,text) to anon,authenticated;
grant execute on function public.get_live_visitor_count() to anon,authenticated;
grant execute on function public.get_today_page_views() to anon,authenticated;
grant execute on function public.get_today_unique_visitors() to anon,authenticated;
grant execute on function public.get_visitor_statistics() to anon,authenticated;

select public.get_visitor_statistics();
