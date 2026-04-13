'use client'
import { useState } from 'react'
import { Loader2, Check, Save, Lock } from 'lucide-react'
import Link from 'next/link'
import { ManageSubscriptionButton } from './ManageSubscriptionButton'
import { ImageUpload } from './ImageUpload'
import { PremiumGate, PremiumBadge } from './PremiumGate'

const ALL_THEMES = [
  { id: 'aurora',   label: 'Aurora',   bg: 'linear-gradient(135deg,#6c63ff,#ff3cac)', free: true },
  { id: 'clean',    label: 'Clean',    bg: '#f4f3ff',                                 free: true },
  { id: 'sunset',   label: 'Sunset',   bg: 'linear-gradient(135deg,#ff6b35,#ffd166)', free: false },
  { id: 'forest',   label: 'Forest',   bg: 'linear-gradient(135deg,#00d97e,#0ea5e9)', free: false },
  { id: 'midnight', label: 'Midnight', bg: 'linear-gradient(135deg,#1a1a2e,#6c63ff)', free: false },
  { id: 'peach',    label: 'Peach',    bg: 'linear-gradient(135deg,#ffd166,#ff6b35)', free: false },
]

export function SettingsForm({ profile }: { profile: any }) {
  const isPremium = profile?.plan === 'PREMIUM'

  const [form, setForm] = useState({
    name:              profile?.name             ?? '',
    username:          profile?.username         ?? '',
    bio:               profile?.bio              ?? '',
    avatar_url:        profile?.avatar_url       ?? '',
    header_url:        profile?.header_url       ?? '',
    theme:             profile?.theme            ?? 'aurora',
    accent_color:      profile?.accent_color     ?? '#6c63ff',
    youtube_url:       profile?.youtube_url      ?? '',
    youtube_title:     profile?.youtube_title    ?? '',
    music_url:         profile?.music_url        ?? '',
    music_type:        profile?.music_type       ?? 'spotify',
    dark_mode_toggle:  profile?.dark_mode_toggle !== false,
    link_sound:        profile?.link_sound       ?? false,
    ga_measurement_id: profile?.ga_measurement_id ?? '',
  })
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500) }
    else { const d = await res.json(); setError(d.error ?? 'Failed to save') }
  }

  const inp = "w-full px-4 py-3 rounded-xl text-sm placeholder:text-[#9896b8] focus:outline-none transition-all"
  const inpSty = { border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }
  const card = "bg-white rounded-2xl border p-6"
  const cardSty = { borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>}

      {/* ── Images ──────────────────────────────────── */}
      <div className={card + ' space-y-6'} style={cardSty}>
        <h2 className="font-bold text-base">Profile images</h2>
        <ImageUpload type="header" label="Header banner" currentUrl={form.header_url} onUpload={url => set('header_url', url)} />
        <div className="h-px" style={{ background: 'var(--border)' }} />
        <ImageUpload type="avatar" label="Profile picture" currentUrl={form.avatar_url} onUpload={url => set('avatar_url', url)} />
      </div>

      {/* ── Profile info ────────────────────────────── */}
      <div className={card + ' space-y-4'} style={cardSty}>
        <h2 className="font-bold text-base">Profile info</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5">Full name</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" className={inp} style={inpSty} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'var(--text-muted)' }}>@</span>
              <input type="text" value={form.username} onChange={e => set('username', e.target.value.toLowerCase())} placeholder="username" className={inp} style={{ ...inpSty, paddingLeft: '28px' }} />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Bio <span className="font-normal" style={{ color: 'var(--text-muted)' }}>({form.bio.length}/300)</span></label>
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} maxLength={300} placeholder="Tell visitors who you are..." className={inp + ' resize-none'} style={inpSty} />
        </div>
      </div>

      {/* ── Theme ───────────────────────────────────── */}
      <div className={card} style={cardSty}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base">Page theme</h2>
          {!isPremium && (
            <Link href="/upgrade" className="text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: 'var(--bg-elevated)', color: 'var(--brand)', border: '1px solid var(--border-strong)' }}>
              Unlock all →
            </Link>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
          {ALL_THEMES.map(theme => {
            const locked = !isPremium && !theme.free
            return (
              <button key={theme.id} type="button"
                onClick={() => { if (!locked) set('theme', theme.id) }}
                className="relative h-16 rounded-xl overflow-hidden border-2 transition-all"
                style={{
                  background: theme.bg,
                  borderColor: form.theme === theme.id ? 'var(--brand)' : 'transparent',
                  transform: form.theme === theme.id ? 'scale(1.07)' : 'scale(1)',
                  cursor: locked ? 'not-allowed' : 'pointer',
                  opacity: locked ? 0.55 : 1,
                  boxShadow: form.theme === theme.id ? '0 4px 16px rgba(108,99,255,0.3)' : 'none',
                }}>
                <span className="absolute bottom-1 left-0 right-0 text-[10px] font-semibold text-center text-white drop-shadow">{theme.label}</span>
                {locked && <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.15)' }}><Lock size={14} className="text-white" /></div>}
                {form.theme === theme.id && !locked && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow">
                    <Check size={10} style={{ color: 'var(--brand)' }} />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Accent colour — Premium only */}
        <div>
          <label className="block text-sm font-semibold mb-2 flex items-center">
            Accent colour {!isPremium && <PremiumBadge />}
          </label>
          {isPremium ? (
            <div className="flex items-center gap-3">
              <input type="color" value={form.accent_color} onChange={e => set('accent_color', e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border" style={{ borderColor: 'var(--border-strong)' }} />
              <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>{form.accent_color}</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border flex items-center justify-center" style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}>
                <Lock size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
              <Link href="/upgrade" className="text-sm font-semibold hover:underline" style={{ color: 'var(--brand)' }}>Upgrade to customise</Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Media embeds — Premium only ─────────────── */}
      <PremiumGate isPremium={isPremium} feature="Media embeds" mode="lock">
        <div className={card + ' space-y-5'} style={cardSty}>
          <div>
            <h2 className="font-bold text-base mb-1">Media embeds <PremiumBadge /></h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Embed a YouTube video or music player directly on your profile</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">▶️ YouTube URL</label>
            <input type="url" value={form.youtube_url} onChange={e => set('youtube_url', e.target.value)} placeholder="https://youtube.com/watch?v=..." className={inp} style={inpSty} />
            <input type="text" value={form.youtube_title} onChange={e => set('youtube_title', e.target.value)} placeholder="Custom video title (optional)" className={inp + ' mt-2'} style={inpSty} />
          </div>
          <div className="h-px" style={{ background: 'var(--border)' }} />
          <div>
            <label className="block text-sm font-semibold mb-2">🎵 Music player</label>
            <div className="flex gap-2 mb-2">
              {['spotify', 'apple'].map(t => (
                <button key={t} type="button" onClick={() => set('music_type', t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: form.music_type === t ? (t === 'spotify' ? '#1db954' : '#fc3c44') : 'var(--bg-elevated)',
                    color: form.music_type === t ? 'white' : 'var(--text-secondary)',
                  }}>
                  {t === 'spotify' ? '🟢 Spotify' : '🔴 Apple Music'}
                </button>
              ))}
            </div>
            <input type="url" value={form.music_url} onChange={e => set('music_url', e.target.value)}
              placeholder={form.music_type === 'apple' ? 'https://music.apple.com/...' : 'https://open.spotify.com/track/...'}
              className={inp} style={inpSty} />
          </div>
        </div>
      </PremiumGate>

      {/* ── Page behaviour — Premium only ───────────── */}
      <PremiumGate isPremium={isPremium} feature="Page behaviour settings" mode="lock">
        <div className={card + ' space-y-4'} style={cardSty}>
          <h2 className="font-bold text-base">Page behaviour <PremiumBadge /></h2>

          {[
            { key: 'dark_mode_toggle', label: 'Dark mode toggle', desc: 'Let visitors switch between light and dark mode' },
            { key: 'link_sound', label: 'Link click sound & haptics', desc: 'Play a subtle sound and vibration when links are tapped' },
          ].map(({ key, label, desc }) => (
            <div key={key}>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</p>
                </div>
                <button type="button" onClick={() => set(key, !(form as any)[key])}
                  className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
                  style={{ background: (form as any)[key] ? 'var(--accent-green)' : '#e5e7eb' }}>
                  <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all"
                    style={{ left: (form as any)[key] ? '20px' : '2px' }} />
                </button>
              </div>
              <div className="h-px" style={{ background: 'var(--border)' }} />
            </div>
          ))}
        </div>
      </PremiumGate>

      {/* ── Google Analytics — Premium only ─────────── */}
      <PremiumGate isPremium={isPremium} feature="Google Analytics integration" mode="lock">
        <div className={card} style={cardSty}>
          <h2 className="font-bold text-base mb-1">Google Analytics <PremiumBadge /></h2>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Track your profile in Google Analytics with your own GA4 property</p>
          <input type="text" value={form.ga_measurement_id} onChange={e => set('ga_measurement_id', e.target.value)}
            placeholder="G-XXXXXXXXXX" className={inp} style={inpSty} />
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
            Google Analytics → Admin → Data Streams → your stream
          </p>
        </div>
      </PremiumGate>

      {/* ── Plan ────────────────────────────────────── */}
      <div className={card} style={cardSty}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base">Current plan</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {isPremium ? 'Premium — all features unlocked ✅' : 'Free plan — limited features'}
            </p>
          </div>
          {isPremium ? <ManageSubscriptionButton /> : (
            <Link href="/upgrade" className="text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
              Upgrade — $10/mo
            </Link>
          )}
        </div>
      </div>

      {/* ── Danger zone ─────────────────────────────── */}
      <div className={card} style={{ borderColor: 'rgba(239,68,68,0.2)', boxShadow: 'var(--shadow-sm)' }}>
        <h2 className="font-bold text-base text-red-500 mb-1">Danger zone</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Permanently delete your account and all your data. This cannot be undone.</p>
        <button type="button"
          onClick={async () => {
            if (!confirm('Are you absolutely sure? This permanently deletes your account and all your links.')) return
            const res = await fetch('/api/account', { method: 'DELETE' })
            if (res.ok) window.location.href = '/'
            else alert('Failed to delete account. Please contact support.')
          }}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
          Delete my account
        </button>
      </div>

      {/* ── Save ────────────────────────────────────── */}
      <button type="submit" disabled={saving}
        className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-60"
        style={{ background: 'var(--brand)' }}>
        {saving ? <Loader2 size={17} className="animate-spin" /> : saved ? <><Check size={17} /> Saved!</> : <><Save size={17} /> Save changes</>}
      </button>
    </form>
  )
}
