-- Update admin credentials from admin/admin123 to username123/password123
-- The app login form constructs email as ${username}@lunchapp.com
-- So username123 maps to username123@lunchapp.com

-- Update auth.users email and password
UPDATE auth.users
SET
  email = 'username123@lunchapp.com',
  encrypted_password = extensions.crypt('password123', extensions.gen_salt('bf')),
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  updated_at = now()
WHERE email = 'admin@lunchapp.com';

-- Update auth.identities to match new email
UPDATE auth.identities
SET
  identity_data = jsonb_set(
    jsonb_set(identity_data, '{email}', '"username123@lunchapp.com"'),
    '{email_verified}', 'true'
  ),
  email = 'username123@lunchapp.com',
  updated_at = now()
WHERE email = 'admin@lunchapp.com';

-- Update profiles username
UPDATE public.profiles
SET username = 'username123'
WHERE username = 'admin';
