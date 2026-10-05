'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DemoProgressBar } from './demo-progress-bar'
import { Screen1Profile } from './screen1-profile'
import { Screen2Debt } from './screen2-debt'
import { Screen3Analysis } from './screen3-analysis'
import { Screen4Strategy } from './screen4-strategy'
import { Screen5Negotiation } from './screen5-negotiation'
import { Screen6Agreement } from './screen6-agreement'
import { Screen7Confirmation } from './screen7-confirmation'
import { Screen8Recovery } from './screen8-recovery'

export function DemoController() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawStep = searchParams.get('step')
  const initialStep = rawStep ? Math.max(1, Math.min(8, parseInt(rawStep, 10) || 1)) : 1

  const [currentStep, setCurrentStep] = useState<number>(initialStep)

  // Sync state if URL changes externally (e.g. browser back/forward)
  useEffect(() => {
    if (rawStep) {
      const parsed = Math.max(1, Math.min(8, parseInt(rawStep, 10) || 1))
      setCurrentStep(parsed)
    }
  }, [rawStep])

  const setStep = (step: number) => {
    const clamped = Math.max(1, Math.min(8, step))
    setCurrentStep(clamped)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const url = new URL(window.location.href)
    url.searchParams.set('step', clamped.toString())
    window.history.pushState({}, '', url.toString())
  }

  const handleNext = () => setStep(currentStep + 1)
  const handleBack = () => setStep(currentStep - 1)
  const handleRestart = () => setStep(1)

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        {/* Sticky Demo Progress Bar & Status */}
        <DemoProgressBar
          currentStep={currentStep}
          onSelectStep={setStep}
          onRestart={handleRestart}
        />

        {/* Screen Container */}
        <main className="transition-opacity duration-200">
          {currentStep === 1 && <Screen1Profile onNext={handleNext} />}
          {currentStep === 2 && <Screen2Debt onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && <Screen3Analysis onNext={handleNext} onBack={handleBack} />}
          {currentStep === 4 && <Screen4Strategy onNext={handleNext} onBack={handleBack} />}
          {currentStep === 5 && <Screen5Negotiation onNext={handleNext} onBack={handleBack} />}
          {currentStep === 6 && <Screen6Agreement onNext={handleNext} onBack={handleBack} />}
          {currentStep === 7 && <Screen7Confirmation onNext={handleNext} />}
          {currentStep === 8 && <Screen8Recovery onRestart={handleRestart} />}
        </main>
      </div>

      {/* Persistent Minimal Footer */}
      <footer className="mt-12 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <p>© 2026 SettleX · AI-Powered Bilateral Financial Negotiation</p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="font-semibold text-foreground">DEMO MODE · SIMULATED DATA</span>
            <span className="text-muted-foreground">· No real financial or credit impact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
