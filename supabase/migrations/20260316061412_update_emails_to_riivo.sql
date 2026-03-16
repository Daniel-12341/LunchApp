-- Migration: Individual auth accounts for each team member
-- Each person gets name@riivo.io / password
-- Admin (Daniel) gets daniel@riivo.io / password123
-- Removes old shared user account and old admin account

-- Step 1: Delete old auth accounts (cascades to identities)
DELETE FROM auth.users WHERE email IN ('user@lunchapp.com', 'username123@lunchapp.com');

-- Step 2: Create individual auth accounts and link to profiles
DO $$
DECLARE
  v_pw text := extensions.crypt('password', extensions.gen_salt('bf'));
  v_admin_pw text := extensions.crypt('password123', extensions.gen_salt('bf'));
  v_id uuid;
  v_name text;
  v_email text;
  v_names text[] := ARRAY[
    'Anastasia','Andre','Andrea','Angus','Chris','Daniel','Dormehl',
    'Francois','James','Jenna','Lloyd','Luc','Lungile','Michael',
    'Natalia','Nic','Oliver','Rosie'
  ];
BEGIN
  FOREACH v_name IN ARRAY v_names LOOP
    v_id := gen_random_uuid();
    v_email := lower(v_name) || '@riivo.io';

    -- Create auth user
    INSERT INTO auth.users (
      id, instance_id, aud, role,
      email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at
    ) VALUES (
      v_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated',
      v_email,
      CASE WHEN v_name = 'Daniel' THEN v_admin_pw ELSE v_pw END,
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(), now()
    );

    -- Create identity (required for signInWithPassword)
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      v_id, v_id,
      format('{"sub":"%s","email":"%s"}', v_id, v_email)::jsonb,
      'email', v_id::text,
      now(), now(), now()
    );

    -- Link auth account to existing profile
    UPDATE public.profiles
    SET auth_user_id = v_id,
        role = CASE WHEN v_name = 'Daniel' THEN 'admin' ELSE 'user' END
    WHERE username = v_name;

  END LOOP;
END $$;
