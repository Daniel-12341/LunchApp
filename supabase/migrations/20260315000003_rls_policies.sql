-- Migration: RLS policies for orders table
-- Plan: 01-01 (Foundation - Schema)
-- IMPORTANT: Admin role checks use auth_user_id (not id) to join profiles to auth.users,
-- because profiles.id is a plain UUID (not a FK to auth.users) for org members.

-- SELECT: users read their own orders, admins read all orders
create policy "Users can view own orders"
  on public.orders for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (
      select role from public.profiles
      where auth_user_id = (select auth.uid())
    ) = 'admin'
  );

-- INSERT: users can only insert orders attributed to themselves
create policy "Users can insert own orders"
  on public.orders for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- UPDATE (user): users can update their own orders
create policy "Users can update own orders"
  on public.orders for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- UPDATE (admin): admins can update any order (e.g. archiving)
create policy "Admin can update all orders"
  on public.orders for update
  to authenticated
  using (
    (select role from public.profiles where auth_user_id = (select auth.uid())) = 'admin'
  );
