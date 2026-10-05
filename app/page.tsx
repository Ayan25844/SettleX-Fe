import Link from 'next/link'
import {
  ArrowRight,
  Banknote,
  Building2,
  FileCheck2,
  Gavel,
  Handshake,
  Navbar,
  Play,
  PrimaryButton,
  SectionHeading,
  ShieldCheck,
  Sparkles,
} from '@/components/settlex'

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />

      <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-16 lg:px-8 lg:pb-32 lg:pt-24">
        <div className="grid-glow pointer-events-none absolute inset-x-0 top-0 h-[650px] opacity-50" />

        <div className="relative grid items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/7 px-3 py-1.5 text-xs text-primary">
              <Sparkles size={13} />
              <span>Built for fairer financial outcomes</span>
            </div>

            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.06em] sm:text-7xl">
              AI-powered <span className="text-gradient">financial negotiation</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
              Your AI advocate negotiates for your interests. Their AI advocate negotiates for theirs.
              SettleX finds a mathematically feasible agreement.
            </p>

            {/* Primary Action Buttons with Prominent Demo Button */}
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link
                href="/demo"
                className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/25 transition hover:brightness-110 active:scale-95"
              >
                <Play size={15} className="fill-current" />
                <span>▶ Try Interactive Demo</span>
              </Link>

              <PrimaryButton href="/borrower">Start negotiation</PrimaryButton>

              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-muted-foreground transition hover:border-white/25 hover:text-foreground"
              >
                <span>See how it works</span>
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Small Label below Try Interactive Demo */}
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Demo Mode · Simulated Data</span>
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Click through complete end-to-end resolution in under 2 minutes
              </span>
            </div>
          </div>

          {/* Hero Diagram */}
          <div className="relative">
            <div className="glass animate-float rounded-[26px] p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-border pb-5">
                <div>
                  <p className="text-xs uppercase tracking-[.2em] text-muted-foreground">Live protocol</p>
                  <p className="mt-1 text-lg font-medium">Negotiation topology</p>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs text-primary">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-primary" /> Active
                </span>
              </div>

              <div className="relative py-10">
                <div className="absolute left-1/2 top-12 h-32 w-px -translate-x-1/2 bg-gradient-to-b from-primary via-sky-300 to-primary" />
                <div className="relative z-10 grid gap-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/7 px-3 py-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
                        <Banknote size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Borrower</p>
                        <p className="text-[10px] text-muted-foreground">₹5,00,000 request</p>
                      </div>
                    </div>
                    <div className="h-px flex-1 bg-primary/30" />
                    <div className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] text-primary">
                      Advocacy
                    </div>
                  </div>

                  <div className="mx-auto flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-4 py-3">
                    <Gavel size={16} className="text-primary" />
                    <span className="text-xs font-medium">Negotiation engine</span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-1 text-[10px] text-sky-300">
                      Risk & return
                    </div>
                    <div className="h-px flex-1 bg-sky-300/30" />
                    <div className="flex items-center gap-3 rounded-xl border border-sky-300/20 bg-sky-300/7 px-3 py-3">
                      <div className="grid h-8 w-8 place-items-center rounded-lg bg-sky-300/15 text-sky-300">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">Lender</p>
                        <p className="text-[10px] text-muted-foreground">Policy boundary</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-primary/15 bg-primary/[.04] p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileCheck2 size={15} className="text-primary" /> Independent verifier
                </div>
                <span className="text-xs font-semibold text-primary">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol section */}
      <section id="how" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <SectionHeading eyebrow="The protocol" title="Built for the space between two interests.">
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            A transparent system where both sides bring an advocate — and every outcome earns its
            way through verification.
          </p>
        </SectionHeading>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: 'AI advocacy',
              text: 'Each party gets an advocate that understands their goals, constraints, and walk-away points.',
            },
            {
              icon: Gavel,
              title: 'Game-theoretic negotiation',
              text: 'Offers move through a structured bargaining process designed to discover the feasible zone.',
            },
            {
              icon: FileCheck2,
              title: 'Independent verification',
              text: 'A deterministic verifier checks every proposed term against both parties’ hard boundaries.',
            },
          ].map(({ icon: Icon, title, text }) => (
            <div className="glass rounded-2xl p-6" key={title}>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon size={22} />
              </div>
              <h3 className="mt-7 text-lg font-medium">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-3xl border border-primary/15 bg-gradient-to-r from-primary/10 via-transparent to-sky-300/10 p-8 text-center sm:p-14">
          <Handshake className="mx-auto text-primary" size={28} />
          <h2 className="mt-5 text-3xl font-semibold tracking-[-.04em]">
            LLMs negotiate. Mathematics decides.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            SettleX makes the reasoning visible, the constraints explicit, and the final decision
            yours.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:brightness-110"
            >
              <Play size={14} className="fill-current" />
              <span>Launch Interactive Demo</span>
            </Link>
            <PrimaryButton href="/how-it-works">Explore the architecture</PrimaryButton>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl items-center justify-between border-t border-border px-5 py-7 text-xs text-muted-foreground lg:px-8">
        <span>© 2026 SettleX</span>
        <span>Prototype for demonstration only</span>
      </footer>
    </main>
  )
}
