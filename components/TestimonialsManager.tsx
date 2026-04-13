'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2, Star, Loader2, X } from 'lucide-react'

interface Testimonial {
  id: string
  author_name: string
  author_handle?: string
  author_avatar?: string
  content: string
  rating: number
}

export function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    author_name: '', author_handle: '', author_avatar: '', content: '', rating: 5
  })

  const fetchItems = async () => {
    const res = await fetch('/api/testimonials?userId=me')
    // Use profile API to get own testimonials
    const supaRes = await fetch('/api/profile')
    const profile = await supaRes.json()
    if (profile?.id) {
      const tRes = await fetch(`/api/testimonials?userId=${profile.id}`)
      const data = await tRes.json()
      if (Array.isArray(data)) setItems(data)
    }
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const data = await res.json()
      setItems(prev => [...prev, data])
      setForm({ author_name: '', author_handle: '', author_avatar: '', content: '', rating: 5 })
      setShowForm(false)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    setItems(prev => prev.filter(t => t.id !== id))
    await fetch('/api/testimonials', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  const inp = "w-full px-3 py-2.5 rounded-xl text-sm placeholder:text-[#9896b8] focus:outline-none"
  const inpSty = { border: '1px solid var(--border-strong)', background: 'var(--bg-base)' }

  return (
    <div className="bg-white rounded-2xl border p-6"
      style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-base">Testimonials</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Show what people say about you on your profile
          </p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white transition-all active:scale-95"
          style={{ background: 'var(--brand)' }}>
          <Plus size={13} /> Add
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="mb-5 p-4 rounded-2xl border space-y-3"
          style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-elevated)' }}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">New testimonial</p>
            <button onClick={() => setShowForm(false)} style={{ color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input required value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                placeholder="Their name *" className={inp} style={inpSty} />
              <input value={form.author_handle} onChange={e => setForm(f => ({ ...f, author_handle: e.target.value }))}
                placeholder="@handle (optional)" className={inp} style={inpSty} />
            </div>
            <input value={form.author_avatar} onChange={e => setForm(f => ({ ...f, author_avatar: e.target.value }))}
              placeholder="Their photo URL (optional)" className={inp} style={inpSty} />
            <textarea required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={3} maxLength={300} placeholder="What they said about you *"
              className={inp + ' resize-none'} style={inpSty} />
            {/* Star rating */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Rating:</span>
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}>
                  <Star size={18} fill={s <= form.rating ? '#ffd166' : 'transparent'}
                    style={{ color: s <= form.rating ? '#ffd166' : 'var(--text-muted)' }} />
                </button>
              ))}
            </div>
            <button type="submit" disabled={saving}
              className="w-full py-2.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'var(--brand)' }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : 'Add testimonial'}
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 size={20} className="animate-spin" style={{ color: 'var(--brand)' }} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <Star size={28} className="mx-auto mb-2 opacity-20" />
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>No testimonials yet</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Add what your fans and customers say about you</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(t => (
            <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl border"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
                {t.author_name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold">{t.author_name}</span>
                  {t.author_handle && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.author_handle}</span>}
                  <div className="flex ml-auto">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={10} fill={s <= t.rating ? '#ffd166' : 'transparent'}
                        style={{ color: s <= t.rating ? '#ffd166' : 'var(--text-muted)' }} />
                    ))}
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  &ldquo;{t.content}&rdquo;
                </p>
              </div>
              <button onClick={() => handleDelete(t.id)}
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                style={{ color: 'var(--text-muted)' }}>
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
