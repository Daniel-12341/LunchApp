'use client'

import dynamic from 'next/dynamic'

const NameSelectorPage = dynamic(() => import('@/components/NameSelectorPage'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-emerald-50 animate-pulse" />
  ),
})

export default function HomePage() {
  return <NameSelectorPage />
}
