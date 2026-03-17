import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import OrderPageClient from './OrderPageClient'

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ name?: string; restaurant?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const params = await searchParams
  const name = params.name ?? 'Someone'
  const restaurant = params.restaurant ?? 'posticino'

  return <OrderPageClient name={name} userId={user.id} restaurant={restaurant} />
}
