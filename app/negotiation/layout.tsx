import type { ReactNode } from 'react'
import { NegotiationConnection } from '@/components/negotiation-connection'

export default function NegotiationLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <NegotiationConnection />
      {children}
    </>
  )
}