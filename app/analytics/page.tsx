import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { DMIntentDashboard } from '@/components/DMIntentDashboard'
import Link from 'next/link'
import { Lock, BarChart3 } from 'lucide-react'

export default async function AnalyticsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const isPremium = profile?.plan === 'PREMIUM'

  if (!isPremium) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
        <DashboardNav profile={profile} />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Analytics</h1>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Track your page performance</p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden">
            <div className="filter blur-sm pointer-events-none select-none opacity-60">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {['2,481','847','34.1%','6'].map((v, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 border" style={{ borderColor: 'var(--border)' }}>
                    <div className="w-9 h-9 rounded-xl mb-3" style={{ background: 'var(--bg-elevated)' }} />
                    <p className="text-2xl font-bold mb-0.5" style={{ color: 'var(--brand)' }}>{v}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Metric</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl h-48 border" style={{ borderColor: 'var(--border)' }} />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
              style={{ background: 'rgba(250,250,250,0.85)', backdropFilter: 'blur(2px)' }}>
              <div className="text-center px-6 py-10 max-w-sm">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'var(--bg-elevated)' }}>
                  <BarChart3 size={32} style={{ color: 'var(--brand)' }} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Unlock Analytics</h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  See who is clicking your links, where your traffic comes from, and how your profile grows — day by day.
                </p>
                <Link href="/upgrade"
                  className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-xl"
                  style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
                  <Lock size={15} /> Upgrade to Premium — $10/mo
                </Link>
                <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>Cancel anytime</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <DashboardNav profile={profile} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <AnalyticsDashboard userId={user.id} />
        <div className="mt-8 pt-8 border-t" style={{ borderColor: 'var(--border)' }}>
          <DMIntentDashboard />
        </div>
      </main>
    </div>
  )
}
