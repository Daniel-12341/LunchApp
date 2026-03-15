'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { Person } from '@/data/people'

interface FlyControllerProps {
  target: { lat: number; lng: number } | null
  zoom: number
  onAnimationEnd: () => void
}

function FlyController({ target, zoom, onAnimationEnd }: FlyControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (!target) return

    map.flyTo([target.lat, target.lng], zoom, { animate: true, duration: 2.5 })

    const handleMoveEnd = () => {
      onAnimationEnd()
      map.off('moveend', handleMoveEnd)
    }

    map.on('moveend', handleMoveEnd)

    return () => {
      map.off('moveend', handleMoveEnd)
    }
  }, [target, zoom, map, onAnimationEnd])

  return null
}

function createEmojiIcon(
  emoji: string,
  locationName: string,
  isSelected: boolean,
  isBouncing: boolean,
  hasSelection: boolean,
) {
  const stateClass = hasSelection
    ? isSelected
      ? 'marker-selected'
      : 'marker-dimmed'
    : ''
  const bounceClass = isBouncing ? 'marker-bounce' : ''

  return L.divIcon({
    html: `<div class="emoji-marker ${stateClass} ${bounceClass}">${emoji}<span class="marker-location">${locationName}</span></div>`,
    className: '',
    iconSize: [60, 50],
    iconAnchor: [30, 45],
  })
}

interface MapComponentProps {
  people: Person[]
  selectedPerson: Person | null
  onAnimationEnd: () => void
}

export default function MapComponent({
  people,
  selectedPerson,
  onAnimationEnd,
}: MapComponentProps) {
  const [bouncingName, setBouncingName] = useState<string | null>(null)

  const handleAnimationEnd = () => {
    if (selectedPerson) {
      setBouncingName(selectedPerson.name)
      setTimeout(() => setBouncingName(null), 2000)
    }
    onAnimationEnd()
  }

  return (
    <MapContainer
      center={[-33.9, 18.8]}
      zoom={9}
      style={{ height: '100vh', width: '100%' }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      {people.map((person) => (
        <Marker
          key={person.name}
          position={[person.lat, person.lng]}
          icon={createEmojiIcon(
            person.emoji,
            person.locationName,
            person.name === selectedPerson?.name,
            person.name === bouncingName,
            selectedPerson !== null,
          )}
        />
      ))}
      <FlyController
        target={
          selectedPerson
            ? { lat: selectedPerson.lat, lng: selectedPerson.lng }
            : null
        }
        zoom={14}
        onAnimationEnd={handleAnimationEnd}
      />
    </MapContainer>
  )
}
