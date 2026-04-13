import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upgrade to Premium',
  description: 'Unlock analytics, all themes, custom colours and more. $10/month. Cancel anytime.',
  robots: { index: false, follow: false },
}

export default function UpgradeLayout({ children }: { children: React.ReactNode }) {
  return children
}
