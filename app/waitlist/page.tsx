'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Loader2, Zap } from 'lucide-react'

const UPCOMING_FEATURES = [
  { emoji: '💰', title: 'Tip jar & donations', desc: 'Accept tips directly on your profile via Paystack and Stripe' },
  { emoji: '📦', title: 'Digital product sales', desc: 'Sell files, presets, templates and courses from your page' },
  { emoji: '📅', title: 'Booking links', desc: 'Let people book appointments with you — no Calendly needed' },
  { emoji: '📧', title: 'Email list builder', desc: 'Collect email subscribers directly from your profile page' },
  { emoji: '🌐', title: 'Custom domains', desc: 'Use yourname.com instead of afriilink.com/yourname' },
  { emoji: '🎥', title: 'Video background', desc: 'Set a looping video as your profile background' },
]

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [feature, setFeature] = useState('')
  const [loading, setLoading] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, feature }),
      })
      if (res.ok) {
        setJoined(true)
      } else {
        const d = await res.json()
        setError(d.error ?? 'Something went wrong')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen mesh-bg">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-bold">Afriilink</span>
          </Link>
          <Link href="/dashboard" className="text-sm font-medium px-4 py-2 rounded-lg"
            style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
            Dashboard →
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', color: 'var(--brand)' }}>
            <Zap size={14} /> Coming soon
          </div>
          <h1 className="text-4xl font-bold mb-4">
            More power is <span className="gradient-text">on the way</span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            We&apos;re building more tools to help African creators earn and grow. Join the waitlist to get early access.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {UPCOMING_FEATURES.map(f => (
            <button key={f.title} type="button"
              onClick={() => setFeature(feature === f.title ? '' : f.title)}
              className="flex items-start gap-3 p-4 rounded-2xl border text-left transition-all hover-lift"
              style={{
                background: feature === f.title ? 'var(--bg-elevated)' : 'white',
                borderColor: feature === f.title ? 'var(--brand)' : 'var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}>
              <div className="text-2xl flex-shrink-0">{f.emoji}</div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold">{f.title}</p>
                  {feature === f.title && (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'var(--brand)' }}>
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {f.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Sign up form */}
        {joined ? (
          <div className="bg-white rounded-2xl p-8 text-center border"
            style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">You&apos;re on the list! 🎉</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
              We&apos;ll email you as soon as {feature || 'new features'} go live. You&apos;ll get early access before everyone else.
            </p>
            <Link href="/dashboard" className="text-sm font-semibold" style={{ color: 'var(--brand)' }}>
              ← Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border"
            style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <h2 className="text-xl font-bold mb-1">Get early access</h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              {feature ? `You selected: ${feature}. ` : ''}Enter your email and we&apos;ll notify you first.
            </p>
            {error && <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-sm placeholder:text-[#9896b8]"
                style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }} />
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60 flex-shrink-0"
                style={{ background: 'var(--brand)' }}>
                {loading ? <Loader2 size={15} className="animate-spin" /> : <>Join <ArrowRight size={15} /></>}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
