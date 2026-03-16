'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { RESTAURANTS } from '@/data/menu'
import { createClient } from '@/utils/supabase/client'

export default function RestaurantPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-riivo-navy" />}>
      <RestaurantSelector />
    </Suspense>
  )
}

function RestaurantSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') ?? ''
  const [selected, setSelected] = useState<string | null>(null)
  const [activeRests, setActiveRests] = useState<string[] | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('app_settings')
      .select('active_restaurants')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        setActiveRests(data?.active_restaurants ?? [])
      })
  }, [])

  function handleContinue() {
    if (!selected) return
    router.push(`/order?name=${encodeURIComponent(name)}&restaurant=${selected}`)
  }

  const loading = activeRests === null

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80)',
      }}
    >
      <div className="absolute inset-0 bg-riivo-navy/85 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-5xl mb-3">🍽️</div>
          <h1 className="text-3xl font-fredoka font-bold text-riivo-yellow tracking-tight">
            Where are we eating?
          </h1>
          {name && (
            <p className="text-riivo-muted mt-2 text-sm font-fredoka">
              Choose a restaurant, <span className="text-riivo-white font-semibold">{name}</span>
            </p>
          )}
        </div>

        {/* Restaurant cards */}
        <div className="space-y-3">
          {RESTAURANTS.map((r) => {
            const isAvailable = !loading && activeRests.includes(r.id)
            const isDisabled = !loading && !isAvailable
            return (
              <button
                key={r.id}
                onClick={() => isAvailable && setSelected(r.id)}
                disabled={isDisabled || loading}
                className={`w-full text-left rounded-2xl border-2 p-5 transition-all
                  ${isDisabled
                    ? 'border-riivo-border/50 bg-riivo-navy-light/40 opacity-40 cursor-not-allowed'
                    : selected === r.id
                      ? 'border-riivo-yellow bg-riivo-yellow/10 shadow-lg shadow-riivo-yellow/10'
                      : 'border-riivo-border bg-riivo-navy-light/90 hover:border-riivo-yellow/50 hover:shadow-md'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-4xl ${isDisabled ? 'grayscale' : ''}`}>{r.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-fredoka font-bold ${
                        isDisabled ? 'text-riivo-muted/40' :
                        selected === r.id ? 'text-riivo-yellow' : 'text-riivo-white'
                      }`}>
                        {r.name}
                      </span>
                      {isDisabled && (
                        <span className="text-xs text-riivo-muted/50 font-fredoka">Not available this week</span>
                      )}
                      {selected === r.id && (
                        <span className="text-riivo-yellow text-lg">✓</span>
                      )}
                    </div>
                    <p className={`text-sm mt-0.5 ${isDisabled ? 'text-riivo-muted/30' : 'text-riivo-muted'}`}>{r.tagline}</p>
                    <p className={`text-xs mt-1 ${isDisabled ? 'text-riivo-muted/20' : 'text-riivo-muted/60'}`}>
                      {r.menu.length} categories · {r.menu.reduce((sum, c) => sum + c.items.length, 0)} items
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {!loading && activeRests.length === 0 && (
          <p className="text-center text-amber-400 text-sm font-fredoka">
            No restaurants available yet — check back soon!
          </p>
        )}

        {/* Continue button */}
        <button
          onClick={handleContinue}
          disabled={!selected}
          className={`w-full py-4 rounded-xl font-bold text-lg font-fredoka transition-all
            ${selected
              ? 'bg-riivo-yellow text-riivo-navy hover:brightness-110 shadow-md active:scale-95'
              : 'bg-riivo-border text-riivo-muted cursor-not-allowed'
            }`}
        >
          {selected
            ? `Let's eat at ${RESTAURANTS.find(r => r.id === selected)?.name}`
            : 'Pick a restaurant'}
        </button>

        {/* Back link */}
        <button
          onClick={() => router.back()}
          className="w-full text-center text-riivo-muted hover:text-riivo-white text-sm transition"
        >
          &larr; Go back
        </button>
      </div>
    </div>
  )
}
