import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get all links with their position and click counts
  const { data: links } = await supabase
    .from('links')
    .select('id, title, icon, position, active, link_clicks(count)')
    .eq('user_id', user.id)
    .order('position')

  if (!links) return NextResponse.json([])

  const totalClicks = links.reduce((sum, l: any) =>
    sum + (l.link_clicks?.[0]?.count ?? 0), 0)

  const heatmap = links.map((link: any) => {
    const clicks = link.link_clicks?.[0]?.count ?? 0
    const pct = totalClicks > 0 ? (clicks / totalClicks) * 100 : 0
    // Heat score: higher position gets natural advantage, we show vs expected
    const expectedPct = links.length > 0 ? 100 / links.length : 0
    const performance = expectedPct > 0 ? ((pct - expectedPct) / expectedPct) * 100 : 0
    return {
      id: link.id,
      title: link.title,
      icon: link.icon,
      position: link.position + 1, // 1-indexed for display
      active: link.active,
      clicks,
      pct: Math.round(pct * 10) / 10,
      performance: Math.round(performance),
    }
  })

  return NextResponse.json(heatmap)
}
