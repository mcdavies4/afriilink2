'use client'
import { useEffect, useState } from 'react'

function formatNum(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toString()
}

export function SocialProof() {
  const [stats, setStats] = useState({ users: 0, links: 0, clicks: 0 })

  useEffect(() => {
    fetch('/api/stats')
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }, [])

  if (stats.users === 0) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-10 border-t border-b"
      style={{ borderColor: 'var(--border)', background: 'rgba(108,99,255,0.02)' }}>
      {[
        { value: formatNum(stats.users), label: 'creators joined', emoji: '🌍' },
        { value: formatNum(stats.links), label: 'links created', emoji: '🔗' },
        { value: formatNum(stats.clicks), label: 'clicks tracked', emoji: '📊' },
      ].map(({ value, label, emoji }) => (
        <div key={label} className="text-center">
          <div className="text-3xl font-bold mb-0.5" style={{ color: 'var(--brand)' }}>
            {emoji} {value}
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</div>
        </div>
      ))}
    </div>
  )
}
