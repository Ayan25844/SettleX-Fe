'use client'

import React, { useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  Clock,
  Handshake,
  Loader2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  UserCheck,
} from 'lucide-react'
import { DEMO_NEGOTIATION, formatINR } from '@/lib/demo-data'
import { JudgeGuide } from './judge-guide'

interface Screen5NegotiationProps {
  onNext: () => void
  onBack: () => void
}

export function Screen5Negotiation({ onNext, onBack }: Screen5NegotiationProps) {
  const [isNegotiating, setIsNegotiating] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)
  const [showAcceptAlert, setShowAcceptAlert] = useState(false)

  const {
    creditor,
    initialOffer,
    creditorCounterOffer,
    suggestedCounterOffer,
    suggestedTerms,
    finalSettlementAmount,
    timelineInitial,
    timelineAccepted,
  } = DEMO_NEGOTIATION

  const handleSubmitRevisedOffer = () => {
    setIsNegotiating(true)
    // 1.5s simulated negotiation latency
    setTimeout(() => {
      setIsNegotiating(false)
      setIsAccepted(true)
    }, 1500)
  }

  const handleAcceptCounterOffer = () => {
    setShowAcceptAlert(true)
    setTimeout(() => setShowAcceptAlert(false), 4000)
  }

  const activeTimeline = isAccepted
    ? [...timelineInitial, ...timelineAccepted]
    : isNegotiating
      ? [
          ...timelineInitial,
          {
            time: '10:07 AM',
            event: 'Submitting revised counter-offer...',
            detail: 'Transmitting optimal offer ₹5,47,690 to HDFC risk committee API',
            actor: 'SettleX Agent',
          },
        ]
      : timelineInitial

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Judge Walkthrough Guide */}
      <JudgeGuide
        step={5}
        title="Live Creditor Bilateral Bargaining"
        what="SettleX and HDFC Bank exchange strategic counter-proposals. HDFC demanded ₹5,85,000; clicking 'Submit Revised Offer' submits the AI-optimized ₹5,47,690 compromise."
        why="Lenders run automated recovery NPV models. SettleX's ₹5,47,690 structure satisfies the lender's hurdle rate while safeguarding Rahul's ₹25.5k monthly budget."
        next="Proceed to legally binding Settlement Agreement compilation with payment schedule and NOC terms."
      />

      {/* Main Card */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Building2 size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Screen 5 · Live Protocol
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Creditor Negotiation
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Lead Creditor: <span className="font-semibold text-foreground">{creditor}</span>
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isAccepted ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                🟢 Creditor Accepted
              </span>
            ) : isNegotiating ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-3.5 py-1.5 text-xs font-bold text-primary">
                <Loader2 size={13} className="animate-spin text-primary" />
                Negotiating...
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/15 px-3.5 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                🟡 Negotiation in Progress
              </span>
            )}
          </div>
        </div>

        {/* Live Timeline Display */}
        <div className="mt-6 rounded-2xl border border-border/70 bg-card/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Clock size={14} className="text-primary" />
              Negotiation Exchange Log
            </h2>
            <span className="text-[11px] text-muted-foreground">Real-time protocol sync</span>
          </div>

          <div className="space-y-4">
            {activeTimeline.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="font-mono text-muted-foreground shrink-0 w-16 pt-0.5 font-medium">
                  {item.time}
                </span>
                <div
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                    'status' in item && item.status === 'success'
                      ? 'bg-emerald-500 ring-4 ring-emerald-500/20'
                      : 'bg-primary'
                  }`}
                />
                <div className="flex-1 rounded-xl border border-border/40 bg-card/50 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{item.event}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{item.actor}</span>
                  </div>
                  <p className="mt-0.5 text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offer Comparison Panel */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Initial Offer */}
          <div className="rounded-2xl border border-border/70 bg-card/50 p-5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Initial Proposal (SettleX)
            </span>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {formatINR(initialOffer)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Submitted at 10:02 AM</p>
          </div>

          {/* Creditor Counter-Offer */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-5">
            <span className="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Creditor Counter-Offer (HDFC Bank)
            </span>
            <p className="mt-2 text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {formatINR(creditorCounterOffer)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Received at 10:06 AM (+₹1,00,000)</p>
          </div>
        </div>

        {/* AI-Assisted Recommendation Box */}
        <div className="mt-6 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/[0.08] to-emerald-500/[0.05] p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>AI-Assisted Response Suggestion</span>
              </div>
              <h3 className="mt-2 text-xl font-extrabold text-foreground">
                Suggested Counter Offer: <span className="text-primary">{formatINR(suggestedCounterOffer)}</span>
              </h3>
              <p className="mt-1 text-xs text-muted-foreground font-medium">
                Structured with: <span className="text-foreground font-bold">{suggestedTerms}</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Calculated to settle at the Nash equilibrium: provides HDFC with ₹1.5L immediate liquidity while locking 12 manageable tranches of ₹33,129.
              </p>
            </div>
          </div>
        </div>

        {/* ACCEPTED STATE BANNER */}
        {isAccepted && (
          <div className="mt-6 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 p-5 text-center animate-in zoom-in-95 duration-300">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-white shadow-lg">
              <ShieldCheck size={26} />
            </div>
            <p className="mt-3 text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Consensus Reached
            </p>
            <h2 className="mt-1 text-2xl font-black text-foreground sm:text-3xl">
              🟢 Creditor Accepted
            </h2>
            <p className="mt-1 text-sm font-semibold text-foreground">
              Settlement Amount:{' '}
              <span className="text-primary font-bold text-xl">
                {formatINR(finalSettlementAmount)}
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              HDFC Bank risk committee confirmed all settlement parameters and suspended legal recovery procedures.
            </p>
          </div>
        )}

        {/* Alert if user clicks "Accept Counter Offer" */}
        {showAcceptAlert && (
          <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/15 p-3 text-xs text-amber-800 dark:text-amber-200 animate-in fade-in">
            ⚠️ Note: Accepting the creditor's initial ₹5,85,000 counter-offer leaves ₹37,310 in avoidable cost on the table! We recommend clicking <strong>"Submit Revised Offer"</strong> to reach the optimal ₹5,47,690 settlement.
          </div>
        )}

        {/* Interactive Action Area */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 sm:flex-row">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft size={16} />
            <span>Back to Strategy</span>
          </button>

          {!isAccepted ? (
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleAcceptCounterOffer}
                disabled={isNegotiating}
                className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-full border border-border bg-card/60 px-5 py-3 text-sm font-medium text-muted-foreground transition hover:border-amber-500/40 hover:text-foreground disabled:opacity-50"
              >
                Accept Counter Offer
              </button>

              <button
                onClick={handleSubmitRevisedOffer}
                disabled={isNegotiating}
                className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110 active:scale-95 disabled:opacity-50"
              >
                {isNegotiating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Negotiating...</span>
                  </>
                ) : (
                  <>
                    <Handshake size={16} />
                    <span>Submit Revised Offer</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={onNext}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition hover:brightness-110 active:scale-95"
            >
              <span>Review Settlement Agreement →</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
