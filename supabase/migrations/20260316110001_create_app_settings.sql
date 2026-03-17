-- App settings table (single row)
CREATE TABLE public.app_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  active_restaurants text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Insert default row — no restaurants active (all greyed out until admin picks)
INSERT INTO public.app_settings (id, active_restaurants) VALUES (1, '{}');

-- Allow all authenticated users to read settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings"
  ON public.app_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can update settings"
  ON public.app_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.auth_user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
