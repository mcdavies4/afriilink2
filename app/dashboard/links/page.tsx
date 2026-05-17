'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Link as LinkType, LINK_ICONS, LINK_LABELS, LinkType as LType } from '@/types'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragEndEvent, DragStartEvent, DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, Trash2, GripVertical, ToggleLeft, ToggleRight, Pencil, X, Clock, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

// ─── Scheduling helpers ─────────────────────────
function isLiveNow(link: LinkType): boolean {
  const now = new Date()
  const scheduled = link.scheduled_at ? new Date(link.scheduled_at) : null
  const expires   = link.expires_at   ? new Date(link.expires_at)   : null
  if (scheduled && now < scheduled) return false
  if (expires   && now > expires)   return false
  return true
}

function scheduleStatus(link: LinkType): { label: string; color: string } | null {
  if (!link.scheduled_at && !link.expires_at) return null
  const now = new Date()
  if (link.scheduled_at && new Date(link.scheduled_at) > now) {
    return { label: `Goes live ${new Date(link.scheduled_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}`, color: '#7b6ef6' }
  }
  if (link.expires_at && new Date(link.expires_at) > now) {
    return { label: `Expires ${new Date(link.expires_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}`, color: '#ff6b35' }
  }
  if (link.expires_at && new Date(link.expires_at) < now) {
    return { label: 'Expired', color: '#ff5050' }
  }
  return null
}

function toDatetimeLocal(iso: string | null | undefined): string {
  if (!iso) return ''
  return iso.slice(0, 16) // "YYYY-MM-DDTHH:MM"
}
function fromDatetimeLocal(val: string): string | null {
  if (!val) return null
  return new Date(val).toISOString()
}

// ─── Card UI ─────────────────────────────────────
interface CardProps {
  link: LinkType
  onToggle: (id: string, val: boolean) => void
  onDelete: (id: string) => void
  onEdit:   (link: LinkType) => void
  dragHandleProps?: object
  isDragging?: boolean
}

function LinkCard({ link, onToggle, onDelete, onEdit, dragHandleProps, isDragging }: CardProps) {
  const status = scheduleStatus(link)
  const live   = isLiveNow(link)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      background: isDragging ? 'var(--surface2)' : 'var(--surface)',
      border: `1px solid ${isDragging ? '#555' : 'var(--border)'}`,
      borderRadius: 14, padding: '14px 18px',
      opacity: link.is_active && live ? 1 : 0.45,
      boxShadow: isDragging ? '0 16px 40px rgba(0,0,0,0.4)' : 'none',
      userSelect: 'none', transition: 'background 0.15s, border-color 0.15s',
    }}>
      <div {...dragHandleProps} style={{ cursor: isDragging ? 'grabbing' : 'grab', color: 'var(--muted)', flexShrink: 0, touchAction: 'none', display: 'flex', alignItems: 'center' }}>
        <GripVertical size={16} />
      </div>
      <span style={{ fontSize: 22, flexShrink: 0 }}>{link.icon || LINK_ICONS[link.type as LType] || '🔗'}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {link.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {link.url}
        </div>
        {status && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
            <Clock size={10} style={{ color: status.color }} />
            <span style={{ fontSize: 10, color: status.color }}>{status.label}</span>
          </div>
        )}
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0, textAlign: 'right', minWidth: 44 }}>
        <div style={{ fontWeight: 500 }}>{link.click_count}</div>
        <div style={{ opacity: 0.6 }}>clicks</div>
      </div>
      <button onClick={() => onEdit(link)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, display: 'flex' }}>
        <Pencil size={14} />
      </button>
      <button onClick={() => onToggle(link.id, link.is_active)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: link.is_active ? 'var(--accent)' : 'var(--muted)', display: 'flex' }}>
        {link.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
      </button>
      <button onClick={() => onDelete(link.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 4, display: 'flex' }}>
        <Trash2 size={15} />
      </button>
    </div>
  )
}

function SortableLinkCard(props: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.link.id })
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 }}>
      <LinkCard {...props} dragHandleProps={{ ...attributes, ...listeners }} isDragging={isDragging} />
    </div>
  )
}

// ─── Main Page ─────────────────────────────────
const LINK_TYPES = Object.entries(LINK_LABELS) as [LType, string][]

export default function LinksPage() {
  const [links, setLinks]         = useState<LinkType[]>([])
  const [showAddModal, setShowAdd] = useState(false)
  const [editingLink, setEditing]  = useState<LinkType | null>(null)
  const [activeId, setActiveId]    = useState<string | null>(null)
  const [saving, setSaving]        = useState(false)
  const [plan, setPlan]            = useState<'free' | 'pro'>('free')
  const [newLink, setNewLink]      = useState({
    type: 'website' as LType, title: '', url: '', subtitle: '',
    scheduled_at: '', expires_at: '',
  })
  const supabase = createClient()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => { loadLinks() }, [])

  async function loadLinks() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: p } = await supabase.from('profiles').select('id, plan').eq('user_id', user.id).single()
    if (p) setPlan(p.plan)
    const res = await fetch('/api/links')
    const data = await res.json()
    if (data.links) setLinks(data.links)
  }

  function handleDragStart(e: DragStartEvent) { setActiveId(e.active.id as string) }

  async function handleDragEnd(e: DragEndEvent) {
    setActiveId(null)
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIdx = links.findIndex(l => l.id === active.id)
    const newIdx = links.findIndex(l => l.id === over.id)
    const reordered = arrayMove(links, oldIdx, newIdx)
    setLinks(reordered)
    await Promise.all(reordered.map((l, i) =>
      fetch('/api/links', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: l.id, sort_order: i }) })
    ))
  }

  async function handleToggle(id: string, current: boolean) {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, is_active: !current } : l))
    const res = await fetch('/api/links', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_active: !current }) })
    const data = await res.json()
    if (data.error) { setLinks(prev => prev.map(l => l.id === id ? { ...l, is_active: current } : l)); toast.error(data.error) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this link?')) return
    setLinks(prev => prev.filter(l => l.id !== id))
    await fetch('/api/links', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    toast.success('Deleted')
  }

  async function handleAdd() {
    if (!newLink.title.trim()) return toast.error('Title is required')
    if (!newLink.url.trim())   return toast.error('URL is required')
    setSaving(true)
    const res = await fetch('/api/links', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: newLink.type, title: newLink.title, url: newLink.url,
        subtitle: newLink.subtitle || null, icon: LINK_ICONS[newLink.type],
        sort_order: links.length,
        scheduled_at: fromDatetimeLocal(newLink.scheduled_at),
        expires_at:   fromDatetimeLocal(newLink.expires_at),
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (data.error) return toast.error(data.error)
    setLinks(prev => [...prev, data.link])
    setShowAdd(false)
    setNewLink({ type: 'website', title: '', url: '', subtitle: '', scheduled_at: '', expires_at: '' })
    toast.success('Link added ✦')
  }

  async function handleSaveEdit() {
    if (!editingLink) return
    setSaving(true)
    const res = await fetch('/api/links', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingLink.id, title: editingLink.title, url: editingLink.url,
        subtitle: editingLink.subtitle, icon: editingLink.icon,
        scheduled_at: editingLink.scheduled_at || null,
        expires_at:   editingLink.expires_at   || null,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (data.error) return toast.error(data.error)
    setLinks(prev => prev.map(l => l.id === data.link.id ? data.link : l))
    setEditing(null)
    toast.success('Saved!')
  }

  const activeLink = links.find(l => l.id === activeId)
  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#0a0a0a', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 14px', color: 'var(--text)',
    fontSize: 14, outline: 'none', fontFamily: 'inherit',
  }
  const modalOverlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)',
    backdropFilter: 'blur(8px)', zIndex: 200,
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  }
  const modal: React.CSSProperties = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: '24px 24px 0 0', padding: '32px 28px',
    width: '100%', maxWidth: 520, maxHeight: '92vh', overflowY: 'auto',
  }
  const scheduleBox: React.CSSProperties = {
    background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 12, padding: '16px 18px', marginTop: 4,
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 720 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Links</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            {links.filter(l => l.is_active && isLiveNow(l)).length} live · {links.filter(l => !isLiveNow(l) || !l.is_active).length} hidden · drag to reorder
          </p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px',
          borderRadius: 100, background: 'var(--accent)', color: '#0a0a0a',
          fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>
          <Plus size={16} /> Add link
        </button>
      </div>

      {/* Free plan bar */}
      {plan === 'free' && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', borderRadius: 10, marginBottom: 20, marginTop: 12,
          background: links.length >= 5 ? 'rgba(255,107,53,0.08)' : 'rgba(200,240,77,0.05)',
          border: `1px solid ${links.length >= 5 ? 'rgba(255,107,53,0.25)' : 'rgba(200,240,77,0.15)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 120, height: 5, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 100, transition: 'width 0.4s',
                background: links.length >= 5 ? '#ff6b35' : 'var(--accent)',
                width: `${Math.min((links.length / 5) * 100, 100)}%`,
              }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{links.length}/5 links used</span>
          </div>
          {links.length >= 5 && (
            <Link href="/dashboard/settings" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>
              Upgrade for unlimited →
            </a>
          )}
        </div>
      )}

      {/* DnD List */}
      {links.length > 0 ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {links.map(link => (
                <SortableLinkCard key={link.id} link={link} onToggle={handleToggle} onDelete={handleDelete} onEdit={setEditing} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.35' } } }) }}>
            {activeLink && <LinkCard link={activeLink} onToggle={() => {}} onDelete={() => {}} onEdit={() => {}} isDragging />}
          </DragOverlay>
        </DndContext>
      ) : (
        <div style={{ textAlign: 'center', padding: '64px 20px', background: 'var(--surface)', border: '1.5px dashed var(--border)', borderRadius: 16 }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🔗</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No links yet</div>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24, lineHeight: 1.6 }}>
            Add your first link — socials, portfolio, shop, newsletter, anything.
          </p>
          <button onClick={() => setShowAdd(true)} style={{
            padding: '11px 28px', borderRadius: 100, background: 'var(--accent)',
            color: '#0a0a0a', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
          }}>Add your first link →</button>
        </div>
      )}

      {/* ── ADD MODAL ── */}
      {showAddModal && (
        <div style={modalOverlay} onClick={e => e.target === e.currentTarget && setShowAdd(false)}>
          <div style={modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Add a link</h2>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Choose a type and add your details</p>
              </div>
              <button onClick={() => setShowAdd(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
              {LINK_TYPES.map(([type, label]) => (
                <button key={type} onClick={() => setNewLink(p => ({ ...p, type, title: p.title || label }))}
                  style={{
                    background: newLink.type === type ? 'rgba(200,240,77,0.08)' : 'var(--bg)',
                    border: `1.5px solid ${newLink.type === type ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 10, padding: '10px 6px', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit',
                  }}>
                  <span style={{ fontSize: 20, display: 'block', marginBottom: 4 }}>{LINK_ICONS[type]}</span>
                  <span style={{ fontSize: 10, color: newLink.type === type ? 'var(--text)' : 'var(--muted)' }}>{label}</span>
                </button>
              ))}
            </div>

            {[
              { key: 'title', label: 'TITLE', ph: newLink.title || 'e.g. My Portfolio', type: 'text' },
              { key: 'url',   label: 'URL',   ph: 'https://...',                        type: 'url'  },
              { key: 'subtitle', label: 'SUBTITLE (optional)', ph: 'Short description', type: 'text' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} value={(newLink as Record<string, string>)[f.key]}
                  onChange={e => setNewLink(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.ph} style={inputStyle} />
              </div>
            ))}

            {/* Scheduling */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Calendar size={14} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', letterSpacing: '0.5px' }}>SCHEDULING (optional)</span>
              </div>
              <div style={scheduleBox}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 6 }}>GO LIVE AT</label>
                    <input type="datetime-local" value={newLink.scheduled_at}
                      onChange={e => setNewLink(p => ({ ...p, scheduled_at: e.target.value }))}
                      style={{ ...inputStyle, colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 6 }}>EXPIRE AT</label>
                    <input type="datetime-local" value={newLink.expires_at}
                      onChange={e => setNewLink(p => ({ ...p, expires_at: e.target.value }))}
                      style={{ ...inputStyle, colorScheme: 'dark' }} />
                  </div>
                </div>
                <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>
                  Leave blank to publish immediately with no expiry.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '12px', borderRadius: 100, background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving} style={{ flex: 2, padding: '12px', borderRadius: 100, background: 'var(--accent)', border: 'none', color: '#0a0a0a', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Adding...' : 'Add link ✦'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ── */}
      {editingLink && (
        <div style={modalOverlay} onClick={e => e.target === e.currentTarget && setEditing(null)}>
          <div style={modal}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700 }}>Edit link</h2>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Update your link details and schedule</p>
              </div>
              <button onClick={() => setEditing(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={20} /></button>
            </div>

            {/* Icon picker */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 8 }}>ICON</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.values(LINK_ICONS).filter((v, i, a) => a.indexOf(v) === i).map(icon => (
                  <button key={icon} onClick={() => setEditing(p => p ? { ...p, icon } : p)}
                    style={{
                      width: 40, height: 40, borderRadius: 10, fontSize: 20,
                      background: editingLink.icon === icon ? 'rgba(200,240,77,0.1)' : 'var(--bg)',
                      border: `1.5px solid ${editingLink.icon === icon ? 'var(--accent)' : 'var(--border)'}`,
                      cursor: 'pointer',
                    }}>{icon}</button>
                ))}
              </div>
            </div>

            {[
              { key: 'title',    label: 'TITLE',              type: 'text' },
              { key: 'url',      label: 'URL',                type: 'url'  },
              { key: 'subtitle', label: 'SUBTITLE (optional)', type: 'text' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type}
                  value={(editingLink as Record<string, string | null>)[f.key] ?? ''}
                  onChange={e => setEditing(p => p ? { ...p, [f.key]: e.target.value } : p)}
                  style={inputStyle} />
              </div>
            ))}

            {/* Scheduling */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <Calendar size={14} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}>SCHEDULING</span>
                {(editingLink.scheduled_at || editingLink.expires_at) && (
                  <button onClick={() => setEditing(p => p ? { ...p, scheduled_at: null, expires_at: null } : p)}
                    style={{ marginLeft: 'auto', fontSize: 11, color: '#ff5050', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Clear schedule
                  </button>
                )}
              </div>
              <div style={scheduleBox}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 6 }}>GO LIVE AT</label>
                    <input type="datetime-local"
                      value={toDatetimeLocal(editingLink.scheduled_at)}
                      onChange={e => setEditing(p => p ? { ...p, scheduled_at: fromDatetimeLocal(e.target.value) } : p)}
                      style={{ ...inputStyle, colorScheme: 'dark' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 10, color: 'var(--muted)', letterSpacing: '1px', marginBottom: 6 }}>EXPIRE AT</label>
                    <input type="datetime-local"
                      value={toDatetimeLocal(editingLink.expires_at)}
                      onChange={e => setEditing(p => p ? { ...p, expires_at: fromDatetimeLocal(e.target.value) } : p)}
                      style={{ ...inputStyle, colorScheme: 'dark' }} />
                  </div>
                </div>
                {(editingLink.scheduled_at || editingLink.expires_at) && (
                  <div style={{ marginTop: 10, fontSize: 11, color: scheduleStatus(editingLink)?.color || 'var(--accent)' }}>
                    {scheduleStatus(editingLink)?.label}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setEditing(null)} style={{ flex: 1, padding: '12px', borderRadius: 100, background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
              <button onClick={handleSaveEdit} disabled={saving} style={{ flex: 2, padding: '12px', borderRadius: 100, background: 'var(--accent)', border: 'none', color: '#0a0a0a', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving...' : 'Save changes ✦'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
