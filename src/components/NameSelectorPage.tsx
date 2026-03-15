'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PEOPLE, Person } from '@/data/people'
import MapComponent from '@/components/MapComponent'

export default function NameSelectorPage() {
  const router = useRouter()
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value
    if (!name) {
      setSelectedPerson(null)
      setAnimationComplete(false)
      return
    }
    const person = PEOPLE.find((p) => p.name === name) ?? null
    setSelectedPerson(person)
    setAnimationComplete(false)
  }

  const handleAnimationEnd = () => {
    setAnimationComplete(true)
  }

  const handleContinue = () => {
    if (selectedPerson) {
      router.push('/order?name=' + encodeURIComponent(selectedPerson.name))
    }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen map */}
      <MapComponent
        people={PEOPLE}
        selectedPerson={selectedPerson}
        onAnimationEnd={handleAnimationEnd}
      />

      {/* Floating dropdown card — top center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-xl shadow-lg px-6 py-4 min-w-[260px]">
        <h2 className="text-xl font-bold text-emerald-700 mb-3">
          🍽️ Who&apos;s hungry?
        </h2>
        <select
          value={selectedPerson?.name ?? ''}
          onChange={handleSelectChange}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        >
          <option value="" disabled>
            Choose your name...
          </option>
          {PEOPLE.map((person) => (
            <option key={person.name} value={person.name}>
              {person.emoji} {person.name}
            </option>
          ))}
        </select>
      </div>

      {/* Continue button — bottom center, appears after animation */}
      {animationComplete && selectedPerson && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleContinue}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full px-8 py-3 shadow-lg transition-all duration-300 opacity-100 translate-y-0"
            style={{ animation: 'slideUp 0.3s ease forwards' }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
