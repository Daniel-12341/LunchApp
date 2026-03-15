-- Enable required extensions
create extension if not exists pg_cron with schema pg_catalog;
create extension if not exists pg_net with schema extensions;

-- Schedule archive-weekly-orders Edge Function every Sunday at 21:00 UTC
--
-- IMPORTANT: This migration uses app.settings.supabase_url and
-- app.settings.service_role_key as Postgres custom settings.
-- These must be configured before running this migration, e.g.:
--   ALTER DATABASE postgres SET app.settings.supabase_url = 'https://<project-ref>.supabase.co';
--   ALTER DATABASE postgres SET app.settings.service_role_key = '<your-service-role-key>';
--
-- ALTERNATIVE (simpler): Skip this migration and create the cron job manually
-- in Supabase Dashboard > SQL Editor, substituting actual values directly:
--
--   select cron.schedule(
--     'archive-weekly-orders',
--     '0 21 * * 0',
--     $$
--     select net.http_post(
--       url := 'https://<project-ref>.supabase.co/functions/v1/archive-weekly-orders',
--       headers := jsonb_build_object(
--         'Content-Type', 'application/json',
--         'Authorization', 'Bearer <service-role-key>'
--       ),
--       body := '{}'::jsonb
--     ) as request_id;
--     $$
--   );
--
-- To verify the cron job is registered:
--   SELECT * FROM cron.job WHERE jobname = 'archive-weekly-orders';

select cron.schedule(
  'archive-weekly-orders',
  '0 21 * * 0',
  $$
  select net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/archive-weekly-orders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := '{}'::jsonb
  ) as request_id;
  $$
);
