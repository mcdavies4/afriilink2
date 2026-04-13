import { createSupabaseServerClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code, referral_earnings')
    .eq('id', user.id)
    .single()

  const { data: referrals } = await supabase
    .from('referrals')
    .select('*, referred:referred_id(name, username, created_at)')
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })

  const stats = {
    total: referrals?.length ?? 0,
    converted: referrals?.filter(r => r.status === 'converted' || r.status === 'paid').length ?? 0,
    earnings: (profile?.referral_earnings ?? 0) / 100,
    referralCode: profile?.referral_code,
    referralUrl: `${process.env.NEXT_PUBLIC_APP_URL}/register?ref=${profile?.referral_code}`,
  }

  return NextResponse.json({ stats, referrals: referrals ?? [] })
}
