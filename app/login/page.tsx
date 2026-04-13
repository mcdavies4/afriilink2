'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Loader2, Mail } from 'lucide-react'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needsConfirm, setNeedsConfirm] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setNeedsConfirm(false)

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed') ||
          error.message.toLowerCase().includes('confirm')) {
        setNeedsConfirm(true)
      } else {
        setError('Wrong email or password. Please try again.')
      }
      setLoading(false)
      return
    }

    // Hard redirect so middleware reads the new session cookie
    window.location.href = '/dashboard'
  }

  const handleResend = async () => {
    setResending(true)
    await supabase.auth.resend({ type: 'signup', email: form.email })
    setResending(false)
    setResent(true)
  }

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
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border"
          style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>

          {needsConfirm && (
            <div className="mb-5 p-4 rounded-xl border text-sm"
              style={{ background: '#fffbeb', borderColor: '#fcd34d' }}>
              <div className="flex items-center gap-2 font-semibold mb-2" style={{ color: '#92400e' }}>
                <Mail size={15} /> Please confirm your email first
              </div>
              <p className="mb-3" style={{ color: '#92400e' }}>
                Check your inbox for a confirmation email from Afriilink.
              </p>
              {resent ? (
                <p className="font-semibold text-green-600">✓ Confirmation email resent!</p>
              ) : (
                <button onClick={handleResend} disabled={resending}
                  className="font-semibold underline flex items-center gap-1"
                  style={{ color: '#92400e' }}>
                  {resending && <Loader2 size={13} className="animate-spin" />}
                  Resend confirmation email
                </button>
              )}
            </div>
          )}

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm placeholder:text-[#9896b8]"
                style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold">Password</label>
              <Link href="/forgot-password" className="text-xs font-medium hover:underline" style={{ color: 'var(--brand)' }}>
                Forgot password?
              </Link>
            </div>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm placeholder:text-[#9896b8]"
                  style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60 mt-2"
              style={{ background: 'var(--brand)' }}>
              {loading
                ? <Loader2 size={16} className="animate-spin" />
                : <>Sign in <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-semibold hover:underline"
              style={{ color: 'var(--brand)' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
