'use client'
import Link from 'next/link'
import { Lock, Zap } from 'lucide-react'

interface Props {
  children: React.ReactNode
  isPremium: boolean
  feature: string
  mode?: 'blur' | 'lock' | 'inline'  // blur=overlay, lock=replace with locked UI, inline=small badge
}

export function PremiumGate({ children, isPremium, feature, mode = 'blur' }: Props) {
  if (isPremium) return <>{children}</>

  if (mode === 'inline') {
    return (
      <div className="relative">
        <div className="opacity-40 pointer-events-none select-none">{children}</div>
        <div className="absolute inset-0 flex items-center justify-end pr-3">
          <Link href="/upgrade"
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)', color: 'white' }}>
            <Lock size={10} /> Premium
          </Link>
        </div>
      </div>
    )
  }

  if (mode === 'lock') {
    return (
      <div className="relative rounded-2xl border-2 border-dashed overflow-hidden"
        style={{ borderColor: 'var(--border-strong)' }}>
        <div className="opacity-30 pointer-events-none select-none">{children}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
          style={{ background: 'rgba(250,249,255,0.92)', backdropFilter: 'blur(4px)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
            <Lock size={18} className="text-white" />
          </div>
          <p className="text-sm font-bold mb-1">{feature}</p>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            Available on Premium plan
          </p>
          <Link href="/upgrade"
            className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all active:scale-95"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
            <Zap size={12} /> Upgrade — $10/mo
          </Link>
        </div>
      </div>
    )
  }

  // blur mode — show blurred content with overlay
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="filter blur-sm opacity-50 pointer-events-none select-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
        style={{ background: 'rgba(250,249,255,0.88)', backdropFilter: 'blur(2px)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
          style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
          <Lock size={18} className="text-white" />
        </div>
        <p className="text-sm font-bold mb-1">{feature}</p>
        <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
          Upgrade to Premium to unlock
        </p>
        <Link href="/upgrade"
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl text-white transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
          <Zap size={12} /> Upgrade — $10/mo
        </Link>
      </div>
    </div>
  )
}

// Smaller inline lock badge for form fields
export function PremiumBadge() {
  return (
    <Link href="/upgrade"
      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ml-2"
      style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)', color: 'white' }}>
      <Lock size={8} /> PREMIUM
    </Link>
  )
}
