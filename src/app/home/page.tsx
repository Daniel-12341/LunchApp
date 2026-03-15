import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import NameSelectorLoader from '@/components/NameSelectorLoader'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/')

  return <NameSelectorLoader />
}
