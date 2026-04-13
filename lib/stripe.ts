import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const PREMIUM_PRICE_ID = process.env.STRIPE_PREMIUM_PRICE_ID!

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      'Unlimited links',
      'Mobile-optimised page',
      'Basic themes',
      'Afriilink branding',
    ],
    limits: {
      themes: ['aurora', 'clean'],
      analytics: false,
      customColors: false,
      removeBranding: false,
    },
  },
  PREMIUM: {
    name: 'Premium',
    price: 10,
    features: [
      'Everything in Free',
      'All 6 themes',
      'Full analytics dashboard',
      'Custom accent colours',
      'Remove Afriilink branding',
      'Priority support',
    ],
    limits: {
      themes: ['aurora', 'sunset', 'forest', 'midnight', 'clean', 'peach'],
      analytics: true,
      customColors: true,
      removeBranding: true,
    },
  },
}
