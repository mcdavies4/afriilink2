import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminCheck } = await supabaseAdmin
    .from('profiles').select('is_admin').eq('id', user.id).single()

  if (!adminCheck?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Get real user count from auth.users (captures ALL signups even without profiles)
  const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
  const totalAuthUsers = authUsers?.users?.length ?? 0

  const [
    { count: totalProfiles },
    { count: premiumUsers },
    { count: totalLinks },
    { count: totalClicks },
    { count: totalViews },
    { data: profiles },
  ] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'PREMIUM'),
    supabaseAdmin.from('links').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('link_clicks').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('page_views').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles')
      .select('id, name, username, plan, created_at, is_admin')
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  // Merge auth.users emails into profiles
  const emailMap: Record<string, string> = {}
  authUsers?.users?.forEach(u => { emailMap[u.id] = u.email ?? '' })

  const recentUsers = (profiles ?? []).map((p: any) => ({
    ...p,
    email: emailMap[p.id] ?? '',
  }))

  // Also find auth users with NO profile (signed up but profile creation failed)
  const profileIds = new Set((profiles ?? []).map((p: any) => p.id))
  const usersWithoutProfiles = (authUsers?.users ?? [])
    .filter(u => !profileIds.has(u.id))
    .map(u => ({
      id: u.id,
      name: u.user_metadata?.name ?? null,
      username: null,
      email: u.email ?? '',
      plan: 'FREE',
      created_at: u.created_at,
      is_admin: false,
      noProfile: true,
    }))

  // Daily signups from auth.users (real count)
  const dailySignups: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    dailySignups[d.toISOString().split('T')[0]] = 0
  }

  ;(authUsers?.users ?? []).forEach(u => {
    const key = u.created_at?.split('T')[0]
    if (key && dailySignups[key] !== undefined) dailySignups[key]++
  })

  return NextResponse.json({
    stats: {
      totalUsers:    totalAuthUsers,
      profilesCreated: totalProfiles ?? 0,
      missingProfiles: usersWithoutProfiles.length,
      premiumUsers:  premiumUsers ?? 0,
      freeUsers:     totalAuthUsers - (premiumUsers ?? 0),
      totalLinks:    totalLinks ?? 0,
      totalClicks:   totalClicks ?? 0,
      totalViews:    totalViews ?? 0,
      mrr:           (premiumUsers ?? 0) * 10,
    },
    recentUsers,
    usersWithoutProfiles,
    dailySignups: Object.entries(dailySignups).map(([date, count]) => ({
      date, count,
      label: new Date(date + 'T12:00:00Z').toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    })),
  })
}
