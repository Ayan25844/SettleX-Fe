const TOKEN_KEY = 'settlex_access_token'

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') {
    return null
  }
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string): void {
  if (typeof window === 'undefined') {
    return
  }
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // Local storage might be blocked or full
  }
}

export function clearStoredToken(): void {
  if (typeof window === 'undefined') {
    return
  }
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Local storage might be blocked
  }
}
