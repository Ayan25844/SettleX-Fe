'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import {
  createNegotiationSession,
  startNegotiationSession,
  type NegotiationSessionResponse,
  ApiError,
} from '@/lib/api'

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export interface NegotiationContextType {
  session: NegotiationSessionResponse | null
  loading: boolean
  isRunning: boolean
  error: string | null
  statusMessage: string | null
  runNegotiation: () => Promise<void>
}

const NegotiationContext = createContext<NegotiationContextType | null>(null)

export function useNegotiation(): NegotiationContextType {
  const context = useContext(NegotiationContext)
  if (!context) {
    throw new Error('useNegotiation must be used within a NegotiationProvider')
  }
  return context
}

export function NegotiationProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<NegotiationSessionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const executingRef = useRef(false)

  const executeNegotiation = useCallback(async (forceRestart = false) => {
    if (executingRef.current) return
    executingRef.current = true
    setError(null)
    setLoading(true)

    try {
      // 1. Read accepted match from sessionStorage
      const rawMatch = typeof window !== 'undefined' ? sessionStorage.getItem('settlex.accepted_match') : null
      if (!rawMatch) {
        throw new Error('No accepted match found. Please choose a compatible lender from the Matches page first.')
      }

      let parsedMatch: { id?: number; match_id?: number }
      try {
        parsedMatch = JSON.parse(rawMatch)
      } catch {
        throw new Error('Invalid match data in session. Please return to the Matches page and select a lender.')
      }

      const matchId = parsedMatch.id ?? parsedMatch.match_id
      if (!matchId) {
        throw new Error('Match identifier missing. Please choose a compatible lender from the Matches page.')
      }

      // Check if we already have a finished negotiation result for this match
      if (!forceRestart) {
        const cachedResultStr = sessionStorage.getItem('settlex.negotiation_result')
        if (cachedResultStr) {
          try {
            const cached = JSON.parse(cachedResultStr) as NegotiationSessionResponse
            if (cached.match_id === matchId) {
              setSession(cached)
              setLoading(false)
              setIsRunning(false)
              executingRef.current = false
              return
            }
          } catch {
            sessionStorage.removeItem('settlex.negotiation_result')
          }
        }
      }

      // 2. Create or retrieve negotiation session from backend
      setStatusMessage('Creating negotiation session for accepted match...')
      const newSession = await createNegotiationSession(matchId)
      sessionStorage.setItem('settlex.negotiation_session', JSON.stringify(newSession))
      setSession(newSession)

      // If the session was already completed on backend (agreement reached or round limit), use it
      if (newSession.status === 'completed' || newSession.agreement_found) {
        sessionStorage.setItem('settlex.negotiation_result', JSON.stringify(newSession))
        setStatusMessage(null)
        setLoading(false)
        setIsRunning(false)
        executingRef.current = false
        return
      }

      // 3. Start the LangGraph autonomous negotiation
      setIsRunning(true)
      setStatusMessage('Autonomous advocates negotiating via LangGraph...')
      const finalResult = await startNegotiationSession(newSession.session_id)

      // 4. Save final response to settlex.negotiation_result
      sessionStorage.setItem('settlex.negotiation_result', JSON.stringify(finalResult))
      setSession(finalResult)
      setStatusMessage(null)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unable to complete negotiation with the SettleX backend.')
      }
    } finally {
      setLoading(false)
      setIsRunning(false)
      executingRef.current = false
    }
  }, [])

  useEffect(() => {
    void executeNegotiation()
  }, [executeNegotiation])

  return (
    <NegotiationContext.Provider
      value={{
        session,
        loading,
        isRunning,
        error,
        statusMessage,
        runNegotiation: () => executeNegotiation(true),
      }}
    >
      {children}
    </NegotiationContext.Provider>
  )
}

export function NegotiationConnection() {
  const { session, loading, isRunning, error, statusMessage, runNegotiation } = useNegotiation()

  const finalProposal = session?.final_proposal || session?.current_offer
  const verification = session?.verification

  return (
    <section
      aria-live="polite"
      className="mx-auto mt-5 max-w-7xl rounded-2xl border border-border bg-card/60 px-5 py-4 backdrop-blur-md lg:px-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {loading || isRunning ? (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : error ? (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/15 text-destructive">
              <AlertCircle size={18} />
            </div>
          ) : session?.agreement_found && verification?.valid ? (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
          ) : session?.status === 'rejected' ? (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/15 text-destructive">
              <AlertCircle size={18} />
            </div>
          ) : (
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-400">
              <AlertTriangle size={18} />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">
                Autonomous Negotiation Session
              </p>
              {session && (
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  Session #{session.session_id}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm font-semibold">
              {loading || isRunning
                ? statusMessage || 'Running LangGraph autonomous advocates…'
                : error
                  ? 'Negotiation could not be completed'
                  : session?.agreement_found && verification?.valid
                    ? 'Feasible agreement reached & verified by backend'
                    : session?.status === 'rejected'
                      ? 'Negotiation rejected by advocate boundaries'
                      : 'Negotiation reached round limit without convergence'}
            </p>
            {error && (
              <p className="mt-1 text-xs text-destructive">{error}</p>
            )}
            {!error && session && !loading && !isRunning && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {session.agreement_found && verification?.valid
                  ? `Deterministic verifier passed in Round ${session.round_number}.`
                  : `Completed ${session.round_number} of ${session.max_rounds} rounds without reaching mutual agreement.`}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {finalProposal && session?.agreement_found && verification?.valid && (
            <dl className="hidden grid-cols-4 gap-x-6 gap-y-1 text-sm md:grid">
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Amount</dt>
                <dd className="font-semibold">{money.format(finalProposal.amount)}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Rate</dt>
                <dd className="font-semibold">{finalProposal.interest_rate}%</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Tenure</dt>
                <dd className="font-semibold">{finalProposal.tenure_months} mo</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">Verified EMI</dt>
                <dd className="font-semibold text-primary">{money.format(verification.emi)}</dd>
              </div>
            </dl>
          )}

          {error && (
            <div className="flex items-center gap-2">
              <Link
                href="/matches"
                className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground"
              >
                Back to Matches
              </Link>
              <button
                type="button"
                onClick={() => void runNegotiation()}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition hover:brightness-110"
              >
                <RefreshCw size={12} />
                <span>Retry</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}