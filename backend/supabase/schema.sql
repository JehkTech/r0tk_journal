-- Supabase schema draft based on current LowDB models
-- UUID-first tables with auth-aware columns, RLS, and storage metadata

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique references auth.users(id) on delete cascade,
  username text not null unique,
  email text not null unique,
  password_hash text not null,
  legacy_user_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  pair text not null,
  side text not null check (side in ('Long', 'Short')),
  lot_size numeric(12,5) not null,
  entry_price numeric(14,6) not null,
  exit_price numeric(14,6),
  stop_loss numeric(14,6),
  take_profit numeric(14,6),
  session text not null check (session in ('Asian', 'London', 'NY', 'Overlap')),
  status text not null default 'open' check (status in ('open', 'closed', 'cancelled')),
  strategy text,
  emotion text check (emotion in ('Confident', 'Focused', 'Calm', 'Rushed', 'Uncertain', 'Fearful', 'Greedy')),
  confidence integer check (confidence between 1 and 10),
  notes text,
  pnl numeric(14,2),
  trade_date date not null,
  legacy_trade_id bigint,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, trade_date, session, pair)
);

create index if not exists trades_user_id_idx on public.trades(user_id);
create index if not exists trades_user_date_pair_idx on public.trades(user_id, trade_date desc, pair);
create index if not exists trades_id_user_id_idx on public.trades(id, user_id);
create index if not exists trades_user_pnl_idx on public.trades(user_id, pnl desc) where pnl is not null;
create index if not exists trades_open_trades_idx on public.trades(user_id, created_at desc) where exit_price is null;
create index if not exists trades_trade_date_idx on public.trades(trade_date desc);
create index if not exists trades_pair_idx on public.trades(pair);
create index if not exists trades_session_idx on public.trades(session);

create table if not exists public.screenshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  trade_id uuid not null references public.trades(id) on delete cascade,
  filename text not null,
  original_name text not null,
  file_path text not null,
  storage_path text not null unique,
  file_size bigint not null,
  mime_type text not null,
  legacy_screenshot_id bigint,
  created_at timestamptz not null default now()
);

create index if not exists screenshots_trade_id_idx on public.screenshots(trade_id);
create index if not exists screenshots_user_id_idx on public.screenshots(user_id, created_at desc);

create table if not exists public.analytics_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  cache_key text not null,
  cache_data jsonb not null,
  expires_at timestamptz not null,
  legacy_cache_id bigint,
  created_at timestamptz not null default now()
);

create index if not exists analytics_cache_user_id_idx on public.analytics_cache(user_id);
create index if not exists analytics_cache_user_expires_idx on public.analytics_cache(user_id, expires_at desc);
create index if not exists analytics_cache_expires_at_idx on public.analytics_cache(expires_at);

alter table public.users enable row level security;
alter table public.trades enable row level security;
alter table public.screenshots enable row level security;
alter table public.analytics_cache enable row level security;

create policy "Users can read and update own profile"
  on public.users
  for all
  to authenticated
  using (auth.uid() = auth_id)
  with check (auth.uid() = auth_id);

create policy "Trades are private to owner"
  on public.trades
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.users u
      where u.id = trades.user_id
        and u.auth_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.users u
      where u.id = trades.user_id
        and u.auth_id = auth.uid()
    )
  );

create policy "Screenshots are private to owner"
  on public.screenshots
  for all
  to authenticated
  using (auth.uid() = auth_id)
  with check (auth.uid() = auth_id);

create policy "Analytics cache is private to owner"
  on public.analytics_cache
  for all
  to authenticated
  using (
    exists (
      select 1
      from public.users u
      where u.id = analytics_cache.user_id
        and u.auth_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.users u
      where u.id = analytics_cache.user_id
        and u.auth_id = auth.uid()
    )
  );

create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

create trigger set_trades_updated_at
before update on public.trades
for each row execute function public.set_updated_at();

create trigger set_analytics_cache_updated_at
before update on public.analytics_cache
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public)
values ('trade-screenshots', 'trade-screenshots', false)
on conflict (id) do nothing;

create policy "Trade screenshots upload"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Trade screenshots read"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Trade screenshots update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Trade screenshots delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'trade-screenshots'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
