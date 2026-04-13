'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BarChart3, Settings, ExternalLink, LogOut, Gift, Crown } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { NotificationBell } from './NotificationBell'

export function DashboardNav({ profile }: { profile: any }) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { href: '/dashboard', label: 'Links', icon: LayoutDashboard },
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 border-b"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)', borderColor: 'var(--border)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <span className="font-bold text-base hidden sm:block">Afriilink</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: active ? 'var(--bg-elevated)' : 'transparent',
                  color: active ? 'var(--brand)' : 'var(--text-secondary)',
                }}>
                <Icon size={15} />
                <span className="hidden sm:block">{label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link href={`/u/${profile?.username}`} target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all border"
            style={{ color: 'var(--brand)', background: 'var(--bg-elevated)', borderColor: 'var(--border-strong)' }}>
            <ExternalLink size={13} /> View page
          </Link>

          <NotificationBell />

          {/* Avatar menu */}
          <div className="relative">
            <button onClick={() => setMenuOpen(v => !v)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
              {profile?.name?.[0]?.toUpperCase() ?? 'U'}
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl py-1 z-20 border"
                  style={{ boxShadow: 'var(--shadow-lg)', borderColor: 'var(--border)' }}>

                  {/* User info */}
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                    <p className="text-sm font-bold truncate">{profile?.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>@{profile?.username}</p>
                    <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: profile?.plan === 'PREMIUM' ? 'rgba(108,99,255,0.1)' : 'var(--bg-elevated)',
                        color: profile?.plan === 'PREMIUM' ? 'var(--brand)' : 'var(--text-muted)',
                      }}>
                      {profile?.plan === 'PREMIUM' ? '⚡ Premium' : 'Free plan'}
                    </span>
                  </div>

                  {profile?.plan !== 'PREMIUM' && (
                    <Link href="/upgrade"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[var(--bg-elevated)]"
                      style={{ color: 'var(--brand)' }}
                      onClick={() => setMenuOpen(false)}>
                      <Crown size={14} /> Upgrade to Premium
                    </Link>
                  )}

                  <Link href="/referral"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-elevated)]"
                    style={{ color: 'var(--accent-green)' }}
                    onClick={() => setMenuOpen(false)}>
                    <Gift size={14} /> Refer & Earn
                  </Link>

                  {profile?.is_admin && (
                    <Link href="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-elevated)]"
                      style={{ color: 'var(--accent-orange)' }}
                      onClick={() => setMenuOpen(false)}>
                      <Crown size={14} /> Admin panel
                    </Link>
                  )}

                  <div className="border-t my-1" style={{ borderColor: 'var(--border)' }} />

                  <button onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
