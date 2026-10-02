'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  Gavel,
  Handshake,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  User as UserIcon,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[0_0_24px_oklch(.76_.17_165_/_25%)]">
        <span className="text-lg italic">S</span>
      </span>
      <span className="text-[17px] text-foreground">
        Settle<span className="text-red-600">X</span>
      </span>
    </Link>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
      <Logo />

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
        <Link href="/how-it-works" className="transition hover:text-foreground">
          How it works
        </Link>

        {isAuthenticated && user ? (
          user.role === 'admin' ? (
            <Link href="/admin" className="font-medium text-primary transition hover:brightness-110">
              Admin
            </Link>
          ) : user.role === 'borrower' ? (
            <>
              <Link href="/borrower" className="transition hover:text-foreground">
                Borrower
              </Link>
              <Link href="/matches" className="transition hover:text-foreground">
                Matches
              </Link>
              <Link href="/negotiation" className="transition hover:text-foreground">
                Negotiation
              </Link>
            </>
          ) : (
            <>
              <Link href="/lender" className="transition hover:text-foreground">
                Lender
              </Link>
              <Link href="/lender/matches" className="transition hover:text-foreground">
                Matches
              </Link>
              <Link href="/negotiation" className="transition hover:text-foreground">
                Negotiation
              </Link>
            </>
          )
        ) : (
          <>
            <Link href="/borrower" className="transition hover:text-foreground">
              Borrower
            </Link>
            <Link href="/lender" className="transition hover:text-foreground">
              Lender
            </Link>
          </>
        )}
      </nav>

      {/* Desktop Actions */}
      <div className="hidden items-center gap-3 md:flex">
        {isLoading ? (
          <div className="h-9 w-24 animate-pulse rounded-full bg-white/5" />
        ) : isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3.5 py-1.5 text-xs">
              <UserIcon size={14} className="text-muted-foreground" />
              <span className="font-medium text-foreground">{user.full_name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  user.role === 'admin'
                    ? 'border border-primary/30 bg-primary/15 text-primary'
                    : user.role === 'borrower'
                      ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                      : 'border border-sky-400/30 bg-sky-400/10 text-sky-400'
                }`}
              >
                {user.role}
              </span>
            </div>
            <button
              onClick={() => void logout()}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition hover:border-destructive/40 hover:text-destructive"
              title="Sign out"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg border border-border p-2 md:hidden"
        aria-label="Toggle menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile Menu Overlay */}
      {open && (
        <div className="absolute left-5 right-5 top-16 z-30 rounded-2xl border border-border bg-card p-5 shadow-2xl md:hidden">
          <div className="grid gap-3 text-sm">
            {isAuthenticated && user && (
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div>
                  <p className="font-medium text-foreground">{user.full_name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    user.role === 'admin'
                      ? 'border border-primary/30 bg-primary/15 text-primary'
                      : user.role === 'borrower'
                        ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border border-sky-400/30 bg-sky-400/10 text-sky-400'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            )}

            <Link
              href="/how-it-works"
              onClick={() => setOpen(false)}
              className="py-1 transition hover:text-primary"
            >
              How it works
            </Link>

            {isAuthenticated && user ? (
              user.role === 'admin' ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="py-1 font-semibold text-primary"
                >
                  Admin dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href={user.role === 'borrower' ? '/borrower' : '/lender'}
                    onClick={() => setOpen(false)}
                    className="py-1 transition hover:text-primary"
                  >
                    {user.role === 'borrower' ? 'Borrower' : 'Lender'}
                  </Link>
                  <Link
                    href={user.role === 'borrower' ? '/matches' : '/lender/matches'}
                    onClick={() => setOpen(false)}
                    className="py-1 transition hover:text-primary"
                  >
                    Matches
                  </Link>
                  <Link
                    href="/negotiation"
                    onClick={() => setOpen(false)}
                    className="py-1 text-primary"
                  >
                    Negotiation
                  </Link>
                  <Link
                    href="/agreement"
                    onClick={() => setOpen(false)}
                    className="py-1 transition hover:text-primary"
                  >
                    View agreement
                  </Link>
                </>
              )
            ) : (
              <>
                <Link
                  href="/borrower"
                  onClick={() => setOpen(false)}
                  className="py-1 transition hover:text-primary"
                >
                  Borrower setup
                </Link>
                <Link
                  href="/lender"
                  onClick={() => setOpen(false)}
                  className="py-1 transition hover:text-primary"
                >
                  Lender setup
                </Link>
                <Link
                  href="/negotiation"
                  onClick={() => setOpen(false)}
                  className="py-1 text-primary"
                >
                  Open demo
                </Link>
              </>
            )}

            <div className="mt-2 border-t border-border pt-3">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setOpen(false)
                    void logout()
                  }}
                  className="flex w-full items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-xs font-semibold text-destructive transition hover:bg-destructive/20"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-border px-4 py-2 text-center text-xs font-medium text-foreground transition hover:border-primary/50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground transition hover:brightness-110"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export function Shell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode
  eyebrow?: string
  title?: string
  description?: string
}) {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />
      {title && (
        <div className="mx-auto max-w-7xl px-5 pb-8 pt-10 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[.22em] text-primary">
            {eyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-.04em] sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </main>
  )
}

export function AgentCard({
  type,
  status = 'Negotiating',
}: {
  type: 'borrower' | 'lender'
  status?: string
}) {
  const borrower = type === 'borrower'
  return (
    <div className={`glass rounded-2xl p-5 ${borrower ? 'border-primary/20' : 'border-sky-300/15'}`}>
      <div className="flex items-start justify-between">
        <div
          className={`grid h-11 w-11 place-items-center rounded-xl ${borrower ? 'bg-primary/12 text-primary' : 'bg-sky-300/12 text-sky-300'}`}
        >
          {borrower ? <ShieldCheck size={22} /> : <Building2 size={22} />}
        </div>
        <span className="flex items-center gap-2 text-xs text-primary">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary" />
          {status}
        </span>
      </div>
      <p className="mt-7 text-[11px] font-semibold uppercase tracking-[.18em] text-muted-foreground">
        {borrower ? 'Borrower advocate' : 'Lender advocate'}
      </p>
      <h3 className="mt-1 text-xl font-medium">
        {borrower ? 'Protecting affordability' : 'Optimizing return & risk'}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {borrower
          ? 'Prioritizing liquidity, flexibility, and sustainable repayment.'
          : 'Balancing yield, risk exposure, and downside protection.'}
      </p>
    </div>
  )
}

export function UtilityCard({
  label,
  value,
  accent = 'primary',
}: {
  label: string
  value: string
  accent?: 'primary' | 'sky' | 'violet'
}) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={`mt-2 text-2xl font-semibold ${accent === 'sky' ? 'text-sky-300' : accent === 'violet' ? 'text-violet-300' : 'text-primary'}`}
      >
        {value}
      </p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/7">
        <div
          className={`h-full rounded-full ${accent === 'sky' ? 'bg-sky-300' : accent === 'violet' ? 'bg-violet-300' : 'bg-primary'}`}
          style={{ width: `${Number.parseFloat(value) * 100 || 72}%` }}
        />
      </div>
    </div>
  )
}

export function ProgressIndicator({
  current = 3,
  total = 6,
}: {
  current?: number
  total?: number
}) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span>
        Round {current} of {total}
      </span>
      <div className="flex flex-1 gap-1">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < current ? 'bg-primary' : 'bg-white/10'}`}
          />
        ))}
      </div>
    </div>
  )
}

export function Verifier() {
  const checks = [
    'EMI within borrower affordability limit',
    'Interest rate within allowed range',
    'Tenure within lender policy',
    'No hard constraint violations',
    'Agreement mathematically valid',
  ]
  return (
    <div className="glass rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <FileCheck2 size={19} />
            <p className="text-xs font-semibold uppercase tracking-[.18em]">Financial verifier</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Deterministic validation layer · last checked just now
          </p>
        </div>
        <span className="rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
          PASSED
        </span>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {checks.map((check) => (
          <div
            key={check}
            className="flex items-center gap-2 rounded-lg bg-white/[.025] px-3 py-2.5 text-sm text-muted-foreground"
          >
            <Check size={15} className="shrink-0 text-primary" />
            {check}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ConstraintCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Target size={16} className="text-primary" />
        {title}
      </div>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-center justify-between border-b border-border pb-3 text-sm last:border-0 last:pb-0"
          >
            <span className="text-muted-foreground">{item.split(':')[0]}</span>
            <span className="font-medium">{item.split(':').slice(1).join(':')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-primary">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-.035em] sm:text-4xl">{title}</h2>
      </div>
      {children}
    </div>
  )
}

export function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
    >
      {children}
      <ArrowRight size={16} />
    </Link>
  )
}

export {
  ArrowRight,
  Banknote,
  Building2,
  Check,
  ChevronRight,
  CircleHelp,
  FileCheck2,
  Gavel,
  Handshake,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserIcon,
}
