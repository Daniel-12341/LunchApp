'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PEOPLE, Person } from '@/data/people'
import MapComponent from '@/components/MapComponent'

export default function NameSelectorPage() {
  const router = useRouter()
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filtered = PEOPLE.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (person: Person) => {
    setSelectedPerson(person)
    setAnimationComplete(false)
    setSearch('')
    setIsOpen(false)
  }

  const handleAnimationEnd = () => {
    setAnimationComplete(true)
  }

  const handleContinue = () => {
    if (selectedPerson) {
      router.push('/order?name=' + encodeURIComponent(selectedPerson.name))
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen map */}
      <MapComponent
        people={PEOPLE}
        selectedPerson={selectedPerson}
        onAnimationEnd={handleAnimationEnd}
      />

      {/* Floating dropdown card — top center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-riivo-navy-light border border-riivo-border rounded-xl shadow-lg px-6 py-4 w-[min(90vw,320px)]">
        <h2 className="text-xl font-pacifico text-riivo-yellow mb-3">
          🍽️ Who&apos;s hungry?
        </h2>
        <div ref={dropdownRef} className="relative">
          <input
            type="text"
            value={isOpen ? search : selectedPerson?.name ?? ''}
            placeholder="Search for your name..."
            onFocus={() => {
              setIsOpen(true)
              setSearch('')
            }}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-riivo-border bg-riivo-navy rounded-lg px-3 py-2 text-riivo-white placeholder-riivo-muted/50 focus:outline-none focus:ring-2 focus:ring-riivo-yellow"
          />
          {isOpen && (
            <ul className="absolute top-full left-0 right-0 mt-1 bg-riivo-navy-light border border-riivo-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-riivo-muted text-sm">No match</li>
              ) : (
                filtered.map((person) => (
                  <li
                    key={person.name}
                    onClick={() => handleSelect(person)}
                    className="px-3 py-2 hover:bg-riivo-yellow/10 cursor-pointer text-riivo-white text-sm"
                  >
                    {person.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Continue button — bottom center, appears after animation */}
      {animationComplete && selectedPerson && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={handleContinue}
            className="bg-riivo-yellow hover:brightness-110 text-riivo-navy font-bold rounded-full px-8 py-3 min-h-[44px] shadow-lg transition-all duration-300 opacity-100 translate-y-0 font-fredoka"
            style={{ animation: 'slideUp 0.3s ease forwards' }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
