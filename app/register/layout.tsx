import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create your free Afriilink page',
  description: 'Join Afriilink for free. Create your link-in-bio page in 2 minutes. No credit card needed.',
  openGraph: {
    title: 'Create your free Afriilink page',
    description: 'Join thousands of African creators sharing everything with one link.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create your free Afriilink page',
    description: 'Join thousands of African creators sharing everything with one link.',
  },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
