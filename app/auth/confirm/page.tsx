'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleConfirm = async () => {
      try {
        // Try token_hash format (newer Supabase)
        const queryParams = new URLSearchParams(window.location.search)
        const tokenHash = queryParams.get('token_hash')
        const type = queryParams.get('type')

        if (tokenHash && type === 'email') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'email',
          })
          if (error) throw error
        } else {
          // Try hash fragment format (older Supabase)
          const hash = window.location.hash
          if (hash) {
            const hashParams = new URLSearchParams(hash.substring(1))
            const accessToken = hashParams.get('access_token')
            const refreshToken = hashParams.get('refresh_token')
            if (accessToken && refreshToken) {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              })
              if (error) throw error
            } else {
              throw new Error('Invalid confirmation link')
            }
          } else {
            // Check if already logged in from a previous confirm
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('Invalid or expired confirmation link')
          }
        }

        setStatus('success')
        // Hard redirect after 2 seconds
        setTimeout(() => { window.location.href = '/dashboard' }, 2000)
      } catch (err: any) {
        setStatus('error')
        setMessage(err.message || 'Something went wrong')
      }
    }

    handleConfirm()
  }, [])

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in text-center">
        <div className="bg-white rounded-2xl p-10 border"
          style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>

          <Link href="/" className="inline-flex items-center gap-2 mb-8 justify-center">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl">Afriilink</span>
          </Link>

          {status === 'loading' && (
            <>
              <Loader2 size={48} className="animate-spin mx-auto mb-4" style={{ color: 'var(--brand)' }} />
              <h1 className="text-xl font-bold mb-2">Confirming your email...</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Just a moment</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-green-50">
                <CheckCircle2 size={44} className="text-green-500" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Email confirmed! 🎉</h1>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                Your account is active. Taking you to your dashboard...
              </p>
              <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Loader2 size={14} className="animate-spin" /> Redirecting...
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-red-50">
                <XCircle size={44} className="text-red-500" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Link expired</h1>
              <p className="mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                This confirmation link has expired or already been used.
              </p>
              {message && (
                <p className="text-xs mb-6 p-3 rounded-xl bg-red-50 text-red-500">{message}</p>
              )}
              <div className="flex flex-col gap-3 mt-6">
                <Link href="/login"
                  className="w-full text-center py-3 rounded-xl text-white font-semibold text-sm"
                  style={{ background: 'var(--brand)' }}>
                  Sign in
                </Link>
                <Link href="/register"
                  className="w-full text-center py-3 rounded-xl font-semibold text-sm border"
                  style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}>
                  Create a new account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
