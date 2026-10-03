'use client'

import React from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Gavel,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import {
  AgentCard,
  Navbar,
  ProgressIndicator,
  UtilityCard,
  Verifier,
} from '@/components/settlex'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useNegotiation } from '@/components/negotiation-connection'

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export default function Negotiation() {
  const { session, loading, isRunning, error, runNegotiation } = useNegotiation()

  const finalProposal = session?.final_proposal || session?.current_offer
  const verification = session?.verification

  const borrowerUtility = verification?.borrower_utility
  const lenderUtility = verification?.lender_utility
  const nashWelfare =
    borrowerUtility !== undefined && lenderUtility !== undefined
      ? (borrowerUtility * lenderUtility).toFixed(2)
      : '—'

  const hasValidAgreement =
    session?.agreement_found === true && verification?.valid === true

  return (
    <ProtectedRoute allowedRoles={['borrower', 'lender', 'admin']}>
      <main className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-8 lg:px-8">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">
                  {session ? `Live session · SX-SESSION-${session.session_id}` : 'Live session'}
                </p>
                {session?.demo_mode && (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    DEMO SIMULATION
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">
                SettleX Negotiation Room
              </h1>
            </div>

            <div className="flex items-center gap-2">
              {isRunning || loading ? (
                <div className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/7 px-3.5 py-2 text-xs text-primary">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
                  <span>
                    {session?.demo_mode
                      ? 'Deterministic simulation in progress'
                      : 'Negotiation in progress'}
                  </span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-xs text-destructive">
                  <AlertCircle size={14} />
                  <span>Negotiation error</span>
                </div>
              ) : hasValidAgreement ? (
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-400">
                  <CheckCircle2 size={14} />
                  <span>Agreement reached & verified</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-400">
                  <AlertTriangle size={14} />
                  <span>No agreement reached</span>
                </div>
              )}
            </div>
          </div>

          {/* Autonomous Advocates Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <AgentCard type="borrower" />
            <AgentCard type="lender" />
          </div>

          {/* Main Grid: Timeline + Right Panel (Utilities, Verifier) */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            {/* Timeline */}
            <div className="glass rounded-2xl p-5 sm:p-7">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">
                      Negotiation timeline
                    </p>
                    {session?.demo_mode && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                        DEMO SIMULATION
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-lg font-medium">
                    {hasValidAgreement
                      ? 'Advocate proposals converged inside the feasible zone'
                      : 'Autonomous advocates exchanging contract proposals'}
                  </h2>
                </div>
                <Gavel size={20} className="text-primary" />
              </div>

              <div className="mt-7 space-y-5">
                {/* Loading / In-Progress Skeleton when no history yet */}
                {(loading || isRunning) && (!session?.history || session.history.length === 0) && (
                  <div className="space-y-4 py-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Loader2 size={18} className="animate-spin text-primary" />
                      <span>
                        {session?.demo_mode
                          ? 'Executing deterministic negotiation simulation...'
                          : 'Advocate agents evaluating reservation boundaries...'}
                      </span>
                    </div>
                    <div className="h-16 w-full animate-pulse rounded-xl bg-white/[0.03]" />
                    <div className="h-16 w-full animate-pulse rounded-xl bg-white/[0.03]" />
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    <div className="flex items-center gap-2 font-medium">
                      <AlertCircle size={16} />
                      <span>Negotiation failed to complete</span>
                    </div>
                    <p className="mt-1 text-xs opacity-90">{error}</p>
                    <button
                      type="button"
                      onClick={() => void runNegotiation()}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-destructive px-3.5 py-1.5 text-xs font-semibold text-destructive-foreground transition hover:opacity-90"
                    >
                      <RefreshCw size={12} />
                      <span>Retry</span>
                    </button>
                  </div>
                )}

                {/* Real History from Backend */}
                {session?.history && session.history.length > 0 ? (
                  session.history.map((event, i) => {
                    const isBorrower = event.agent === 'borrower'
                    const isLender = event.agent === 'lender'
                    const isAccept = event.action === 'accept'
                    const isReject = event.action === 'reject'
                    const isCounter = event.action === 'counter'

                    const agentLabel = isBorrower
                      ? 'Borrower Advocate'
                      : isLender
                        ? 'Lender Advocate'
                        : 'System'

                    // Compare against previous offer in history to visibly reflect changed proposal terms between rounds
                    const prevOffer = i > 0 ? session.history[i - 1]?.offer : null
                    const rateDiff =
                      prevOffer && event.offer
                        ? event.offer.interest_rate - prevOffer.interest_rate
                        : 0
                    const isRateChanged = prevOffer && Math.abs(rateDiff) >= 0.01

                    return (
                      <div
                        className="relative flex gap-4"
                        key={`${event.round}-${event.agent}-${event.action}-${i}`}
                      >
                        <div className="flex w-8 shrink-0 flex-col items-center">
                          <span
                            className={`grid h-8 w-8 place-items-center rounded-full text-[10px] font-semibold ${
                              isBorrower
                                ? 'bg-primary/15 text-primary'
                                : isLender
                                  ? 'bg-sky-300/15 text-sky-300'
                                  : 'bg-white/10 text-muted-foreground'
                            }`}
                          >
                            {String(event.round).padStart(2, '0')}
                          </span>
                          {i < session.history.length - 1 && (
                            <span className="mt-1 h-full w-px bg-border" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1 rounded-xl border border-border bg-white/[.025] p-3.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isBorrower ? 'bg-primary' : 'bg-sky-300'
                              }`}
                            />
                            <p className="text-xs font-semibold">{agentLabel}</p>

                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                isAccept
                                  ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                  : isReject
                                    ? 'border border-destructive/30 bg-destructive/10 text-destructive'
                                    : isCounter
                                      ? 'border border-sky-400/30 bg-sky-400/10 text-sky-300'
                                      : 'border border-primary/30 bg-primary/10 text-primary'
                              }`}
                            >
                              {event.action}
                            </span>

                            <span className="ml-auto text-[10px] text-muted-foreground">
                              Round {event.round}
                            </span>
                          </div>

                          {/* Offer Terms */}
                          {event.offer && (
                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">
                                {money.format(event.offer.amount)} ·{' '}
                                {Number(event.offer.interest_rate).toFixed(2)}% ·{' '}
                                {event.offer.tenure_months} months
                                {event.offer.upfront_payment && event.offer.upfront_payment > 0
                                  ? ` · ${money.format(event.offer.upfront_payment)} upfront`
                                  : ''}
                              </p>

                              {/* Visibly reflect proposal changes between rounds */}
                              {isRateChanged && (
                                <span
                                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                                    rateDiff < 0
                                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                                      : 'border-sky-400/30 bg-sky-400/10 text-sky-300'
                                  }`}
                                >
                                  {rateDiff > 0
                                    ? `+${rateDiff.toFixed(2)}% rate`
                                    : `${rateDiff.toFixed(2)}% rate`}
                                </span>
                              )}

                              {isAccept && (
                                <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                                  Terms accepted
                                </span>
                              )}
                            </div>
                          )}

                          {/* Agent Reasoning */}
                          {event.reason && (
                            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                              {event.reason}
                            </p>
                          )}

                          {/* Verification result attached to event */}
                          {event.verification && (
                            <div className="mt-2.5 flex flex-wrap items-center gap-3 border-t border-border/50 pt-2 text-[11px]">
                              {event.verification.valid ? (
                                <span className="inline-flex items-center gap-1 font-medium text-emerald-400">
                                  <Check size={12} />
                                  <span>Verified valid</span>
                                  {event.verification.emi !== undefined && (
                                    <span className="text-muted-foreground">
                                      · Monthly EMI: {money.format(event.verification.emi)}
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-destructive">
                                  <AlertCircle size={12} />
                                  <span>
                                    Violations:{' '}
                                    {event.verification.violations?.join(', ') || 'Constraint breached'}
                                  </span>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  !loading &&
                  !isRunning &&
                  !error && (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                      No negotiation history available for this session.
                    </p>
                  )
                )}
              </div>

              {/* Progress Indicator */}
              <div className="mt-7">
                <ProgressIndicator
                  current={session?.round_number ?? (isRunning ? 1 : 0)}
                  total={session?.max_rounds ?? 6}
                />
              </div>
            </div>

            {/* Right Column: Utilities, ZOPA, Verifier */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <UtilityCard
                  label="Borrower utility"
                  value={borrowerUtility !== undefined ? borrowerUtility.toFixed(2) : '—'}
                />
                <UtilityCard
                  label="Lender utility"
                  value={lenderUtility !== undefined ? lenderUtility.toFixed(2) : '—'}
                  accent="sky"
                />
                <UtilityCard
                  label="Nash welfare"
                  value={nashWelfare}
                  accent="violet"
                />
                <div className="glass rounded-xl p-4">
                  <p className="text-xs text-muted-foreground">ZOPA</p>
                  <p
                    className={`mt-2 text-2xl font-semibold ${
                      hasValidAgreement
                        ? 'text-primary'
                        : session && !isRunning
                          ? 'text-destructive'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {hasValidAgreement
                      ? 'FOUND'
                      : session && !isRunning
                        ? 'NOT REACHED'
                        : 'EVALUATING'}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {hasValidAgreement
                      ? 'Feasible agreement verified'
                      : session && !isRunning
                        ? session.status === 'rejected'
                          ? 'Counteroffer rejected'
                          : 'No mutual convergence'
                        : 'Checking boundaries…'}
                  </p>
                </div>
              </div>

              {/* Authoritative Financial Verifier */}
              <Verifier verification={verification} loading={isRunning} />
            </div>
          </div>

          {/* Conditional Final State / Agreement CTA Banner */}
          {hasValidAgreement && finalProposal && verification ? (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/8 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/15 text-primary">
                    <Check size={22} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-base font-semibold">Agreement Reached & Verified</p>
                      {session.demo_mode && (
                        <span className="rounded-full border border-primary/30 bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                          DEMO
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Negotiation successfully completed in Round {session.round_number}. All deterministic constraints verified.
                    </p>
                  </div>
                </div>
                <Link
                  href="/agreement"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
                >
                  View proposed agreement <ArrowRight size={16} />
                </Link>
              </div>

              {/* Final Agreed Terms Grid */}
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-primary/15 pt-5 sm:grid-cols-3 lg:grid-cols-5">
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Loan Amount</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{money.format(finalProposal.amount)}</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Interest Rate</p>
                  <p className="mt-1 text-sm font-semibold text-primary">{Number(finalProposal.interest_rate).toFixed(2)}%</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tenure</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{finalProposal.tenure_months} months</p>
                </div>
                <div className="rounded-xl bg-white/[0.03] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Monthly EMI</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-400">{money.format(verification.emi)}</p>
                </div>
                {verification.total_repayment ? (
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Repayment</p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{money.format(verification.total_repayment)}</p>
                  </div>
                ) : (
                  <div className="rounded-xl bg-white/[0.03] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Verification</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-400">PASSED</p>
                  </div>
                )}
              </div>
            </div>
          ) : session && !isRunning && !loading ? (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Negotiation ended without a valid agreement</p>
                    {session.demo_mode && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                        DEMO
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {session.status === 'rejected'
                      ? 'One of the advocates rejected the contract proposal based on boundary rules.'
                      : 'The borrower and lender boundaries did not converge within the maximum rounds.'}
                  </p>
                </div>
              </div>
              <Link
                href="/matches"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                Find another lender <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-5 text-muted-foreground">
              <Loader2 size={18} className="animate-spin text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {session?.demo_mode ? 'Deterministic simulation in progress' : 'Negotiation in progress'}
                </p>
                <p className="text-xs">
                  {session?.demo_mode
                    ? 'Executing multi-round negotiation simulation within financial boundary limits.'
                    : 'Advocate agents are actively converging on contract terms within boundary limits.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
