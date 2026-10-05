import React, { Suspense } from 'react'
import { Metadata } from 'next'
import { DemoController } from '@/components/demo/demo-controller'

export const metadata: Metadata = {
  title: 'Interactive Demo Mode · SettleX',
  description:
    'End-to-End interactive demonstration of the SettleX AI-powered financial negotiation platform with simulated data.',
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Loading SettleX Demo...
            </p>
          </div>
        </div>
      }
    >
      <DemoController />
    </Suspense>
  )
}
