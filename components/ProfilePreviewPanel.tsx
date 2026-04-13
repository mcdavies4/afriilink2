'use client'
import { ExternalLink, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface Props {
  username: string
  profile: any
  links: { id: string; title: string; url: string; icon: string | null; active: boolean; position: number }[]
}

const THEMES: Record<string, any> = {
  aurora:   { headerBg: 'linear-gradient(135deg,#6c63ff,#a855f7,#ff3cac)', pageBg: '#f4f3ff', cardBg: '#fff', textPrimary: '#0f0e1a', textSecondary: '#4a4869', linkBg: '#faf9ff', linkBorder: 'rgba(108,99,255,0.12)' },
  sunset:   { headerBg: 'linear-gradient(135deg,#ff6b35,#ffd166)', pageBg: '#fff8f0', cardBg: '#fff', textPrimary: '#1a0f00', textSecondary: '#7a5a30', linkBg: '#fffbf5', linkBorder: 'rgba(255,107,53,0.15)' },
  forest:   { headerBg: 'linear-gradient(135deg,#00d97e,#0ea5e9)', pageBg: '#f0fdf8', cardBg: '#fff', textPrimary: '#022c22', textSecondary: '#1a5e40', linkBg: '#f5fdf9', linkBorder: 'rgba(0,217,126,0.15)' },
  midnight: { headerBg: 'linear-gradient(135deg,#1a1a2e,#6c63ff)', pageBg: '#0f0e1a', cardBg: '#1a1a2e', textPrimary: '#f0eeff', textSecondary: '#9896b8', linkBg: '#1e1e38', linkBorder: 'rgba(108,99,255,0.2)' },
  clean:    { headerBg: 'linear-gradient(135deg,#e8e6ff,#f0efff)', pageBg: '#f5f4f8', cardBg: '#fff', textPrimary: '#0f0e1a', textSecondary: '#4a4869', linkBg: '#f9f8ff', linkBorder: 'rgba(108,99,255,0.1)' },
  peach:    { headerBg: 'linear-gradient(135deg,#ffd166,#ff6b35)', pageBg: '#fff8f0', cardBg: '#fff', textPrimary: '#2d1200', textSecondary: '#8c4a15', linkBg: '#fffaf5', linkBorder: 'rgba(255,107,53,0.15)' },
}

export function ProfilePreviewPanel({ username, profile, links }: Props) {
  const [visible, setVisible] = useState(true)
  const [key, setKey] = useState(0)

  const theme = THEMES[profile?.theme ?? 'aurora']
  const accent = profile?.accent_color ?? '#6c63ff'
  const activeLinks = links.filter(l => l.active)
  const initials = profile?.name?.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase() ?? username?.slice(0, 2).toUpperCase()

  return (
    <div className="bg-white rounded-2xl border overflow-hidden"
      style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>

      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            afriilink.com/u/{username}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setKey(k => k + 1)} title="Refresh preview"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <RefreshCw size={13} />
          </button>
          <button onClick={() => setVisible(v => !v)} title={visible ? 'Hide preview' : 'Show preview'}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            {visible ? <EyeOff size={13} /> : <Eye size={13} />}
          </button>
          <Link href={`/u/${username}`} target="_blank" title="Open full page"
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-muted)' }}>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {visible && (
        <div key={key} className="overflow-y-auto" style={{ maxHeight: '520px', background: theme.pageBg }}>
          {/* Mini profile preview */}
          <div className="h-16 relative" style={{ background: theme.headerBg }} />

          <div className="px-3 pb-4" style={{ marginTop: '-24px' }}>
            <div className="rounded-2xl overflow-hidden"
              style={{ background: theme.cardBg, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: `1px solid ${theme.linkBorder}` }}>

              <div className="px-4 pt-4 pb-3">
                <div className="flex items-end justify-between mb-3">
                  <div className="w-14 h-14 rounded-xl border-3 overflow-hidden flex-shrink-0"
                    style={{ background: `linear-gradient(135deg,${accent},#ff3cac)`, borderColor: theme.cardBg, borderWidth: 3 }}>
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-base">
                        {initials}
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-sm leading-tight mb-0.5" style={{ color: theme.textPrimary }}>
                  {profile?.name ?? username}
                </h3>
                <p className="text-xs font-semibold mb-1.5" style={{ color: accent }}>@{username}</p>
                {profile?.bio && (
                  <p className="text-xs leading-relaxed" style={{ color: theme.textSecondary }}>
                    {profile.bio.slice(0, 80)}{profile.bio.length > 80 ? '...' : ''}
                  </p>
                )}
                <div className="h-px mt-3" style={{ background: theme.linkBorder }} />
              </div>

              <div className="px-4 pb-4 flex flex-col gap-2">
                {activeLinks.slice(0, 6).map((link: any) => (
                  <div key={link.id}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium"
                    style={{ background: theme.linkBg, borderColor: theme.linkBorder, color: theme.textPrimary }}>
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: accent + '15' }}>
                      {link.icon ?? '🔗'}
                    </span>
                    <span className="flex-1 truncate">{link.title}</span>
                  </div>
                ))}
                {activeLinks.length === 0 && (
                  <p className="text-center py-4 text-xs" style={{ color: theme.textSecondary }}>
                    No active links yet
                  </p>
                )}
                {activeLinks.length > 6 && (
                  <p className="text-center text-xs" style={{ color: theme.textSecondary }}>
                    +{activeLinks.length - 6} more links
                  </p>
                )}
              </div>
            </div>

            {profile?.plan === 'FREE' && (
              <p className="text-center text-xs mt-3" style={{ color: theme.textSecondary }}>
                Made with <span style={{ color: accent }}>Afriilink</span>
              </p>
            )}
          </div>
        </div>
      )}

      {!visible && (
        <div className="py-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
          Preview hidden
        </div>
      )}
    </div>
  )
}
