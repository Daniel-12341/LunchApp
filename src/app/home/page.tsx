import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-6xl mb-4">🥗</div>
        <h1 className="text-4xl font-extrabold text-emerald-700 mb-3">
          Welcome to LunchApp!
        </h1>
        <p className="text-lg text-gray-500">
          Pick your name to get started
        </p>
      </div>
    </div>
  )
}
