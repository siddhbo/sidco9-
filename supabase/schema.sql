-- sidco9 Ventures - Supabase schema (Postgres)
-- Run this in Supabase SQL Editor.

-- Enable uuid generation
create extension if not exists "uuid-ossp";

-- =========================
-- TABLE: financial_products
-- =========================
create table if not exists public.financial_products (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  type text not null check (type in ('Insurance','Mutual Fund')),
  name text not null,
  provider text not null,
  "desc" text not null,
  features text[] not null default '{}',
  badge text
);

create index if not exists financial_products_type_idx on public.financial_products(type);

-- =================
-- TABLE: properties
-- =================
create table if not exists public.properties (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  region text not null check (region in ('UAE','India')),
  category text not null check (category in ('Residential','Commercial')),
  title text not null,
  location text not null,
  price numeric not null,
  yield numeric,
  type text,
  highlights text[] not null default '{}',
  gradient text
);

create index if not exists properties_region_idx on public.properties(region);

-- =================
-- TABLE: inquiries
-- =================
create table if not exists public.inquiries (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz not null default now(),

  name text not null,
  email text not null,
  phone text,
  interest text not null,
  message text not null,

  property_id uuid references public.properties(id) on delete set null,
  property_title text,
  timestamp_iso text
);

-- =========================
-- updated_at trigger helper
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_financial_products_updated_at on public.financial_products;
create trigger trg_financial_products_updated_at
before update on public.financial_products
for each row execute function public.set_updated_at();

drop trigger if exists trg_properties_updated_at on public.properties;
create trigger trg_properties_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

-- =========================
-- RLS (Row Level Security)
-- =========================
alter table public.financial_products enable row level security;
alter table public.properties enable row level security;
alter table public.inquiries enable row level security;

-- Public read for website
create policy if not exists "public read financial_products"
  on public.financial_products for select
  using (true);

create policy if not exists "public read properties"
  on public.properties for select
  using (true);

-- Public insert for inquiries (contact forms)
create policy if not exists "public insert inquiries"
  on public.inquiries for insert
  with check (true);

-- Admin-only writes for catalog tables (requires authenticated user)
create policy if not exists "admin write financial_products"
  on public.financial_products for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy if not exists "admin write properties"
  on public.properties for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Admin-only read inquiries (optional: keep leads private)
create policy if not exists "admin read inquiries"
  on public.inquiries for select
  using (auth.role() = 'authenticated');
