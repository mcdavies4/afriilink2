import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({}, { status: 400 })
    await supabaseAdmin.from('page_views').insert({ user_id: userId, referer: req.headers.get('referer') })
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: true }) }
}
