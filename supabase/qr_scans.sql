-- QR scan tracker: one row per scan of a printed QR code (www.zenant.club/card, ...).
--
-- Rows are written by the website's api/qr.mts function with the Supabase
-- publishable (anon) key. That key can only INSERT here: it cannot read,
-- change or delete scans. Read them in the Supabase dashboard (the postgres
-- role), e.g. the qr_scans_daily view below.
--
-- Paste the whole file into the Supabase SQL editor and press Run once. It runs as one
-- transaction: either everything is created or nothing is. Safe to re-run.

begin;

create table if not exists public.qr_scans (
  id          bigint generated always as identity primary key,
  scanned_at  timestamptz not null default now(),
  code        text not null check (char_length(code) <= 32),  -- which printed code, e.g. 'card'
  country     text,      -- ISO country code from the visitor's IP, e.g. 'IN'
  region      text,      -- state code from the IP, e.g. 'HR' (Haryana), 'DL'
  city        text,      -- from the IP; approximate on mobile networks
  device_type text,      -- mobile | tablet | desktop
  os          text,      -- iOS | Android | Windows | macOS | ...
  browser     text,      -- Chrome | Safari | Samsung Internet | Instagram app | ...
  is_bot      boolean not null default false,  -- link-preview bots (WhatsApp, Facebook), crawlers
  visitor_id  text,      -- salted hash of IP + user agent; the raw IP is never stored
  user_agent  text check (char_length(user_agent) <= 512)
);

create index if not exists qr_scans_scanned_at_idx on public.qr_scans (scanned_at desc);
create index if not exists qr_scans_code_scanned_at_idx on public.qr_scans (code, scanned_at desc);

-- The website may only add scans, and may not set scanned_at (always the
-- database's own clock).
alter table public.qr_scans enable row level security;
revoke all on public.qr_scans from anon, authenticated;
grant insert (code, country, region, city, device_type, os, browser, is_bot, visitor_id, user_agent)
  on public.qr_scans to anon;
drop policy if exists "website records scans" on public.qr_scans;
create policy "website records scans" on public.qr_scans
  for insert to anon with check (true);

-- Reports. Times are India time. Bots are left out. security_invoker keeps the
-- table's access rules in force, so the public key cannot read these either.

create or replace view public.qr_scans_daily with (security_invoker = true) as
select (scanned_at at time zone 'Asia/Kolkata')::date as day,
       code,
       count(*)                   as scans,
       count(distinct visitor_id) as unique_visitors
from public.qr_scans
where not is_bot
group by 1, 2
order by 1 desc, 2;

create or replace view public.qr_scans_by_location with (security_invoker = true) as
select code, country, region, city,
       count(*)                   as scans,
       count(distinct visitor_id) as unique_visitors
from public.qr_scans
where not is_bot
group by 1, 2, 3, 4
order by scans desc;

create or replace view public.qr_scans_by_device with (security_invoker = true) as
select code, device_type, os, browser,
       count(*) as scans
from public.qr_scans
where not is_bot
group by 1, 2, 3, 4
order by scans desc;

create or replace view public.qr_scans_by_hour with (security_invoker = true) as
select code,
       extract(hour from scanned_at at time zone 'Asia/Kolkata')::int as hour_ist,
       count(*) as scans
from public.qr_scans
where not is_bot
group by 1, 2
order by 1, 2;

revoke all on public.qr_scans_daily, public.qr_scans_by_location,
              public.qr_scans_by_device, public.qr_scans_by_hour
  from anon, authenticated;

commit;
