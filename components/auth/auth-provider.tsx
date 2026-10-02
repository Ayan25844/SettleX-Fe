'use client'

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { User, getCurrentUser, logoutUser } from '@/lib/api'
import { getStoredToken, setStoredToken, clearStoredToken } from '@/lib/auth-storage'

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, user: User) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Validate and restore user session from stored JWT on initial mount
  useEffect(() => {
    let isMounted = true

    async function initAuth() {
      const storedToken = getStoredToken()

      if (!storedToken) {
        if (isMounted) {
          setUser(null)
          setToken(null)
          setIsLoading(false)
        }
        return
      }

      try {
        const currentUser = await getCurrentUser(storedToken)
        if (isMounted) {
          if (currentUser && currentUser.is_active) {
            setUser(currentUser)
            setToken(storedToken)
          } else {
            clearStoredToken()
            setUser(null)
            setToken(null)
          }
        }
      } catch {
        // Token is invalid, expired, or backend rejected
        clearStoredToken()
        if (isMounted) {
          setUser(null)
          setToken(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void initAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback((newToken: string, newUser: User) => {
    setStoredToken(newToken)
    setToken(newToken)
    setUser(newUser)
  }, [])

  const logout = useCallback(async () => {
    const currentToken = token || getStoredToken()
    try {
      if (currentToken) {
        await logoutUser(currentToken)
      }
    } catch {
      // Backend logout error shouldn't prevent local cleanup
    } finally {
      clearStoredToken()
      setToken(null)
      setUser(null)
      window.location.href = '/login'
    }
  }, [token])

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const currentToken = token || getStoredToken()
    if (!currentToken) {
      setUser(null)
      return null
    }

    try {
      const freshUser = await getCurrentUser(currentToken)
      setUser(freshUser)
      return freshUser
    } catch {
      clearStoredToken()
      setToken(null)
      setUser(null)
      return null
    }
  }, [token])

  const isAuthenticated = useMemo(() => !!(user && token && user.is_active), [user, token])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, token, isAuthenticated, isLoading, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
