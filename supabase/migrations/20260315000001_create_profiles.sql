-- Migration: Create profiles table
-- Plan: 01-01 (Foundation - Schema)
-- Profiles table for org members and auth-linked users.
-- id is a plain UUID (no FK to auth.users) so org members with no auth account
-- can have profile rows. Auth-linked rows use the nullable auth_user_id column.

create table public.profiles (
  id             uuid        primary key default gen_random_uuid(),
  auth_user_id   uuid        references auth.users(id) on delete cascade,
  username       text        not null,
  role           text        not null default 'user' check (role in ('user', 'admin')),
  created_at     timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Authenticated users can read all profiles (needed for Phase 2 name selector)
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can only update their own profile (matched via auth_user_id)
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = auth_user_id);
