'use client'
import { useState, useEffect } from 'react'
import { MessageCircle, Smartphone, Monitor, Tablet, RefreshCw, TrendingUp, Info } from 'lucide-react'

const PLATFORM_ICONS: Record<string, string> = {
  whatsapp: '💬',
  telegram: '✈️',
  instagram_dm: '📸',
  twitter_dm: '🐦',
  email: '📧',
  phone: '📞',
}

const PLATFORM_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  telegram: 'Telegram',
  instagram_dm: 'Instagram DM',
  twitter_dm: 'Twitter/X DM',
  email: 'Email',
  phone: 'Phone',
}

const PLATFORM_COLORS: Record<string, string> = {
  whatsapp:     '#25d366',
  telegram:     '#0088cc',
  instagram_dm: '#e1306c',
  twitter_dm:   '#1da1f2',
  email:        '#6c63ff',
  phone:        '#ff6b35',
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function DMIntentDashboard() {
  const [data, setData]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays]       = useState(30)

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch(`/api/analytics/dm-intent?days=${days}`)
    if (res.ok) setData(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [days])

  const maxDay = Math.max(...(data?.dailyData ?? []).map((d: any) => d.count), 1)
  const maxPlatform = Math.max(...(data?.platforms ?? []).map((p: any) => p.count), 1)

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageCircle size={20} style={{ color: 'var(--brand)' }} />
            DM Intent Tracker
          </h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            People who clicked your messaging links
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl border"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
            {[7, 30, 90].map(d => (
              <button key={d} onClick={() => setDays(d)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: days === d ? 'white' : 'transparent',
                  color: days === d ? 'var(--brand)' : 'var(--text-muted)',
                  boxShadow: days === d ? 'var(--shadow-sm)' : 'none',
                }}>
                {d}d
              </button>
            ))}
          </div>
          <button onClick={fetchData}
            className="w-9 h-9 rounded-xl flex items-center justify-center border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="p-3 rounded-xl flex items-start gap-2.5 text-xs"
        style={{ background: 'rgba(108,99,255,0.06)', border: '1px solid rgba(108,99,255,0.15)' }}>
        <Info size={14} style={{ color: 'var(--brand)', marginTop: 1, flexShrink: 0 }} />
        <p style={{ color: 'var(--text-secondary)' }}>
          <strong>How this works:</strong> Every time someone taps your WhatsApp, Telegram or other messaging links, we record it.
          We can track who <em>intended</em> to message you — even if they never sent a message.
          Device type and timing helps you understand your audience better.
        </p>
      </div>

      {loading && !data ? (
        <div className="flex items-center justify-center py-16">
          <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--brand)' }} />
        </div>
      ) : (
        <>
          {/* Total stat */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-white rounded-2xl p-5 border text-center"
              style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="text-3xl font-bold mb-1" style={{ color: 'var(--brand)' }}>
                {data?.total ?? 0}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>DM intents ({days}d)</p>
            </div>

            {/* Device split */}
            <div className="col-span-2 bg-white rounded-2xl p-5 border"
              style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>BY DEVICE</p>
              <div className="flex items-center gap-4">
                {[
                  { key: 'mobile', icon: Smartphone, label: 'Mobile', color: '#6c63ff' },
                  { key: 'desktop', icon: Monitor, label: 'Desktop', color: '#ff3cac' },
                  { key: 'tablet', icon: Tablet, label: 'Tablet', color: '#ff6b35' },
                ].map(({ key, icon: Icon, label, color }) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ background: color + '15' }}>
                      <Icon size={15} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color }}>{data?.byDevice?.[key] ?? 0}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Daily chart */}
            <div className="bg-white rounded-2xl p-5 border"
              style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 className="font-bold text-sm mb-4">Daily DM intents</h3>
              {(data?.dailyData ?? []).length === 0 ? (
                <div className="h-24 flex items-center justify-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  No data yet
                </div>
              ) : (
                <div className="flex items-end gap-1 h-24">
                  {(data?.dailyData ?? []).map((d: any, i: number) => {
                    const pct = maxDay > 0 ? (d.count / maxDay) * 100 : 0
                    const isLast = i === (data?.dailyData?.length ?? 0) - 1
                    return (
                      <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                        {d.count > 0 && (
                          <span className="text-[9px] font-semibold" style={{ color: 'var(--text-muted)' }}>{d.count}</span>
                        )}
                        <div className="w-full rounded-t-md transition-all"
                          style={{
                            height: `${Math.max(pct, 4)}%`, minHeight: '3px',
                            background: isLast ? 'linear-gradient(180deg,#6c63ff,#ff3cac)' : 'rgba(108,99,255,0.3)',
                          }} />
                        {i % Math.ceil((data?.dailyData?.length ?? 1) / 7) === 0 && (
                          <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>{d.label}</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Platform breakdown */}
            <div className="bg-white rounded-2xl p-5 border"
              style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 className="font-bold text-sm mb-4">By platform</h3>
              {(data?.platforms ?? []).length === 0 ? (
                <div className="py-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  No DM link clicks yet.<br />Add a WhatsApp or Telegram link to start tracking.
                </div>
              ) : (
                <div className="space-y-3">
                  {(data?.platforms ?? []).map((p: any) => {
                    const color = PLATFORM_COLORS[p.platform] ?? 'var(--brand)'
                    const pct = maxPlatform > 0 ? (p.count / maxPlatform) * 100 : 0
                    return (
                      <div key={p.platform}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <span>{PLATFORM_ICONS[p.platform] ?? '💬'}</span>
                            <span style={{ color: 'var(--text-primary)' }}>
                              {PLATFORM_LABELS[p.platform] ?? p.platform}
                            </span>
                          </div>
                          <span className="text-xs font-bold" style={{ color }}>{p.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recent intents feed */}
          <div className="bg-white rounded-2xl border overflow-hidden"
            style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="flex items-center justify-between px-5 py-4 border-b"
              style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-bold text-sm">Recent DM intents</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Last 20</p>
            </div>

            {(data?.recentClicks ?? []).length === 0 ? (
              <div className="py-10 text-center">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-muted)' }}>No DM intents yet</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Add WhatsApp or Telegram links to start seeing who wants to reach you
                </p>
              </div>
            ) : (
              <div>
                {(data?.recentClicks ?? []).map((c: any, i: number) => {
                  const color = PLATFORM_COLORS[c.platform] ?? 'var(--brand)'
                  const DeviceIcon = c.device === 'mobile' ? Smartphone : c.device === 'tablet' ? Tablet : Monitor
                  return (
                    <div key={c.id ?? i}
                      className="flex items-center gap-3 px-5 py-3 border-b last:border-0"
                      style={{ borderColor: 'var(--border)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                        style={{ background: color + '15' }}>
                        {PLATFORM_ICONS[c.platform] ?? '💬'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {PLATFORM_LABELS[c.platform] ?? c.platform} intent
                        </p>
                        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                          via "{c.linkTitle}"
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1 text-xs"
                          style={{ color: 'var(--text-muted)' }}>
                          <DeviceIcon size={12} />
                          <span className="capitalize">{c.device ?? 'unknown'}</span>
                        </div>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {timeAgo(c.time)}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Privacy note */}
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            🔒 We only track link clicks, not message content. Visitor identities are anonymous.
          </p>
        </>
      )}
    </div>
  )
}
