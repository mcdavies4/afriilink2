'use client'
import { useState } from 'react'
import { Loader2, Settings } from 'lucide-react'

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false)

  const handleManage = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const { url, error } = await res.json()
      if (error) { alert(error); setLoading(false); return }
      window.location.href = url
    } catch {
      alert('Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className="flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all active:scale-95"
      style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <><Settings size={14} /> Manage subscription</>}
    </button>
  )
}
