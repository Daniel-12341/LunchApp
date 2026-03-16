-- Add restaurant column to orders table
ALTER TABLE public.orders
  ADD COLUMN restaurant text DEFAULT NULL;

-- Backfill existing orders as posticino (original restaurant)
UPDATE public.orders SET restaurant = 'posticino' WHERE restaurant IS NULL;
