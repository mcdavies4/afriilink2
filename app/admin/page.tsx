'use client'
import { useState, useEffect } from 'react'
import { Users, Link2, MousePointerClick, Eye, Crown, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminPage() {
  const [data, setData]       = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [fixing, setFixing]   = useState(false)
  const [fixResult, setFixResult] = useState('')

  const fetchData = async () => {
    setLoading(true)
    const res = await fetch('/api/admin')
    if (res.status === 403) { setError('Access denied — admin only'); setLoading(false); return }
    if (!res.ok) { setError('Failed to load'); setLoading(false); return }
    setData(await res.json())
    setLoading(false)
  }

  const fixMissingProfiles = async () => {
    setFixing(true)
    const res = await fetch('/api/admin/fix-profiles', { method: 'POST' })
    const d = await res.json()
    setFixResult(d.message ?? 'Done')
    setFixing(false)
    fetchData()
  }

  useEffect(() => { fetchData() }, [])

  if (error) return (
    <div className="min-h-screen flex items-center justify-center mesh-bg">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg border" style={{ borderColor: 'var(--border)' }}>
        <div className="text-4xl mb-3">🔒</div>
        <h1 className="text-xl font-bold mb-2">Access Denied</h1>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{error}</p>
        <Link href="/dashboard" className="text-sm font-semibold" style={{ color: 'var(--brand)' }}>← Back to dashboard</Link>
      </div>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw size={28} className="animate-spin" style={{ color: 'var(--brand)' }} />
    </div>
  )

  const { stats, recentUsers, usersWithoutProfiles, dailySignups } = data
  const maxSignups = Math.max(...dailySignups.map((d: any) => d.count), 1)
  const COLORS = ['#6c63ff','#ff3cac','#ff6b35','#00d97e','#ffd166','#a855f7']

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-white" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
                <span className="text-white font-bold text-xs">A</span>
              </div>
            </Link>
            <div className="h-5 w-px" style={{ background: 'var(--border-strong)' }} />
            <span className="text-sm font-bold flex items-center gap-1.5" style={{ color: 'var(--brand)' }}>
              <Crown size={14} /> Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchData}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
              <RefreshCw size={12} /> Refresh
            </button>
            <Link href="/dashboard" className="text-xs font-semibold px-3 py-2 rounded-lg"
              style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Platform Overview</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Live stats across Afriilink</p>
        </div>

        {/* Missing profiles alert */}
        {stats.missingProfiles > 0 && (
          <div className="mb-6 p-4 rounded-2xl border flex items-start gap-3"
            style={{ background: '#fffbeb', borderColor: '#fcd34d' }}>
            <AlertTriangle size={18} style={{ color: '#d97706', flexShrink: 0, marginTop: 1 }} />
            <div className="flex-1">
              <p className="text-sm font-bold" style={{ color: '#92400e' }}>
                {stats.missingProfiles} user{stats.missingProfiles > 1 ? 's' : ''} signed up without a profile row
              </p>
              <p className="text-xs mt-0.5 mb-3" style={{ color: '#92400e' }}>
                These users exist in auth.users but have no matching profile. This happens when the database trigger wasn&apos;t set up. Click fix to create their profiles automatically.
              </p>
              {fixResult ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                  <CheckCircle2 size={13} /> {fixResult}
                </div>
              ) : (
                <button onClick={fixMissingProfiles} disabled={fixing}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                  style={{ background: '#d97706' }}>
                  {fixing ? <RefreshCw size={12} className="animate-spin" /> : null}
                  Fix {stats.missingProfiles} missing profile{stats.missingProfiles > 1 ? 's' : ''}
                </button>
              )}
            </div>
          </div>
        )}

        {/* MRR */}
        <div className="p-6 rounded-2xl mb-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7,#ff3cac)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'white', transform: 'translate(30%,-30%)' }} />
          <p className="text-sm font-semibold opacity-70 mb-1">MONTHLY RECURRING REVENUE</p>
          <p className="text-5xl font-bold mb-1">${stats.mrr.toLocaleString()}</p>
          <p className="text-sm opacity-70">{stats.premiumUsers} premium × $10/mo</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Total signups', value: stats.totalUsers.toLocaleString(), sub: 'From auth.users', color: 'var(--brand)', bg: 'var(--bg-elevated)' },
            { icon: Crown, label: 'Premium users', value: stats.premiumUsers.toLocaleString(), sub: `${((stats.premiumUsers/Math.max(stats.totalUsers,1))*100).toFixed(1)}% conversion`, color: '#ffd166', bg: '#fffbeb' },
            { icon: Link2, label: 'Total links', value: stats.totalLinks.toLocaleString(), sub: `${stats.totalUsers > 0 ? (stats.totalLinks/stats.totalUsers).toFixed(1) : 0} avg/user`, color: 'var(--accent-green)', bg: '#f0fdf8' },
            { icon: Eye, label: 'Total views', value: stats.totalViews.toLocaleString(), sub: 'All-time page views', color: 'var(--accent-orange)', bg: '#fff7f4' },
          ].map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border"
              style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <p className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</p>
              <p className="text-xs font-semibold mb-0.5">{label}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Signup chart */}
          <div className="bg-white rounded-2xl p-6 border"
            style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-bold text-sm mb-5">New signups (14 days)</h2>
            <div className="flex items-end gap-1.5 h-32">
              {dailySignups.map((d: any, i: number) => {
                const pct = maxSignups > 0 ? (d.count / maxSignups) * 100 : 0
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                    {d.count > 0 && (
                      <span className="text-[9px] font-semibold" style={{ color: 'var(--text-muted)' }}>{d.count}</span>
                    )}
                    <div className="w-full rounded-t-md"
                      style={{
                        height: `${Math.max(pct, 4)}%`, minHeight: '4px',
                        background: i === dailySignups.length - 1
                          ? 'linear-gradient(180deg,#6c63ff,#a855f7)'
                          : 'rgba(108,99,255,0.25)',
                      }} />
                    {i % 2 === 0 && (
                      <span className="text-[8px]" style={{ color: 'var(--text-muted)' }}>{d.label}</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Plan split */}
          <div className="bg-white rounded-2xl p-6 border"
            style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h2 className="font-bold text-sm mb-5">Plan distribution</h2>
            <div className="space-y-4">
              {[
                { label: 'Free', count: stats.freeUsers, color: 'var(--text-muted)', pct: stats.totalUsers > 0 ? (stats.freeUsers/stats.totalUsers)*100 : 0 },
                { label: 'Premium', count: stats.premiumUsers, color: '#6c63ff', pct: stats.totalUsers > 0 ? (stats.premiumUsers/stats.totalUsers)*100 : 0 },
              ].map(p => (
                <div key={p.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-semibold">{p.label}</span>
                    <span className="text-sm font-bold" style={{ color: p.color }}>
                      {p.count} ({p.pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t flex items-center justify-between"
              style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>CONVERSION RATE</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--brand)' }}>
                  {stats.totalUsers > 0 ? ((stats.premiumUsers/stats.totalUsers)*100).toFixed(1) : 0}%
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>ARR POTENTIAL</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--accent-green)' }}>
                  ${(stats.mrr * 12).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* All users table */}
        <div className="bg-white rounded-2xl border overflow-hidden mb-6"
          style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-bold text-sm">Recent signups</h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {stats.profilesCreated} with profiles · {stats.totalUsers} total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
                  {['User','Email','Username','Plan','Joined'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u: any, i: number) => (
                  <tr key={u.id} className="border-b hover:bg-[var(--bg-base)] transition-colors"
                    style={{ borderColor: 'var(--border)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: COLORS[i % COLORS.length] }}>
                          {(u.name ?? u.email ?? '?')[0]?.toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold">{u.name ?? '—'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {u.email || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {u.username ? (
                        <a href={`/u/${u.username}`} target="_blank"
                          className="text-xs font-medium hover:underline" style={{ color: 'var(--brand)' }}>
                          @{u.username}
                        </a>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: '#fef3c7', color: '#92400e' }}>
                          No profile
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{
                          background: u.plan === 'PREMIUM' ? 'rgba(108,99,255,0.1)' : 'var(--bg-elevated)',
                          color: u.plan === 'PREMIUM' ? 'var(--brand)' : 'var(--text-muted)',
                        }}>
                        {u.plan === 'PREMIUM' ? '⚡ Premium' : 'Free'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {new Date(u.created_at).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users without profiles */}
        {usersWithoutProfiles?.length > 0 && (
          <div className="bg-white rounded-2xl border overflow-hidden"
            style={{ borderColor: '#fcd34d', boxShadow: 'var(--shadow-sm)' }}>
            <div className="px-6 py-4 border-b flex items-center gap-2"
              style={{ borderColor: '#fcd34d', background: '#fffbeb' }}>
              <AlertTriangle size={15} style={{ color: '#d97706' }} />
              <h2 className="font-bold text-sm" style={{ color: '#92400e' }}>
                Users without profiles ({usersWithoutProfiles.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: '#fcd34d', background: '#fffbeb' }}>
                    {['Email','Name','Signed up'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold"
                        style={{ color: '#92400e' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {usersWithoutProfiles.map((u: any) => (
                    <tr key={u.id} className="border-b" style={{ borderColor: '#fef3c7' }}>
                      <td className="px-4 py-3 text-xs">{u.email}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{u.name ?? '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(u.created_at).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
