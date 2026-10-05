'use client'

import React from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  FileCheck2,
  Gauge,
  HelpCircle,
  Layers,
  Send,
  Shield,
  Sparkles,
  Target,
} from 'lucide-react'
import { DEMO_STRATEGY, formatINR } from '@/lib/demo-data'
import { JudgeGuide } from './judge-guide'

interface Screen4StrategyProps {
  onNext: () => void
  onBack: () => void
}

export function Screen4Strategy({ onNext, onBack }: Screen4StrategyProps) {
  const {
    targetSettlement,
    openingOffer,
    maxBudget,
    paymentStructure,
    negotiationPoints,
  } = DEMO_STRATEGY

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Judge Walkthrough Guide */}
      <JudgeGuide
        step={4}
        title="AI Negotiation Plan Formulation"
        what="SettleX codifies Rahul's bargaining protocol: Opening Anchor of ₹4,85,000, Target of ₹5,47,690, and Walk-Away Ceiling of ₹5,50,000."
        why="Unstructured human negotiations break down over emotions. Algorithmic boundary parameters protect the borrower from agreeing to unpayable terms while proving genuine resolution intent."
        next="Open the live creditor negotiation interface to dispatch the proposal to HDFC Bank's risk committee."
      />

      {/* Main Card */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        {/* Header */}
        <div className="border-b border-border/80 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Screen 4 · Strategy Engine
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            AI Negotiation Plan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Personalized negotiation strategy generated from the borrower's financial profile.
          </p>
        </div>

        {/* 4 Core Quantitative Strategy Metrics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Target Settlement */}
          <div className="rounded-2xl border border-primary/30 bg-primary/[0.05] p-5 shadow-sm">
            <div className="flex items-center justify-between text-primary">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Target Settlement
              </span>
              <Target size={16} />
            </div>
            <p className="mt-2 text-2xl font-black tracking-tight text-primary">
              {formatINR(targetSettlement)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              35% haircut · Optimal Nash point
            </p>
          </div>

          {/* Opening Offer */}
          <div className="rounded-2xl border border-border/70 bg-card/50 p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Opening Offer</span>
              <Coins size={16} className="text-sky-500" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {formatINR(openingOffer)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Anchors negotiation to maximize concession
            </p>
          </div>

          {/* Maximum Settlement Budget */}
          <div className="rounded-2xl border border-border/70 bg-card/50 p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Max Settlement Budget
              </span>
              <Shield size={16} className="text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
              {formatINR(maxBudget)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Hard stop walk-away limit for borrower
            </p>
          </div>

          {/* Proposed Payment Structure */}
          <div className="rounded-2xl border border-border/70 bg-card/50 p-5 shadow-sm">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Payment Structure</span>
              <Layers size={16} className="text-emerald-500" />
            </div>
            <p className="mt-2 text-base font-bold tracking-tight text-foreground leading-snug">
              {paymentStructure}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              ₹1.5L initial escrow + 12 monthly tranches
            </p>
          </div>
        </div>

        {/* Visual Bargaining Range Slider / Gauge */}
        <div className="mt-6 rounded-2xl border border-border/60 bg-card/30 p-5">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Bargaining Spectrum & Boundaries</span>
            <span className="font-semibold text-primary">Feasible Zone: ₹4.85L – ₹5.50L</span>
          </div>

          <div className="relative mt-4 h-4 w-full rounded-full bg-border/50">
            {/* Feasible Zone */}
            <div
              className="absolute h-full rounded-full bg-gradient-to-r from-sky-400 via-primary to-emerald-400"
              style={{ left: '15%', width: '65%' }}
            />
            {/* Opening Offer Pin */}
            <div
              className="absolute -top-1 h-6 w-1 rounded-full bg-sky-500 shadow-md"
              style={{ left: '15%' }}
              title="Opening Offer: ₹4,85,000"
            />
            {/* Target Pin */}
            <div
              className="absolute -top-1.5 h-7 w-1.5 rounded-full bg-primary ring-2 ring-background shadow-md"
              style={{ left: '60%' }}
              title="Target Settlement: ₹5,47,690"
            />
            {/* Max Budget Pin */}
            <div
              className="absolute -top-1 h-6 w-1 rounded-full bg-amber-500 shadow-md"
              style={{ left: '80%' }}
              title="Max Budget: ₹5,50,000"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>₹4.85L (Opening Offer)</span>
            <span className="font-bold text-primary">₹5.48L (Target Equilibrium)</span>
            <span>₹5.50L (Max Cap)</span>
          </div>
        </div>

        {/* Negotiation Points Checklist */}
        <div className="mt-6 rounded-2xl border border-border/70 bg-card/40 p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck2 size={18} className="text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Algorithmic Negotiation Principles
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-1">
            {negotiationPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-xl border border-border/40 bg-card/30 p-3.5 text-xs transition hover:border-primary/20"
              >
                <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{point}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {point === 'Demonstrate consistent repayment intent' &&
                      'Presents verified historical track record prior to hardship event.'}
                    {point === 'Highlight current repayment capacity' &&
                      'Submits verified bank cashflow confirming surplus capacity of ₹25,500.'}
                    {point === 'Request reduction of accumulated interest/penalties' &&
                      'Demands full reversal of 24.5%+ compounding penalties & legal collection costs.'}
                    {point === 'Offer structured payment schedule' &&
                      'Provides automated NACH mandate for immediate 12-month direct bank clearance.'}
                    {point === 'Avoid commitment beyond sustainable monthly capacity' &&
                      'Guarantees zero re-default risk by keeping commitments strictly within cashflow bounds.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-6 sm:flex-row">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft size={16} />
            <span>Back to AI Analysis</span>
          </button>

          <button
            onClick={onNext}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:brightness-110 active:scale-95 sm:w-auto"
          >
            <Send size={15} />
            <span>Send Negotiation Request →</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
