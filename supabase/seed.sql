-- Seed: Auth users + org member profiles
-- Plan: 01-01 (Foundation - Schema)
-- Creates 2 Supabase Auth accounts (user + admin) with matching auth.identities rows,
-- 1 admin profile, and 10 org member profiles (no auth accounts for org members).
--
-- Run after migrations: supabase db push (applies migrations then runs seed.sql)
-- Passwords: user@lunchapp.com / password  |  admin@lunchapp.com / admin123

create extension if not exists "pgcrypto";

do $$
declare
  v_user_id  uuid := gen_random_uuid();
  v_admin_id uuid := gen_random_uuid();
  v_user_pw  text := crypt('password', gen_salt('bf'));
  v_admin_pw text := crypt('admin123', gen_salt('bf'));
begin

  -- ----------------------------------------------------------------
  -- Shared user account (used by all 10 org members to log in)
  -- ----------------------------------------------------------------
  insert into auth.users (
    id, instance_id, aud, role,
    email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    v_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'user@lunchapp.com',
    v_user_pw,
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now()
  );

  -- auth.identities is required — without it signInWithPassword fails silently
  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) values (
    v_user_id,
    v_user_id,
    format('{"sub":"%s","email":"user@lunchapp.com"}', v_user_id)::jsonb,
    'email',
    v_user_id::text,
    now(),
    now(),
    now()
  );

  -- ----------------------------------------------------------------
  -- Admin account
  -- ----------------------------------------------------------------
  insert into auth.users (
    id, instance_id, aud, role,
    email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at
  ) values (
    v_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@lunchapp.com',
    v_admin_pw,
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now()
  );

  insert into auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) values (
    v_admin_id,
    v_admin_id,
    format('{"sub":"%s","email":"admin@lunchapp.com"}', v_admin_id)::jsonb,
    'email',
    v_admin_id::text,
    now(),
    now(),
    now()
  );

  -- ----------------------------------------------------------------
  -- Admin profile (auth_user_id links to the admin auth account)
  -- ----------------------------------------------------------------
  insert into public.profiles (id, auth_user_id, username, role) values
    (gen_random_uuid(), v_admin_id, 'admin', 'admin');

  -- ----------------------------------------------------------------
  -- 10 org member profiles (no auth accounts — identity via Phase 2 name selector)
  -- auth_user_id is NULL for all org members
  -- ----------------------------------------------------------------
  insert into public.profiles (id, auth_user_id, username, role) values
    (gen_random_uuid(), null, 'Daniel', 'user'),
    (gen_random_uuid(), null, 'Nic',    'user'),
    (gen_random_uuid(), null, 'James',  'user'),
    (gen_random_uuid(), null, 'Sarah',  'user'),
    (gen_random_uuid(), null, 'Lara',   'user'),
    (gen_random_uuid(), null, 'Tom',    'user'),
    (gen_random_uuid(), null, 'Mike',   'user'),
    (gen_random_uuid(), null, 'Amy',    'user'),
    (gen_random_uuid(), null, 'Kate',   'user'),
    (gen_random_uuid(), null, 'Chris',  'user');

end $$;
