'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Loader2,
  Percent,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { Navbar } from '@/components/settlex'
import { ProtectedRoute } from '@/components/auth/protected-route'
import {
  findLenderMatches,
  acceptMatch,
  rejectMatch,
  MatchCandidate,
  ApiError,
} from '@/lib/api'

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function getScoreSummary(breakdown: MatchCandidate['score_breakdown']): string[] {
  const points: string[] = []

  if (breakdown.interest >= 0.8) {
    points.push('Strong interest-rate fit')
  } else if (breakdown.interest >= 0.5) {
    points.push('Moderate interest-rate alignment')
  } else {
    points.push('Tight interest margin')
  }

  if (breakdown.loan_amount >= 0.8) {
    points.push('Good loan-size fit')
  } else {
    points.push('Approaching ticket ceiling')
  }

  if (breakdown.tenure >= 0.8) {
    points.push('Compatible tenure range')
  } else {
    points.push('Constrained tenure')
  }

  if (breakdown.capacity >= 0.8) {
    points.push('Lending capacity available')
  } else {
    points.push('Limited pool capacity')
  }

  return points
}

function MatchesContent() {
  const router = useRouter()
  const [candidates, setCandidates] = useState<MatchCandidate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [serverMessage, setServerMessage] = useState<string | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)
  const [acceptedSuccessId, setAcceptedSuccessId] = useState<number | null>(null)

  const fetchMatches = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await findLenderMatches()
      setCandidates(response.matches)
      setServerMessage(response.message || null)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.message.toLowerCase().includes('profile not found')) {
          setError('Please complete your borrower profile before discovering matches.')
        } else if (err.status === 401) {
          setError('Your session has expired. Please log in again.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Unable to load compatible lenders. Please check backend connectivity.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchMatches()
  }, [fetchMatches])

  async function handleAccept(candidate: MatchCandidate) {
    setActionLoadingId(candidate.match_id)
    setError(null)

    try {
      const updatedMatch = await acceptMatch(candidate.match_id)

      // Store in sessionStorage for seamless handover to negotiation room
      sessionStorage.setItem('settlex.accepted_match', JSON.stringify(updatedMatch))

      if (candidate.lender_summary) {
        sessionStorage.setItem(
          'settlex.lender',
          JSON.stringify({
            max_loan_amount: candidate.lender_summary.max_loan_amount,
            min_interest_rate: candidate.lender_summary.min_interest_rate,
            max_tenure: candidate.lender_summary.max_tenure,
            min_expected_return: 1.15,
            collateral_required: candidate.lender_summary.collateral_required,
          }),
        )
      }

      setAcceptedSuccessId(candidate.match_id)
      setCandidates((prev) =>
        prev.map((c) =>
          c.match_id === candidate.match_id ? { ...c, status: 'accepted' } : c,
        ),
      )

      // Route to negotiation after brief visual confirmation
      setTimeout(() => {
        router.push('/negotiation')
      }, 700)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400 && err.message.toLowerCase().includes('insufficient')) {
          setError('This lender has insufficient capacity for your loan amount. Please choose another lender.')
        } else {
          setError(err.message)
        }
      } else {
        setError('Failed to accept match. Please try again.')
      }
    } finally {
      setActionLoadingId(null)
    }
  }

  async function handleReject(candidate: MatchCandidate) {
    setActionLoadingId(candidate.match_id)
    setError(null)

    try {
      const updatedMatch = await rejectMatch(candidate.match_id)
      setCandidates((prev) =>
        prev.map((c) =>
          c.match_id === candidate.match_id ? { ...c, status: updatedMatch.status as MatchCandidate['status'] } : c,
        ),
      )
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to reject match. Please try again.')
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
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/7 px-3 py-1.5 text-xs text-primary">
              <Sparkles size={13} /> SettleX Deterministic Matching
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
              Find your lending match
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              SettleX filtered lenders using your financial boundaries and ranked the compatible options.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/borrower"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-white/20 hover:text-foreground"
            >
              <ArrowLeft size={14} />
              Adjust boundaries
            </Link>
            <button
              onClick={() => void fetchMatches()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/[0.02] px-4 py-2 text-xs font-medium text-foreground transition hover:border-primary/50 hover:bg-white/[0.05] disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Re-scan
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
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

        {/* Loading State */}
        {loading ? (
          <div className="glass mt-10 flex flex-col items-center justify-center rounded-3xl border border-border p-16 text-center">
            <div className="relative mb-6">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary shadow-[0_0_30px_oklch(.48_.16_158_/_20%)] animate-pulse">
                <ShieldCheck size={32} />
              </div>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              Analyzing lender compatibility...
            </h2>
            <p className="mt-2 max-w-md text-xs leading-5 text-muted-foreground">
              Evaluating ticket ceilings, minimum acceptable rates, tenure constraints, and available lending pool capacities.
            </p>
          </div>
        ) : candidates.length === 0 ? (
          /* Empty / No Matches State */
          <div className="glass mt-10 rounded-3xl border border-border p-12 text-center sm:p-16">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-muted-foreground">
              <Building2 size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-[-.03em]">
              No compatible lenders found
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              No lender currently satisfies the financial constraints of this request. Try adjusting your maximum interest rate, loan amount, or preferred tenure.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/borrower"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                <ArrowLeft size={16} />
                Adjust financial boundaries
              </Link>
            </div>
          </div>
        ) : (
          /* Candidates Grid */
          <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {candidates.length} compatible {candidates.length === 1 ? 'lender' : 'lenders'} discovered
              </span>
              <span className="font-mono uppercase tracking-wider text-[11px] text-primary">
                Ranked by deterministic score
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {candidates.map((candidate, idx) => {
                const scorePercent = Math.round(candidate.match_score * 100)
                const breakdown = candidate.score_breakdown
                const summary = candidate.lender_summary
                const isAccepted = candidate.status === 'accepted'
                const isRejected = candidate.status === 'rejected'
                const isBusy = actionLoadingId === candidate.match_id
                const bullets = getScoreSummary(breakdown)

                return (
                  <div
                    key={candidate.match_id}
                    className={`glass relative flex flex-col justify-between rounded-3xl p-6 transition sm:p-7 ${
                      isAccepted
                        ? 'border-emerald-500/40 bg-emerald-500/[0.03] ring-1 ring-emerald-500/20'
                        : isRejected
                          ? 'opacity-60 border-border'
                          : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <div>
                      {/* Top Header: Rank & Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-xs font-mono font-semibold text-muted-foreground">
                            #{idx + 1}
                          </span>
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                              Lending Advocate
                            </p>
                            <p className="font-medium text-foreground">
                              Lender Pool #{candidate.lender_id}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                            isAccepted
                              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                              : isRejected
                                ? 'border border-destructive/30 bg-destructive/10 text-destructive'
                                : 'border border-primary/30 bg-primary/10 text-primary'
                          }`}
                        >
                          {candidate.status}
                        </span>
                      </div>

                      {/* Main Compatibility Score Box */}
                      <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                              Deterministic compatibility score
                            </p>
                            <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                              {scorePercent}%
                            </p>
                          </div>

                          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
                            <Percent size={20} />
                          </div>
                        </div>

                        {/* Concise Fit Explanations */}
                        <div className="mt-4 grid gap-1.5 border-t border-primary/15 pt-3">
                          {bullets.map((point) => (
                            <div
                              key={point}
                              className="flex items-center gap-2 text-xs text-muted-foreground"
                            >
                              <Check size={13} className="shrink-0 text-primary" />
                              <span>{point}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Compatibility Breakdown Bars */}
                      <div className="mt-6 space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Score Factor Breakdown
                        </p>

                        {[
                          ['Interest rate', breakdown.interest],
                          ['Loan ticket size', breakdown.loan_amount],
                          ['Tenure fit', breakdown.tenure],
                          ['Collateral policy', breakdown.collateral],
                          ['Capacity coverage', breakdown.capacity],
                        ].map(([label, val]) => {
                          const percentage = Math.round(Number(val) * 100)
                          return (
                            <div key={label as string} className="text-xs">
                              <div className="flex justify-between text-muted-foreground mb-1">
                                <span>{label}</span>
                                <span className="font-mono text-foreground">{percentage}%</span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                                <div
                                  className="h-full rounded-full bg-primary transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Lender Terms Summary (Authorized public view only) */}
                      {summary && (
                        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 text-xs sm:grid-cols-3">
                          <div>
                            <p className="text-muted-foreground">Max ticket size</p>
                            <p className="mt-1 font-semibold text-foreground">
                              {money.format(summary.max_loan_amount)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Min floor rate</p>
                            <p className="mt-1 font-semibold text-foreground">
                              {summary.min_interest_rate}% p.a.
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Max tenure</p>
                            <p className="mt-1 font-semibold text-foreground">
                              {summary.max_tenure} months
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Collateral</p>
                            <p className="mt-1 font-semibold text-foreground">
                              {summary.collateral_required ? 'Required' : 'Not required'}
                            </p>
                          </div>
                          {summary.available_capacity !== undefined && (
                            <div className="col-span-2">
                              <p className="text-muted-foreground">Pool available capacity</p>
                              <p className="mt-1 font-semibold text-foreground">
                                {money.format(summary.available_capacity)}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-8 border-t border-border pt-5">
                      {isAccepted ? (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                            <CheckCircle2 size={16} /> Match Accepted & Capacity Reserved
                          </span>
                          <Link
                            href="/negotiation"
                            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
                          >
                            Open negotiation
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => void handleReject(candidate)}
                            disabled={isBusy || isRejected}
                            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-destructive/40 hover:text-destructive disabled:opacity-40"
                          >
                            <X size={14} />
                            <span>{isRejected ? 'Declined' : 'Not interested'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleAccept(candidate)}
                            disabled={isBusy || isRejected}
                            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110 disabled:opacity-50"
                          >
                            {isBusy ? (
                              <>
                                <Loader2 size={14} className="animate-spin" />
                                <span>Reserving capacity...</span>
                              </>
                            ) : (
                              <>
                                <span>Choose this lender</span>
                                <ArrowRight size={14} />
                              </>
                            )}
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

export default function MatchesPage() {
  return (
    <ProtectedRoute allowedRoles={['borrower']}>
      <MatchesContent />
    </ProtectedRoute>
  )
}
