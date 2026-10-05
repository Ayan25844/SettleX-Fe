'use client'

import React from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  Layers,
  Percent,
  Receipt,
  ShieldAlert,
} from 'lucide-react'
import { DEMO_BORROWER, DEMO_CREDITORS, formatINR } from '@/lib/demo-data'
import { JudgeGuide } from './judge-guide'

interface Screen2DebtProps {
  onNext: () => void
  onBack: () => void
}

export function Screen2Debt({ onNext, onBack }: Screen2DebtProps) {
  const totalDebt = DEMO_CREDITORS.reduce((acc, c) => acc + c.outstanding, 0)
  const totalEmi = DEMO_CREDITORS.reduce((acc, c) => acc + c.emi, 0)
  const monthlyCapacity = DEMO_BORROWER.availableMonthlyCapacity
  const monthlyDeficit = totalEmi - monthlyCapacity

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Judge Walkthrough Guide */}
      <JudgeGuide
        step={2}
        title="Debt Portfolio & Delinquency Review"
        what="Consolidated breakdown of 3 institutional liabilities totaling ₹8,42,600 with interest rates reaching 26.2% and DPD as high as 92 days."
        why="Rahul's current required EMI is ₹30,400/month, creating a recurring deficit of -₹4,900 against his ₹25,500 capacity. Without intervention, accounts face Non-Performing Asset (NPA) classification."
        next="Trigger SettleX AI Financial Analysis to evaluate affordability constraints, compare settlement options, and derive optimal hair-cut targets."
      />

      {/* Main Container */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Screen 2 · Debt Overview
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Consolidated Debt Portfolio
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              3 active uncollateralized credit accounts requiring structured negotiation
            </p>
          </div>

          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-right">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-destructive">
              Total Outstanding
            </span>
            <p className="text-2xl font-extrabold text-foreground sm:text-3xl">
              {formatINR(totalDebt)}
            </p>
          </div>
        </div>

        {/* Warning Banner: Repayment Deficit Alert */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
          <div className="leading-relaxed">
            <span className="font-bold">Affordability Deficit Warning: </span>
            Current aggregate EMI of <span className="font-bold">{formatINR(totalEmi)}/month</span>{' '}
            exceeds Rahul's available monthly capacity of{' '}
            <span className="font-bold">{formatINR(monthlyCapacity)}/month</span> by{' '}
            <span className="font-bold text-destructive">
              -{formatINR(monthlyDeficit)}/month
            </span>
            . SettleX negotiation is required to restructure and lower debt obligation into the
            sustainable zone.
          </div>
        </div>

        {/* Debt Cards Grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {DEMO_CREDITORS.map((creditor) => (
            <div
              key={creditor.id}
              className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/50 p-5 shadow-sm transition hover:border-primary/30"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{creditor.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{creditor.accountType}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3 border-t border-border/50 pt-4 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Outstanding</span>
                    <span className="font-bold text-base text-foreground">
                      {formatINR(creditor.outstanding)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Percent size={13} />
                      Interest Rate
                    </span>
                    <span className="font-semibold text-foreground">
                      {creditor.interestRate}% p.a.
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Receipt size={13} />
                      Current EMI
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatINR(creditor.emi)}/mo
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock size={13} />
                      Days Past Due
                    </span>
                    <span
                      className={`font-bold ${
                        creditor.daysPastDue >= 90
                          ? 'text-destructive'
                          : 'text-amber-500'
                      }`}
                    >
                      {creditor.daysPastDue} Days
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/50">
                <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  {creditor.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Aggregate Summary Bar */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-card/30 p-5">
          <div className="grid gap-4 sm:grid-cols-4 text-center sm:text-left">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Total Debt
              </p>
              <p className="text-xl font-bold text-foreground">{formatINR(totalDebt)}</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Cumulative Current EMI
              </p>
              <p className="text-xl font-bold text-foreground">{formatINR(totalEmi)}/mo</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Max Delinquency
              </p>
              <p className="text-xl font-bold text-destructive">92 Days Past Due</p>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Risk Classification
              </p>
              <p className="text-xl font-bold text-amber-500">Sub-Standard SMA-2</p>
            </div>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 sm:flex-row">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft size={16} />
            <span>Back to Profile</span>
          </button>

          <button
            onClick={onNext}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110 active:scale-95 sm:w-auto"
          >
            <span>Analyze My Debt →</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
