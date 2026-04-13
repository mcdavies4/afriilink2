import { TestimonialsManager } from '@/components/TestimonialsManager'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'
import { SettingsForm } from '@/components/SettingsForm'

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return (
    <div className="min-h-screen" style={{background:'var(--bg-base)'}}>
      <DashboardNav profile={profile} />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-sm mb-8" style={{color:'var(--text-muted)'}}>Manage your profile and page appearance</p>
        <SettingsForm profile={profile} />
        <div className="mt-6"><TestimonialsManager /></div>
      </main>
    </div>
  )
}
