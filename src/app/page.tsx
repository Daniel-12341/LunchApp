'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    setIsLoading(true)

    const supabase = createClient()
    const email = `${username}@lunchapp.com`

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setErrorMsg('Oops! Wrong username or password. Try again.')
      setIsLoading(false)
      return
    }

    router.push('/home')
    router.refresh()
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&q=80)',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-riivo-navy/80 backdrop-blur-sm" />

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-riivo-navy-light/95 backdrop-blur border border-riivo-border rounded-2xl shadow-2xl px-8 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🍽️</div>
            <h1 className="text-3xl font-pacifico text-riivo-yellow tracking-tight">
              What&apos;s for lunch?
            </h1>
            <p className="text-riivo-muted mt-2 text-sm font-fredoka">
              Sign in to place your order
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-riivo-muted mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-riivo-border bg-riivo-navy px-4 py-3 text-riivo-white placeholder-riivo-muted/50 focus:outline-none focus:ring-2 focus:ring-riivo-yellow focus:border-transparent transition disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-riivo-muted mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full rounded-xl border border-riivo-border bg-riivo-navy px-4 py-3 text-riivo-white placeholder-riivo-muted/50 focus:outline-none focus:ring-2 focus:ring-riivo-yellow focus:border-transparent transition disabled:opacity-60"
              />
            </div>

            {/* Error message */}
            {errorMsg && (
              <p className="text-red-400 text-sm text-center font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {errorMsg}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-riivo-yellow hover:brightness-110 text-riivo-navy font-bold py-3 px-6 rounded-xl shadow-md transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-fredoka"
            >
              {isLoading ? (
                <>
                  <span className="inline-block w-5 h-5 border-2 border-riivo-navy border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Let's Eat!"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
