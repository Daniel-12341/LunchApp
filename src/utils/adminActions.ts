'use server'

import { createClient } from '@/utils/supabase/server'

export type Order = {
  id: string
  selected_name: string
  meal_category: string
  meal_name: string
  price: number
  customisation: string | null
  created_at: string
}

function getISOWeekNumber(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return { week, year: d.getUTCFullYear() }
}

export async function getWeeklyOrders(): Promise<{ data: Order[]; week: number; year: number; error?: string }> {
  const supabase = await createClient()
  const { week, year } = getISOWeekNumber(new Date())

  const { data, error } = await supabase
    .from('orders')
    .select('id, selected_name, meal_category, meal_name, price, customisation, created_at')
    .eq('week_number', week)
    .eq('year', year)
    .eq('archived', false)
    .order('created_at', { ascending: true })

  if (error) {
    return { data: [], week, year, error: error.message }
  }
  return { data: data ?? [], week, year }
}

export async function archiveWeek(weekNumber: number, year: number): Promise<{ count: number; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .update({ archived: true })
    .eq('week_number', weekNumber)
    .eq('year', year)
    .eq('archived', false)
    .select('id')

  if (error) {
    return { count: 0, error: error.message }
  }
  return { count: data?.length ?? 0 }
}
