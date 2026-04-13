'use client'
import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface Testimonial {
  id: string
  author_name: string
  author_handle?: string
  author_avatar?: string
  content: string
  rating: number
}

interface Props {
  userId: string
  theme: any
  accent: string
}

export function Testimonials({ userId, theme, accent }: Props) {
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    if (userId === 'demo') {
      setItems([
        { id: '1', author_name: 'Chioma A.', author_handle: '@chioma_styles', content: 'Found all your links in one place! So easy to navigate 🔥', rating: 5 },
        { id: '2', author_name: 'Emeka T.', author_handle: '@emeka_tech', content: 'Ordered from the boutique — amazing quality, great experience!', rating: 5 },
        { id: '3', author_name: 'Blessing O.', content: 'Love your content. This page makes it so easy to follow everything you do!', rating: 5 },
      ])
      return
    }
    fetch(`/api/testimonials?userId=${userId}`)
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setItems(data) })
      .catch(() => {})
  }, [userId])

  if (items.length === 0) return null

  return (
    <div className="mt-4">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="flex">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={13} fill={accent} style={{ color: accent }} />
          ))}
        </div>
        <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>
          What people say
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {items.map((t, i) => (
          <div key={t.id}
            className="px-4 py-3.5 rounded-2xl border text-sm"
            style={{
              background: theme.linkBg,
              borderColor: theme.linkBorder,
              opacity: 0,
              transform: 'translateY(8px)',
              animation: `fadeUp 0.4s ease ${i * 80 + 200}ms forwards`,
            }}>
            {/* Stars */}
            <div className="flex gap-0.5 mb-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={11}
                  fill={s <= t.rating ? accent : 'transparent'}
                  style={{ color: s <= t.rating ? accent : theme.textMuted }} />
              ))}
            </div>

            {/* Content */}
            <p className="text-sm leading-relaxed mb-2.5 italic"
              style={{ color: theme.textSecondary }}>
              &ldquo;{t.content}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-2">
              {t.author_avatar ? (
                <img src={t.author_avatar} alt={t.author_name}
                  className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${accent},#ff3cac)` }}>
                  {t.author_name[0].toUpperCase()}
                </div>
              )}
              <div>
                <span className="text-xs font-semibold" style={{ color: theme.textPrimary }}>
                  {t.author_name}
                </span>
                {t.author_handle && (
                  <span className="text-xs ml-1" style={{ color: theme.textMuted }}>
                    {t.author_handle}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
