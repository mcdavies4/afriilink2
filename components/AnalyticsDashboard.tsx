'use client'
import { LinkHeatmap } from './LinkHeatmap'
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Eye, MousePointerClick, Percent, BarChart2, Globe, RefreshCw } from 'lucide-react'

interface Props {
  userId: string
}

const PERIODS = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
]

const SOURCE_ICONS: Record<string, string> = {
  'Instagram': '📸', 'Twitter / X': '🐦', 'Facebook': '👍', 'WhatsApp': '📱',
  'TikTok': '🎵', 'YouTube': '▶️', 'Google': '🔍', 'Direct': '🔗',
}

function delta(curr: number, prev: number) {
  if (prev === 0) return null
  return (((curr - prev) / prev) * 100).toFixed(1)
}

export function AnalyticsDashboard({ userId }: Props) {
  const [period, setPeriod] = useState(7)
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/analytics/full?period=${period}`)
      if (res.ok) setData(await res.json())
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [period])

  const COLORS = ['#6c63ff', '#ff3cac', '#ff6b35', '#00d97e', '#ffd166', '#a855f7', '#0ea5e9', '#f43f5e']

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--brand)' }} />
      </div>
    )
  }

  const d = data ?? {}
  const viewsDelta = delta(d.totalViews ?? 0, d.prevViews ?? 0)
  const maxClicks = Math.max(...(d.dailyData ?? []).map((x: any) => x.clicks), 1)
  const maxLinkClicks = Math.max(...(d.topLinks ?? []).map((l: any) => l.link_clicks?.[0]?.count ?? 0), 1)
  const maxReferrer = Math.max(...(d.referrers ?? []).map((r: any) => r.count), 1)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Analytics</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Track your page performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl border"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
            {PERIODS.map(p => (
              <button key={p.days} onClick={() => setPeriod(p.days)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: period === p.days ? 'white' : 'transparent',
                  color: period === p.days ? 'var(--brand)' : 'var(--text-muted)',
                  boxShadow: period === p.days ? 'var(--shadow-sm)' : 'none',
                }}>
                {p.label}
              </button>
            ))}
          </div>
          <button onClick={fetchData} className="w-9 h-9 rounded-xl flex items-center justify-center border transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* All-time banner */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 rounded-2xl border"
        style={{ background: 'linear-gradient(135deg,rgba(108,99,255,0.06),rgba(255,60,172,0.04))', borderColor: 'var(--border)' }}>
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>ALL-TIME VIEWS</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--brand)' }}>
            {(d.allTimeViews ?? 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>ALL-TIME CLICKS</p>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent-orange)' }}>
            {(d.allTimeClicks ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Period stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Eye, label: `Views (${period}d)`, value: (d.totalViews ?? 0).toLocaleString(), d: viewsDelta, color: 'var(--brand)', bg: 'var(--bg-elevated)' },
          { icon: MousePointerClick, label: `Clicks (${period}d)`, value: (d.totalClicks ?? 0).toLocaleString(), d: null, color: 'var(--accent-orange)', bg: '#fff7f4' },
          { icon: Percent, label: 'Click rate', value: `${d.totalViews > 0 ? ((d.totalClicks / d.totalViews) * 100).toFixed(1) : 0}%`, d: null, color: 'var(--accent-green)', bg: '#f0fdf8' },
          { icon: BarChart2, label: 'Active links', value: (d.topLinks?.length ?? 0).toString(), d: null, color: 'var(--accent-pink)', bg: '#fdf2f8' },
        ].map(({ icon: Icon, label, value, d: dv, color, bg }) => {
          const up = dv ? parseFloat(dv) >= 0 : null
          return (
            <div key={label} className="bg-white rounded-2xl p-4 border" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                <Icon size={18} style={{ color }} />
              </div>
              <p className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
              {dv !== null && (
                <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(parseFloat(dv))}%
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Bar chart */}
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="font-bold text-sm mb-4">Daily clicks</h2>
          {(d.dailyData ?? []).length === 0 ? (
            <div className="h-32 flex items-center justify-center text-sm" style={{ color: 'var(--text-muted)' }}>No data yet</div>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {(d.dailyData ?? []).map((day: any, i: number) => {
                const pct = maxClicks > 0 ? (day.clicks / maxClicks) * 100 : 0
                const isLast = i === (d.dailyData?.length ?? 0) - 1
                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
                    {day.clicks > 0 && (
                      <span className="text-[9px] font-semibold" style={{ color: 'var(--text-muted)' }}>{day.clicks}</span>
                    )}
                    <div className="w-full rounded-t-lg" style={{
                      height: `${Math.max(pct, 4)}%`, minHeight: '4px',
                      background: isLast ? 'linear-gradient(180deg,#6c63ff,#a855f7)' : 'rgba(108,99,255,0.3)',
                    }} />
                    <span className="text-[9px]" style={{ color: 'var(--text-muted)' }}>{day.label}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Referrers */}
        <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="font-bold text-sm mb-4 flex items-center gap-1.5">
            <Globe size={14} style={{ color: 'var(--brand)' }} /> Traffic sources
          </h2>
          {(d.referrers ?? []).length === 0 ? (
            <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
              No traffic data yet
            </div>
          ) : (
            <div className="space-y-3">
              {(d.referrers ?? []).map((r: any, i: number) => {
                const pct = maxReferrer > 0 ? (r.count / maxReferrer) * 100 : 0
                return (
                  <div key={r.source}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        <span>{SOURCE_ICONS[r.source] ?? '🌐'}</span>
                        <span>{r.source}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: COLORS[i % COLORS.length] }}>
                        {r.count}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top links */}
      <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 className="font-bold text-sm mb-4">Top performing links</h2>
        {(d.topLinks ?? []).length === 0 ? (
          <div className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No clicks tracked yet</div>
        ) : (
          <div className="space-y-3">
            {(d.topLinks ?? []).map((link: any, i: number) => {
              const clicks = link.link_clicks?.[0]?.count ?? 0
              const pct = maxLinkClicks > 0 ? (clicks / maxLinkClicks) * 100 : 0
              return (
                <div key={link.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
                        style={{ background: COLORS[i % COLORS.length] + '18' }}>
                        {link.icon ?? '🔗'}
                      </span>
                      <div>
                        <span className="text-xs font-semibold truncate max-w-[160px] block" style={{ color: 'var(--text-primary)' }}>{link.title}</span>
                        {link.category && link.category !== 'general' && (
                          <span className="text-[10px] capitalize" style={{ color: 'var(--text-muted)' }}>{link.category}</span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold" style={{ color: COLORS[i % COLORS.length] }}>
                      {clicks.toLocaleString()} clicks
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <div className="mt-5">
        <LinkHeatmap />
      </div>
    </div>
  )
}
