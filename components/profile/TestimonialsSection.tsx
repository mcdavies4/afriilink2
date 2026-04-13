'use client'
import { Star } from 'lucide-react'

interface Testimonial {
  id: string
  author_name: string
  author_title?: string
  author_avatar?: string
  content: string
  rating: number
}

interface Props {
  testimonials: Testimonial[]
  accent: string
  theme: any
}

function StarRating({ rating, accent }: { rating: number; accent: string }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={12} fill={i <= rating ? accent : 'transparent'}
          style={{ color: i <= rating ? accent : 'var(--text-muted)' }} />
      ))}
    </div>
  )
}

export function TestimonialsSection({ testimonials, accent, theme }: Props) {
  if (!testimonials.length) return null

  return (
    <div className="mt-2">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="h-px flex-1" style={{ background: theme.linkBorder }} />
        <span className="text-xs font-semibold" style={{ color: theme.textMuted }}>What people say</span>
        <div className="h-px flex-1" style={{ background: theme.linkBorder }} />
      </div>

      <div className="flex flex-col gap-3">
        {testimonials.map((t, i) => (
          <div key={t.id}
            className="px-4 py-4 rounded-2xl border animate-fade-up"
            style={{
              background: theme.linkBg,
              borderColor: theme.linkBorder,
              animationDelay: `${i * 80}ms`,
            }}>

            {/* Rating */}
            <StarRating rating={t.rating} accent={accent} />

            {/* Quote */}
            <p className="text-sm leading-relaxed mt-2 mb-3" style={{ color: theme.textSecondary }}>
              &ldquo;{t.content}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-2.5">
              {t.author_avatar ? (
                <img src={t.author_avatar} alt={t.author_name}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg,${accent},#ff3cac)` }}>
                  {t.author_name[0].toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-xs font-bold" style={{ color: theme.textPrimary }}>{t.author_name}</p>
                {t.author_title && (
                  <p className="text-xs" style={{ color: theme.textMuted }}>{t.author_title}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
