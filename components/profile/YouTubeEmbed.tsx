'use client'
import { useState } from 'react'
import { Play, X, ExternalLink } from 'lucide-react'

interface Props {
  url: string
  title?: string
  accent: string
  theme: any
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function YouTubeEmbed({ url, title, accent, theme }: Props) {
  const [playing, setPlaying] = useState(false)
  const videoId = extractYouTubeId(url)
  if (!videoId) return null

  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: theme.linkBorder }}>
      {!playing ? (
        <div className="relative cursor-pointer group" onClick={() => setPlaying(true)}>
          <div className="relative w-full aspect-video overflow-hidden" style={{ background: '#000' }}>
            <img
              src={thumbnail}
              alt={title ?? 'YouTube video'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={e => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              }}
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-transform group-hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.95)' }}>
                <Play size={24} style={{ color: accent }} className="ml-1" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-3" style={{ background: theme.linkBg }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#ff0000' }}>
              <Play size={12} className="text-white ml-0.5" />
            </div>
            <span className="text-sm font-semibold flex-1 truncate" style={{ color: theme.textPrimary }}>
              {title ?? 'Watch my latest video'}
            </span>
            <ExternalLink size={13} style={{ color: theme.textMuted }} />
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="aspect-video">
            <iframe src={embedUrl} className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen />
          </div>
          <button onClick={() => setPlaying(false)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 text-white hover:bg-black/80 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
