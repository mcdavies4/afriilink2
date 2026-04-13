'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight, Loader2, Check, X, Mail } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const usernameValid = /^[a-zA-Z0-9_-]{3,30}$/.test(form.username)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!usernameValid) { setError('Username: 3-30 chars, letters/numbers/underscores only'); return }
    setLoading(true)
    setError('')

    // Check username taken
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', form.username.toLowerCase())
      .single()

    if (existing) { setError('Username already taken — try another'); setLoading(false); return }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { name: form.name, username: form.username.toLowerCase() },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      }
    })

    if (error) { setError(error.message); setLoading(false); return }

    // If session exists immediately, email confirm is disabled - go straight to dashboard
    if (data.session) {
      window.location.href = '/onboarding'
      return
    }

    // Otherwise show email confirmation screen
    setEmailSent(true)
    setLoading(false)
  }

  if (emailSent) {
    return (
      <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-scale-in text-center">
          <div className="bg-white rounded-2xl p-10 border"
            style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
              <Mail size={36} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-3">Check your email!</h1>
            <p className="mb-2" style={{ color: 'var(--text-secondary)' }}>We sent a confirmation link to:</p>
            <p className="font-bold text-lg mb-6" style={{ color: 'var(--brand)' }}>{form.email}</p>
            <div className="p-4 rounded-xl text-sm text-left space-y-2 mb-6"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)' }}>
              <p className="font-semibold">What to do:</p>
              <p style={{ color: 'var(--text-secondary)' }}>1. Open your email inbox</p>
              <p style={{ color: 'var(--text-secondary)' }}>2. Find the email from Afriilink</p>
              <p style={{ color: 'var(--text-secondary)' }}>3. Click <strong>Confirm your email</strong></p>
              <p style={{ color: 'var(--text-secondary)' }}>4. You&apos;ll land on your dashboard</p>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Wrong email?{' '}
              <button onClick={() => setEmailSent(false)} className="font-semibold hover:underline"
                style={{ color: 'var(--brand)' }}>Go back</button>
            </p>
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold mb-1">Create your page</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Free forever. Live in 2 minutes.</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border"
          style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium flex items-center gap-2">
              <X size={15} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">Full name</label>
              <input type="text" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Adaeze Kalu"
                className="w-full px-4 py-3 rounded-xl text-sm placeholder:text-[#9896b8]"
                style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }} />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                  style={{ color: 'var(--text-muted)' }}>afriilink.com/</span>
                <input type="text" required value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase() }))}
                  placeholder="yourname"
                  className="w-full pl-[108px] pr-10 py-3 rounded-xl text-sm placeholder:text-[#9896b8]"
                  style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }} />
                {form.username.length > 0 && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameValid
                      ? <Check size={15} style={{ color: 'var(--accent-green)' }} />
                      : <X size={15} className="text-red-400" />}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm placeholder:text-[#9896b8]"
                style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }} />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 8 characters" minLength={8}
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
                : <>Create my free page <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--brand)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
