import { ConnectedSetupForm } from '@/components/connected-setup-form'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function BorrowerPage() {
  return (
    <ProtectedRoute allowedRoles={['borrower']}>
      <ConnectedSetupForm />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: 'Borrower setup · SettleX',
  description: 'Set your synthetic financial boundaries for SettleX.',
}
