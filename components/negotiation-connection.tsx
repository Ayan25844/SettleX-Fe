'use client'

import { useEffect, useState } from 'react'
import {
  startNegotiation,
  type BorrowerProfile,
  type LenderProfile,
  type NegotiationResponse,
} from '@/lib/api'

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function NegotiationConnection() {
  const [result, setResult] = useState<NegotiationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function negotiate() {
      try {
        const borrower = sessionStorage.getItem('settlex.borrower')
        const lender = sessionStorage.getItem('settlex.lender')

        if (!borrower || !lender) {
          throw new Error('Complete borrower and lender setup before starting a negotiation.')
        }

        const response = await startNegotiation(
          JSON.parse(borrower) as BorrowerProfile,
          JSON.parse(lender) as LenderProfile,
        )

        if (active) {
          sessionStorage.setItem('settlex.result', JSON.stringify(response))
          setResult(response)
        }
      } catch (cause) {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : 'Unable to reach the negotiation service.',
          )
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    void negotiate()
    return () => {
      active = false
    }
  }, [])

  const deal = result?.agreement_found ? result.best_deal : undefined

  return (
    <section
      aria-live="polite"
      className="mx-auto mt-5 max-w-7xl rounded-xl border border-border bg-background/80 px-5 py-4 lg:px-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">
            Backend negotiation
          </p>
          <p className="mt-1 text-sm font-medium">
            {loading
              ? 'Finding a feasible proposal…'
              : error
                ? 'Negotiation could not be completed'
                : deal
                  ? 'A feasible proposal was returned'
                  : 'No feasible proposal was found'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {error ?? result?.message ?? (result ? `${result.candidates_checked} feasible proposals evaluated.` : '')}
          </p>
          {result?.agreement_found && (
            <p className="mt-1 text-xs text-muted-foreground">
              The timeline and verifier below are illustrative; this proposal is from the backend.
            </p>
          )}
        </div>
        {deal && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">Loan amount</dt>
              <dd className="mt-1 font-medium">{money.format(deal.proposal.amount)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Interest rate</dt>
              <dd className="mt-1 font-medium">{deal.proposal.interest_rate}%</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Tenure</dt>
              <dd className="mt-1 font-medium">{deal.proposal.tenure_months} months</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Monthly EMI</dt>
              <dd className="mt-1 font-medium">{money.format(deal.emi)}</dd>
            </div>
          </dl>
        )}
      </div>
    </section>
  )
}