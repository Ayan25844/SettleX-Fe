'use client'

import React from 'react'
import {
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  CreditCard,
  Flame,
  LineChart,
  Percent,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { DEMO_RECOVERY, formatINR } from '@/lib/demo-data'
import { JudgeGuide } from './judge-guide'

interface Screen8RecoveryProps {
  onRestart: () => void
}

export function Screen8Recovery({ onRestart }: Screen8RecoveryProps) {
  const {
    debtBefore,
    settlementAmount,
    savings,
    monthlyPayment,
    settlementStatus,
    visualComparison,
    progress,
    schedule,
  } = DEMO_RECOVERY

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Judge Walkthrough Guide */}
      <JudgeGuide
        step={8}
        title="Post-Settlement Financial Recovery Dashboard"
        what="SettleX monitors Rahul's 12-month recovery journey: Month 1 of 12 active, next installment of ₹33,129 due on 15 Nov 2026, and full discharge roadmap."
        why="Resolution must lead to sustainable solvency. SettleX provides clear visibility, automated debits, and credit repair milestones to prevent recidivism."
        next="Demo flow complete! Click 'Restart Demo ↻' to re-run the interactive showcase from Screen 1."
      />

      {/* Main Container */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Screen 8 · Final Stage
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Financial Recovery Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Post-settlement health tracker & structured repayment trajectory
            </p>
          </div>

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-5 py-2.5 text-xs font-bold text-primary shadow-sm transition hover:bg-primary/20 active:scale-95"
          >
            <RotateCcw size={14} />
            <span>Restart Demo ↻</span>
          </button>
        </div>

        {/* 5 Core Top Metric Cards */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Debt Before */}
          <div className="rounded-2xl border border-border/70 bg-card/50 p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Debt Before
            </span>
            <p className="mt-1.5 text-xl font-bold text-foreground line-through">
              {formatINR(debtBefore)}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">Original liabilities</p>
          </div>

          {/* Settlement Amount */}
          <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
              Settlement Amount
            </span>
            <p className="mt-1.5 text-xl font-black text-primary">
              {formatINR(settlementAmount)}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">Approved haircut</p>
          </div>

          {/* Savings */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Savings
            </span>
            <p className="mt-1.5 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatINR(savings)}
            </p>
            <p className="mt-1 text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
              35% debt saved
            </p>
          </div>

          {/* Monthly Payment */}
          <div className="rounded-2xl border border-border/70 bg-card/50 p-4">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Monthly Payment
            </span>
            <p className="mt-1.5 text-xl font-bold text-foreground">
              {formatINR(monthlyPayment)}
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">12 months tenure</p>
          </div>

          {/* Settlement Status */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex flex-col justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Settlement Status
            </span>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                {settlementStatus}
              </p>
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Good standing</p>
          </div>
        </div>

        {/* Visual Comparison: Original Debt vs Settlement vs Savings */}
        <div className="mt-6 rounded-2xl border border-border/70 bg-card/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Debt Resolution Comparison
              </h2>
              <p className="text-xs text-muted-foreground">
                Visualizing haircut allocation and capital relieved
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              35% Capital Relief
            </span>
          </div>

          {/* Comparison Cards Visual */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border/50 bg-card/60 p-4">
              <span className="text-xs text-muted-foreground font-medium">Original Debt</span>
              <p className="text-2xl font-black text-foreground mt-1">
                {visualComparison.originalDebt}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-border/50 overflow-hidden">
                <div className="h-full bg-muted-foreground/50 w-full" />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">100% of initial liability</p>
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/[0.05] p-4">
              <span className="text-xs text-primary font-bold">Settlement</span>
              <p className="text-2xl font-black text-primary mt-1">
                {visualComparison.settlement}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-border/50 overflow-hidden">
                <div className="h-full bg-primary w-[65%]" />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">65% payable over 12 months</p>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.05] p-4">
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                Savings
              </span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {visualComparison.savings}
              </p>
              <div className="mt-3 h-2 w-full rounded-full bg-border/50 overflow-hidden">
                <div className="h-full bg-emerald-500 w-[35%]" />
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">35% forgiven / waived</p>
            </div>
          </div>
        </div>

        {/* Recovery Progress Section */}
        <div className="mt-6 rounded-2xl border border-border/70 bg-card/40 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Recovery Progress
                </h2>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Structured fulfillment schedule tracking
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                Month {progress.currentMonth} / {progress.totalMonths}
              </span>
            </div>
          </div>

          {/* Progress Bar Display: ████░░░░░░░░ */}
          <div className="mt-5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-2">
              <span>Installments Progress (1 of 12)</span>
              <span className="font-bold text-foreground">8.3% Completed</span>
            </div>

            {/* Custom stylized blocks to mirror prompt requirements */}
            <div className="flex h-3 w-full gap-1 overflow-hidden rounded-full bg-card/50 p-0.5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 rounded-sm transition-all ${
                    i === 0
                      ? 'bg-primary'
                      : 'bg-border/60'
                  }`}
                  title={`Month ${i + 1}`}
                />
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>████░░░░░░░░░░░░</span>
              <span>11 Months Remaining</span>
            </div>
          </div>

          {/* Next Payment Card */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">Next Payment</span>
                <Clock size={15} className="text-primary" />
              </div>
              <p className="mt-1 text-2xl font-black text-foreground">
                {formatINR(progress.nextPayment)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Automated clearing via NACH mandate
              </p>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/50 p-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">Due Date</span>
                <Calendar size={15} className="text-emerald-500" />
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">{progress.dueDate}</p>
              <p className="mt-1 text-xs text-muted-foreground">Auto-debit in 43 days</p>
            </div>
          </div>

          {/* 12-Month Schedule Preview */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Amortized Payout Schedule (Preview)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground">
                    <th className="pb-2 font-semibold">Tranche</th>
                    <th className="pb-2 font-semibold">Due Date</th>
                    <th className="pb-2 font-semibold">Amount</th>
                    <th className="pb-2 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {schedule.slice(0, 4).map((row) => (
                    <tr key={row.month} className="text-foreground">
                      <td className="py-2.5 font-medium">Month {row.month}</td>
                      <td className="py-2.5 text-muted-foreground">{row.due}</td>
                      <td className="py-2.5 font-bold">{formatINR(row.amount)}</td>
                      <td className="py-2.5 text-right">
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            row.status === 'Due Soon'
                              ? 'bg-primary/15 text-primary border border-primary/30'
                              : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground text-center">
              + 8 additional scheduled monthly tranches through October 2027
            </p>
          </div>
        </div>

        {/* Final Navigation / Call to Action */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 sm:flex-row">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>End of interactive demonstration flow</span>
          </div>

          <button
            onClick={onRestart}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-primary px-9 py-3.5 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/25 transition hover:brightness-110 active:scale-95"
          >
            <RotateCcw size={16} />
            <span>Restart Demo ↻</span>
          </button>
        </div>
      </div>
    </div>
  )
}
