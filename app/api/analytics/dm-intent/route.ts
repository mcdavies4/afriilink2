import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

const DM_TYPES = ['whatsapp', 'telegram', 'instagram_dm', 'twitter_dm', 'email', 'phone']

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') ?? '30')
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  // Get all DM link clicks for this user's links
  const { data: dmClicks } = await supabase
    .from('link_clicks')
    .select(`
      id,
      created_at,
      link_type,
      device_type,
      referer,
      links!inner(id, title, url, user_id)
    `)
    .eq('links.user_id', user.id)
    .in('link_type', DM_TYPES)
    .gte('created_at', since)
    .order('created_at', { ascending: false })

  // Get totals per platform
  const byPlatform: Record<string, number> = {}
  const byDevice: Record<string, number> = {}
  const byDay: Record<string, number> = {}

  // Build 30-day skeleton
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    byDay[d.toISOString().split('T')[0]] = 0
  }

  ;(dmClicks ?? []).forEach((c: any) => {
    const type = c.link_type ?? 'general'
    byPlatform[type] = (byPlatform[type] ?? 0) + 1

    const device = c.device_type ?? 'unknown'
    byDevice[device] = (byDevice[device] ?? 0) + 1

    const day = c.created_at.split('T')[0]
    if (byDay[day] !== undefined) byDay[day]++
  })

  const platforms = Object.entries(byPlatform)
    .sort((a, b) => b[1] - a[1])
    .map(([platform, count]) => ({ platform, count }))

  const dailyData = Object.entries(byDay).map(([date, count]) => ({
    date,
    count,
    label: new Date(date + 'T12:00:00Z').toLocaleDateString('en', {
      month: 'short', day: 'numeric'
    }),
  }))

  return NextResponse.json({
    total: dmClicks?.length ?? 0,
    platforms,
    byDevice,
    dailyData,
    recentClicks: (dmClicks ?? []).slice(0, 20).map((c: any) => ({
      id: c.id,
      platform: c.link_type,
      device: c.device_type,
      linkTitle: c.links?.title,
      time: c.created_at,
    })),
  })
}
