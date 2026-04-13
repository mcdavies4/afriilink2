import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const getSupabaseId = async (customerId: string) => {
    const { data } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()
    return data?.id
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const supabaseId = session.metadata?.supabase_id
        ?? await getSupabaseId(session.customer as string)
      if (supabaseId) {
        await supabaseAdmin.from('profiles').update({
          plan: 'PREMIUM',
          stripe_subscription_id: session.subscription as string,
        }).eq('id', supabaseId)
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const supabaseId = sub.metadata?.supabase_id
        ?? await getSupabaseId(sub.customer as string)
      if (supabaseId) {
        const isActive = sub.status === 'active' || sub.status === 'trialing'
        await supabaseAdmin.from('profiles').update({
          plan: isActive ? 'PREMIUM' : 'FREE',
        }).eq('id', supabaseId)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const supabaseId = sub.metadata?.supabase_id
        ?? await getSupabaseId(sub.customer as string)
      if (supabaseId) {
        await supabaseAdmin.from('profiles').update({
          plan: 'FREE',
          stripe_subscription_id: null,
        }).eq('id', supabaseId)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const supabaseId = await getSupabaseId(invoice.customer as string)
      if (supabaseId) {
        await supabaseAdmin.from('profiles').update({ plan: 'FREE' }).eq('id', supabaseId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
