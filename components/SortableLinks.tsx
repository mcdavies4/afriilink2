'use client'
import { useState } from 'react'
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors, type DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy, arrayMove
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Pencil, Trash2, ExternalLink } from 'lucide-react'
import { LinkFormModal } from './LinkFormModal'

export type LinkItem = {
  id: string
  title: string
  url: string
  icon: string
  active: boolean
  position: number
  user_id: string
  category?: string
  scheduled_at?: string | null
  expires_at?: string | null
  link_clicks?: { count: number }[]
}

interface ItemProps {
  link: LinkItem
  onToggle: (id: string, active: boolean) => void
  onEdit: (l: LinkItem) => void
  onDelete: (id: string) => void
}

function SortableItem({ link, onToggle, onEdit, onDelete }: ItemProps) {
  const {
    attributes, listeners, setNodeRef,
    transform, transition, isDragging
  } = useSortable({ id: link.id })

  const clicks = link.link_clicks?.[0]?.count ?? 0

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        borderColor: link.active ? 'var(--border)' : 'var(--border-strong)',
        boxShadow: 'var(--shadow-sm)',
      }}
      className="flex items-center gap-3 bg-white rounded-2xl p-4 border transition-all"
      
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none p-1 -ml-1 cursor-grab active:cursor-grabbing"
        style={{ color: 'var(--text-muted)' }}
      >
        <GripVertical size={18} />
      </button>

      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ background: 'var(--bg-elevated)' }}
      >
        {link.icon ?? '🔗'}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold truncate">{link.title}</p>
        <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{link.url}</p>
      </div>

      <span
        className="hidden sm:flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg border"
        style={{ color: 'var(--brand)', background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
      >
        {clicks} clicks
      </span>
      {link.scheduled_at && new Date(link.scheduled_at) > new Date() && (
        <span className="hidden sm:flex items-center text-xs font-semibold px-2 py-1 rounded-lg"
          style={{ background: 'rgba(255,209,102,0.15)', color: '#b87d00' }}>
          ⏰ Scheduled
        </span>
      )}
      {link.expires_at && new Date(link.expires_at) < new Date() && (
        <span className="hidden sm:flex items-center text-xs font-semibold px-2 py-1 rounded-lg"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
          ⏱ Expired
        </span>
      )}

      <button
        onClick={() => onToggle(link.id, !link.active)}
        className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
        style={{ background: link.active ? 'var(--accent-green)' : '#e5e7eb' }}
      >
        <span
          className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all"
          style={{ left: link.active ? '20px' : '2px' }}
        />
      </button>

      <div className="flex items-center gap-1 flex-shrink-0">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ color: 'var(--text-muted)' }}
        >
          <ExternalLink size={14} />
        </a>
        <button
          onClick={() => onEdit(link)}
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ color: 'var(--text-muted)' }}
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(link.id)}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-red-500"
          style={{ color: 'var(--text-muted)' }}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export function SortableLinks({ initialLinks, userId, isPremium = false }: { initialLinks: LinkItem[]; userId: string; isPremium?: boolean }) {
  const [links, setLinks] = useState(initialLinks)
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null)
  const [addingNew, setAddingNew] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    const oldIdx = links.findIndex(l => l.id === active.id)
    const newIdx = links.findIndex(l => l.id === over.id)
    const reordered = arrayMove(links, oldIdx, newIdx)
    setLinks(reordered)
    await fetch('/api/links/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderedIds: reordered.map(l => l.id) }),
    })
  }

  const handleToggle = async (id: string, active: boolean) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, active } : l))
    await fetch(`/api/links/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active }),
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this link?')) return
    setLinks(prev => prev.filter(l => l.id !== id))
    await fetch(`/api/links/${id}`, { method: 'DELETE' })
  }

  const handleSave = async (data: { title: string; url: string; icon: string }) => {
    if (editingLink) {
      const res = await fetch(`/api/links/${editingLink.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const updated = await res.json()
      setLinks(prev => prev.map(l => l.id === editingLink.id ? { ...l, ...updated } : l))
      setEditingLink(null)
    } else {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const created = await res.json()
      setLinks(prev => [...prev, created])
      setAddingNew(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">Your links</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {links.length} link{links.length !== 1 ? 's' : ''} · drag to reorder
          </p>
        </div>
        <button
          onClick={() => setAddingNew(true)}
          className="flex items-center gap-2 text-white font-semibold px-5 py-2.5 rounded-xl text-sm active:scale-95 transition-all"
          style={{ background: 'var(--brand)' }}
        >
          + Add link
        </button>
      </div>

      {links.length === 0 ? (
        <div
          className="text-center py-20 bg-white rounded-2xl border-2 border-dashed"
          style={{ borderColor: 'var(--border-strong)' }}
        >
          <div className="text-4xl mb-3">🔗</div>
          <p className="font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>No links yet</p>
          <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Add your first link to get started</p>
          <button
            onClick={() => setAddingNew(true)}
            className="text-white font-semibold px-5 py-2 rounded-xl text-sm"
            style={{ background: 'var(--brand)' }}
          >
            Add your first link
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {links.map(link => (
                <SortableItem
                  key={link.id}
                  link={link}
                  onToggle={handleToggle}
                  onEdit={setEditingLink}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {(addingNew || editingLink) && (
        <LinkFormModal
          link={editingLink}
          onSave={handleSave}
          onClose={() => { setAddingNew(false); setEditingLink(null) }}
          isPremium={isPremium}
        />
      )}
    </div>
  )
}
