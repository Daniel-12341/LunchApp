'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import confetti from 'canvas-confetti'
import { createClient } from '@/utils/supabase/client'
import { MENU, MenuItem } from '@/data/menu'
import { getPreviousOrder, saveOrder } from '@/utils/orderActions'

type PreviousOrder = {
  meal_name: string
  meal_category: string
  price: number
  customisation: string | null
}

type SpinItem = {
  item: MenuItem
  catIdx: number
  itemIdx: number
}

type SelectedItem = {
  categoryIndex: number
  itemIndex: number
  useAltPrice?: boolean
}

type Step = 'select' | 'confirm' | 'success' | 'done'

interface OrderPageClientProps {
  name: string
  userId: string
}

const FOOD_BACKGROUNDS = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=70', // pizza
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=70', // pizza 2
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1200&q=70', // pasta
  'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=70', // pasta 2
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=70', // salad
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1200&q=70', // panini
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=70', // food spread
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=1200&q=70', // food platter
]

export default function OrderPageClient({ name, userId }: OrderPageClientProps) {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)
  const [bgImage] = useState(() => FOOD_BACKGROUNDS[Math.floor(Math.random() * FOOD_BACKGROUNDS.length)])
  const [activeTab, setActiveTab] = useState(0)
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null)
  const [specialRequests, setSpecialRequests] = useState('')
  const [previousOrder, setPreviousOrder] = useState<PreviousOrder | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinDisplayItem, setSpinDisplayItem] = useState<SpinItem | null>(null)
  const [spinFading, setSpinFading] = useState(false)
  const [step, setStep] = useState<Step>('select')
  const [pendingOrder, setPendingOrder] = useState<null | {
    mealName: string
    mealCategory: string
    price: number
    customisation: string
    userId: string
    selectedName: string
  }>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    getPreviousOrder(name).then(({ data }) => {
      if (data) setPreviousOrder(data)
    })
  }, [name])

  const allItems: SpinItem[] = MENU.flatMap((cat, catIdx) =>
    cat.items.map((item, itemIdx) => ({ item, catIdx, itemIdx }))
  )

  function handleSurpriseMe() {
    if (isSpinning) return
    setIsSpinning(true)
    setSpinFading(false)
    const winner = allItems[Math.floor(Math.random() * allItems.length)]
    const totalTicks = 20
    let tick = 0

    const interval = setInterval(() => {
      const random = allItems[Math.floor(Math.random() * allItems.length)]
      setSpinDisplayItem(random)
      tick++
      if (tick >= totalTicks) {
        clearInterval(interval)
        setSpinDisplayItem(winner)
        setIsSpinning(false)
        setSelectedItem({ categoryIndex: winner.catIdx, itemIndex: winner.itemIdx })
        setActiveTab(winner.catIdx)
        setTimeout(() => {
          setSpinFading(true)
          setTimeout(() => setSpinDisplayItem(null), 500)
        }, 1000)
      }
    }, 80)
  }

  function handleSelectItem(catIdx: number, itemIdx: number) {
    if (
      selectedItem?.categoryIndex === catIdx &&
      selectedItem?.itemIndex === itemIdx
    ) {
      setSelectedItem(null)
    } else {
      setSelectedItem({ categoryIndex: catIdx, itemIndex: itemIdx })
    }
  }

  function handleReSelectPrevious() {
    if (!previousOrder) return
    const catIdx = MENU.findIndex(cat => cat.name === previousOrder.meal_category)
    if (catIdx === -1) return
    const itemIdx = MENU[catIdx].items.findIndex(item => item.name === previousOrder.meal_name)
    if (itemIdx === -1) return
    setSelectedItem({ categoryIndex: catIdx, itemIndex: itemIdx })
    setActiveTab(catIdx)
    if (previousOrder.customisation) {
      setSpecialRequests(previousOrder.customisation)
    }
  }

  function handleToggleAltPrice(e: React.MouseEvent) {
    e.stopPropagation()
    if (!selectedItem) return
    setSelectedItem(prev => prev ? { ...prev, useAltPrice: !prev.useAltPrice } : null)
  }

  function handleSubmit() {
    if (!selectedItem) return
    const cat = MENU[selectedItem.categoryIndex]
    const item = cat.items[selectedItem.itemIndex]
    const price = selectedItem.useAltPrice && item.priceAlt ? item.priceAlt : item.price
    const order = {
      mealName: item.name,
      mealCategory: cat.name,
      price,
      customisation: specialRequests,
      userId,
      selectedName: name,
    }
    setPendingOrder(order)
    setSubmitError(null)
    setStep('confirm')
  }

  async function handleConfirm() {
    if (!pendingOrder) return
    setIsSubmitting(true)
    setSubmitError(null)

    const result = await saveOrder({
      userId: pendingOrder.userId,
      selectedName: pendingOrder.selectedName,
      mealCategory: pendingOrder.mealCategory,
      mealName: pendingOrder.mealName,
      price: pendingOrder.price,
      customisation: pendingOrder.customisation || undefined,
    })

    if (result.error) {
      setSubmitError(result.error)
      setIsSubmitting(false)
      return
    }

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D4E000', '#E8F540', '#FFFF66', '#0B1C3E', '#122350'],
    })
    setIsSubmitting(false)
    setStep('success')
  }

  function handleDone() {
    setStep('done')
  }

  const currentItem = selectedItem
    ? MENU[selectedItem.categoryIndex].items[selectedItem.itemIndex]
    : null
  const selectedPrice = currentItem
    ? (selectedItem?.useAltPrice && currentItem.priceAlt ? currentItem.priceAlt : currentItem.price)
    : null

  const previousCatEmoji = previousOrder
    ? MENU.find(cat => cat.name === previousOrder.meal_category)?.emoji ?? ''
    : ''

  // Confirmation screen
  if (step === 'confirm' && pendingOrder) {
    const confirmCat = MENU.find(c => c.name === pendingOrder.mealCategory)
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
        <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="fixed inset-0 bg-riivo-navy/90" />
        <div className="relative z-10 w-full max-w-md bg-riivo-navy-light border border-riivo-border rounded-2xl shadow-lg p-6 space-y-5">
          <div className="text-center">
            <div className="text-3xl mb-2">📋</div>
            <h2 className="text-xl font-fredoka text-riivo-white">Review Your Order</h2>
            <p className="text-sm text-riivo-muted mt-1">Looks good? Lock it in!</p>
          </div>

          <div className="bg-riivo-navy rounded-xl border border-riivo-border p-4 space-y-3">
            <div>
              <div className="text-xs font-semibold text-riivo-yellow uppercase tracking-wide mb-1">Meal</div>
              <div className="text-lg font-bold text-riivo-white">{pendingOrder.mealName}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-riivo-yellow uppercase tracking-wide mb-1">Category</div>
              <div className="text-sm text-riivo-muted">
                {confirmCat?.emoji} {pendingOrder.mealCategory}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-riivo-yellow uppercase tracking-wide mb-1">Price</div>
              <div className="text-sm font-bold text-riivo-yellow">R{pendingOrder.price}</div>
            </div>
            {pendingOrder.customisation && (
              <div>
                <div className="text-xs font-semibold text-riivo-yellow uppercase tracking-wide mb-1">Special Requests</div>
                <div className="text-sm text-riivo-muted italic">{pendingOrder.customisation}</div>
              </div>
            )}
          </div>

          {submitError && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              Something went wrong: {submitError}. Please try again.
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setStep('select')}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl border border-riivo-yellow text-riivo-yellow font-semibold text-sm hover:bg-riivo-yellow/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-fredoka"
            >
              Go Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-riivo-yellow text-riivo-navy font-bold text-sm hover:brightness-110 shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-fredoka"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-riivo-navy" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                'Confirm Order'
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Success screen
  if (step === 'success' && pendingOrder) {
    const successCat = MENU.find(c => c.name === pendingOrder.mealCategory)
    return (
      <div className="min-h-screen relative flex items-center justify-center px-4 py-8">
        <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }} />
        <div className="fixed inset-0 bg-riivo-navy/90" />
        <div className="relative z-10 w-full max-w-md bg-riivo-navy-light border border-riivo-border rounded-2xl shadow-lg p-6 space-y-5 ring-2 ring-riivo-yellow/30">
          <div className="text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-fredoka font-bold text-riivo-yellow">Order Placed!</h2>
            <p className="text-sm text-riivo-muted mt-1">Your order is confirmed for this week.</p>
          </div>

          <div className="bg-riivo-navy rounded-xl border border-riivo-border p-4 space-y-3">
            <div>
              <div className="text-xs font-semibold text-riivo-yellow uppercase tracking-wide mb-1">Meal</div>
              <div className="text-lg font-bold text-riivo-white">{pendingOrder.mealName}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-riivo-yellow uppercase tracking-wide mb-1">Category</div>
              <div className="text-sm text-riivo-muted">
                {successCat?.emoji} {pendingOrder.mealCategory}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-riivo-yellow uppercase tracking-wide mb-1">Price</div>
              <div className="text-sm font-bold text-riivo-yellow">R{pendingOrder.price}</div>
            </div>
            {pendingOrder.customisation && (
              <div>
                <div className="text-xs font-semibold text-riivo-yellow uppercase tracking-wide mb-1">Special Requests</div>
                <div className="text-sm text-riivo-muted italic">{pendingOrder.customisation}</div>
              </div>
            )}
          </div>

          <button
            onClick={handleDone}
            className="w-full py-4 rounded-xl bg-riivo-yellow text-riivo-navy font-bold text-base hover:brightness-110 shadow-md transition-all active:scale-95 font-fredoka"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  // Done screen — faint overlay with food category background
  if (step === 'done' && pendingOrder) {
    const doneCat = MENU.find(c => c.name === pendingOrder.mealCategory)
    const categoryImages: Record<string, string> = {
      Pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
      Pasta: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
      Salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      Panini: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
    }
    const bgImage = categoryImages[pendingOrder.mealCategory] ?? categoryImages.Pizza

    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        {/* Faint overlay */}
        <div className="absolute inset-0 bg-riivo-navy/75 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative z-10 text-center px-6">
          <div className="text-6xl mb-6">{doneCat?.emoji ?? '🍽️'}</div>
          <h1 className="text-3xl font-extrabold text-riivo-white mb-3">
            Your weekly order is complete
          </h1>
          <p className="text-riivo-yellow text-lg font-semibold">
            {pendingOrder.mealName} — R{pendingOrder.price}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative pb-24">
      {/* Randomised faint food background */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div className="fixed inset-0 bg-riivo-navy/90" />

      {/* Page content */}
      <div className="relative z-10">

      {/* Header */}
      <div className="relative bg-riivo-navy-light/70 backdrop-blur-sm border-b border-riivo-border px-4 py-5 text-center">
        <button
          onClick={async () => {
            setSigningOut(true)
            const supabase = createClient()
            await supabase.auth.signOut()
            router.push('/')
            router.refresh()
          }}
          disabled={signingOut}
          className="absolute top-4 right-4 bg-riivo-navy-light/80 border border-riivo-border text-riivo-muted hover:text-riivo-white rounded-lg px-3 py-1.5 text-xs transition disabled:opacity-60"
        >
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
        <div className="text-3xl mb-1">🍽️</div>
        <h1 className="text-2xl font-fredoka font-bold text-riivo-yellow">
          Hey {name}! What&apos;s for lunch?
        </h1>
        <p className="text-sm text-riivo-muted mt-1">Pick your meal below</p>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* Shortcuts row */}
        <div className="flex gap-3 items-stretch">

          {/* Previous order card */}
          {previousOrder && (
            <button
              onClick={handleReSelectPrevious}
              className="flex-1 bg-riivo-navy-light rounded-xl shadow-sm border border-riivo-border p-3 text-left hover:border-riivo-yellow hover:shadow-md transition-all"
            >
              <div className="text-xs font-semibold font-fredoka text-riivo-yellow uppercase tracking-wide mb-1">
                My Previous Order
              </div>
              <div className="font-semibold text-riivo-white text-sm leading-tight">
                {previousCatEmoji} {previousOrder.meal_name}
              </div>
              <div className="text-xs text-riivo-muted mt-0.5">R{previousOrder.price}</div>
            </button>
          )}

          {/* Surprise Me button */}
          <button
            onClick={handleSurpriseMe}
            disabled={isSpinning}
            className={`flex-1 rounded-xl shadow-sm border font-bold text-sm py-3 px-4 transition-all flex flex-col items-center justify-center gap-1 font-fredoka
              ${isSpinning
                ? 'bg-riivo-navy-light border-riivo-border text-riivo-muted cursor-not-allowed'
                : 'bg-riivo-yellow border-riivo-yellow text-riivo-navy hover:brightness-110 hover:shadow-md active:scale-95'
              }`}
          >
            <span className="text-xl">🎲</span>
            <span>Surprise Me!</span>
          </button>
        </div>

        {/* Ticker display */}
        {(isSpinning || spinDisplayItem) && (
          <div
            className={`bg-riivo-navy-light rounded-xl shadow-sm border border-riivo-yellow/30 p-3 text-center transition-opacity duration-500
              ${spinFading ? 'opacity-0' : 'opacity-100'}`}
          >
            <div className="text-xs text-riivo-yellow font-semibold uppercase tracking-wide mb-1">
              {isSpinning ? 'Spinning...' : 'You got...'}
            </div>
            <div className="text-lg font-bold text-riivo-white">
              {spinDisplayItem
                ? `${MENU[spinDisplayItem.catIdx].emoji} ${spinDisplayItem.item.name}`
                : ''}
            </div>
            {spinDisplayItem && !isSpinning && (
              <div className="text-sm text-riivo-yellow mt-0.5">R{spinDisplayItem.item.price}</div>
            )}
          </div>
        )}

        {/* Tab bar */}
        <div className="bg-riivo-navy-light rounded-xl shadow-sm border border-riivo-border overflow-hidden">
          <div className="flex">
            {MENU.map((cat, idx) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 py-3 min-h-[44px] text-sm font-semibold font-fredoka transition-colors border-b-2
                  ${activeTab === idx
                    ? 'bg-riivo-yellow text-riivo-navy border-riivo-yellow'
                    : 'text-riivo-muted hover:text-riivo-white hover:bg-riivo-navy border-transparent'
                  }`}
              >
                <span className="block text-base">{cat.emoji}</span>
                <span className="block text-xs mt-0.5">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-riivo-navy-light rounded-xl shadow-sm border border-riivo-border overflow-hidden divide-y divide-riivo-border">
          {MENU[activeTab].items.map((item, itemIdx) => {
            const isSelected =
              selectedItem?.categoryIndex === activeTab &&
              selectedItem?.itemIndex === itemIdx
            const isCarbonaraSelected = isSelected && item.priceAlt !== undefined
            const displayPrice = isSelected && selectedItem?.useAltPrice && item.priceAlt
              ? item.priceAlt
              : item.price

            return (
              <button
                key={item.name}
                onClick={() => handleSelectItem(activeTab, itemIdx)}
                className={`w-full text-left px-4 py-3 transition-colors
                  ${isSelected
                    ? 'bg-riivo-yellow/10 border-l-4 border-riivo-yellow'
                    : 'hover:bg-riivo-navy border-l-4 border-transparent'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${isSelected ? 'text-riivo-yellow' : 'text-riivo-white'}`}>
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isSelected ? 'text-riivo-yellow' : 'text-riivo-muted'}`}>
                      R{displayPrice}
                    </span>
                    {isSelected && (
                      <span className="text-riivo-yellow text-base">✓</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-riivo-muted mt-0.5 leading-relaxed">{item.description}</p>

                {/* Carbonara cream toggle */}
                {isCarbonaraSelected && item.priceAlt && item.priceAltLabel && (
                  <div
                    className="mt-2 inline-flex items-center gap-2"
                    onClick={handleToggleAltPrice}
                  >
                    <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5
                      ${selectedItem?.useAltPrice ? 'bg-riivo-yellow' : 'bg-riivo-border'}`}
                    >
                      <div className={`w-3 h-3 bg-riivo-white rounded-full shadow transition-transform
                        ${selectedItem?.useAltPrice ? 'translate-x-4' : 'translate-x-0'}`}
                      />
                    </div>
                    <span className="text-xs text-riivo-muted">
                      {item.priceAltLabel} (+R{item.priceAlt - item.price})
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Special requests */}
        <div className="bg-riivo-navy-light rounded-xl shadow-sm border border-riivo-border p-4">
          <label className="block text-sm font-semibold font-fredoka text-riivo-muted mb-2">
            Special Requests
          </label>
          <textarea
            value={specialRequests}
            onChange={e => setSpecialRequests(e.target.value)}
            placeholder="Any special requests? (e.g. no onions, extra cheese)"
            rows={3}
            className="w-full text-sm text-riivo-white placeholder-riivo-muted/50 bg-riivo-navy border border-riivo-border rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-riivo-yellow focus:ring-1 focus:ring-riivo-yellow transition"
          />
        </div>

      </div>

      {/* Sticky submit button */}
      <div className="fixed bottom-0 left-0 right-0 bg-riivo-navy-light/90 backdrop-blur-sm border-t border-riivo-border px-4 py-3 shadow-lg">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!selectedItem}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all
              ${selectedItem
                ? 'bg-riivo-yellow text-riivo-navy hover:brightness-110 shadow-md active:scale-95'
                : 'bg-riivo-border text-riivo-muted cursor-not-allowed'
              }`}
          >
            {selectedItem && currentItem
              ? `Order ${currentItem.name} — R${selectedPrice}`
              : 'Select a meal to continue'
            }
          </button>
        </div>
      </div>

      </div>{/* close z-10 wrapper */}
    </div>
  )
}
