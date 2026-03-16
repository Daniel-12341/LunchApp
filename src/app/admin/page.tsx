import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getWeeklyOrders } from '@/utils/adminActions'
import AdminPageClient from './AdminPageClient'

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('auth_user_id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  const { data: orders, week, year } = await getWeeklyOrders()

  return <AdminPageClient orders={orders} weekNumber={week} year={year} />
}
