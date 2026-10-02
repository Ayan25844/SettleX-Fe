'use client'

import React, { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, CheckCircle2, Lock, Sparkles, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/settlex'
import { loginUser, ApiError } from '@/lib/api'
import { useAuth } from '@/components/auth/auth-provider'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const isJustRegistered = searchParams.get('registered') === 'true'
  const redirectTarget = searchParams.get('redirect')

  function validate(): boolean {
    const errors: Record<string, string> = {}

    if (!email.trim()) {
      errors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const response = await loginUser(email.trim(), password)

      // Store in auth provider and local storage
      login(response.access_token, response.user)

      // Route based on role or safe redirect parameter
      const userRole = response.user.role

      if (redirectTarget && redirectTarget.startsWith('/')) {
        // Only allow redirect if it matches role privileges
        if (userRole === 'admin' && redirectTarget === '/admin') {
          router.push(redirectTarget)
          return
        }
        if (userRole === 'borrower' && ['/borrower', '/negotiation', '/agreement'].includes(redirectTarget)) {
          router.push(redirectTarget)
          return
        }
        if (userRole === 'lender' && ['/lender', '/negotiation', '/agreement'].includes(redirectTarget)) {
          router.push(redirectTarget)
          return
        }
      }

      // Default role routing
      if (userRole === 'admin') {
        router.push('/admin')
      } else if (userRole === 'borrower') {
        router.push('/borrower')
      } else if (userRole === 'lender') {
        router.push('/lender')
      } else {
        router.push('/')
      }
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setErrorMessage('Invalid email or password')
        } else if (err.status === 403) {
          setErrorMessage('Your account has been deactivated. Please contact an administrator.')
        } else if (err.status === 422) {
          setErrorMessage(err.message || 'Validation error. Please verify your credentials.')
        } else {
          setErrorMessage(err.message)
        }
      } else {
        setErrorMessage('Unable to connect to SettleX backend')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass mt-8 rounded-3xl p-6 sm:p-8">
      {isJustRegistered && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          <span>Account created successfully! Please sign in with your credentials.</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground">
            Email address
          </label>
          <input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            autoComplete="email"
            className="mt-1.5 h-12 w-full rounded-xl border border-border bg-white/[.035] px-4 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-medium text-muted-foreground">
              Password
            </label>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
            className="mt-1.5 h-12 w-full rounded-xl border border-border bg-white/[.035] px-4 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
          />
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              Signing in...
            </span>
          ) : (
            <>
              Sign in to SettleX
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-5 text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Register now
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-md px-5 pb-20 pt-10 lg:px-8">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
            <Lock size={22} />
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-.04em]">
            Sign in to SettleX
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your advocate dashboard and negotiation room.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="glass mt-8 rounded-3xl p-8 text-center text-sm text-muted-foreground">
              Loading login form...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  )
}
