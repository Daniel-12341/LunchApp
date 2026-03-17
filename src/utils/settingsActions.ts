'use server'

import { createClient } from '@/utils/supabase/server'

export async function getActiveRestaurants(): Promise<{ data: string[]; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('app_settings')
    .select('active_restaurants')
    .eq('id', 1)
    .single()

  if (error) {
    return { data: [], error: error.message }
  }
  return { data: data?.active_restaurants ?? [] }
}

export async function setActiveRestaurants(restaurants: string[]): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('app_settings')
    .update({ active_restaurants: restaurants, updated_at: new Date().toISOString() })
    .eq('id', 1)

  if (error) {
    return { error: error.message }
  }
  return {}
}
