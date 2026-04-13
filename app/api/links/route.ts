import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date().toISOString()
  const { data } = await supabase
    .from('links')
    .select('*, link_clicks(count)')
    .eq('user_id', user.id)
    .order('position')

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data: last } = await supabase
    .from('links').select('position').eq('user_id', user.id)
    .order('position', { ascending: false }).limit(1).single()

  const allowed = ['title', 'url', 'icon', 'category', 'scheduled_at', 'expires_at']
  const insertData: Record<string, any> = { user_id: user.id, position: (last?.position ?? -1) + 1 }
  for (const key of allowed) {
    if (key in body) insertData[key] = body[key] || null
  }

  const { data, error } = await supabase.from('links').insert(insertData).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
