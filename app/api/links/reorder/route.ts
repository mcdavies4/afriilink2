import { createSupabaseServerClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { orderedIds } = await req.json()
  await Promise.all(orderedIds.map((id: string, position: number) =>
    supabase.from('links').update({ position }).eq('id', id).eq('user_id', user.id)
  ))
  return NextResponse.json({ ok: true })
}
