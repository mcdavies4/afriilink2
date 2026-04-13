import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile not found — Afriilink',
  robots: { index: false, follow: false },
}

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
      style={{ background: 'linear-gradient(180deg,#f0efff,#faf9ff)' }}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-12">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className="font-bold text-xl">Afriilink</span>
      </Link>

      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl mx-auto"
          style={{ background: 'white', boxShadow: '0 8px 40px rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.1)' }}>
          🔗
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{ background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          😢
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-3" style={{ color: '#0f0e1a' }}>
        This page doesn&apos;t exist
      </h1>
      <p className="text-base max-w-sm mb-2" style={{ color: '#4a4869' }}>
        The creator you&apos;re looking for may have changed their username, deleted their account, or never existed.
      </p>
      <p className="text-sm mb-10" style={{ color: '#9896b8' }}>
        Double-check the link and try again.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/"
          className="px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
          style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
          Go to Afriilink
        </Link>
        <Link href="/register"
          className="px-8 py-3 rounded-xl font-semibold text-sm border transition-all active:scale-95"
          style={{ borderColor: 'rgba(108,99,255,0.25)', color: '#6c63ff', background: 'white' }}>
          Claim your free link
        </Link>
      </div>

      <p className="text-xs mt-12" style={{ color: '#9896b8' }}>
        Want your own page?{' '}
        <Link href="/register" className="font-semibold" style={{ color: '#6c63ff' }}>
          It&apos;s free and takes 2 minutes.
        </Link>
      </p>
    </div>
  )
}
