'use client'

import React from 'react'
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  FileCheck2,
  HeartHandshake,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { DEMO_AGREEMENT, formatINR } from '@/lib/demo-data'
import { JudgeGuide } from './judge-guide'

interface Screen7ConfirmationProps {
  onNext: () => void
}

const CONFIRMATION_CHECKLIST = [
  'Financial Profile Created',
  'Debt Analyzed',
  'Negotiation Strategy Generated',
  'Creditor Negotiation Completed',
  'Settlement Agreement Confirmed',
]

export function Screen7Confirmation({ onNext }: Screen7ConfirmationProps) {
  const { caseId, originalDebt, negotiatedSettlement, estimatedSavings } = DEMO_AGREEMENT

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Judge Walkthrough Guide */}
      <JudgeGuide
        step={7}
        title="Settlement Execution Confirmation"
        what="Consensus milestone confirming mutual execution of the ₹5,47,690 settlement across all 5 algorithmic lifecycle stages."
        why="Borrowers in distress need verifiable proof of legal stay on collection calls and transparent records for future credit rebuilding."
        next="Open Rahul's post-settlement Financial Recovery Dashboard to visualize budget recovery and payment schedules."
      />

      {/* Main Card */}
      <div className="glass rounded-3xl p-6 sm:p-10 text-center">
        {/* Big Success Icon & Heading */}
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-xl shadow-emerald-500/10">
          <CheckCircle2 size={46} className="text-emerald-500" />
        </div>

        <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <BadgeCheck size={14} />
          Protocol Verified & Executed
        </span>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          ✓ Settlement Successfully Confirmed
        </h1>

        <p className="mt-2 text-base font-semibold text-muted-foreground">
          SettleX Case <span className="font-mono text-foreground">{caseId}</span>
        </p>

        {/* 3 Core Financial Metric Highlights */}
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-3 text-left">
          {/* Settlement Amount */}
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Settlement Amount
            </span>
            <p className="mt-2 text-2xl font-black text-primary">
              {formatINR(negotiatedSettlement)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Total restructured payout</p>
          </div>

          {/* Original Debt */}
          <div className="rounded-2xl border border-border/70 bg-card/50 p-5 shadow-sm">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Original Debt
            </span>
            <p className="mt-2 text-2xl font-bold line-through text-muted-foreground">
              {formatINR(originalDebt)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Prior uncollateralized sum</p>
          </div>

          {/* Total Savings */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Savings
            </span>
            <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatINR(estimatedSavings)}
            </p>
            <p className="mt-1 text-xs text-emerald-600/80 dark:text-emerald-400/80 font-medium">
              35% debt reduction achieved
            </p>
          </div>
        </div>

        {/* Status Confirmation Tag */}
        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-2 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Status:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            Settlement Confirmed
          </span>
        </div>

        {/* Five Step Progress Timeline */}
        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-border/70 bg-card/40 p-6 text-left">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Completed Lifecycle Milestones
          </h3>

          <div className="space-y-3">
            {CONFIRMATION_CHECKLIST.map((milestone) => (
              <div
                key={milestone}
                className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-3 text-xs"
              >
                <div className="grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-white font-bold text-[11px]">
                  ✓
                </div>
                <span className="font-semibold text-foreground">{milestone}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={onNext}
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-4 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/25 transition hover:brightness-110 active:scale-95"
          >
            <span>View Financial Recovery Dashboard →</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
