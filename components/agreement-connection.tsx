'use client'

import React, { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react'
import { Navbar, UtilityCard } from '@/components/settlex'
import type { NegotiationSessionResponse } from '@/lib/api'

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function AgreementConnection({ children }: { children?: ReactNode }) {
  const [result, setResult] = useState<NegotiationSessionResponse | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const savedResult = typeof window !== 'undefined'
      ? sessionStorage.getItem('settlex.negotiation_result')
      : null

    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult) as NegotiationSessionResponse)
      } catch {
        sessionStorage.removeItem('settlex.negotiation_result')
      }
    }

    setLoaded(true)
  }, [])

  if (!loaded) {
    return <main className="min-h-screen" />
  }

  const isValidAgreement =
    result?.agreement_found === true && result?.verification?.valid === true
  const proposal = result?.final_proposal || result?.current_offer
  const verification = result?.verification

  // If no valid agreement was reached, render the authoritative non-agreement screen
  if (!isValidAgreement || !proposal || !verification) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-3xl px-5 pb-20 pt-16 lg:px-8">
          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-8 text-center sm:p-12">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-destructive/15 text-destructive">
              <ShieldAlert size={32} />
            </div>
            <h1 className="mt-6 text-2xl font-semibold sm:text-3xl">
              No Valid Agreement Reached
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              {result
                ? result.status === 'rejected'
                  ? 'One of the autonomous advocates rejected the contract proposals based on boundary limits.'
                  : 'The negotiation concluded without mutual convergence on contract terms.'
                : 'No active negotiation result was found in your session. Please initiate a negotiation from the Matches page.'}
            </p>

            {verification?.violations && verification.violations.length > 0 && (
              <div className="mx-auto mt-6 max-w-lg text-left">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-destructive">
                  Deterministic Violations:
                </p>
                <div className="space-y-2">
                  {verification.violations.map((violation) => (
                    <div
                      key={violation}
                      className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
                    >
                      {violation}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/negotiation"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft size={16} /> Return to Negotiation
              </Link>
              <Link
                href="/matches"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
              >
                Explore Compatible Lenders <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const borrowerUtility = verification.borrower_utility
  const lenderUtility = verification.lender_utility
  const nashProduct = borrowerUtility * lenderUtility

  const terms: [string, string][] = [
    ['Loan amount', money.format(proposal.amount)],
    ['Interest rate', `${Number(proposal.interest_rate).toFixed(2)}%`],
    ['Tenure', `${proposal.tenure_months} months`],
    ['Monthly EMI', money.format(verification.emi)],
    ['Upfront payment', money.format(proposal.upfront_payment || 0)],
  ]

  if (typeof verification.total_repayment === 'number') {
    terms.push(['Total repayment', money.format(verification.total_repayment)])
  }
  if (typeof verification.total_interest === 'number') {
    terms.push(['Total interest', money.format(verification.total_interest)])
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 lg:px-8">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-primary">
            <Check size={28} />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">
              Backend Verified Agreement · Session #{result.session_id}
            </p>
            {result.demo_mode && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-amber-400">
                DEMO SIMULATION
              </span>
            )}
          </div>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
            Agreement reached
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            Both borrower and lender advocates converged on contract terms verified by the SettleX
            deterministic engine in Round {result.round_number}.
          </p>
        </div>

        <div className="glass mt-10 rounded-3xl p-6 sm:p-9">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div>
              <p className="text-xs uppercase tracking-[.18em] text-muted-foreground">
                Verified terms
              </p>
              <p className="mt-1 text-lg font-medium">Negotiated loan contract</p>
            </div>
            <div className="flex items-center gap-2">
              {result.demo_mode && (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                  DEMO SIMULATION
                </span>
              )}
              <span className="rounded-full bg-primary/12 px-3 py-1.5 text-xs font-semibold text-primary">
                VERIFIED
              </span>
            </div>
          </div>
          <div className="grid gap-4 py-7 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {terms.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 border-t border-border pt-6 sm:grid-cols-3">
            <UtilityCard label="Borrower utility" value={borrowerUtility.toFixed(2)} />
            <UtilityCard label="Lender utility" value={lenderUtility.toFixed(2)} accent="sky" />
            <UtilityCard label="Nash welfare" value={nashProduct.toFixed(2)} accent="violet" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-5">
            <ShieldCheck className="text-primary" />
            <div>
              <p className="text-sm font-medium">ZOPA · FEASIBLE</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Agreement sits inside both parties' declared financial boundaries.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-5">
            <FileCheck2 className="text-primary" />
            <div>
              <p className="text-sm font-medium">Financial verification · PASSED</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Zero deterministic hard-constraint violations.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-3">
          <Link
            href="/negotiation"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={16} /> Return to negotiation
          </Link>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            Approve & Execute Contract <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </main>
  )
}