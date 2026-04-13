import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') ?? '7'
  const days = parseInt(period)

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const prevSince = new Date(Date.now() - days * 2 * 24 * 60 * 60 * 1000).toISOString()

  const [
    { count: totalViews },
    { count: prevViews },
    { data: topLinks },
    { data: recentClicks },
    { data: recentViews },
    { count: allTimeViews },
    { count: allTimeClicks },
  ] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true })
      .eq('user_id', user.id).gte('created_at', since),
    supabase.from('page_views').select('*', { count: 'exact', head: true })
      .eq('user_id', user.id).gte('created_at', prevSince).lt('created_at', since),
    supabase.from('links').select('id, title, icon, category, link_clicks(count)')
      .eq('user_id', user.id),
    supabase.from('link_clicks').select('created_at, link_id, links!inner(user_id)')
      .eq('links.user_id', user.id).gte('created_at', since),
    supabase.from('page_views').select('referer, created_at')
      .eq('user_id', user.id).gte('created_at', since),
    supabase.from('page_views').select('*', { count: 'exact', head: true })
      .eq('user_id', user.id),
    supabase.from('link_clicks').select('*, links!inner(user_id)', { count: 'exact', head: true })
      .eq('links.user_id', user.id),
  ])

  const totalClicks = topLinks?.reduce((sum: number, l: any) => sum + (l.link_clicks?.[0]?.count ?? 0), 0) ?? 0
  const sortedLinks = [...(topLinks ?? [])].sort((a: any, b: any) =>
    (b.link_clicks?.[0]?.count ?? 0) - (a.link_clicks?.[0]?.count ?? 0)).slice(0, 8)

  // Daily data
  const days_arr: Record<string, number> = {}
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    days_arr[d.toISOString().split('T')[0]] = 0
  }
  recentClicks?.forEach((c: any) => {
    const key = c.created_at.split('T')[0]
    if (days_arr[key] !== undefined) days_arr[key]++
  })
  const dailyData = Object.entries(days_arr).map(([date, clicks]) => ({
    date, clicks,
    label: days <= 7
      ? new Date(date + 'T12:00:00Z').toLocaleDateString('en', { weekday: 'short' })
      : new Date(date + 'T12:00:00Z').toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  }))

  // Referrer analysis
  const refererCounts: Record<string, number> = {}
  recentViews?.forEach((v: any) => {
    let source = 'Direct'
    if (v.referer) {
      try {
        const url = new URL(v.referer)
        const host = url.hostname.replace('www.', '')
        if (host.includes('instagram')) source = 'Instagram'
        else if (host.includes('twitter') || host.includes('x.com')) source = 'Twitter / X'
        else if (host.includes('facebook')) source = 'Facebook'
        else if (host.includes('whatsapp')) source = 'WhatsApp'
        else if (host.includes('tiktok')) source = 'TikTok'
        else if (host.includes('youtube')) source = 'YouTube'
        else if (host.includes('google')) source = 'Google'
        else if (host.includes('t.co')) source = 'Twitter / X'
        else if (host.includes('l.instagram')) source = 'Instagram'
        else source = host
      } catch { source = 'Direct' }
    }
    refererCounts[source] = (refererCounts[source] ?? 0) + 1
  })

  const referrers = Object.entries(refererCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([source, count]) => ({ source, count }))

  return NextResponse.json({
    totalViews: totalViews ?? 0,
    prevViews: prevViews ?? 0,
    totalClicks,
    topLinks: sortedLinks,
    dailyData,
    referrers,
    allTimeViews: allTimeViews ?? 0,
    allTimeClicks: allTimeClicks ?? 0,
  })
}
