import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <DashboardNav profile={profile} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <PWAInstallPrompt />
    </div>
  )
}
