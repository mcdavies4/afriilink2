import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient()
  const body = await req.json()
  const { profile_id, email, name } = body

  if (!profile_id || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // Check email capture is enabled for this profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('email_capture_enabled')
    .eq('id', profile_id)
    .single()

  if (!profile?.email_capture_enabled) {
    return NextResponse.json({ error: 'Email capture not enabled' }, { status: 403 })
  }

  const { error } = await supabase
    .from('email_captures')
    .insert({ profile_id, email: email.toLowerCase().trim(), name: name || null })

  if (error) {
    // Unique constraint = already subscribed
    if (error.code === '23505') {
      return NextResponse.json({ already: true })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// GET - fetch captures for dashboard (authenticated)
export async function GET() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('id').eq('user_id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: captures, error } = await supabase
    .from('email_captures')
    .select('*')
    .eq('profile_id', profile.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ captures })
}
