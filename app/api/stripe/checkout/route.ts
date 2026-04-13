import { createSupabaseServerClient } from '@/lib/supabase-server'
import { stripe, PREMIUM_PRICE_ID } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, name, stripe_customer_id')
    .eq('id', user.id)
    .single()

  // Create or reuse Stripe customer
  let customerId = profile?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: profile?.name ?? undefined,
      metadata: { supabase_id: user.id, username: profile?.username ?? '' },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PREMIUM_PRICE_ID, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=true`,
    cancel_url: `${appUrl}/settings?cancelled=true`,
    subscription_data: {
      metadata: { supabase_id: user.id },
    },
    allow_promotion_codes: true,
  })

  return NextResponse.json({ url: session.url })
}
