import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const revalidate = 300 // cache for 5 minutes

export async function GET() {
  try {
    const [{ count: users }, { count: links }, { count: clicks }] = await Promise.all([
      supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('links').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('link_clicks').select('*', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      users: users ?? 0,
      links: links ?? 0,
      clicks: clicks ?? 0,
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=300' }
    })
  } catch {
    return NextResponse.json({ users: 0, links: 0, clicks: 0 })
  }
}
