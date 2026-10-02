'use client'

import React, { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './auth-provider'
import { UserRole } from '@/lib/api'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated || !user) {
      const redirectUrl = pathname ? `/login?redirect=${encodeURIComponent(pathname)}` : '/login'
      router.replace(redirectUrl)
      return
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Role not authorized for this specific route
      if (user.role === 'borrower') {
        router.replace('/borrower')
      } else if (user.role === 'lender') {
        router.replace('/lender')
      } else if (user.role === 'admin') {
        router.replace('/admin')
      } else {
        router.replace('/login')
      }
    }
  }, [isLoading, isAuthenticated, user, allowedRoles, router, pathname])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_0_24px_oklch(.76_.17_165_/_25%)] animate-pulse">
            <span className="text-xl font-bold italic">S</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Authenticating session...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}
