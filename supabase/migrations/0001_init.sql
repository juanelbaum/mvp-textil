-- TextilConnect MVP - initial schema
-- Phase 1: auth is still mocked on the client (RoleProvider). RLS is enabled
-- but policies are permissive because the service_role client bypasses them.
-- When real Supabase Auth is wired, tighten policies to use auth.uid().

begin;

-- Enums -------------------------------------------------------------------

create type user_role as enum ('manufacturer', 'workshop');
create type workshop_capacity as enum ('low', 'medium', 'high');
create type order_status as enum (
  'pending',
  'accepted',
  'in_production',
  'quality_check',
  'completed',
  'cancelled'
);

-- Tables ------------------------------------------------------------------

create table users (
  id uuid primary key default gen_random_uuid(),
  role user_role not null,
  email text not null unique,
  name text not null,
  phone text not null default '',
  location text not null default '',
  description text not null default '',
  avatar text,
  created_at timestamptz not null default now()
);

create table manufacturers (
  user_id uuid primary key references users(id) on delete cascade,
  company_name text not null,
  industry text not null,
  orders_count integer not null default 0
);

create table workshops (
  user_id uuid primary key references users(id) on delete cascade,
  workshop_name text not null,
  services text[] not null default '{}',
  specialties text[] not null default '{}',
  capacity workshop_capacity not null default 'medium',
  rating numeric(2,1) not null default 0,
  reviews_count integer not null default 0,
  completed_orders integer not null default 0,
  min_order_quantity integer not null default 0,
  lead_time_days integer not null default 0,
  images text[] not null default '{}'
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  manufacturer_id uuid not null references manufacturers(user_id) on delete restrict,
  workshop_id uuid references workshops(user_id) on delete set null,
  status order_status not null default 'pending',
  garment_type text not null,
  quantity integer not null check (quantity > 0),
  material text not null,
  deadline date not null,
  budget numeric(12,2) not null check (budget >= 0),
  specifications text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_timeline_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  status order_status not null,
  description text not null,
  timestamp timestamptz not null default now()
);

create table workshop_reviews (
  id uuid primary key default gen_random_uuid(),
  workshop_id uuid not null references workshops(user_id) on delete cascade,
  manufacturer_id uuid not null references manufacturers(user_id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text not null default '',
  created_at timestamptz not null default now()
);

-- Indexes -----------------------------------------------------------------

create index orders_manufacturer_id_idx on orders(manufacturer_id);
create index orders_workshop_id_idx on orders(workshop_id);
create index orders_status_idx on orders(status);
create index order_timeline_events_order_id_idx on order_timeline_events(order_id);
create index workshop_reviews_workshop_id_idx on workshop_reviews(workshop_id);

-- Auto-update updated_at on orders ---------------------------------------

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger orders_set_updated_at
before update on orders
for each row execute function set_updated_at();

-- Row Level Security ------------------------------------------------------
-- Enabled on every table. Service role key bypasses RLS so server-side
-- repositories keep working. Anon key access is denied by default (no
-- policies). Once real auth is in place we will add auth.uid()-based policies.

alter table users enable row level security;
alter table manufacturers enable row level security;
alter table workshops enable row level security;
alter table orders enable row level security;
alter table order_timeline_events enable row level security;
alter table workshop_reviews enable row level security;

commit;
