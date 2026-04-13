import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'
import { UpgradeButton } from '@/components/UpgradeButton'
import { CheckCircle2, Zap } from 'lucide-react'

const FREE_FEATURES = [
  'Unlimited links',
  'Aurora & Clean themes',
  'Profile picture & header image',
  'Basic link management',
  'Mobile-optimised page',
  'Link click tracking',
  'Afriilink branding on profile',
]

const PREMIUM_FEATURES = [
  'Everything in Free',
  'All 6 premium themes',
  'Custom accent colour',
  'Full analytics — 7d, 30d, 90d + all-time',
  'Traffic source tracking (Instagram, WhatsApp etc)',
  'Link click heatmap',
  'YouTube video embed on profile',
  'Spotify & Apple Music player embed',
  'Dark mode toggle for visitors',
  'Link click sounds & haptics',
  'Scheduled links (go live at a date)',
  'Expiring links (auto-hide after date)',
  'WhatsApp floating chat button',
  'Google Analytics integration',
  'QR code download',
  'Remove Afriilink branding',
  'Priority support',
]

export default async function UpgradePage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const isPremium = profile?.plan === 'PREMIUM'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <DashboardNav profile={profile} />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-6"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', color: 'var(--brand)' }}>
            <Zap size={14} /> Upgrade to Premium
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Unlock your full <span className="gradient-text">creator potential</span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Everything you need to grow your audience and monetise your page
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {/* Free */}
          <div className="bg-white rounded-2xl p-8 border" style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>FREE PLAN</p>
            <div className="text-3xl font-bold mb-1">$0</div>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Forever free, no card needed</p>
            <div className="space-y-2.5">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <div className="rounded-2xl p-8 text-white relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#6c63ff 0%,#a855f7 60%,#ff3cac 100%)', boxShadow: '0 8px 40px rgba(108,99,255,0.4)' }}>
            <div className="absolute top-0 right-0 w-40 h-40 opacity-10 rounded-full"
              style={{ background: 'white', transform: 'translate(30%,-30%)' }} />
            <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: 'var(--accent-yellow)', color: '#0f0e1a' }}>PREMIUM</div>

            <p className="text-xs font-semibold opacity-70 mb-2">PREMIUM PLAN</p>
            <div className="text-3xl font-bold mb-1">$10<span className="text-lg font-normal opacity-70"> / month</span></div>
            <p className="text-sm mb-6 opacity-70">Cancel anytime — no lock-in</p>

            <div className="space-y-2.5 mb-8">
              {PREMIUM_FEATURES.map(f => (
                <div key={f} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-yellow)' }} />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {isPremium ? (
              <div className="w-full text-center py-3 rounded-xl font-semibold bg-white/20 border border-white/30">
                ✓ You are on Premium
              </div>
            ) : (
              <UpgradeButton />
            )}
          </div>
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🔒', title: 'Secure payments', desc: 'Powered by Stripe' },
            { icon: '↩️', title: 'Cancel anytime', desc: 'No questions asked' },
            { icon: '⚡', title: 'Instant access', desc: 'Unlocked immediately' },
          ].map(t => (
            <div key={t.title} className="bg-white rounded-2xl p-4 border" style={{ borderColor: 'var(--border)' }}>
              <div className="text-2xl mb-2">{t.icon}</div>
              <p className="text-sm font-semibold">{t.title}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
