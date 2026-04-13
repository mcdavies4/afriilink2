'use client'
import { useState, useEffect } from 'react'
import { Copy, Check, Users, DollarSign, Gift, RefreshCw } from 'lucide-react'

export function ReferralDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/referral').then(r => r.json()).then(setData).finally(() => setLoading(false))
  }, [])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <RefreshCw size={24} className="animate-spin" style={{ color: 'var(--brand)' }} />
    </div>
  )

  const { stats, referrals } = data ?? { stats: {}, referrals: [] }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Refer & Earn</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Invite creators to Afriilink and earn rewards when they upgrade to Premium
        </p>
      </div>

      {/* Hero card */}
      <div className="p-6 rounded-2xl text-white mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'white', transform: 'translate(30%,-30%)' }} />
        <div className="flex items-center gap-3 mb-2">
          <Gift size={24} />
          <h2 className="text-lg font-bold">Your referral link</h2>
        </div>
        <p className="text-sm opacity-80 mb-4">
          Share this link. Earn $2 for every friend who upgrades to Premium.
        </p>
        <div className="flex items-center gap-2 bg-white/20 rounded-xl px-4 py-3 backdrop-blur-sm">
          <span className="flex-1 text-sm font-mono truncate">{stats.referralUrl ?? 'Loading...'}</span>
          <button onClick={() => handleCopy(stats.referralUrl ?? '')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white transition-all active:scale-95"
            style={{ color: 'var(--brand)' }}>
            {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Users, label: 'Total referred', value: stats.total ?? 0, color: 'var(--brand)', bg: 'var(--bg-elevated)' },
          { icon: Check, label: 'Converted', value: stats.converted ?? 0, color: 'var(--accent-green)', bg: '#f0fdf8' },
          { icon: DollarSign, label: 'Total earned', value: `$${stats.earnings ?? 0}`, color: '#ffd166', bg: '#fffbeb' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border text-center"
            style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl p-6 border mb-6"
        style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 className="font-bold text-sm mb-4">How it works</h2>
        <div className="space-y-3">
          {[
            { step: '1', text: 'Share your referral link with creators', color: 'var(--brand)' },
            { step: '2', text: 'They sign up and create their Afriilink page', color: 'var(--accent-orange)' },
            { step: '3', text: 'They upgrade to Premium ($10/mo)', color: 'var(--accent-green)' },
            { step: '4', text: 'You earn $2 — paid monthly via Stripe', color: 'var(--accent-pink)' },
          ].map(({ step, text, color }) => (
            <div key={step} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: color }}>
                {step}
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral list */}
      <div className="bg-white rounded-2xl border overflow-hidden"
        style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-sm">Your referrals</h2>
        </div>
        {referrals.length === 0 ? (
          <div className="py-12 text-center">
            <Users size={28} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No referrals yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Share your link to start earning
            </p>
          </div>
        ) : (
          <div>
            {referrals.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between px-5 py-3 border-b"
                style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
                    {r.referred?.name?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.referred?.name ?? 'User'}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>@{r.referred?.username}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      background: r.status === 'converted' ? 'rgba(0,217,126,0.1)' : 'var(--bg-elevated)',
                      color: r.status === 'converted' ? 'var(--accent-green)' : 'var(--text-muted)',
                    }}>
                    {r.status === 'converted' ? '✓ Converted' : 'Pending'}
                  </span>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {new Date(r.created_at).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
