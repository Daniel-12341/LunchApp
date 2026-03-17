-- Migration: Create orders table
-- Plan: 01-01 (Foundation - Schema)
-- Orders table stores weekly lunch orders.
-- user_id references the auth user who placed the order (the shared user account).
-- selected_name is the org member name chosen in Phase 2 (from profiles.username).

create table public.orders (
  id             uuid         primary key default gen_random_uuid(),
  user_id        uuid         not null references auth.users(id) on delete cascade,
  selected_name  text         not null,
  meal_category  text         not null,
  meal_name      text         not null,
  price          numeric(6,2) not null,
  customisation  text,
  week_number    integer      not null,
  year           integer      not null,
  archived       boolean      not null default false,
  created_at     timestamptz  not null default now()
);

alter table public.orders enable row level security;
