import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username')?.toLowerCase().trim()

  if (!username) return NextResponse.json({ available: false, error: 'Username required' })
  if (username.length < 3) return NextResponse.json({ available: false, error: 'Too short' })
  if (username.length > 30) return NextResponse.json({ available: false, error: 'Too long' })
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return NextResponse.json({ available: false, error: 'Letters, numbers, underscores only' })
  }

  // Reserved usernames
  const reserved = ['admin', 'api', 'dashboard', 'settings', 'analytics', 'upgrade',
    'login', 'register', 'demo', 'u', 'privacy', 'terms', 'referral', 'waitlist', 'onboarding']
  if (reserved.includes(username)) {
    return NextResponse.json({ available: false, error: 'This username is reserved' })
  }

  const { data } = await supabaseAdmin
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  return NextResponse.json({ available: !data })
}
