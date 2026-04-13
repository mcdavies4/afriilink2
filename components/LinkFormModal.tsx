'use client'
import { useState, useEffect } from 'react'
import { X, Loader2, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

const ICONS = ['🔗','💬','✈️','📸','🐦','▶️','🎵','💼','🛍️','📧','🌐','💳','📅','⭐','🎨','📝','🏪','🎯','🚀','🎤','📢','🔥','💰','🎁','📖','📱','🤝','🔔','📌','🏆']
const CATEGORIES = ['general','social','shop','content','music','contact','booking','other']

interface Props {
  link: any
  onSave: (data: any) => Promise<void>
  onClose: () => void
  isPremium?: boolean
}

export function LinkFormModal({ link, onSave, onClose, isPremium = false }: Props) {
  const [form, setForm] = useState({
    title:        link?.title        ?? '',
    url:          link?.url          ?? '',
    icon:         link?.icon         ?? '🔗',
    category:     link?.category     ?? 'general',
    scheduled_at: link?.scheduled_at ? link.scheduled_at.slice(0, 16) : '',
    expires_at:   link?.expires_at   ? link.expires_at.slice(0, 16)   : '',
  })
  const [saving, setSaving]           = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onSave({
      ...form,
      scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
      expires_at:   form.expires_at   ? new Date(form.expires_at).toISOString()   : null,
    })
    setSaving(false)
  }

  const inp = "w-full px-3 py-2.5 rounded-xl text-sm placeholder:text-[#9896b8] focus:outline-none transition-all"
  const inpSty = { border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md animate-scale-in overflow-y-auto"
        style={{ maxHeight: '90vh', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)' }}>

        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10"
          style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-base">{link ? 'Edit link' : 'Add new link'}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">

          {/* Icon picker */}
          <div>
            <label className="block text-sm font-semibold mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button key={ic} type="button" onClick={() => setForm(f => ({ ...f, icon: ic }))}
                  className="w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all"
                  style={{
                    background: form.icon === ic ? 'var(--bg-elevated)' : 'var(--bg-base)',
                    outline: form.icon === ic ? '2px solid var(--brand)' : 'none',
                  }}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Title</label>
            <input type="text" required value={form.title} maxLength={100}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. My Online Store"
              className={inp} style={inpSty} />
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-semibold mb-1.5">URL</label>
            <input type="url" required value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              placeholder="https://..."
              className={inp} style={inpSty} />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-1.5 flex items-center gap-1.5">
              <Tag size={13} /> Category
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat} type="button" onClick={() => setForm(f => ({ ...f, category: cat }))}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                  style={{
                    background: form.category === cat ? 'var(--brand)' : 'var(--bg-elevated)',
                    color: form.category === cat ? 'white' : 'var(--text-secondary)',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scheduling — Premium only */}
          {isPremium ? (
            <>
              <button type="button" onClick={() => setShowAdvanced(v => !v)}
                className="flex items-center gap-1.5 text-xs font-semibold w-full text-left"
                style={{ color: 'var(--brand)' }}>
                <Calendar size={13} />
                {showAdvanced ? 'Hide' : 'Show'} scheduling options
              </button>

              {showAdvanced && (
                <div className="space-y-3 pt-1 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Go live at (optional)
                    </label>
                    <input type="datetime-local" value={form.scheduled_at}
                      onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))}
                      className={inp} style={inpSty} />
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Link stays hidden until this date/time</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                      Expire at (optional)
                    </label>
                    <input type="datetime-local" value={form.expires_at}
                      onChange={e => setForm(f => ({ ...f, expires_at: e.target.value }))}
                      className={inp} style={inpSty} />
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Link auto-hides after this date/time</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-3 rounded-xl text-xs text-center border-dashed border"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--text-muted)' }}>
              🔒 <Link href="/upgrade" style={{ color: 'var(--brand)', fontWeight: 600 }}>Upgrade to Premium</Link> to schedule and expire links
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border text-sm font-semibold"
              style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)' }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'var(--brand)' }}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : (link ? 'Save changes' : 'Add link')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
