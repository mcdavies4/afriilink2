import { OnboardingWrapper } from '@/components/OnboardingWrapper'
import { QuickShare } from '@/components/QuickShare'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { SortableLinks } from '@/components/SortableLinks'
import { ProfilePreviewPanel } from '@/components/ProfilePreviewPanel'
import { Eye, MousePointerClick, TrendingUp, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: profile }, { data: links }, { count: weeklyViews }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('links').select('*, link_clicks(count)').eq('user_id', user.id).order('position'),
    supabase.from('page_views').select('*', { count: 'exact', head: true })
      .eq('user_id', user.id).gte('created_at', sevenDaysAgo),
  ])

  const totalClicks = links?.reduce((sum: number, l: any) => sum + (l.link_clicks?.[0]?.count ?? 0), 0) ?? 0
  const ctr = (weeklyViews ?? 0) > 0 ? (((totalClicks / (weeklyViews ?? 1)) * 100)).toFixed(1) : '0'

  return (
    <div>
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          Hey, {profile?.name?.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Your page is live at{' '}
          <Link href={`/u/${profile?.username}`} target="_blank"
            className="font-semibold hover:underline inline-flex items-center gap-1"
            style={{ color: 'var(--brand)' }}>
            afriilink.com/u/{profile?.username}
            <ExternalLink size={12} />
          </Link>
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Eye, label: 'Views (7d)', value: (weeklyViews ?? 0).toLocaleString(), color: 'var(--brand)', bg: 'var(--bg-elevated)' },
          { icon: MousePointerClick, label: 'Total clicks', value: totalClicks.toLocaleString(), color: 'var(--accent-orange)', bg: '#fff7f4' },
          { icon: TrendingUp, label: 'Click rate', value: `${ctr}%`, color: 'var(--accent-green)', bg: '#f0fdf8' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-4 border"
            style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="text-xl sm:text-2xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      <OnboardingWrapper profile={profile} />

      {/* Main grid — links + preview */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div>
          <SortableLinks initialLinks={links ?? []} userId={user.id} isPremium={profile?.plan === 'PREMIUM'} />
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-xs font-semibold mb-2 px-1" style={{ color: 'var(--text-muted)' }}>
              LIVE PREVIEW
            </p>
            <ProfilePreviewPanel
              username={profile?.username ?? ''}
              profile={profile}
              links={links ?? []}
            />
            <div className="mt-4">
              <QuickShare username={profile?.username ?? ''} isPremium={profile?.plan === 'PREMIUM'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
