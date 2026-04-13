import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const allowed = ['title', 'url', 'icon', 'active', 'position', 'category', 'scheduled_at', 'expires_at']
  const update: Record<string, any> = {}
  for (const key of allowed) {
    if (key in body) update[key] = body[key] ?? null
  }

  const { data, error } = await supabase.from('links')
    .update(update).eq('id', params.id).eq('user_id', user.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await supabase.from('links').delete().eq('id', params.id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
