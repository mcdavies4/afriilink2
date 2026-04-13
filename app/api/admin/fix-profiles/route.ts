import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminCheck } = await supabaseAdmin
    .from('profiles').select('is_admin').eq('id', user.id).single()
  if (!adminCheck?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Get all auth users
  const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })

  // Get existing profile IDs
  const { data: existingProfiles } = await supabaseAdmin
    .from('profiles').select('id')
  const existingIds = new Set((existingProfiles || []).map((p: any) => p.id as string))

  // Find users without profiles
  const missing = (authUsers?.users ?? []).filter(u => !existingIds.has(u.id))

  if (missing.length === 0) {
    return NextResponse.json({ message: 'All users already have profiles' })
  }

  // Create profiles for missing users
  const toInsert = missing.map(u => ({
    id: u.id,
    username: (u.user_metadata?.username as string) || (u.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') + '_' + u.id.slice(0, 4)) || u.id.slice(0, 8),
    name: u.user_metadata?.name ?? u.email?.split('@')[0] ?? 'User',
    plan: 'FREE',
  }))

  const { error } = await supabaseAdmin.from('profiles').insert(toInsert)

  if (error) {
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 400 })
  }

  return NextResponse.json({
    message: `✓ Created ${missing.length} missing profile${missing.length > 1 ? 's' : ''} successfully`
  })
}
