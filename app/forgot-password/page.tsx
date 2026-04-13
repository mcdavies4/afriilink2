'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowRight, Loader2, CheckCircle2, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) { setError(error.message); return }
    setSent(true)
  }

  if (sent) return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center animate-scale-in">
        <div className="bg-white rounded-2xl p-10 border" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
            <Mail size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            We sent a password reset link to:
          </p>
          <p className="font-bold mb-6" style={{ color: 'var(--brand)' }}>{email}</p>
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            Click the link in the email to reset your password. Check spam if you don&apos;t see it.
          </p>
          <Link href="/login" className="text-sm font-semibold hover:underline" style={{ color: 'var(--brand)' }}>
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl">Afriilink</span>
          </Link>
          <h1 className="text-2xl font-bold mb-1">Reset your password</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email address</label>
              <input type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm placeholder:text-[#9896b8]"
                style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60"
              style={{ background: 'var(--brand)' }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <>Send reset link <ArrowRight size={16} /></>}
            </button>
          </form>
          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Remember your password?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--brand)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
