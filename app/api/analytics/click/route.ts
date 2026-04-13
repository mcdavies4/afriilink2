import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

function getDeviceType(ua: string): string {
  if (!ua) return 'unknown'
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return 'mobile'
  if (/tablet/i.test(ua)) return 'tablet'
  return 'desktop'
}

function detectLinkType(url: string, title: string): string {
  const u = url.toLowerCase()
  const t = title.toLowerCase()
  if (u.includes('wa.me') || u.includes('whatsapp.com') || t.includes('whatsapp')) return 'whatsapp'
  if (u.includes('t.me') || u.includes('telegram.me') || t.includes('telegram')) return 'telegram'
  if (u.includes('instagram.com') && (u.includes('/direct') || t.includes('dm') || t.includes('message'))) return 'instagram_dm'
  if ((u.includes('twitter.com') || u.includes('x.com')) && (u.includes('/messages') || t.includes('dm'))) return 'twitter_dm'
  if (u.includes('mailto:') || t.includes('email') || t.includes('mail')) return 'email'
  if (u.includes('tel:') || t.includes('call') || t.includes('phone')) return 'phone'
  if (u.includes('tiktok.com')) return 'tiktok'
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube'
  if (u.includes('spotify.com')) return 'spotify'
  if (u.includes('linkedin.com')) return 'linkedin'
  return 'general'
}

export async function POST(req: Request) {
  try {
    const { linkId, url = '', title = '' } = await req.json()
    if (!linkId) return NextResponse.json({}, { status: 400 })

    const ua = req.headers.get('user-agent') ?? ''
    const referer = req.headers.get('referer') ?? ''
    const deviceType = getDeviceType(ua)
    const linkType = detectLinkType(url, title)

    await supabaseAdmin.from('link_clicks').insert({
      link_id: linkId,
      referer,
      device_type: deviceType,
      link_type: linkType,
    })

    // Also update the link's link_type if not set
    if (linkType !== 'general') {
      await supabaseAdmin.from('links')
        .update({ link_type: linkType })
        .eq('id', linkId)
        .eq('link_type', 'general')
    }

    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: true }) }
}
