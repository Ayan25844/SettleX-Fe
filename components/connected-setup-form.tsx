'use client'

import { ArrowRight, Banknote, Loader2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConstraintCard, Navbar } from './settlex'
import { useAuth } from '@/components/auth/auth-provider'
import {
  saveBorrowerProfile,
  saveLenderProfile,
  getBorrowerProfile,
  getLenderProfile,
  createBorrowerProfile,
  updateBorrowerProfile,
  createLenderProfile,
  updateLenderProfile,
  ApiError,
} from '@/lib/api'
import { useEffect } from 'react'

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
  ['Minimum expected return', '1.15'],
  ['Collateral requirement', 'Optional'],
  ['Risk appetite', 'Moderate'],
]

export function ConnectedSetupForm({ lender = false }: { lender?: boolean }) {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const fields = lender ? lenderFields : borrowerFields
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields),
  )
  const [hasExistingProfile, setHasExistingProfile] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Pre-load existing profile if already saved previously
  useEffect(() => {
    if (!isAuthenticated) return

    let isMounted = true
    async function fetchExistingProfile() {
      try {
        setLoadingInitial(true)
        if (lender) {
          const profile = await getLenderProfile()
          if (isMounted && profile) {
            setHasExistingProfile(true)
            setValues({
              'Maximum loan amount': `₹${Math.round(profile.max_loan_amount).toLocaleString('en-IN')}`,
              'Minimum interest rate': `${profile.min_interest_rate}%`,
              'Maximum tenure': `${profile.max_tenure} months`,
              'Minimum expected return': `${profile.min_expected_return}`,
              'Collateral requirement': profile.collateral_required ? 'Required' : 'Optional',
              'Risk appetite': 'Moderate',
            })
          }
        } else {
          const profile = await getBorrowerProfile()
          if (isMounted && profile) {
            setHasExistingProfile(true)
            setValues({
              'Loan amount': `₹${Math.round(profile.loan_amount).toLocaleString('en-IN')}`,
              'Monthly income': `₹${Math.round(profile.monthly_income).toLocaleString('en-IN')}`,
              'Essential expenses': `₹${Math.round(profile.monthly_expenses).toLocaleString('en-IN')}`,
              'Existing monthly EMI': `₹${Math.round(profile.existing_emi).toLocaleString('en-IN')}`,
              'Maximum affordable EMI': `₹${Math.round(profile.max_emi).toLocaleString('en-IN')}`,
              'Maximum interest rate': `${profile.max_interest_rate}%`,
              'Preferred tenure': `${profile.preferred_tenure} months`,
              'Maximum tenure': `${profile.max_tenure} months`,
            })
          }
        }
      } catch {
        // No existing profile (404), continue with defaults
      } finally {
        if (isMounted) setLoadingInitial(false)
      }
    }

    void fetchExistingProfile()
    return () => {
      isMounted = false
    }
  }, [isAuthenticated, lender])

  async function handleSaveAndProceed(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage(null)

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(lender ? '/lender' : '/borrower')}`)
      return
    }

    const number = (label: string) => Number(values[label].replace(/[^\d.]/g, ''))

    setSubmitting(true)

    try {
      if (lender) {
        const rawReturn = number('Minimum expected return')
        const minExpectedReturn = rawReturn > 10 ? 1.15 : (rawReturn || 1.15)
        const maxLoan = number('Maximum loan amount') || 750000
        const minRate = number('Minimum interest rate') || 11
        const maxTenure = number('Maximum tenure') || 60
        const collateralReq = values['Collateral requirement'].trim().toLowerCase() === 'required'

        // 1. Save in sessionStorage for backward-compatible negotiation prototype
        sessionStorage.setItem(
          'settlex.lender',
          JSON.stringify({
            max_loan_amount: maxLoan,
            min_interest_rate: minRate,
            max_tenure: maxTenure,
            min_expected_return: minExpectedReturn,
            collateral_required: collateralReq,
          }),
        )

          // 2. Persist to backend database via API proxy (PUT if exists, POST if new)
          const payload = {
            max_loan_amount: maxLoan,
            min_interest_rate: minRate,
            max_tenure: maxTenure,
            min_expected_return: minExpectedReturn,
            collateral_required: collateralReq,
            available_capacity: maxLoan,
      }

      if (hasExistingProfile) {
        await updateLenderProfile(payload)
      } else {
        await createLenderProfile(payload)
        setHasExistingProfile(true)
      }

      // 3. Navigate to lender matches
      router.push('/lender/matches')
      return
    }

      // Borrower Flow
      const loanAmount = number('Loan amount') || 500000
    const monthlyIncome = number('Monthly income') || 85000
    const essentialExpenses = number('Essential expenses') || 32000
    const existingEmi = number('Existing monthly EMI') || 8500
    const maxEmi = number('Maximum affordable EMI') || 16000
    const maxInterestRate = number('Maximum interest rate') || 14
    const preferredTenure = number('Preferred tenure') || 42
    const maxTenure = number('Maximum tenure') || 60

    if (maxTenure < preferredTenure) {
      setErrorMessage('Maximum tenure must be greater than or equal to preferred tenure.')
      setSubmitting(false)
      return
    }

    // 1. Save in sessionStorage for backward-compatible negotiation prototype
    sessionStorage.setItem(
      'settlex.borrower',
      JSON.stringify({
        loan_amount: loanAmount,
        monthly_income: monthlyIncome,
        monthly_expenses: essentialExpenses,
        existing_emi: existingEmi,
        max_emi: maxEmi,
        max_interest_rate: maxInterestRate,
        preferred_tenure: preferredTenure,
        max_tenure: maxTenure,
        collateral_required: false,
      }),
    )

      // 2. Persist to backend database via API proxy (PUT if exists, POST if new)
      const payload = {
        loan_amount: loanAmount,
        monthly_income: monthlyIncome,
        monthly_expenses: essentialExpenses,
        existing_emi: existingEmi,
        max_emi: maxEmi,
        max_interest_rate: maxInterestRate,
        preferred_tenure: preferredTenure,
        max_tenure: maxTenure,
        collateral_required: false,
  }

  if (hasExistingProfile) {
    await updateBorrowerProfile(payload)
  } else {
    await createBorrowerProfile(payload)
    setHasExistingProfile(true)
  }

  // 3. Navigate to matches page
  router.push('/matches')
} catch (err) {
  if (err instanceof ApiError) {
    setErrorMessage(err.message)
  } else {
    setErrorMessage('Failed to save profile. Please check your connection and try again.')
  }
} finally {
  setSubmitting(false)
}
  }

const buttonLabel = lender ? 'Save policy & view matches' : 'Find compatible lenders'

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
              ? 'Set the policy your advocate will protect during lender matching and negotiation.'
              : 'Give your advocate a clear financial picture. SettleX uses these boundaries to rank compatible lenders.'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSaveAndProceed}>
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map(([label]) => (
              <label key={label} className="grid gap-2">
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <input
                  value={values[label]}
                  onChange={(event) =>
                    setValues({ ...values, [label]: event.target.value })
                  }
                  disabled={submitting}
                  className="h-12 rounded-xl border border-border bg-white/[.035] px-4 text-sm outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
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
                      className={`rounded-full border px-4 py-2 text-sm ${index === 0
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground'
                        }`}
                    >
                      {option}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving profile & discovering matches...</span>
              </>
            ) : (
              <>
                <span>{buttonLabel}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
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
            Your advocate negotiates exclusively within your declared boundaries. Private reservation limits remain shielded.
          </p>
        </div>
      </aside>
    </div>
  </main>
)
}