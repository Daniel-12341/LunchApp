'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-riivo-navy" />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const name = searchParams.get('name') ?? ''
  const prefillEmail = name ? `${name.toLowerCase()}@riivo.io` : ''

  const [email, setEmail] = useState(prefillEmail)
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail)
  }, [prefillEmail])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (!email.toLowerCase().endsWith('@riivo.io')) {
      setErrorMsg('Only @riivo.io email addresses are allowed.')
      return
    }

    setIsLoading(true)

    const supabase = createClient()
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    })

    if (error) {
      setErrorMsg('Oops! Wrong email or password. Try again.')
      setIsLoading(false)
      return
    }

    // Check if user is admin — route to /admin, otherwise /order
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('auth_user_id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      setIsAdmin(true)
      setIsLoading(false)
      return
    }

    router.push('/restaurant?name=' + encodeURIComponent(name))
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
          {isAdmin ? (
            <>
              {/* Admin choice */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-3">👋</div>
                <h1 className="text-3xl font-fredoka font-bold text-riivo-yellow tracking-tight">
                  Hey {name || 'Admin'}!
                </h1>
                <p className="text-riivo-muted mt-2 text-sm font-fredoka">
                  What would you like to do?
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/restaurant?name=' + encodeURIComponent(name))}
                  className="w-full bg-riivo-yellow hover:brightness-110 text-riivo-navy font-bold py-4 px-6 rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-3 text-lg font-fredoka"
                >
                  <span className="text-2xl">🍽️</span>
                  Place My Order
                </button>
                <button
                  onClick={() => router.push('/admin')}
                  className="w-full bg-riivo-navy border-2 border-riivo-yellow text-riivo-yellow font-bold py-4 px-6 rounded-xl shadow-md transition hover:bg-riivo-yellow/10 active:scale-95 flex items-center justify-center gap-3 text-lg font-fredoka"
                >
                  <span className="text-2xl">📊</span>
                  Admin Dashboard
                </button>
              </div>

              <button
                onClick={async () => {
                  const supabase = createClient()
                  await supabase.auth.signOut()
                  setIsAdmin(false)
                  setPassword('')
                }}
                className="mt-4 w-full text-center text-riivo-muted hover:text-riivo-white text-sm transition"
              >
                &larr; Sign out
              </button>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-5xl mb-3">🍽️</div>
                <h1 className="text-3xl font-fredoka font-bold text-riivo-yellow tracking-tight">
                  What&apos;s for lunch?
                </h1>
                {name && (
                  <p className="text-riivo-muted mt-2 text-sm font-fredoka">
                    Sign in as <span className="text-riivo-white font-semibold">{name}</span>
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-riivo-muted mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@riivo.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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

              {/* Back link */}
              <button
                onClick={() => router.push('/')}
                className="mt-4 w-full text-center text-riivo-muted hover:text-riivo-white text-sm transition"
              >
                &larr; Back to map
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
