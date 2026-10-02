'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Percent,
  RefreshCw,
  Shield,
  ShieldAlert,
  UserCheck,
  Users,
  X,
} from 'lucide-react'
import { Navbar } from '@/components/settlex'
import { ProtectedRoute } from '@/components/auth/protected-route'
import {
  getMyMatches,
  acceptMatch,
  rejectMatch,
  Match,
  ApiError,
} from '@/lib/api'

function LenderMatchesContent() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [successBanner, setSuccessBanner] = useState<string | null>(null)

  const fetchMatches = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyMatches()
      setMatches(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to load incoming matches for your lending pool.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchMatches()
  }, [fetchMatches])

  async function handleAccept(match: Match) {
    setActionLoadingId(match.id)
    setError(null)
    setSuccessBanner(null)

    try {
      const updated = await acceptMatch(match.id)
      setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      setSuccessBanner(`Match #${match.id} accepted. Allocated capacity reserved.`)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to accept match.')
      }
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleReject(match: Match) {
    setActionLoadingId(match.id)
    setError(null)
    setSuccessBanner(null)

    try {
      const updated = await rejectMatch(match.id)
      setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
      setSuccessBanner(`Match #${match.id} rejected.`)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to reject match.')
      }
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 lg:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs text-sky-400">
              <Building2 size={13} /> Lender Operations
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
              Incoming Borrower Matches
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Review and manage loan requests identified as compatible with your active lending boundaries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/lender"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-white/20 hover:text-foreground"
            >
              Policy settings
            </Link>
            <button
              onClick={() => void fetchMatches()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/[0.02] px-4 py-2 text-xs font-medium text-foreground transition hover:border-primary/50 hover:bg-white/[0.05] disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Notifications */}
        {successBanner && (
          <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>{successBanner}</span>
            </div>
            <button
              onClick={() => setSuccessBanner(null)}
              className="text-xs text-emerald-400/80 hover:text-emerald-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-start justify-between gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <div className="flex items-start gap-2.5">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs text-destructive/80 hover:text-destructive"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Content States */}
        {loading ? (
          <div className="glass mt-10 flex flex-col items-center justify-center rounded-3xl border border-border p-16 text-center">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Retrieving incoming borrower matches...
            </p>
          </div>
        ) : matches.length === 0 ? (
          <div className="glass mt-10 rounded-3xl border border-border p-12 text-center sm:p-16">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-muted-foreground">
              <Users size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight">
              No incoming matches yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Borrower requests will appear here once our deterministic matching engine identifies requests compatible with your lending boundaries.
            </p>
            <div className="mt-6">
              <Link
                href="/lender"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground transition hover:border-primary/50"
              >
                Review lending boundaries
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <p className="text-xs text-muted-foreground">
              {matches.length} incoming {matches.length === 1 ? 'match' : 'matches'} recorded
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {matches.map((match) => {
                const scorePercent = Math.round(match.match_score * 100)
                const breakdown = match.score_breakdown
                const isAccepted = match.status === 'accepted'
                const isRejected = match.status === 'rejected'
                const isPending = match.status === 'pending'
                const isBusy = actionLoadingId === match.id

                return (
                  <div
                    key={match.id}
                    className={`glass relative flex flex-col justify-between rounded-3xl p-6 transition ${
                      isAccepted
                        ? 'border-emerald-500/40 bg-emerald-500/[0.03]'
                        : isRejected
                          ? 'opacity-60 border-border'
                          : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div>
                      {/* Top Bar */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Borrower Request #{match.borrower_id}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Match Reference #{match.id} · Created {new Date(match.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                            isAccepted
                              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : isRejected
                                ? 'border border-destructive/30 bg-destructive/10 text-destructive'
                                : 'border border-primary/30 bg-primary/10 text-primary'
                          }`}
                        >
                          {match.status}
                        </span>
                      </div>

                      {/* Compatibility Score Banner */}
                      <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 p-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
                            Deterministic compatibility score
                          </p>
                          <p className="mt-0.5 text-2xl font-semibold text-foreground">
                            {scorePercent}%
                          </p>
                        </div>
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                          <Percent size={18} />
                        </div>
                      </div>

                      {/* Factor Breakdown */}
                      {breakdown && (
                        <div className="mt-5 space-y-2.5">
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Compatibility Components
                          </p>
                          {[
                            ['Rate alignment', breakdown.interest],
                            ['Loan ticket size', breakdown.loan_amount],
                            ['Tenure accommodation', breakdown.tenure],
                            ['Collateral compatibility', breakdown.collateral],
                            ['Capacity coverage', breakdown.capacity],
                          ].map(([label, val]) => {
                            const pct = Math.round(Number(val) * 100)
                            return (
                              <div key={label as string} className="text-xs">
                                <div className="flex justify-between text-muted-foreground mb-1">
                                  <span>{label}</span>
                                  <span className="font-mono text-foreground">{pct}%</span>
                                </div>
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                                  <div
                                    className="h-full rounded-full bg-primary"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 border-t border-border pt-4">
                      {isAccepted ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 size={15} /> Capacity Allocated
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => void handleReject(match)}
                              disabled={isBusy}
                              className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive/40 hover:text-destructive disabled:opacity-50"
                            >
                              Revoke
                            </button>
                            <Link
                              href="/negotiation"
                              className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110"
                            >
                              Negotiation
                              <ArrowRight size={13} />
                            </Link>
                          </div>
                        </div>
                      ) : isPending ? (
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => void handleReject(match)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1 rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-destructive/40 hover:text-destructive disabled:opacity-50"
                          >
                            <X size={13} />
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleAccept(match)}
                            disabled={isBusy}
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
                          >
                            {isBusy ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Check size={13} />
                            )}
                            Accept match
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Match rejected</span>
                          <button
                            onClick={() => void handleAccept(match)}
                            disabled={isBusy}
                            className="rounded-full border border-border px-3 py-1 hover:border-primary/40 text-foreground"
                          >
                            Re-accept
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default function LenderMatchesPage() {
  return (
    <ProtectedRoute allowedRoles={['lender']}>
      <LenderMatchesContent />
    </ProtectedRoute>
  )
}
