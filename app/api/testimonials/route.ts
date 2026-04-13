import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')
  if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  const { data } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .eq('user_id', userId)
    .eq('approved', true)
    .order('position')
    .limit(12)

  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { author_name, author_handle, author_avatar, content, rating } = body

  if (!author_name || !content) {
    return NextResponse.json({ error: 'Name and content are required' }, { status: 400 })
  }

  const { data: last } = await supabase.from('testimonials')
    .select('position').eq('user_id', user.id)
    .order('position', { ascending: false }).limit(1).single()

  const { data, error } = await supabase.from('testimonials').insert({
    user_id: user.id,
    author_name,
    author_handle: author_handle || null,
    author_avatar: author_avatar || null,
    content,
    rating: rating ?? 5,
    position: (last?.position ?? -1) + 1,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  await supabase.from('testimonials').delete().eq('id', id).eq('user_id', user.id)
  return NextResponse.json({ ok: true })
}
