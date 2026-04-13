import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()

  const allowed = [
    'name', 'bio', 'username', 'theme', 'accent_color',
    'avatar_url', 'header_url',
    'youtube_url', 'youtube_title',
    'music_url', 'music_type',
    'dark_mode_toggle', 'ga_measurement_id', 'link_sound',
  ]
  const update: Record<string, any> = {}
  for (const key of allowed) {
    if (key in body) update[key] = body[key] ?? null
  }

  if (update.username) {
    const { data: existing } = await supabase
      .from('profiles').select('id')
      .eq('username', update.username)
      .neq('id', user.id).single()
    if (existing) return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    update.username = update.username.toLowerCase()
  }

  const { data, error } = await supabase.from('profiles')
    .update(update).eq('id', user.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
