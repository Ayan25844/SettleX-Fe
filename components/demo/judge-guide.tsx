'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, Lightbulb } from 'lucide-react'

interface JudgeGuideProps {
  step: number
  title: string
  what: string
  why: string
  next: string
}

export function JudgeGuide({ step, title, what, why, next }: JudgeGuideProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[0.04] via-emerald-500/[0.02] to-sky-500/[0.04] p-4 text-xs shadow-sm transition-all sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/15 text-primary">
            <Lightbulb size={15} />
          </div>
          <div>
            <span className="font-semibold uppercase tracking-wider text-primary">
              Judge Evaluation Guide · Step {step}: {title}
            </span>
            <p className="text-[11px] text-muted-foreground hidden sm:block">
              Hackathon Context: Explaining the fintech mechanics of this step
            </p>
          </div>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1 rounded-lg border border-border bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
          aria-label="Toggle Guide"
        >
          <span>{collapsed ? 'Show' : 'Hide'} Guide</span>
          {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-4 grid gap-3 border-t border-border/60 pt-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/50 bg-card/60 p-3">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-600">
                1
              </span>
              What is happening?
            </p>
            <p className="mt-1.5 leading-relaxed text-muted-foreground">{what}</p>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-3">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-sky-500/20 text-[10px] font-bold text-sky-600">
                2
              </span>
              Why is it happening?
            </p>
            <p className="mt-1.5 leading-relaxed text-muted-foreground">{why}</p>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/60 p-3">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-600">
                3
              </span>
              What does SettleX do next?
            </p>
            <p className="mt-1.5 leading-relaxed text-muted-foreground">{next}</p>
          </div>
        </div>
      )}
    </div>
  )
}
