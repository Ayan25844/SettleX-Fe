import { getStoredToken } from './auth-storage'

export type BorrowerProfile = {
  loan_amount: number
  monthly_income: number
  monthly_expenses: number
  existing_emi: number
  max_emi: number
  max_interest_rate: number
  preferred_tenure: number
  max_tenure: number
  collateral_required: boolean
}

export type LenderProfile = {
  max_loan_amount: number
  min_interest_rate: number
  max_tenure: number
  min_expected_return: number
  collateral_required: boolean
}

export type NegotiationResponse = {
  agreement_found: boolean
  candidates_checked: number
  message?: string
  best_deal?: {
    proposal: {
      amount: number
      interest_rate: number
      tenure_months: number
      upfront_payment: number
    }
    emi: number
    borrower_utility: number
    lender_utility: number
    nash_product: number
  }
}

export type UserRole = 'borrower' | 'lender' | 'admin'

export interface User {
  id: number
  full_name: string
  email: string
  role: UserRole
  is_active: boolean
  created_at?: string
}

export interface RegisterRequest {
  full_name: string
  email: string
  password: string
  role: 'borrower' | 'lender'
}

export interface LoginResponse {
  access_token: string
  token_type: string
  user: User
}

export interface RoleUpdateRequest {
  role: UserRole
}

export interface MessageResponse {
  message: string
}

export class ApiError extends Error {
  status: number
  detail?: string

  constructor(message: string, status: number, detail?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

/**
 * Extracts a human-friendly error message from a backend error response.
 */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  const status = response.status
  let detailMessage = ''

  try {
    const data = await response.json()
    if (data && typeof data === 'object') {
      if (typeof data.detail === 'string') {
        detailMessage = data.detail
      } else if (Array.isArray(data.detail)) {
        // FastAPI validation errors: [{ loc: [...], msg: "...", type: "..." }]
        detailMessage = data.detail.map((err: { msg?: string }) => err.msg || 'Validation error').join(', ')
      } else if (typeof data.message === 'string') {
        detailMessage = data.message
      }
    }
  } catch {
    // Non-JSON response body
  }

  let defaultMessage = 'An unexpected error occurred'
  if (status === 400) {
    defaultMessage = detailMessage || 'Invalid request'
  } else if (status === 401) {
    defaultMessage = detailMessage || 'Invalid email or password'
  } else if (status === 403) {
    defaultMessage = detailMessage || 'You do not have permission to access this page'
  } else if (status === 404) {
    defaultMessage = detailMessage || 'Requested resource not found'
  } else if (status === 409) {
    defaultMessage = detailMessage || 'Email already registered'
  } else if (status === 422) {
    defaultMessage = detailMessage || 'Please check your inputs and try again'
  } else if (status >= 500) {
    defaultMessage = 'Unable to connect to SettleX backend'
  } else if (detailMessage) {
    defaultMessage = detailMessage
  }

  return new ApiError(defaultMessage, status, detailMessage)
}

/**
 * Centralized authenticated request helper.
 * Automatically injects the Authorization Bearer header.
 */
export async function authenticatedRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const authToken = token || getStoredToken()
  const headers = new Headers(options.headers || {})

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      throw await parseErrorResponse(response)
    }

    return (await response.json()) as T
  } catch (err) {
    if (err instanceof ApiError) {
      throw err
    }
    throw new ApiError('Unable to connect to SettleX backend', 0)
  }
}

export async function checkBackend() {
  const response = await fetch('/api/backend/health', { cache: 'no-store' })

  if (!response.ok) {
    throw new Error('Backend request failed')
  }

  return response.json()
}

export async function registerUser(data: RegisterRequest): Promise<User> {
  try {
    const response = await fetch('/api/backend/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw await parseErrorResponse(response)
    }

    return (await response.json()) as User
  } catch (err) {
    if (err instanceof ApiError) {
      throw err
    }
    throw new ApiError('Unable to connect to SettleX backend', 0)
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    // OAuth2 password flow expects application/x-www-form-urlencoded
    const formData = new URLSearchParams()
    formData.append('username', email.trim().toLowerCase())
    formData.append('password', password)

    const response = await fetch('/api/backend/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      cache: 'no-store',
      body: formData.toString(),
    })

    if (!response.ok) {
      throw await parseErrorResponse(response)
    }

    return (await response.json()) as LoginResponse
  } catch (err) {
    if (err instanceof ApiError) {
      throw err
    }
    throw new ApiError('Unable to connect to SettleX backend', 0)
  }
}

export async function logoutUser(token?: string | null): Promise<MessageResponse> {
  try {
    return await authenticatedRequest<MessageResponse>(
      '/api/backend/auth/logout',
      {
        method: 'POST',
      },
      token,
    )
  } catch {
    // Logout is stateless on backend; local clearance still proceeds
    return { message: 'Logged out successfully' }
  }
}

export async function getCurrentUser(token?: string | null): Promise<User> {
  return authenticatedRequest<User>(
    '/api/backend/auth/me',
    {
      method: 'GET',
    },
    token,
  )
}

export async function getAdminUsers(token?: string | null): Promise<User[]> {
  return authenticatedRequest<User[]>(
    '/api/backend/admin/users',
    {
      method: 'GET',
    },
    token,
  )
}

export async function activateUser(userId: number, token?: string | null): Promise<User> {
  return authenticatedRequest<User>(
    `/api/backend/admin/users/${userId}/activate`,
    {
      method: 'PATCH',
    },
    token,
  )
}

export async function deactivateUser(userId: number, token?: string | null): Promise<User> {
  return authenticatedRequest<User>(
    `/api/backend/admin/users/${userId}/deactivate`,
    {
      method: 'PATCH',
    },
    token,
  )
}

export async function changeUserRole(
  userId: number,
  role: UserRole,
  token?: string | null,
): Promise<User> {
  return authenticatedRequest<User>(
    `/api/backend/admin/users/${userId}/role`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    },
    token,
  )
}

export async function startNegotiation(
  borrower: BorrowerProfile,
  lender: LenderProfile,
  token?: string | null,
) {
  const authToken = token || getStoredToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const response = await fetch('/api/backend/negotiation/start', {
    method: 'POST',
    headers,
    cache: 'no-store',
    body: JSON.stringify({
      borrower,
      lender,
    }),
  })

  if (!response.ok) {
    throw new Error('Negotiation request failed')
  }

  return (await response.json()) as NegotiationResponse
}