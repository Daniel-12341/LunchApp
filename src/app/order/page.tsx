import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function OrderPage({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const params = await searchParams
  const name = params.name ?? 'Someone'

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-6xl mb-4">🍕</div>
        <h1 className="text-4xl font-extrabold text-emerald-700 mb-3">
          Order coming soon!
        </h1>
        <p className="text-lg text-gray-500">
          Hang tight, {name} — this is where you will place your lunch order.
        </p>
      </div>
    </div>
  )
}
