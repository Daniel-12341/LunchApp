import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

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

  if (profile?.role !== 'admin') redirect('/home')

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-6xl mb-4">🔧</div>
        <h1 className="text-4xl font-extrabold text-orange-700 mb-3">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-500">Coming in Phase 4</p>
      </div>
    </div>
  )
}
