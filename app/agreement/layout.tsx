import type { ReactNode } from 'react'
import { AgreementConnection } from '@/components/agreement-connection'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function AgreementLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['borrower', 'lender', 'admin']}>
      <AgreementConnection>{children}</AgreementConnection>
    </ProtectedRoute>
  )
}