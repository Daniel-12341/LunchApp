'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { PEOPLE } from '@/data/people'
import { archiveWeek } from '@/utils/adminActions'
import { setActiveRestaurants } from '@/utils/settingsActions'

export type Order = {
  id: string
  selected_name: string
  meal_category: string
  meal_name: string
  price: number
  customisation: string | null
  restaurant: string | null
  created_at: string
}

interface Props {
  orders: Order[]
  weekNumber: number
  year: number
  activeRestaurants: string[]
}

const RESTAURANT_LABELS: Record<string, { emoji: string; name: string }> = {
  posticino: { emoji: '🍕', name: 'Posticino' },
  tadka: { emoji: '🍛', name: 'Tadka' },
  prashad: { emoji: '🙏', name: 'Prashad' },
}

function buildWhatsAppMessage(orders: Order[]): string {
  // Group orders by restaurant
  const byRestaurant: Record<string, Order[]> = {}
  for (const o of orders) {
    const key = o.restaurant ?? 'posticino'
    if (!byRestaurant[key]) byRestaurant[key] = []
    byRestaurant[key].push(o)
  }

  const lines: string[] = ["This Week's Lunch Orders", '']

  for (const [restId, restOrders] of Object.entries(byRestaurant)) {
    const restLabel = RESTAURANT_LABELS[restId]
    const restName = restLabel ? `${restLabel.emoji} ${restLabel.name}` : restId
    lines.push(`═══ ${restName} ═══`)
    lines.push('')

    // Group by category within restaurant
    const byCategory: Record<string, Order[]> = {}
    for (const o of restOrders) {
      if (!byCategory[o.meal_category]) byCategory[o.meal_category] = []
      byCategory[o.meal_category].push(o)
    }

    for (const [cat, catOrders] of Object.entries(byCategory)) {
      lines.push(cat.toUpperCase())
      for (const o of catOrders) {
        const special = o.customisation ? ` (${o.customisation})` : ''
        lines.push(`- ${o.selected_name} - ${o.meal_name} R${o.price}${special}`)
      }
      lines.push('')
    }

    const restTotal = restOrders.reduce((sum, o) => sum + Number(o.price), 0)
    lines.push(`Subtotal: R${restTotal} (${restOrders.length} orders)`)
    lines.push('')
  }

  const total = orders.reduce((sum, o) => sum + Number(o.price), 0)
  lines.push(`Total: R${total} (${orders.length} orders)`)
  return lines.join('\n')
}

const ALL_RESTAURANT_IDS = ['posticino', 'tadka', 'prashad']

export default function AdminPageClient({ orders: initialOrders, weekNumber, year, activeRestaurants: initialActive }: Props) {
  const [signingOut, setSigningOut] = useState(false)
  const [currentOrders, setCurrentOrders] = useState<Order[]>(initialOrders)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [archiveSuccess, setArchiveSuccess] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeRests, setActiveRests] = useState<string[]>(initialActive)
  const [savingRests, setSavingRests] = useState(false)

  async function toggleRestaurant(id: string) {
    setSavingRests(true)
    const next = activeRests.includes(id)
      ? activeRests.filter(r => r !== id)
      : [...activeRests, id]
    const result = await setActiveRestaurants(next)
    if (!result.error) setActiveRests(next)
    setSavingRests(false)
  }

  async function toggleAllRestaurants() {
    setSavingRests(true)
    const allActive = ALL_RESTAURANT_IDS.every(id => activeRests.includes(id))
    const next = allActive ? [] : [...ALL_RESTAURANT_IDS]
    const result = await setActiveRestaurants(next)
    if (!result.error) setActiveRests(next)
    setSavingRests(false)
  }

  const orderedNames = new Set(currentOrders.map(o => o.selected_name))
  const stillToOrder = PEOPLE.map(p => p.name).filter(name => !orderedNames.has(name))

  const message = buildWhatsAppMessage(currentOrders)

  function handleWhatsApp() {
    const url = `https://wa.me/27711602891?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleArchive() {
    setIsArchiving(true)
    const result = await archiveWeek(weekNumber, year)
    setIsArchiving(false)
    if (!result.error) {
      setCurrentOrders([])
      setShowConfirm(false)
      setArchiveSuccess(true)
    }
  }

  // Restaurant toggle section (reused in empty and main views)
  const restaurantToggle = (
    <div className="bg-riivo-navy-light border border-riivo-border rounded-xl px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-fredoka font-bold text-riivo-yellow uppercase tracking-wide">
          Available Restaurants
        </h2>
        <button
          onClick={toggleAllRestaurants}
          disabled={savingRests}
          className="text-xs text-riivo-muted hover:text-riivo-white transition disabled:opacity-50"
        >
          {ALL_RESTAURANT_IDS.every(id => activeRests.includes(id)) ? 'Disable all' : 'Enable all'}
        </button>
      </div>
      <div className="flex gap-2">
        {ALL_RESTAURANT_IDS.map(id => {
          const label = RESTAURANT_LABELS[id]
          const isActive = activeRests.includes(id)
          return (
            <button
              key={id}
              onClick={() => toggleRestaurant(id)}
              disabled={savingRests}
              className={`flex-1 py-3 rounded-xl border-2 font-fredoka font-bold text-sm transition-all disabled:opacity-70
                ${isActive
                  ? 'border-riivo-yellow bg-riivo-yellow/15 text-riivo-yellow shadow-md'
                  : 'border-riivo-border bg-riivo-navy text-riivo-muted/40'
                }`}
            >
              <span className="block text-xl mb-0.5">{label?.emoji}</span>
              {label?.name}
            </button>
          )
        })}
      </div>
      {activeRests.length === 0 && (
        <p className="text-xs text-amber-400 mt-2 text-center">No restaurants enabled — users cannot order yet</p>
      )}
    </div>
  )

  // Empty state
  if (currentOrders.length === 0) {
    return (
      <div className="min-h-screen bg-riivo-navy flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center">
          {archiveSuccess ? (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-fredoka font-bold text-riivo-yellow mb-2">Week archived successfully!</h2>
              <p className="text-riivo-muted">Fresh week started.</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🍽️</div>
              <h2 className="text-2xl font-fredoka font-bold text-riivo-yellow mb-2">No orders yet this week.</h2>
              <p className="text-riivo-muted">Check back once the team starts ordering.</p>
            </>
          )}
        </div>
        <div className="w-full max-w-md">{restaurantToggle}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-riivo-navy">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-fredoka font-bold text-riivo-yellow mb-1">Admin Dashboard</h1>
            <p className="text-riivo-muted text-sm">
              This Week&apos;s Orders ({currentOrders.length} of 18)
            </p>
          </div>
          <button
            onClick={async () => {
              setSigningOut(true)
              const supabase = createClient()
              await supabase.auth.signOut()
              window.location.href = '/'
            }}
            disabled={signingOut}
            className="bg-riivo-navy-light/80 border border-riivo-border text-riivo-muted hover:text-riivo-white rounded-lg px-3 py-1.5 text-xs transition disabled:opacity-60 shrink-0"
          >
            {signingOut ? 'Signing out...' : 'Sign out'}
          </button>
        </div>

        {/* Restaurant availability */}
        <div className="mb-6">{restaurantToggle}</div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleWhatsApp}
            disabled={currentOrders.length === 0}
            className="flex-1 min-w-[140px] bg-riivo-yellow text-riivo-navy font-bold font-fredoka px-4 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            Send to WhatsApp
          </button>
          <button
            onClick={handleCopy}
            disabled={currentOrders.length === 0}
            className="flex-1 min-w-[140px] bg-riivo-navy-light border border-riivo-border text-riivo-white font-bold font-fredoka px-4 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-riivo-yellow transition-colors"
          >
            {copied ? 'Copied!' : 'Copy to clipboard'}
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={currentOrders.length === 0}
            className="flex-1 min-w-[140px] bg-riivo-navy-light border border-riivo-border text-riivo-muted font-bold font-fredoka px-4 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:border-red-400 hover:text-red-400 transition-colors"
          >
            Archive Week
          </button>
        </div>

        {/* Order list */}
        <div className="space-y-2 mb-6">
          {currentOrders.map(order => (
            <div
              key={order.id}
              className="bg-riivo-navy-light border border-riivo-border rounded-xl px-4 py-3"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl mt-0.5 flex-shrink-0">
                  {RESTAURANT_LABELS[order.restaurant ?? 'posticino']?.emoji ?? '🍴'}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-bold text-riivo-white">{order.selected_name}</span>
                    <span className="text-riivo-muted text-sm">{order.meal_name}</span>
                    <span className="text-riivo-yellow text-sm font-semibold ml-auto">R{order.price}</span>
                  </div>
                  {order.customisation && (
                    <p className="text-riivo-muted text-xs italic mt-1">{order.customisation}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Still to order */}
        {stillToOrder.length > 0 && (
          <div className="bg-riivo-navy-light border border-riivo-border rounded-xl px-4 py-3">
            <p className="text-riivo-muted text-sm">
              <span className="font-semibold text-riivo-white">Still to order ({stillToOrder.length}):</span>{' '}
              {stillToOrder.join(', ')}
            </p>
          </div>
        )}
      </div>

      {/* Confirmation dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-riivo-navy-light border border-riivo-border rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-riivo-white font-bold text-lg mb-2">Archive this week?</h3>
            <p className="text-riivo-muted text-sm mb-2">
              This will archive {currentOrders.length} orders and start a fresh week.
            </p>
            {stillToOrder.length > 0 && (
              <p className="text-amber-400 text-sm mb-4">
                {stillToOrder.length} {stillToOrder.length === 1 ? 'person hasn\'t' : 'people haven\'t'} ordered yet. Archive anyway?
              </p>
            )}
            {stillToOrder.length === 0 && <div className="mb-4" />}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                disabled={isArchiving}
                className="flex-1 bg-riivo-navy border border-riivo-border text-riivo-white font-bold px-4 py-2.5 rounded-xl text-sm hover:border-riivo-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleArchive}
                disabled={isArchiving}
                className="flex-1 bg-red-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isArchiving ? 'Archiving...' : 'Archive'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
