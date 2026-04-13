'use client'
import { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'

export function UpgradeButton() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) { alert(error); setLoading(false); return }
      window.location.href = url
    } catch {
      alert('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-70"
      style={{ background: 'white', color: 'var(--brand)' }}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <><Zap size={16} /> Upgrade to Premium — $10/mo</>
      )}
    </button>
  )
}
