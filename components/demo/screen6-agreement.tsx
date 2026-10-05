'use client'

import React, { useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileCheck2,
  FileSignature,
  FileText,
  Lock,
  Percent,
  Receipt,
  Scale,
  Shield,
  ShieldCheck,
} from 'lucide-react'
import { DEMO_AGREEMENT, formatINR } from '@/lib/demo-data'
import { JudgeGuide } from './judge-guide'

interface Screen6AgreementProps {
  onNext: () => void
  onBack: () => void
}

export function Screen6Agreement({ onNext, onBack }: Screen6AgreementProps) {
  const [isSimulatedConfirmed, setIsSimulatedConfirmed] = useState(false)
  const [showErrorHint, setShowErrorHint] = useState(false)

  const {
    caseId,
    creditor,
    borrower,
    originalDebt,
    negotiatedSettlement,
    estimatedSavings,
    paymentPlan,
    status,
  } = DEMO_AGREEMENT

  const handleConfirm = () => {
    if (!isSimulatedConfirmed) {
      setShowErrorHint(true)
      return
    }
    onNext()
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Judge Walkthrough Guide */}
      <JudgeGuide
        step={6}
        title="Settlement Agreement & Legal Deed"
        what="Formal contract documentation reflecting the negotiated ₹5,47,690 settlement (35% debt reduction) with a 12-month payment schedule."
        why="Legal finality is crucial in debt workouts. A standardized deed guarantees that upon timely fulfillment, the borrower receives full debt discharge (NOC) without residual collections."
        next="Confirm agreement to lock the transaction, generate the compliance certificate, and activate the recovery dashboard."
      />

      {/* Main Card */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <FileSignature size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Screen 6 · Legal Deed
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Settlement Agreement
              </h1>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Case ID: <span className="font-mono font-semibold text-foreground">{caseId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={15} />
            <span>🟢 {status}</span>
          </div>
        </div>

        {/* Contract-styled parchment / summary container */}
        <div className="mt-6 rounded-2xl border border-border/80 bg-card/60 p-6 shadow-inner">
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Binding Bilateral Accord
              </p>
              <p className="text-sm font-bold text-foreground">
                Creditor Consortium (HDFC Lead) & {borrower}
              </p>
            </div>
            <span className="font-mono text-xs text-muted-foreground">STX-EXEC-2026-V1</span>
          </div>

          {/* 4 Core Financial Terms Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Original Debt */}
            <div className="rounded-xl border border-border/60 bg-card/40 p-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Original Debt
              </span>
              <p className="mt-1 text-xl font-bold line-through text-muted-foreground">
                {formatINR(originalDebt)}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">Pre-negotiation ledger</p>
            </div>

            {/* Negotiated Settlement */}
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Negotiated Settlement
              </span>
              <p className="mt-1 text-2xl font-black text-primary">
                {formatINR(negotiatedSettlement)}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground font-medium">
                Approved full & final amount
              </p>
            </div>

            {/* Estimated Savings */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Estimated Savings
              </span>
              <p className="mt-1 text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatINR(estimatedSavings)}
              </p>
              <p className="mt-1 text-[10px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">
                35% total debt reduction
              </p>
            </div>

            {/* Payment Plan */}
            <div className="rounded-xl border border-border/60 bg-card/40 p-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Payment Plan
              </span>
              <p className="mt-1 text-xs font-bold text-foreground leading-snug">
                {paymentPlan}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Direct NACH escrow schedule
              </p>
            </div>
          </div>

          {/* Standard Terms & Conditions Excerpts */}
          <div className="mt-6 rounded-xl border border-border/50 bg-card/30 p-4 text-xs space-y-2.5 text-muted-foreground">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-[11px]">
              Key Covenant Provisions:
            </h4>
            <div className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 shrink-0 text-primary" />
              <span>
                <strong>Extinguishment of Liability:</strong> Upon punctual settlement of all 12 tranches, all original loan facilities shall be permanently satisfied in full without recourse.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 shrink-0 text-primary" />
              <span>
                <strong>Cessation of Recovery Activities:</strong> Creditors agree to immediately withdraw third-party recovery agencies and suspend judicial recovery filings.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <Check size={14} className="mt-0.5 shrink-0 text-primary" />
              <span>
                <strong>Credit Bureau Reporting:</strong> Account status shall be updated to &quot;Settled - In Full Compliance&quot; across CIBIL, Experian, and CRIF High Mark within 30 days of final installment.
              </span>
            </div>
          </div>
        </div>

        {/* Mandatory Interactive Demonstration Checkbox */}
        <div className="mt-6 rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-5">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isSimulatedConfirmed}
              onChange={(e) => {
                setIsSimulatedConfirmed(e.target.checked)
                if (e.target.checked) setShowErrorHint(false)
              }}
              className="mt-1 h-5 w-5 rounded border-border text-primary focus:ring-primary accent-primary"
            />
            <div className="text-xs">
              <span className="font-bold text-foreground">
                I understand that this is a simulated agreement for demonstration purposes.
              </span>
              <p className="text-muted-foreground mt-0.5">
                Checking this acknowledges that all monetary figures, creditor names, and covenants are
                synthetic and part of the SettleX hackathon prototype.
              </p>
            </div>
          </label>

          {showErrorHint && !isSimulatedConfirmed && (
            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-destructive animate-in fade-in">
              <AlertCircle size={14} />
              <span>Please check the simulated agreement confirmation box above to proceed.</span>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 sm:flex-row">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft size={16} />
            <span>Back to Negotiation</span>
          </button>

          <button
            onClick={handleConfirm}
            className={`inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold shadow-lg transition active:scale-95 ${
              isSimulatedConfirmed
                ? 'bg-primary text-primary-foreground shadow-primary/25 hover:brightness-110'
                : 'bg-primary/60 text-primary-foreground/80 hover:bg-primary'
            }`}
          >
            <Lock size={15} />
            <span>Confirm Settlement →</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
