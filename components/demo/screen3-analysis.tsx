'use client'

import React, { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Cpu,
  HelpCircle,
  Loader2,
  RotateCw,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  Zap,
} from 'lucide-react'
import { DEMO_BORROWER, DEMO_SCENARIOS, formatINR } from '@/lib/demo-data'
import { JudgeGuide } from './judge-guide'

interface Screen3AnalysisProps {
  onNext: () => void
  onBack: () => void
}

const ANALYSIS_STEPS = [
  'Analyzing financial profile...',
  'Evaluating repayment capacity...',
  'Comparing settlement scenarios...',
  'Generating negotiation strategy...',
]

export function Screen3Analysis({ onNext, onBack }: Screen3AnalysisProps) {
  const [analyzing, setAnalyzing] = useState(true)
  const [activeStepIndex, setActiveStepIndex] = useState(0)

  useEffect(() => {
    // 1.6 second simulated analysis sequence
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1
        }
        clearInterval(interval)
        setTimeout(() => setAnalyzing(false), 350)
        return prev
      })
    }, 380)

    return () => clearInterval(interval)
  }, [])

  const reRunAnalysis = () => {
    setAnalyzing(true)
    setActiveStepIndex(0)
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1
        }
        clearInterval(interval)
        setTimeout(() => setAnalyzing(false), 350)
        return prev
      })
    }, 380)
  }

  const { optionA, optionB, optionC } = DEMO_SCENARIOS

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Judge Walkthrough Guide */}
      <JudgeGuide
        step={3}
        title="AI Financial Analysis & Scenario Modeling"
        what="SettleX calculates 3 distinct repayment topologies: Option A (Full Repayment over 36 mo), Option B (35% Negotiated Haircut over 12 mo), and Option C (41% Lump-Sum Settlement)."
        why="Lenders will reject unrealistic discount demands. Option B optimizes the mathematical Nash Bargaining frontier—maximizing debt relief while remaining attractive to bank recovery committees."
        next="Synthesize Option B into an executable AI Negotiation Plan containing specific opening bids, escalation thresholds, and payment cadence."
      />

      {/* Main Card */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <BrainCircuit size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Screen 3 · AI Engine
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                AI Financial Analysis
              </h1>
            </div>
          </div>

          {!analyzing && (
            <button
              onClick={reRunAnalysis}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              <RotateCw size={13} />
              <span>Re-run Analysis</span>
            </button>
          )}
        </div>

        {/* LOADING STATE (~1-2 seconds) */}
        {analyzing ? (
          <div className="my-12 flex flex-col items-center justify-center py-10 text-center">
            <div className="relative mb-6">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-primary/15 text-primary shadow-xl">
                <Cpu size={36} className="animate-spin text-primary" />
              </div>
              <span className="pulse-dot absolute right-1 top-1 h-3.5 w-3.5 rounded-full bg-primary" />
            </div>

            <h3 className="text-xl font-bold text-foreground">
              {ANALYSIS_STEPS[activeStepIndex]}
            </h3>
            <p className="mt-2 text-xs text-muted-foreground max-w-sm">
              SettleX algorithmic agent evaluating debt-to-income frontiers and creditor loss-provisions
            </p>

            {/* Stepper indicators */}
            <div className="mt-8 flex w-full max-w-md flex-col gap-2.5 text-left text-xs">
              {ANALYSIS_STEPS.map((step, idx) => {
                const isDone = idx < activeStepIndex
                const isCurrent = idx === activeStepIndex
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-3 rounded-xl border p-2.5 transition-all ${
                      isDone
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                        : isCurrent
                          ? 'border-primary/40 bg-primary/10 text-primary font-semibold'
                          : 'border-border/40 bg-card/20 text-muted-foreground/60'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : isCurrent ? (
                      <Loader2 size={16} className="animate-spin text-primary" />
                    ) : (
                      <span className="grid h-4 w-4 place-items-center rounded-full bg-muted text-[10px]">
                        {idx + 1}
                      </span>
                    )}
                    <span>{step}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* COMPLETED ANALYSIS VIEW */
          <div className="mt-6 space-y-8 animate-in fade-in duration-300">
            {/* AI Assessment Panel */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-primary" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  AI Assessment
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* Sustainable Monthly Payment */}
                <div className="rounded-2xl border border-border/70 bg-card/50 p-5 shadow-sm">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Estimated Sustainable Monthly Payment
                  </span>
                  <p className="mt-2 text-2xl font-extrabold text-primary">
                    {formatINR(DEMO_BORROWER.availableMonthlyCapacity)}{' '}
                    <span className="text-xs font-normal text-muted-foreground">/ month</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Matches verified cash surplus
                  </p>
                </div>

                {/* Financial Stress */}
                <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-5 shadow-sm">
                  <span className="text-xs font-medium uppercase tracking-wider text-destructive">
                    Financial Stress
                  </span>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-2xl font-extrabold text-destructive">High</span>
                    <ShieldAlert size={20} className="text-destructive" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    92 DPD & debt load at 12.4× monthly salary
                  </p>
                </div>

                {/* Recommended Strategy */}
                <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 shadow-sm">
                  <span className="text-xs font-medium uppercase tracking-wider text-primary">
                    Recommended Strategy
                  </span>
                  <p className="mt-2 text-2xl font-extrabold text-foreground">
                    Structured Settlement
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Optimal principal waiver with 12-mo payout
                  </p>
                </div>
              </div>
            </div>

            {/* Three Scenario Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Comparative Settlement Scenarios
                </h2>
                <span className="text-xs text-muted-foreground">
                  Simulated outcomes based on historical recovery matrices
                </span>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {/* Option A — Full Repayment */}
                <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/40 p-5 shadow-sm transition hover:border-primary/30">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                        {optionA.tag}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-foreground">{optionA.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{optionA.description}</p>

                    <div className="mt-5 space-y-2.5 border-t border-border/50 pt-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Payment</span>
                        <span className="font-bold text-foreground">
                          {formatINR(optionA.totalPayment)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-semibold text-foreground">
                          {optionA.durationMonths} months
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Monthly Payment</span>
                        <span className="font-bold text-foreground">
                          {formatINR(optionA.monthlyPayment)}/mo
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground/60">
                        <span>Settlement Savings</span>
                        <span>₹0 (0% waiver)</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                    High total interest burden over 3 years.
                  </div>
                </div>

                {/* Option B — Negotiated Settlement (HIGHLIGHTED) */}
                <div className="relative flex flex-col justify-between rounded-2xl border-2 border-primary bg-primary/[0.04] p-5 shadow-xl shadow-primary/10 transition">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md">
                      <Sparkles size={11} />
                      Recommended by SettleX AI
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="rounded-md bg-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary">
                        {optionB.tag}
                      </span>
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        -{optionB.settlementReduction}% Haircut
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-foreground">{optionB.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{optionB.description}</p>

                    <div className="mt-5 space-y-2.5 border-t border-primary/20 pt-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-muted-foreground">
                          Estimated Settlement
                        </span>
                        <span className="font-extrabold text-lg text-primary">
                          {formatINR(optionB.estimatedSettlement)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Estimated Savings</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {formatINR(optionB.estimatedSavings)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Settlement Reduction</span>
                        <span className="font-bold text-foreground">
                          {optionB.settlementReduction}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Structure</span>
                        <span className="font-semibold text-foreground">
                          {formatINR(optionB.upfrontAmount)} + 12 mo
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-primary/25 bg-primary/10 p-2.5 text-center text-[11px] font-medium text-primary">
                    Optimal Nash balance between borrower savings and creditor acceptance.
                  </div>
                </div>

                {/* Option C — Lump-Sum Settlement */}
                <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card/40 p-5 shadow-sm transition hover:border-primary/30">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                        {optionC.tag}
                      </span>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600">
                        -{optionC.settlementReduction}%
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-foreground">{optionC.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{optionC.description}</p>

                    <div className="mt-5 space-y-2.5 border-t border-border/50 pt-4 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Estimated Settlement</span>
                        <span className="font-bold text-foreground">
                          {formatINR(optionC.estimatedSettlement)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Required Upfront Amount</span>
                        <span className="font-bold text-amber-500">
                          {formatINR(optionC.requiredUpfrontAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Estimated Savings</span>
                        <span className="font-semibold text-emerald-600">
                          {formatINR(optionC.estimatedSavings)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tenure</span>
                        <span className="font-semibold text-foreground">Immediate 1-Time</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
                    Deepest discount, but requires ₹4.96L instant liquid cash.
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                * Simulated estimation based on collective bargaining models. Not a formal financial
                guarantee until ratified by creditor committee.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 sm:flex-row">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                <ArrowLeft size={16} />
                <span>Back to Debt Overview</span>
              </button>

              <button
                onClick={onNext}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110 active:scale-95 sm:w-auto"
              >
                <span>Generate Negotiation Plan →</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
