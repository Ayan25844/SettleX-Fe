import { ConnectedSetupForm } from '@/components/connected-setup-form'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function LenderPage() {
  return (
    <ProtectedRoute allowedRoles={['lender']}>
      <ConnectedSetupForm lender />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: 'Lender setup · SettleX',
  description: 'Define synthetic lending boundaries for SettleX.',
}
