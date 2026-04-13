'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { ExternalLink, Share2, Check, Link as LinkIcon, Sun, Moon } from 'lucide-react'
import { YouTubeEmbed } from './profile/YouTubeEmbed'
import { MusicEmbed } from './profile/MusicEmbed'
import { WhatsAppButton } from './profile/WhatsAppButton'
import Script from 'next/script'

const LIGHT_THEMES: Record<string, any> = {
  aurora:   { headerBg:'linear-gradient(135deg,#6c63ff 0%,#a855f7 50%,#ff3cac 100%)', pageBg:'linear-gradient(180deg,#f0efff,#faf9ff)', cardBg:'#fff', textPrimary:'#0f0e1a', textSecondary:'#4a4869', textMuted:'#9896b8', linkBg:'#faf9ff', linkBorder:'rgba(108,99,255,0.12)', linkHoverBg:'#f4f3ff', statBg:'#f4f3ff' },
  sunset:   { headerBg:'linear-gradient(135deg,#ff6b35,#f7931e,#ffd166)', pageBg:'linear-gradient(180deg,#fff4ec,#fffdf5)', cardBg:'#fff', textPrimary:'#1a0f00', textSecondary:'#7a5a30', textMuted:'#b8956a', linkBg:'#fffbf5', linkBorder:'rgba(255,107,53,0.15)', linkHoverBg:'#fff4ec', statBg:'#fff4ec' },
  forest:   { headerBg:'linear-gradient(135deg,#00d97e,#0ea5e9)', pageBg:'linear-gradient(180deg,#ecfdf8,#f0f9ff)', cardBg:'#fff', textPrimary:'#022c22', textSecondary:'#1a5e40', textMuted:'#4a9e78', linkBg:'#f5fdf9', linkBorder:'rgba(0,217,126,0.15)', linkHoverBg:'#ecfdf5', statBg:'#ecfdf5' },
  midnight: { headerBg:'linear-gradient(135deg,#1a1a2e,#6c63ff)', pageBg:'linear-gradient(180deg,#0a0914,#0f0e1a)', cardBg:'#1a1a2e', textPrimary:'#f0eeff', textSecondary:'#9896b8', textMuted:'#5c5a78', linkBg:'#1e1e38', linkBorder:'rgba(108,99,255,0.2)', linkHoverBg:'#252545', statBg:'#13122a' },
  clean:    { headerBg:'linear-gradient(135deg,#e8e6ff,#f0efff)', pageBg:'#f5f4f8', cardBg:'#fff', textPrimary:'#0f0e1a', textSecondary:'#4a4869', textMuted:'#9896b8', linkBg:'#f9f8ff', linkBorder:'rgba(108,99,255,0.1)', linkHoverBg:'#f0efff', statBg:'#f0efff' },
  peach:    { headerBg:'linear-gradient(135deg,#ffd166,#ff9a6c,#ff6b35)', pageBg:'linear-gradient(180deg,#fff8f0,#fff5ec)', cardBg:'#fff', textPrimary:'#2d1200', textSecondary:'#8c4a15', textMuted:'#c4885a', linkBg:'#fffaf5', linkBorder:'rgba(255,107,53,0.15)', linkHoverBg:'#fff4ec', statBg:'#fff4ec' },
}

const DARK_THEMES: Record<string, any> = {
  aurora:   { headerBg:'linear-gradient(135deg,#3b35cc,#7b2fa0,#cc1a7a)', pageBg:'#0a0918', cardBg:'#12112a', textPrimary:'#f0eeff', textSecondary:'#9896b8', textMuted:'#5c5a78', linkBg:'#1a1932', linkBorder:'rgba(108,99,255,0.2)', linkHoverBg:'#201e3e', statBg:'#0f0e24' },
  sunset:   { headerBg:'linear-gradient(135deg,#cc4a1a,#cc7a00,#cc9900)', pageBg:'#0f0800', cardBg:'#1a1000', textPrimary:'#fff4e8', textSecondary:'#c4885a', textMuted:'#7a5a30', linkBg:'#1a1200', linkBorder:'rgba(255,107,53,0.2)', linkHoverBg:'#201600', statBg:'#150e00' },
  forest:   { headerBg:'linear-gradient(135deg,#008a50,#0a7abf)', pageBg:'#030e08', cardBg:'#071a0f', textPrimary:'#e8fff4', textSecondary:'#4a9e78', textMuted:'#2a5e40', linkBg:'#0a2015', linkBorder:'rgba(0,217,126,0.2)', linkHoverBg:'#102a1a', statBg:'#061510' },
  midnight: { headerBg:'linear-gradient(135deg,#0a0918,#3b35cc)', pageBg:'#050410', cardBg:'#0d0c22', textPrimary:'#f0eeff', textSecondary:'#7876a8', textMuted:'#3c3a58', linkBg:'#100f28', linkBorder:'rgba(108,99,255,0.25)', linkHoverBg:'#161430', statBg:'#080718' },
  clean:    { headerBg:'linear-gradient(135deg,#2a2860,#3a3880)', pageBg:'#0f0e1a', cardBg:'#1a1930', textPrimary:'#f0eeff', textSecondary:'#9896b8', textMuted:'#5c5a78', linkBg:'#201e38', linkBorder:'rgba(108,99,255,0.15)', linkHoverBg:'#262448', statBg:'#15142a' },
  peach:    { headerBg:'linear-gradient(135deg,#8a6010,#8a4010,#6a2a00)', pageBg:'#0f0800', cardBg:'#1a1000', textPrimary:'#fff4e8', textSecondary:'#c4885a', textMuted:'#7a5a30', linkBg:'#1a1200', linkBorder:'rgba(255,107,53,0.2)', linkHoverBg:'#201600', statBg:'#150e00' },
}

function hexToRgb(hex: string) {
  try {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
    return `${r},${g},${b}`
  } catch { return '108,99,255' }
}

export function ProfilePage({ profile, links }: { profile: any; links: any[] }) {
  const [isDark, setIsDark] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  const isPremium = profile.plan === 'PREMIUM'
  const theme = (isDark ? DARK_THEMES : LIGHT_THEMES)[profile.theme] ?? (isDark ? DARK_THEMES : LIGHT_THEMES).aurora
  const accent = profile.accent_color ?? '#6c63ff'
  const allowDarkToggle = isPremium && profile.dark_mode_toggle !== false
  const linkSound = isPremium && profile.link_sound === true

  useEffect(() => {
    setMounted(true)
    // Respect system dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) setIsDark(true)
    if (profile.id === 'demo') return
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: profile.id }),
    }).catch(() => {})
  }, [profile.id])

  const initials = profile.name
    ? profile.name.split(' ').map((w: string) => w[0]).slice(0,2).join('').toUpperCase()
    : profile.username?.slice(0,2).toUpperCase()

  const playClickSound = useCallback(() => {
    if (!linkSound) return
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.1)
      // Haptic feedback on mobile
      if (navigator.vibrate) navigator.vibrate(30)
    } catch {}
  }, [linkSound])

  const handleLinkClick = (linkId: string, url: string, title: string) => {
    if (linkId === 'demo') return
    playClickSound()
    try {
      navigator.sendBeacon('/api/analytics/click',
        new Blob([JSON.stringify({ linkId, url, title })], { type: 'application/json' })
      )
    } catch {}
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: `${profile.name ?? profile.username} on Afriilink`, url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const hasHeader = !!profile.header_url

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: theme.pageBg }}>

      {/* Google Analytics — Premium only */}
      {profile.ga_measurement_id && isPremium && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${profile.ga_measurement_id}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${profile.ga_measurement_id}');`}
          </Script>
        </>
      )}

      {/* Header banner */}
      <div className="h-48 sm:h-56 relative overflow-hidden"
        style={{ background: hasHeader ? 'transparent' : theme.headerBg }}>
        {hasHeader ? (
          <img src={profile.header_url} alt="Header" className="w-full h-full object-cover" />
        ) : (
          <>
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.3)' }} />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full opacity-15" style={{ background: 'rgba(255,255,255,0.4)' }} />
          </>
        )}
        {hasHeader && <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.15)' }} />}

        {/* Top right controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {allowDarkToggle && (
            <button onClick={() => setIsDark(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold backdrop-blur-sm transition-all active:scale-95"
              style={{ background: 'rgba(255,255,255,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>
              {isDark ? <Sun size={12} /> : <Moon size={12} />}
              {isDark ? 'Light' : 'Dark'}
            </button>
          )}
          <button onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold backdrop-blur-sm transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.25)', color: 'white', border: '1px solid rgba(255,255,255,0.4)' }}>
            {copied ? <Check size={12} /> : <Share2 size={12} />}
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-24 relative z-10" style={{ marginTop: '-72px' }}>

        {/* Profile card */}
        <div className="rounded-3xl overflow-hidden transition-colors duration-300"
          style={{ background: theme.cardBg, boxShadow: `0 20px 60px rgba(0,0,0,0.15),0 4px 16px rgba(${hexToRgb(accent)},0.1)`, border: `1px solid ${theme.linkBorder}` }}>

          <div className="px-6 pt-6 pb-5">
            <div className="flex items-end justify-between mb-4">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4"
                  style={{ borderColor: theme.cardBg, background: `linear-gradient(135deg,${accent},#ff3cac)` }}>
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.name ?? profile.username} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl">{initials}</div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2" style={{ background: '#00d97e', borderColor: theme.cardBg }} />
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: theme.statBg, color: theme.textMuted, border: `1px solid ${theme.linkBorder}` }}>
                <LinkIcon size={10} />{profile.username}
              </div>
            </div>

            <h1 className="text-2xl font-bold mb-0.5 leading-tight" style={{ color: theme.textPrimary }}>
              {profile.name ?? profile.username}
            </h1>
            <p className="text-sm font-semibold mb-3" style={{ color: accent }}>@{profile.username}</p>
            {profile.bio && <p className="text-sm leading-relaxed mb-4" style={{ color: theme.textSecondary }}>{profile.bio}</p>}

            <div className="h-px" style={{ background: theme.linkBorder }} />
          </div>

          <div className="px-6 pb-6 flex flex-col gap-3">

            {/* YouTube embed — Premium only */}
            {profile.youtube_url && isPremium && (
              <YouTubeEmbed
                url={profile.youtube_url}
                title={profile.youtube_title}
                accent={accent}
                theme={theme}
              />
            )}

            {/* Music embed — Premium only */}
            {profile.music_url && isPremium && (
              <MusicEmbed
                url={profile.music_url}
                type={profile.music_type ?? 'spotify'}
                accent={accent}
                theme={theme}
              />
            )}

            {/* Links */}
            {links.map((link, i) => (
              <a key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleLinkClick(link.id, link.url, link.title)}
                className="group flex items-center gap-3 w-full px-4 py-4 rounded-2xl border font-medium text-sm"
                style={{
                  background: theme.linkBg,
                  borderColor: theme.linkBorder,
                  color: theme.textPrimary,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'translateY(0)' : 'translateY(8px)',
                  transition: `opacity 0.4s ease ${i * 80}ms, transform 0.4s ease ${i * 80}ms, background 0.2s, border-color 0.2s, box-shadow 0.2s`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = theme.linkHoverBg
                  el.style.borderColor = accent + '55'
                  el.style.transform = 'translateY(-2px)'
                  el.style.boxShadow = `0 8px 24px rgba(${hexToRgb(accent)},0.15)`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = theme.linkBg
                  el.style.borderColor = theme.linkBorder
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform group-hover:scale-110"
                  style={{ background: `rgba(${hexToRgb(accent)},0.1)` }}>
                  {link.icon ?? '🔗'}
                </div>
                <span className="flex-1 text-left font-semibold" style={{ color: theme.textPrimary }}>{link.title}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:translate-x-0.5"
                  style={{ background: `rgba(${hexToRgb(accent)},0.08)`, color: accent }}>
                  <ExternalLink size={13} />
                </div>
              </a>
            ))}

          {links.length === 0 && !profile.youtube_url && !profile.music_url && (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">🔗</div>
                <p className="font-semibold mb-1" style={{ color: theme.textSecondary }}>No links yet</p>
                <p className="text-sm" style={{ color: theme.textMuted }}>Check back soon</p>
              </div>
            )}
          </div>
        </div>

        {/* Powered by badge */}
        {profile.plan === 'FREE' && (
          <div className="text-center mt-6">
            <Link href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all hover:scale-105 active:scale-95"
              style={{ background: theme.cardBg, color: theme.textMuted, border: `1px solid ${theme.linkBorder}`, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
                <span className="text-white font-bold" style={{ fontSize: '9px' }}>A</span>
              </div>
              Made with Afriilink
              <span style={{ opacity: 0.4 }}>·</span>
              <span style={{ color: accent }}>Get yours free</span>
            </Link>
          </div>
        )}
      </div>

      {/* WhatsApp floating button — Premium only */}
      {isPremium && <WhatsAppButton links={links} accent={accent} />}
    </div>
  )
}
