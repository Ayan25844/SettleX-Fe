'use client'

import Link from 'next/link'
import { ArrowRight, Banknote } from 'lucide-react'
import { useState } from 'react'
import { ConstraintCard, Navbar } from './settlex'
import { useAuth } from '@/components/auth/auth-provider'

const borrowerFields = [
  ['Loan amount', '₹5,00,000'],
  ['Monthly income', '₹85,000'],
  ['Essential expenses', '₹32,000'],
  ['Existing monthly EMI', '₹8,500'],
  ['Maximum affordable EMI', '₹16,000'],
  ['Maximum interest rate', '14%'],
  ['Preferred tenure', '42 months'],
  ['Maximum tenure', '60 months'],
]

const lenderFields = [
  ['Maximum loan amount', '₹7,50,000'],
  ['Minimum interest rate', '11%'],
  ['Maximum tenure', '60 months'],
  ['Minimum expected return', '₹1,20,000'],
  ['Collateral requirement', 'Optional'],
  ['Risk appetite', 'Moderate'],
]

export function ConnectedSetupForm({ lender = false }: { lender?: boolean }) {
  const { user } = useAuth()
  const fields = lender ? lenderFields : borrowerFields
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields),
  )

  function saveProfile() {
    const number = (label: string) => Number(values[label].replace(/[^\d.]/g, ''))

    if (lender) {
      sessionStorage.setItem(
        'settlex.lender',
        JSON.stringify({
          max_loan_amount: number('Maximum loan amount'),
          min_interest_rate: number('Minimum interest rate'),
          max_tenure: number('Maximum tenure'),
          min_expected_return: number('Minimum expected return'),
          collateral_required:
            values['Collateral requirement'].trim().toLowerCase() === 'required',
        }),
      )

      // Ensure a counterpart borrower profile exists so negotiation can proceed seamlessly
      if (!sessionStorage.getItem('settlex.borrower')) {
        sessionStorage.setItem(
          'settlex.borrower',
          JSON.stringify({
            loan_amount: 500000,
            monthly_income: 85000,
            monthly_expenses: 32000,
            existing_emi: 8500,
            max_emi: 16000,
            max_interest_rate: 14,
            preferred_tenure: 42,
            max_tenure: 60,
            collateral_required: false,
          }),
        )
      }
      return
    }

    sessionStorage.setItem(
      'settlex.borrower',
      JSON.stringify({
        loan_amount: number('Loan amount'),
        monthly_income: number('Monthly income'),
        monthly_expenses: number('Essential expenses'),
        existing_emi: number('Existing monthly EMI'),
        max_emi: number('Maximum affordable EMI'),
        max_interest_rate: number('Maximum interest rate'),
        preferred_tenure: number('Preferred tenure'),
        max_tenure: number('Maximum tenure'),
        collateral_required: false,
      }),
    )

    // Ensure a counterpart lender profile exists so negotiation can proceed seamlessly
    if (!sessionStorage.getItem('settlex.lender')) {
      sessionStorage.setItem(
        'settlex.lender',
        JSON.stringify({
          max_loan_amount: 750000,
          min_interest_rate: 11,
          max_tenure: 60,
          min_expected_return: 120000,
          collateral_required: false,
        }),
      )
    }
  }

  // If logged in as borrower, navigate directly to negotiation since /lender is role-restricted
  const targetHref = lender || user?.role === 'borrower' ? '/negotiation' : '/lender'
  const buttonLabel = lender || user?.role === 'borrower' ? 'Start AI negotiation' : 'Continue as borrower'

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 pt-10 lg:grid-cols-[1.2fr_.8fr] lg:px-8">
        <div>
          <div className="mb-9">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-primary">
              {lender ? 'Lender setup' : 'Borrower setup'}{' '}
              <span className="ml-2 text-muted-foreground">01 / 02</span>
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-.04em]">
              {lender ? 'Define your lending boundaries' : 'Tell us what you need'}
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {lender
                ? 'Set the policy your advocate will protect during the negotiation.'
                : 'Give your advocate a clear financial picture. These boundaries stay in your control.'}
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map(([label]) => (
              <label key={label} className="grid gap-2">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <input
                  value={values[label]}
                  onChange={(event) =>
                    setValues({ ...values, [label]: event.target.value })
                  }
                  className="h-12 rounded-xl border border-border bg-white/[.035] px-4 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
                />
              </label>
            ))}
          </div>
          {!lender && (
            <div className="mt-7">
              <p className="mb-3 text-xs font-medium text-muted-foreground">
                Primary priority
              </p>
              <div className="flex flex-wrap gap-2">
                {['Low EMI', 'Low total cost', 'Flexible repayment', 'Shorter tenure'].map(
                  (option, index) => (
                    <button
                      type="button"
                      key={option}
                      className={`rounded-full border px-4 py-2 text-sm ${index === 0 ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}
          <Link
            href={targetHref}
            onClick={saveProfile}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            {buttonLabel}
            <ArrowRight size={16} />
          </Link>
        </div>
        <aside className="lg:pt-20">
          <ConstraintCard
            title={lender ? 'Lender constraints' : 'Your financial boundaries'}
            items={fields.slice(0, 6).map(([label]) => `${label}:${values[label]}`)}
          />
          <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Banknote size={16} className="text-primary" /> Private by design
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Synthetic prototype data is used for this demo. Your advocate only sees
              the boundaries you define.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}