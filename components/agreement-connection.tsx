'use client'

import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Navbar, UtilityCard } from '@/components/settlex'
import type { NegotiationResponse } from '@/lib/api'

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function AgreementConnection({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<NegotiationResponse | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const savedResult = sessionStorage.getItem('settlex.result')

    if (savedResult) {
      try {
        setResult(JSON.parse(savedResult) as NegotiationResponse)
      } catch {
        sessionStorage.removeItem('settlex.result')
      }
    }

    setLoaded(true)
  }, [])

  if (!loaded) {
    return <main className="min-h-screen" />
  }

  const deal = result?.agreement_found ? result.best_deal : undefined

  if (!deal) return children

  const terms = [
    ['Loan amount', money.format(deal.proposal.amount)],
    ['Interest rate', `${deal.proposal.interest_rate}%`],
    ['Tenure', `${deal.proposal.tenure_months} months`],
    ['Monthly EMI', money.format(deal.emi)],
    ['Upfront payment', money.format(deal.proposal.upfront_payment)],
  ]

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-10 lg:px-8">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/12 text-primary">
            <Check size={28} />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[.22em] text-primary">
            Backend proposal · {result?.candidates_checked ?? 0} feasible candidates
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
            Agreement proposal
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
            These terms were selected by the SettleX backend from the borrower and lender
            boundaries you submitted.
          </p>
        </div>

        <div className="glass mt-10 rounded-3xl p-6 sm:p-9">
          <div className="flex items-center justify-between border-b border-border pb-5">
            <div>
              <p className="text-xs uppercase tracking-[.18em] text-muted-foreground">
                Proposed terms
              </p>
              <p className="mt-1 text-lg font-medium">Negotiated loan proposal</p>
            </div>
            <span className="rounded-full bg-primary/12 px-3 py-1.5 text-xs font-semibold text-primary">
              VERIFIED
            </span>
          </div>
          <div className="grid gap-4 py-7 sm:grid-cols-3 lg:grid-cols-5">
            {terms.map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-2 text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-3 border-t border-border pt-6 sm:grid-cols-3">
            <UtilityCard label="Borrower utility" value={deal.borrower_utility.toFixed(2)} />
            <UtilityCard label="Lender utility" value={deal.lender_utility.toFixed(2)} accent="sky" />
            <UtilityCard label="Nash welfare" value={deal.nash_product.toFixed(2)} accent="violet" />
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/negotiation"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-muted-foreground"
          >
            <ArrowLeft size={16} /> Return to negotiation
          </Link>
        </div>
      </div>
    </main>
  )
}