'use client'
import { Music } from 'lucide-react'

interface Props {
  url: string
  type: string
  accent: string
  theme: any
}

function getSpotifyEmbedUrl(url: string): string | null {
  // Handle various Spotify URL formats
  const match = url.match(/spotify\.com\/(track|album|playlist|artist|episode)\/([a-zA-Z0-9]+)/)
  if (!match) return null
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0`
}

function getAppleMusicEmbedUrl(url: string): string | null {
  // Apple Music embed - convert share URL to embed
  if (!url.includes('music.apple.com')) return null
  return url.replace('music.apple.com', 'embed.music.apple.com')
}

export function MusicEmbed({ url, type, accent, theme }: Props) {
  const embedUrl = type === 'spotify'
    ? getSpotifyEmbedUrl(url)
    : getAppleMusicEmbedUrl(url)

  if (!embedUrl) return null

  const isSpotify = type === 'spotify'
  const height = url.includes('/track/') ? 152 : 352

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: theme.linkBorder }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: theme.linkBg, borderColor: theme.linkBorder }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: isSpotify ? '#1db954' : '#fc3c44' }}>
          <Music size={13} className="text-white" />
        </div>
        <span className="text-sm font-semibold" style={{ color: theme.textPrimary }}>
          {isSpotify ? 'Listen on Spotify' : 'Listen on Apple Music'}
        </span>
      </div>

      {/* Embed */}
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ display: 'block' }}
      />
    </div>
  )
}
