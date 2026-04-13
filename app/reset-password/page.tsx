'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Supabase sets the session from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.updateUser({ password: form.password })
    setLoading(false)
    if (error) { setError(error.message); return }
    setDone(true)
    setTimeout(() => { window.location.href = '/dashboard' }, 2000)
  }

  if (done) return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center animate-scale-in">
        <div className="bg-white rounded-2xl p-10 border" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={36} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Password updated!</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Taking you to your dashboard...</p>
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
          <h1 className="text-2xl font-bold mb-1">Set new password</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Choose a strong password</p>
        </div>

        <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1.5">New password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} required minLength={8}
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm placeholder:text-[#9896b8]"
                  style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5">Confirm password</label>
              <input type="password" required value={form.confirm}
                onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 rounded-xl text-sm placeholder:text-[#9896b8]"
                style={{ border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }} />
            </div>
            <button type="submit" disabled={loading || !ready}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl transition-all active:scale-95 disabled:opacity-60"
              style={{ background: 'var(--brand)' }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : 'Update password'}
            </button>
            {!ready && (
              <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                Waiting for session... if this persists please request a new reset link.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
