'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Mail, Download, ToggleLeft, ToggleRight, Users, TrendingUp } from 'lucide-react'

interface EmailCapture {
  id: string
  email: string
  name: string | null
  source: string
  created_at: string
}

interface CaptureConfig {
  email_capture_enabled: boolean
  email_capture_title: string
  email_capture_subtitle: string
  email_capture_button: string
}

export default function EmailPage() {
  const [captures, setCaptures]   = useState<EmailCapture[]>([])
  const [config, setConfig]       = useState<CaptureConfig>({
    email_capture_enabled: false,
    email_capture_title: 'Stay in the loop',
    email_capture_subtitle: 'Drop your email to get updates.',
    email_capture_button: 'Subscribe',
  })
  const [saving, setSaving]       = useState(false)
  const [loading, setLoading]     = useState(true)
  const supabase = createClient()

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: profile } = await supabase
      .from('profiles')
      .select('email_capture_enabled, email_capture_title, email_capture_subtitle, email_capture_button')
      .eq('user_id', user.id).single()

    if (profile) setConfig(profile as CaptureConfig)

    const res = await fetch('/api/email-capture')
    const data = await res.json()
    if (data.captures) setCaptures(data.captures)
    setLoading(false)
  }

  async function saveConfig() {
    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
    const data = await res.json()
    setSaving(false)
    if (data.error) return toast.error(data.error)
    toast.success('Saved!')
  }

  function exportCSV() {
    const header = 'Email,Name,Date\n'
    const rows = captures.map(c =>
      `${c.email},${c.name || ''},${new Date(c.created_at).toLocaleDateString('en-GB')}`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `afriilink-emails-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Exported ${captures.length} emails`)
  }

  const thisWeek = captures.filter(c => {
    const d = new Date(c.created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return d > weekAgo
  }).length

  const cardStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '20px 24px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0a0a0a', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 14px', color: 'var(--text)',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 800 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Email Capture</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            Collect emails directly from your Afriilink page
          </p>
        </div>
        {captures.length > 0 && (
          <button onClick={exportCSV} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 100, background: 'transparent',
            border: '1px solid var(--border)', color: 'var(--text)',
            fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <Download size={14} /> Export CSV
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total subscribers', value: captures.length, icon: Users, color: 'var(--accent)' },
          { label: 'This week', value: thisWeek, icon: TrendingUp, color: '#7b6ef6' },
          { label: 'Capture status', value: config.email_capture_enabled ? 'Active' : 'Off', icon: Mail, color: config.email_capture_enabled ? 'var(--accent)' : 'var(--muted)' },
        ].map(s => (
          <div key={s.label} style={cardStyle}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Config */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>Capture Widget</h2>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Shown on your public page when enabled</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, color: config.email_capture_enabled ? 'var(--accent)' : 'var(--muted)' }}>
              {config.email_capture_enabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              onClick={() => setConfig(p => ({ ...p, email_capture_enabled: !p.email_capture_enabled }))}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: config.email_capture_enabled ? 'var(--accent)' : 'var(--muted)', display: 'flex' }}>
              {config.email_capture_enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          {[
            { key: 'email_capture_title',    label: 'TITLE',           ph: 'Stay in the loop' },
            { key: 'email_capture_button',   label: 'BUTTON TEXT',     ph: 'Subscribe' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 6 }}>{f.label}</label>
              <input
                value={(config as Record<string, string | boolean>)[f.key] as string}
                onChange={e => setConfig(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.ph} style={inputStyle}
              />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 6 }}>SUBTITLE</label>
          <input
            value={config.email_capture_subtitle}
            onChange={e => setConfig(p => ({ ...p, email_capture_subtitle: e.target.value }))}
            placeholder="Drop your email to get updates."
            style={inputStyle}
          />
        </div>

        {/* Live preview */}
        <div style={{
          padding: '20px 24px', borderRadius: 12, marginBottom: 20,
          background: 'var(--bg)', border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 12 }}>PREVIEW</div>
          <div style={{
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '20px 20px',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
              {config.email_capture_title || 'Stay in the loop'}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
              {config.email_capture_subtitle || 'Drop your email to get updates.'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{
                flex: 1, background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '10px 14px', fontSize: 13, color: 'var(--muted)',
              }}>
                your@email.com
              </div>
              <div style={{
                padding: '10px 18px', borderRadius: 10, background: 'var(--accent)',
                color: '#0a0a0a', fontSize: 13, fontWeight: 600,
              }}>
                {config.email_capture_button || 'Subscribe'}
              </div>
            </div>
          </div>
        </div>

        <button onClick={saveConfig} disabled={saving} style={{
          padding: '12px 28px', borderRadius: 100, background: 'var(--accent)',
          border: 'none', color: '#0a0a0a', fontSize: 14, fontWeight: 700,
          cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1,
        }}>
          {saving ? 'Saving...' : 'Save settings →'}
        </button>
      </div>

      {/* Subscribers list */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>Subscribers</h2>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>{captures.length} total</span>
        </div>

        {loading ? (
          <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '20px 0' }}>Loading...</p>
        ) : captures.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Mail size={32} style={{ color: 'var(--border)', marginBottom: 12 }} />
            <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No subscribers yet</p>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>
              Enable the widget above and share your page to start collecting emails.
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 140px 120px',
              padding: '8px 12px', marginBottom: 8,
              fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              <span>Email</span><span>Name</span><span>Date</span>
            </div>
            {captures.map(c => (
              <div key={c.id} style={{
                display: 'grid', gridTemplateColumns: '1fr 140px 120px',
                padding: '12px 12px', borderRadius: 10,
                fontSize: 13, alignItems: 'center',
                borderBottom: '1px solid var(--border)',
              }}>
                <span style={{ fontWeight: 500 }}>{c.email}</span>
                <span style={{ color: 'var(--muted)' }}>{c.name || '—'}</span>
                <span style={{ color: 'var(--muted)', fontSize: 12 }}>
                  {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
