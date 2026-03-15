'use server'

import { createClient } from '@/utils/supabase/server'

function getISOWeekNumber(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return { week, year: d.getUTCFullYear() }
}

export async function saveOrder(payload: {
  userId: string
  selectedName: string
  mealCategory: string
  mealName: string
  price: number
  customisation?: string
}): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { week, year } = getISOWeekNumber(new Date())

  const { error } = await supabase.from('orders').insert({
    user_id: payload.userId,
    selected_name: payload.selectedName,
    meal_category: payload.mealCategory,
    meal_name: payload.mealName,
    price: payload.price,
    customisation: payload.customisation ?? null,
    week_number: week,
    year,
  })

  if (error) {
    return { error: error.message }
  }
  return {}
}

export async function getPreviousOrder(selectedName: string): Promise<{
  data: { meal_name: string; meal_category: string; price: number; customisation: string | null } | null
  error?: string
}> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select('meal_name, meal_category, price, customisation')
    .eq('selected_name', selectedName)
    .eq('archived', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return { data: null, error: error.message }
  }
  return { data }
}
