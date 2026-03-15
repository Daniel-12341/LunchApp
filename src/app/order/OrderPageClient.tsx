'use client'

import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
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

type Step = 'select' | 'confirm' | 'success'

interface OrderPageClientProps {
  name: string
  userId: string
}

export default function OrderPageClient({ name, userId }: OrderPageClientProps) {
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
      colors: ['#10b981', '#34d399', '#6ee7b7', '#fbbf24', '#f59e0b'],
    })
    setIsSubmitting(false)
    setStep('success')
  }

  function handleDone() {
    setStep('select')
    setSelectedItem(null)
    setSpecialRequests('')
    setSubmitError(null)
    setPendingOrder(null)
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-5">
          <div className="text-center">
            <div className="text-3xl mb-2">📋</div>
            <h2 className="text-xl font-extrabold text-gray-800">Review Your Order</h2>
            <p className="text-sm text-gray-500 mt-1">Looks good? Lock it in!</p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 space-y-3">
            <div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Meal</div>
              <div className="text-lg font-bold text-gray-800">{pendingOrder.mealName}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Category</div>
              <div className="text-sm text-gray-700">
                {confirmCat?.emoji} {pendingOrder.mealCategory}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Price</div>
              <div className="text-sm font-bold text-emerald-700">R{pendingOrder.price}</div>
            </div>
            {pendingOrder.customisation && (
              <div>
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Special Requests</div>
                <div className="text-sm text-gray-600 italic">{pendingOrder.customisation}</div>
              </div>
            )}
          </div>

          {submitError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              Something went wrong: {submitError}. Please try again.
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={() => setStep('select')}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl border border-emerald-300 text-emerald-700 font-semibold text-sm hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Go Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-5 ring-2 ring-emerald-200">
          <div className="text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-extrabold text-emerald-600">Order Placed!</h2>
            <p className="text-sm text-gray-500 mt-1">Your order is confirmed for this week.</p>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 space-y-3">
            <div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Meal</div>
              <div className="text-lg font-bold text-gray-800">{pendingOrder.mealName}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Category</div>
              <div className="text-sm text-gray-700">
                {successCat?.emoji} {pendingOrder.mealCategory}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Price</div>
              <div className="text-sm font-bold text-emerald-700">R{pendingOrder.price}</div>
            </div>
            {pendingOrder.customisation && (
              <div>
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Special Requests</div>
                <div className="text-sm text-gray-600 italic">{pendingOrder.customisation}</div>
              </div>
            )}
          </div>

          <button
            onClick={handleDone}
            className="w-full py-4 rounded-xl bg-emerald-500 text-white font-bold text-base hover:bg-emerald-600 shadow-md transition-all active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 pb-24">

      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-emerald-100 px-4 py-5 text-center">
        <div className="text-3xl mb-1">🍽️</div>
        <h1 className="text-2xl font-extrabold text-emerald-700">
          Hey {name}! What&apos;s for lunch?
        </h1>
        <p className="text-sm text-emerald-500 mt-1">Pick your meal below</p>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">

        {/* Shortcuts row */}
        <div className="flex gap-3 items-stretch">

          {/* Previous order card */}
          {previousOrder && (
            <button
              onClick={handleReSelectPrevious}
              className="flex-1 bg-white rounded-xl shadow-sm border border-emerald-100 p-3 text-left hover:border-emerald-400 hover:shadow-md transition-all"
            >
              <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">
                My Previous Order
              </div>
              <div className="font-semibold text-gray-800 text-sm leading-tight">
                {previousCatEmoji} {previousOrder.meal_name}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">R{previousOrder.price}</div>
            </button>
          )}

          {/* Surprise Me button */}
          <button
            onClick={handleSurpriseMe}
            disabled={isSpinning}
            className={`flex-1 rounded-xl shadow-sm border font-bold text-sm py-3 px-4 transition-all flex flex-col items-center justify-center gap-1
              ${isSpinning
                ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-emerald-500 border-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md active:scale-95'
              }`}
          >
            <span className="text-xl">🎲</span>
            <span>Surprise Me!</span>
          </button>
        </div>

        {/* Ticker display */}
        {(isSpinning || spinDisplayItem) && (
          <div
            className={`bg-white rounded-xl shadow-sm border border-emerald-200 p-3 text-center transition-opacity duration-500
              ${spinFading ? 'opacity-0' : 'opacity-100'}`}
          >
            <div className="text-xs text-emerald-500 font-semibold uppercase tracking-wide mb-1">
              {isSpinning ? 'Spinning...' : 'You got...'}
            </div>
            <div className="text-lg font-bold text-gray-800">
              {spinDisplayItem
                ? `${MENU[spinDisplayItem.catIdx].emoji} ${spinDisplayItem.item.name}`
                : ''}
            </div>
            {spinDisplayItem && !isSpinning && (
              <div className="text-sm text-emerald-600 mt-0.5">R{spinDisplayItem.item.price}</div>
            )}
          </div>
        )}

        {/* Tab bar */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden">
          <div className="flex">
            {MENU.map((cat, idx) => (
              <button
                key={cat.name}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors
                  ${activeTab === idx
                    ? 'bg-emerald-500 text-white'
                    : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
              >
                <span className="block text-base">{cat.emoji}</span>
                <span className="block text-xs mt-0.5">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 overflow-hidden divide-y divide-gray-50">
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
                    ? 'bg-emerald-50 border-l-4 border-emerald-500'
                    : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-sm ${isSelected ? 'text-emerald-700' : 'text-gray-800'}`}>
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${isSelected ? 'text-emerald-600' : 'text-gray-600'}`}>
                      R{displayPrice}
                    </span>
                    {isSelected && (
                      <span className="text-emerald-500 text-base">✓</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.description}</p>

                {/* Carbonara cream toggle */}
                {isCarbonaraSelected && item.priceAlt && item.priceAltLabel && (
                  <div
                    className="mt-2 inline-flex items-center gap-2"
                    onClick={handleToggleAltPrice}
                  >
                    <div className={`w-8 h-4 rounded-full transition-colors flex items-center px-0.5
                      ${selectedItem?.useAltPrice ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full shadow transition-transform
                        ${selectedItem?.useAltPrice ? 'translate-x-4' : 'translate-x-0'}`}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {item.priceAltLabel} (+R{item.priceAlt - item.price})
                    </span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Special requests */}
        <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4">
          <label className="block text-sm font-semibold text-gray-600 mb-2">
            Special Requests
          </label>
          <textarea
            value={specialRequests}
            onChange={e => setSpecialRequests(e.target.value)}
            placeholder="Any special requests? (e.g. no onions, extra cheese)"
            rows={3}
            className="w-full text-sm text-gray-700 placeholder-gray-400 border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition"
          />
        </div>

      </div>

      {/* Sticky submit button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-emerald-100 px-4 py-3 shadow-lg">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={!selectedItem}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all
              ${selectedItem
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {selectedItem && currentItem
              ? `Order ${currentItem.name} — R${selectedPrice}`
              : 'Select a meal to continue'
            }
          </button>
        </div>
      </div>

    </div>
  )
}
