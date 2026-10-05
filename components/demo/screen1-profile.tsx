'use client'

import React from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Building,
  Calendar,
  CreditCard,
  FileText,
  MapPin,
  TrendingDown,
  User,
  Wallet,
} from 'lucide-react'
import { DEMO_BORROWER, formatINR } from '@/lib/demo-data'
import { JudgeGuide } from './judge-guide'

interface Screen1ProfileProps {
  onNext: () => void
}

export function Screen1Profile({ onNext }: Screen1ProfileProps) {
  const {
    name,
    caseId,
    age,
    location,
    monthlyIncome,
    monthlyExpenses,
    availableMonthlyCapacity,
    creditorCount,
    totalOutstandingDebt,
  } = DEMO_BORROWER

  // Percent of income allocated to expenses
  const expenseRatio = Math.round((monthlyExpenses / monthlyIncome) * 100)
  const capacityRatio = Math.round((availableMonthlyCapacity / monthlyIncome) * 100)

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Judge Walkthrough Guide */}
      <JudgeGuide
        step={1}
        title="Borrower Profile Ingestion"
        what="The system loads Rahul Mehta's verified financial profile, case ID, cashflow metrics, and total uncollateralized liabilities."
        why="Lenders demand verified proof of genuine financial distress and sustainable repayment capability before agreeing to principal waivers."
        next="Review all individual creditor records to identify interest accumulation, days past due, and default triggers."
      />

      {/* Main Profile Card */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        {/* Header Section */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/80 pb-6">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-primary/20 via-primary/10 to-emerald-400/20 text-primary shadow-inner">
              <User size={32} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <BadgeCheck size={14} />
                  KYC Verified
                </span>
              </div>
              <p className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin size={13} />
                  {location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} />
                  Age: {age}
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/60 px-4 py-2.5 text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Case Identifier
            </span>
            <p className="font-mono text-sm font-bold text-primary">{caseId}</p>
          </div>
        </div>

        {/* Financial Capacity Breakdown */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {/* Monthly Income */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">Monthly Income</span>
              <Wallet size={16} className="text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {formatINR(monthlyIncome)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Verified salaried inflow</p>
          </div>

          {/* Monthly Expenses */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-wider">Monthly Expenses</span>
              <TrendingDown size={16} className="text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {formatINR(monthlyExpenses)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Essential living & household</p>
          </div>

          {/* Available Capacity */}
          <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-5 shadow-sm">
            <div className="flex items-center justify-between text-primary">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Available Capacity
              </span>
              <Wallet size={16} />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-primary">
              {formatINR(availableMonthlyCapacity)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground font-medium">
              Net free monthly surplus for debt service
            </p>
          </div>
        </div>

        {/* Visual Cashflow Bar */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-card/30 p-5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Income Allocation Ratio</span>
            <span className="text-foreground">
              {expenseRatio}% Living Costs · {capacityRatio}% Repayment Capacity
            </span>
          </div>
          <div className="mt-2.5 flex h-3 w-full overflow-hidden rounded-full bg-border/40">
            <div
              className="bg-amber-500/80 transition-all duration-500"
              style={{ width: `${expenseRatio}%` }}
              title={`Living Expenses: ${formatINR(monthlyExpenses)}`}
            />
            <div
              className="bg-primary transition-all duration-500"
              style={{ width: `${capacityRatio}%` }}
              title={`Repayment Capacity: ${formatINR(availableMonthlyCapacity)}`}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Essential Expenses ({formatINR(monthlyExpenses)})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span>Available Capacity ({formatINR(availableMonthlyCapacity)})</span>
            </div>
          </div>
        </div>

        {/* Debt Profile Summary Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <CreditCard size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Total Outstanding Debt
              </p>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {formatINR(totalOutstandingDebt)}
              </p>
              <p className="text-xs text-muted-foreground">Across unsecured credit facilities</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/40 p-5">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-500/10 text-sky-600">
              <Building size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Active Creditors
              </p>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {creditorCount} Financial Institutions
              </p>
              <p className="text-xs text-muted-foreground">HDFC Bank, ICICI Bank, Bajaj Finance</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText size={14} className="text-primary" />
            <span>Profile verified against Central Credit Registry & Form 16</span>
          </div>

          <button
            onClick={onNext}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110 active:scale-95 sm:w-auto"
          >
            <span>Continue → Review Debt</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
