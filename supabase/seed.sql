-- Seed: Auth users + org member profiles
-- Plan: 02-01 (Name Selector - Data Foundation)
-- Creates 2 Supabase Auth accounts (user + admin) with matching auth.identities rows,
-- 1 admin profile, and 18 org member profiles (no auth accounts for org members).
--
-- Run after migrations: supabase db push (applies migrations then runs seed.sql)
-- Passwords: user@lunchapp.com / password  |  admin@lunchapp.com / admin123

create extension if not exists "pgcrypto" with schema extensions;

do $$
declare
  v_user_id  uuid := gen_random_uuid();
  v_admin_id uuid := gen_random_uuid();
  v_user_pw  text := extensions.crypt('password', extensions.gen_salt('bf'));
  v_admin_pw text := extensions.crypt('admin123', extensions.gen_salt('bf'));
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
  -- 18 org member profiles (no auth accounts — identity via Phase 2 name selector)
  -- auth_user_id is NULL for all org members
  -- ----------------------------------------------------------------
  insert into public.profiles (id, auth_user_id, username, role, location_name, lat, lng, emoji, fun_label) values
    (gen_random_uuid(), null, 'Andre',     'user', 'Paarl',          -33.7312, 18.9706, '🏉💪', 'Practicing his passes'),
    (gen_random_uuid(), null, 'Andrea',    'user', 'Rondebosch',     -33.9570, 18.4780, '👶❤️', 'Looking after Jack'),
    (gen_random_uuid(), null, 'Anastasia', 'user', 'Greyton',        -34.0382, 19.6102, '🎬🏡', 'Taking the best videos of Greyton'),
    (gen_random_uuid(), null, 'Angus',     'user', 'Rondebosch',     -33.9610, 18.4740, '💇✂️', 'Getting a fresh haircut'),
    (gen_random_uuid(), null, 'Chris',     'user', 'Greyton',        -34.0410, 19.6050, '🎭🔫', 'Loving Mafia!'),
    (gen_random_uuid(), null, 'Daniel',    'user', 'Stellenbosch',   -33.9321, 18.8602, '🏓🔥', 'Smashing padel balls'),
    (gen_random_uuid(), null, 'Dormehl',   'user', 'Sea Point',      -33.9180, 18.3850, '🧘🏋️', 'Practicing Pilates and gyming'),
    (gen_random_uuid(), null, 'Francois',  'user', 'Foreshore',      -33.9170, 18.4260, '🦾🏆', 'Hyrox man'),
    (gen_random_uuid(), null, 'James',     'user', 'In the sea',     -34.1500, 18.7000, '🐟🎣', 'The tuna specialist'),
    (gen_random_uuid(), null, 'Jenna',     'user', 'Somerset West',  -34.0825, 18.8430, '🥾⛰️', 'Hiker'),
    (gen_random_uuid(), null, 'Lloyd',     'user', 'Simonstown',     -34.1908, 18.4326, '💍🐧', 'Penguin town romantic'),
    (gen_random_uuid(), null, 'Luc',       'user', 'Sea Point',      -33.9210, 18.3810, '🏓🌊', 'Padel by the sea'),
    (gen_random_uuid(), null, 'Lungile',   'user', 'Rondebosch',     -33.9550, 18.4690, '😂🤪', 'Life of the party'),
    (gen_random_uuid(), null, 'Michael',   'user', 'Greyton',        -34.0350, 19.6130, '♟️🧠', 'Chess strategist'),
    (gen_random_uuid(), null, 'Natalia',   'user', 'Hermanus',       -34.4187, 19.2345, '🐋👀', 'Whale watching'),
    (gen_random_uuid(), null, 'Nic',       'user', 'Rondebosch',     -33.9520, 18.4710, '⭐👶👑', 'Baby leader'),
    (gen_random_uuid(), null, 'Oliver',    'user', 'Greyton',        -34.0430, 19.6080, '🔍🕵️', 'Murder mystery master'),
    (gen_random_uuid(), null, 'Rosie',     'user', 'Rondebosch',     -33.9590, 18.4790, '🎨🎭', 'Art, museums and theatre');

end $$;
