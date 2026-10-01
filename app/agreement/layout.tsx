import type { ReactNode } from 'react'
import { AgreementConnection } from '@/components/agreement-connection'

export default function AgreementLayout({ children }: { children: ReactNode }) {
  return <AgreementConnection>{children}</AgreementConnection>
}