'use client'
import { useState, useEffect } from 'react'
import { Flame, TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'

interface HeatItem {
  id: string
  title: string
  icon: string
  position: number
  active: boolean
  clicks: number
  pct: number
  performance: number
}

function heatColor(pct: number, max: number): string {
  if (max === 0) return 'rgba(108,99,255,0.08)'
  const intensity = pct / max
  if (intensity > 0.7) return 'rgba(255,60,172,0.15)'
  if (intensity > 0.4) return 'rgba(255,107,53,0.12)'
  if (intensity > 0.2) return 'rgba(255,209,102,0.15)'
  return 'rgba(108,99,255,0.06)'
}

function heatBorder(pct: number, max: number): string {
  if (max === 0) return 'rgba(108,99,255,0.1)'
  const intensity = pct / max
  if (intensity > 0.7) return 'rgba(255,60,172,0.4)'
  if (intensity > 0.4) return 'rgba(255,107,53,0.35)'
  if (intensity > 0.2) return 'rgba(255,209,102,0.4)'
  return 'rgba(108,99,255,0.12)'
}

export function LinkHeatmap() {
  const [items, setItems] = useState<HeatItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics/heatmap')
      .then(r => r.json())
      .then(setItems)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="bg-white rounded-2xl p-6 border flex items-center justify-center h-40"
      style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <RefreshCw size={20} className="animate-spin" style={{ color: 'var(--brand)' }} />
    </div>
  )

  if (items.length === 0) return null

  const maxPct = Math.max(...items.map(i => i.pct), 1)

  return (
    <div className="bg-white rounded-2xl p-5 border"
      style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Flame size={16} style={{ color: '#ff3cac' }} />
        <h2 className="font-bold text-sm">Link click heatmap</h2>
      </div>
      <p className="text-xs mb-5" style={{ color: 'var(--text-muted)' }}>
        Warmer = more clicks. Position 1 is top of your page.
      </p>

      <div className="flex flex-col gap-2">
        {items.map(item => (
          <div key={item.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all"
            style={{
              background: heatColor(item.pct, maxPct),
              borderColor: heatBorder(item.pct, maxPct),
              opacity: item.active ? 1 : 0.5,
            }}>
            {/* Position badge */}
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.08)', color: 'var(--text-secondary)' }}>
              {item.position}
            </div>

            {/* Icon */}
            <span className="text-base flex-shrink-0">{item.icon ?? '🔗'}</span>

            {/* Title */}
            <span className="flex-1 text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
              {item.title}
            </span>

            {/* Performance vs average */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {item.performance > 10 ? (
                <TrendingUp size={12} style={{ color: 'var(--accent-green)' }} />
              ) : item.performance < -10 ? (
                <TrendingDown size={12} style={{ color: '#ff3cac' }} />
              ) : (
                <Minus size={12} style={{ color: 'var(--text-muted)' }} />
              )}
              <span className="text-xs font-semibold"
                style={{ color: item.performance > 10 ? 'var(--accent-green)' : item.performance < -10 ? '#ff3cac' : 'var(--text-muted)' }}>
                {item.performance > 0 ? '+' : ''}{item.performance}%
              </span>
            </div>

            {/* Clicks */}
            <span className="text-xs font-bold min-w-[52px] text-right" style={{ color: 'var(--text-secondary)' }}>
              {item.clicks.toLocaleString()} clicks
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
        % vs average: how each link performs relative to equal distribution
      </p>
    </div>
  )
}
