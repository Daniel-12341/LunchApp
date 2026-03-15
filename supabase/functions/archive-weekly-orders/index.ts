import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ISO week calculation — must match src/utils/orderActions.ts exactly
function getISOWeekNumber(date: Date): { week: number; year: number } {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return { week, year: d.getUTCFullYear() }
}

Deno.serve(async (_req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Service role key bypasses RLS — required for admin-level bulk update
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { week, year } = getISOWeekNumber(new Date())

    const { data, error } = await supabase
      .from('orders')
      .update({ archived: true })
      .eq('week_number', week)
      .eq('year', year)
      .eq('archived', false)
      .select('id')

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const count = data?.length ?? 0

    return new Response(
      JSON.stringify({ ok: true, week, year, archived: count }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
