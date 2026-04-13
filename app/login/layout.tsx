import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign in to Afriilink',
  description: 'Sign in to your Afriilink account and manage your link page.',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
