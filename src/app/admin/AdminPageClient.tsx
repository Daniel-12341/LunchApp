'use client'

import { useState } from 'react'
import { PEOPLE } from '@/data/people'
import { archiveWeek } from '@/utils/adminActions'

export type Order = {
  id: string
  selected_name: string
  meal_category: string
  meal_name: string
  price: number
  customisation: string | null
  created_at: string
}

interface Props {
  orders: Order[]
  weekNumber: number
  year: number
}

const CATEGORY_EMOJIS: Record<string, string> = {
  Pizza: '🍕',
  Pasta: '🍝',
  Salad: '🥗',
  Panini: '🥖',
}

const CATEGORY_ORDER = ['Pizza', 'Pasta', 'Salad', 'Panini']

function buildWhatsAppMessage(orders: Order[]): string {
  const grouped = CATEGORY_ORDER.reduce<Record<string, Order[]>>((acc, cat) => {
    acc[cat] = orders.filter(o => o.meal_category === cat)
    return acc
  }, {})

  const lines: string[] = ["*This Week's Lunch Orders*", '']
  for (const cat of CATEGORY_ORDER) {
    const catOrders = grouped[cat]
    if (catOrders.length === 0) continue
    lines.push(`${CATEGORY_EMOJIS[cat]} *${cat}*`)
    for (const o of catOrders) {
      const special = o.customisation ? ` (${o.customisation})` : ''
      lines.push(`• ${o.selected_name} — ${o.meal_name} R${o.price}${special}`)
    }
    lines.push('')
  }

  const total = orders.reduce((sum, o) => sum + Number(o.price), 0)
  lines.push(`Total: R${total} (${orders.length} orders)`)
  return lines.join('\n')
}

export default function AdminPageClient({ orders: initialOrders, weekNumber, year }: Props) {
  const [currentOrders, setCurrentOrders] = useState<Order[]>(initialOrders)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [archiveSuccess, setArchiveSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

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

  // Empty state
  if (currentOrders.length === 0) {
    return (
      <div className="min-h-screen bg-riivo-navy flex items-center justify-center">
        <div className="text-center px-6">
          {archiveSuccess ? (
            <>
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-pacifico text-riivo-yellow mb-2">Week archived successfully!</h2>
              <p className="text-riivo-muted">Fresh week started.</p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">🍽️</div>
              <h2 className="text-2xl font-pacifico text-riivo-yellow mb-2">No orders yet this week.</h2>
              <p className="text-riivo-muted">Check back once the team starts ordering.</p>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-riivo-navy">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-pacifico text-riivo-yellow mb-1">Admin Dashboard</h1>
          <p className="text-riivo-muted text-sm">
            This Week&apos;s Orders ({currentOrders.length} of 18)
          </p>
        </div>

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
                  {CATEGORY_EMOJIS[order.meal_category] ?? '🍴'}
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
