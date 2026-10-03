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

// =============================================================================
// Matching Engine Types
// =============================================================================

export type MatchStatus = 'pending' | 'accepted' | 'rejected' | 'expired'

export interface ScoreBreakdown {
  interest: number
  loan_amount: number
  tenure: number
  collateral: number
  capacity: number
}

export interface LenderSummary {
  max_loan_amount: number
  min_interest_rate: number
  max_tenure: number
  available_capacity?: number
  collateral_required: boolean
}

export interface MatchCandidate {
  match_id: number
  lender_id: number
  match_score: number
  status: MatchStatus
  score_breakdown: ScoreBreakdown
  lender_summary?: LenderSummary | null
}

export interface FindMatchesResponse {
  matches: MatchCandidate[]
  message?: string | null
}

export interface Match {
  id: number
  borrower_id: number
  lender_id: number
  match_score: number
  status: MatchStatus
  score_breakdown?: ScoreBreakdown | null
  created_at: string
  updated_at: string
}

export interface BorrowerProfileCreatePayload {
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

export interface BorrowerProfileResponse extends BorrowerProfileCreatePayload {
  id: number
  user_id: number
  created_at: string
  updated_at: string
}

export interface LenderProfileCreatePayload {
  max_loan_amount: number
  min_interest_rate: number
  max_tenure: number
  min_expected_return: number
  collateral_required: boolean
  available_capacity?: number | null
}

export interface LenderProfileResponse extends LenderProfileCreatePayload {
  id: number
  user_id: number
  available_capacity: number
  created_at: string
  updated_at: string
}

// =============================================================================
// Negotiation Session Types (LangGraph)
// =============================================================================

export interface NegotiationOfferTerms {
  amount: number
  interest_rate: number
  tenure_months: number
  upfront_payment: number
}

export interface NegotiationVerification {
  valid: boolean
  violations: string[]
  emi: number
  total_repayment?: number
  total_interest?: number
  borrower_utility: number
  lender_utility: number
}

export interface NegotiationHistoryEvent {
  round: number
  agent: 'borrower' | 'lender' | 'system' | string
  action: 'proposal' | 'counter' | 'accept' | 'reject' | string
  reason?: string | null
  offer?: {
    amount: number
    interest_rate: number
    tenure_months: number
    upfront_payment: number
  } | null
  verification?: NegotiationVerification | null
}

export interface NegotiationSessionResponse {
  session_id: number
  match_id: number
  borrower_id: number
  lender_id: number
  status: string
  round_number: number
  max_rounds: number
  agreement_found: boolean
  current_offer?: {
    amount: number
    interest_rate: number
    tenure_months: number
    upfront_payment: number
  } | null
  final_proposal?: {
    amount: number
    interest_rate: number
    tenure_months: number
    upfront_payment: number
  } | null
  verification?: NegotiationVerification | null
  history: NegotiationHistoryEvent[]
  demo_mode?: boolean
  created_at: string
  updated_at: string
}

export interface NegotiationOfferResponse {
  id: number
  session_id: number
  round_number: number
  agent_type: string
  amount: number
  interest_rate: number
  tenure_months: number
  upfront_payment: number
  position: string
  reason?: string | null
  is_valid: boolean
  verification_result?: NegotiationVerification | null
  created_at: string
}

// =============================================================================
// Error Handling
// =============================================================================

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
        detailMessage = data.detail
          .map((err: { msg?: string }) => err.msg || 'Validation error')
          .join(', ')
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

// =============================================================================
// Profile API Functions
// =============================================================================

export async function createBorrowerProfile(
  payload: BorrowerProfileCreatePayload,
  token?: string | null,
): Promise<BorrowerProfileResponse> {
  return authenticatedRequest<BorrowerProfileResponse>(
    '/api/backend/borrower/profile',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    token,
  )
}

export async function getBorrowerProfile(
  token?: string | null,
): Promise<BorrowerProfileResponse> {
  return authenticatedRequest<BorrowerProfileResponse>(
    '/api/backend/borrower/profile',
    {
      method: 'GET',
    },
    token,
  )
}

export async function updateBorrowerProfile(
  payload: Partial<BorrowerProfileCreatePayload>,
  token?: string | null,
): Promise<BorrowerProfileResponse> {
  return authenticatedRequest<BorrowerProfileResponse>(
    '/api/backend/borrower/profile',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    token,
  )
}

/**
 * Saves a borrower profile to backend: creates if not exists, updates if exists.
 */
export async function saveBorrowerProfile(
  payload: BorrowerProfileCreatePayload,
  token?: string | null,
): Promise<BorrowerProfileResponse> {
  try {
    return await createBorrowerProfile(payload, token)
  } catch (err) {
    if (err instanceof ApiError && err.status === 400 && err.message.includes('already exists')) {
      return await updateBorrowerProfile(payload, token)
    }
    throw err
  }
}

export async function createLenderProfile(
  payload: LenderProfileCreatePayload,
  token?: string | null,
): Promise<LenderProfileResponse> {
  return authenticatedRequest<LenderProfileResponse>(
    '/api/backend/lender/profile',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    token,
  )
}

export async function getLenderProfile(
  token?: string | null,
): Promise<LenderProfileResponse> {
  return authenticatedRequest<LenderProfileResponse>(
    '/api/backend/lender/profile',
    {
      method: 'GET',
    },
    token,
  )
}

export async function updateLenderProfile(
  payload: Partial<LenderProfileCreatePayload>,
  token?: string | null,
): Promise<LenderProfileResponse> {
  return authenticatedRequest<LenderProfileResponse>(
    '/api/backend/lender/profile',
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    },
    token,
  )
}

/**
 * Saves a lender profile to backend: creates if not exists, updates if exists.
 */
export async function saveLenderProfile(
  payload: LenderProfileCreatePayload,
  token?: string | null,
): Promise<LenderProfileResponse> {
  try {
    return await createLenderProfile(payload, token)
  } catch (err) {
    if (err instanceof ApiError && err.status === 400 && err.message.includes('already exists')) {
      return await updateLenderProfile(payload, token)
    }
    throw err
  }
}

// =============================================================================
// Matching Engine API Functions
// =============================================================================

/**
 * Discovers and ranks compatible lenders for the authenticated borrower.
 */
export async function findLenderMatches(
  token?: string | null,
): Promise<FindMatchesResponse> {
  return authenticatedRequest<FindMatchesResponse>(
    '/api/backend/matching/find',
    {
      method: 'POST',
    },
    token,
  )
}

/**
 * Returns matches involving the authenticated user (borrower or lender).
 */
export async function getMyMatches(
  token?: string | null,
): Promise<Match[]> {
  return authenticatedRequest<Match[]>(
    '/api/backend/matching/my-matches',
    {
      method: 'GET',
    },
    token,
  )
}

/**
 * Accepts a match and executes capacity reservation on the backend.
 */
export async function acceptMatch(
  matchId: number,
  token?: string | null,
): Promise<Match> {
  return authenticatedRequest<Match>(
    `/api/backend/matching/${matchId}/accept`,
    {
      method: 'POST',
    },
    token,
  )
}

/**
 * Rejects a match and restores lender capacity if previously accepted.
 */
export async function rejectMatch(
  matchId: number,
  token?: string | null,
): Promise<Match> {
  return authenticatedRequest<Match>(
    `/api/backend/matching/${matchId}/reject`,
    {
      method: 'POST',
    },
    token,
  )
}

// =============================================================================
// Real LangGraph Negotiation API
// =============================================================================

/**
 * Creates or retrieves a negotiation session for an accepted match.
 */
export async function createNegotiationSession(
  matchId: number,
  token?: string | null,
): Promise<NegotiationSessionResponse> {
  return authenticatedRequest<NegotiationSessionResponse>(
    '/api/backend/negotiations/session',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ match_id: matchId }),
    },
    token,
  )
}

/**
 * Starts/executes the LangGraph negotiation session and returns the completed session.
 */
export async function startNegotiationSession(
  sessionId: number,
  token?: string | null,
): Promise<NegotiationSessionResponse> {
  return authenticatedRequest<NegotiationSessionResponse>(
    `/api/backend/negotiations/${sessionId}/start`,
    {
      method: 'POST',
    },
    token,
  )
}

/**
 * Returns the current/final state of a negotiation session.
 */
export async function getNegotiationSession(
  sessionId: number,
  token?: string | null,
): Promise<NegotiationSessionResponse> {
  return authenticatedRequest<NegotiationSessionResponse>(
    `/api/backend/negotiations/${sessionId}`,
    {
      method: 'GET',
    },
    token,
  )
}

/**
 * Returns persisted negotiation offers for a session.
 */
export async function getNegotiationOffers(
  sessionId: number,
  token?: string | null,
): Promise<NegotiationOfferResponse[]> {
  return authenticatedRequest<NegotiationOfferResponse[]>(
    `/api/backend/negotiations/${sessionId}/offers`,
    {
      method: 'GET',
    },
    token,
  )
}

// =============================================================================
// Legacy Negotiation Flow (Preserved)
// =============================================================================

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