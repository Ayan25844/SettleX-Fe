'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Building2, Check, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react'
import { Navbar } from '@/components/settlex'
import { registerUser, ApiError } from '@/lib/api'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'borrower' | 'lender'>('borrower')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errors: Record<string, string> = {}

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required'
    }

    if (!email.trim()) {
      errors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address'
    }

    if (!password) {
      errors.password = 'Password is required'
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long'
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirmation password is required'
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (role !== 'borrower' && role !== 'lender') {
      errors.role = 'Role must be either borrower or lender'
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
      await registerUser({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role,
      })

      // On success, redirect to login page with registered flag
      router.push('/login?registered=true')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          setErrorMessage('This email address is already registered. Please log in instead.')
        } else if (err.status === 422) {
          setErrorMessage(err.message || 'Please check your information and try again.')
        } else {
          setErrorMessage(err.message)
        }
      } else {
        setErrorMessage('Unable to connect to SettleX backend. Please verify the service is running.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-xl px-5 pb-20 pt-8 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/7 px-3 py-1.5 text-xs text-primary">
            <Sparkles size={13} /> SettleX Account Registration
          </div>
          <h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose your advocate profile to begin autonomous negotiation.
          </p>
        </div>

        <div className="glass mt-8 rounded-3xl p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                I am participating as
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('borrower')}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                    role === 'borrower'
                      ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary'
                      : 'border-border bg-white/[0.02] text-muted-foreground hover:border-white/20'
                  }`}
                >
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-xl ${
                      role === 'borrower' ? 'bg-primary/20 text-primary' : 'bg-white/5 text-muted-foreground'
                    }`}
                  >
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Borrower</p>
                    <p className="text-[11px] text-muted-foreground">Seeking optimal loan terms</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('lender')}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                    role === 'lender'
                      ? 'border-sky-400 bg-sky-400/10 text-foreground ring-1 ring-sky-400'
                      : 'border-border bg-white/[0.02] text-muted-foreground hover:border-white/20'
                  }`}
                >
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-xl ${
                      role === 'lender' ? 'bg-sky-400/20 text-sky-400' : 'bg-white/5 text-muted-foreground'
                    }`}
                  >
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lender</p>
                    <p className="text-[11px] text-muted-foreground">Setting policy & boundaries</p>
                  </div>
                </button>
              </div>
              {fieldErrors.role && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.role}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Full name
              </label>
              <input
                type="text"
                placeholder="e.g. Maya Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
                className="mt-1.5 h-12 w-full rounded-xl border border-border bg-white/[.035] px-4 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
              />
              {fieldErrors.fullName && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
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
                className="mt-1.5 h-12 w-full rounded-xl border border-border bg-white/[.035] px-4 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Password (min 8 characters)
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="mt-1.5 h-12 w-full rounded-xl border border-border bg-white/[.035] px-4 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground">
                Confirm password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="mt-1.5 h-12 w-full rounded-xl border border-border bg-white/[.035] px-4 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.confirmPassword}</p>
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
                  Creating account...
                </span>
              ) : (
                <>
                  Register as {role === 'borrower' ? 'Borrower' : 'Lender'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
