'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Loader2, ArrowRight } from 'lucide-react'

export function UsernameChecker() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const timerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!username || username.length < 2) {
      setStatus('idle')
      return
    }

    clearTimeout(timerRef.current)
    setStatus('checking')

    timerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`)
        const data = await res.json()
        if (data.error) {
          setStatus('error')
          setMessage(data.error)
        } else if (data.available) {
          setStatus('available')
          setMessage('Available!')
        } else {
          setStatus('taken')
          setMessage('Already taken')
        }
      } catch {
        setStatus('idle')
      }
    }, 500)

    return () => clearTimeout(timerRef.current)
  }, [username])

  const handleClaim = () => {
    if (status === 'available') {
      router.push(`/register?username=${encodeURIComponent(username)}`)
    }
  }

  const borderColor = status === 'available' ? 'rgba(0,217,126,0.5)'
    : status === 'taken' ? 'rgba(239,68,68,0.4)'
    : 'var(--border-strong)'

  const icon = status === 'checking' ? <Loader2 size={16} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
    : status === 'available' ? <Check size={16} style={{ color: 'var(--accent-green)' }} />
    : status === 'taken' || status === 'error' ? <X size={16} className="text-red-400" />
    : null

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center rounded-2xl overflow-hidden border-2 bg-white transition-all"
        style={{ borderColor, boxShadow: status === 'available' ? '0 0 0 4px rgba(0,217,126,0.1)' : 'none' }}>

        {/* Prefix */}
        <div className="pl-4 pr-1 py-4 text-sm font-medium flex-shrink-0"
          style={{ color: 'var(--text-muted)' }}>
          afriilink.com/
        </div>

        {/* Input */}
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
          placeholder="yourname"
          maxLength={30}
          className="flex-1 py-4 pr-2 text-sm font-semibold outline-none bg-transparent"
          style={{ color: 'var(--text-primary)' }}
          onKeyDown={e => { if (e.key === 'Enter') handleClaim() }}
        />

        {/* Status icon */}
        {icon && <div className="px-2">{icon}</div>}

        {/* Claim button */}
        <button
          onClick={handleClaim}
          disabled={status !== 'available'}
          className="flex items-center gap-1.5 px-5 py-4 text-sm font-bold text-white transition-all disabled:opacity-40 flex-shrink-0"
          style={{
            background: status === 'available'
              ? 'linear-gradient(135deg,#6c63ff,#a855f7)'
              : 'var(--text-muted)',
          }}>
          Claim <ArrowRight size={15} />
        </button>
      </div>

      {/* Status message */}
      {message && (
        <p className="text-xs text-center mt-2 font-medium"
          style={{ color: status === 'available' ? 'var(--accent-green)' : 'var(--accent-orange)' }}>
          {status === 'available' ? '✓ ' : '✗ '}{message}
          {status === 'available' && ' — click Claim to get it free!'}
        </p>
      )}
    </div>
  )
}
