'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Flame,
  Home,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

export interface DemoProgressBarProps {
  currentStep: number // 1 to 8
  onSelectStep: (step: number) => void
  onRestart: () => void
}

const STAGES = [
  { id: 1, label: 'Profile', steps: [1] },
  { id: 2, label: 'Analyze', steps: [2, 3] },
  { id: 3, label: 'Negotiate', steps: [4, 5] },
  { id: 4, label: 'Settle', steps: [6, 7] },
  { id: 5, label: 'Recover', steps: [8] },
]

const STEP_TITLES: Record<number, string> = {
  1: 'Borrower Profile',
  2: 'Debt Overview',
  3: 'AI Financial Analysis',
  4: 'Negotiation Strategy',
  5: 'Creditor Negotiation',
  6: 'Settlement Agreement',
  7: 'Settlement Confirmation',
  8: 'Financial Recovery Dashboard',
}

export function DemoProgressBar({
  currentStep,
  onSelectStep,
  onRestart,
}: DemoProgressBarProps) {
  // Determine active stage (1 to 5)
  const currentStage =
    STAGES.find((s) => s.steps.includes(currentStep))?.id || 1

  return (
    <div className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
      {/* Top Banner with Demo Badge and Quick Actions */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            title="Exit demo to home"
          >
            <Home size={13} />
            <span className="hidden sm:inline">Home</span>
          </Link>

          {/* Persistent Small Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>DEMO MODE · SIMULATED DATA</span>
          </div>
        </div>

        {/* Step info and restart */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-muted-foreground hidden md:inline">
            Screen <span className="font-semibold text-foreground">{currentStep}</span> of 8:{' '}
            <span className="text-foreground">{STEP_TITLES[currentStep]}</span>
          </span>

          {currentStep > 1 && (
            <button
              onClick={() => onSelectStep(currentStep - 1)}
              className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              title="Previous screen"
            >
              <ArrowLeft size={12} />
              <span className="hidden xs:inline">Back</span>
            </button>
          )}

          <button
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/[0.03] px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            title="Restart demo from screen 1"
          >
            <RotateCcw size={12} />
            <span>Restart</span>
          </button>
        </div>
      </div>

      {/* 5-Stage Progress Indicator */}
      <div className="mx-auto max-w-7xl px-4 pb-2.5 pt-1 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 text-xs no-scrollbar">
          {STAGES.map((stage, idx) => {
            const isCompleted = currentStage > stage.id
            const isActive = currentStage === stage.id
            const isUpcoming = currentStage < stage.id

            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => onSelectStep(stage.steps[0])}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 transition-all ${
                    isActive
                      ? 'border border-primary/40 bg-primary/15 font-semibold text-primary shadow-sm'
                      : isCompleted
                        ? 'text-muted-foreground hover:text-foreground'
                        : 'text-muted-foreground/60 hover:text-muted-foreground'
                  }`}
                >
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-600'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? '✓' : stage.id}
                  </span>
                  <span className="tracking-tight">{stage.label}</span>
                </button>

                {idx < STAGES.length - 1 && (
                  <ChevronRight
                    size={13}
                    className={`shrink-0 ${
                      isCompleted ? 'text-emerald-500/70' : 'text-muted-foreground/30'
                    }`}
                  />
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Linear progress fill across the 8 screens */}
        <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-border/40">
          <div
            className="h-full bg-gradient-to-r from-primary via-emerald-400 to-sky-500 transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
