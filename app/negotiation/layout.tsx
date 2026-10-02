import type { ReactNode } from 'react'
import { NegotiationConnection } from '@/components/negotiation-connection'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function NegotiationLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['borrower', 'lender', 'admin']}>
      <NegotiationConnection />
      {children}
    </ProtectedRoute>
  )
}