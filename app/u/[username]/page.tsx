import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { ProfilePage } from '@/components/ProfilePage'
import type { Metadata } from 'next'

export const revalidate = 60

interface Props { params: { username: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('name, bio, avatar_url, username')
    .eq('username', params.username.toLowerCase())
    .single()

  if (!profile) return { title: 'Not found' }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriilink2.vercel.app'
  const name = profile.name ?? profile.username
  const bio = profile.bio ?? `Check out ${name}'s links on Afriilink`
  const profileUrl = `${appUrl}/u/${profile.username}`
  const imageUrl = profile.avatar_url ?? `${appUrl}/og-image.jpg`

  return {
    title: `${name} (@${profile.username})`,
    description: bio,
    alternates: { canonical: profileUrl },
    openGraph: {
      type: 'profile', url: profileUrl,
      title: `${name} on Afriilink`, description: bio, siteName: 'Afriilink',
      images: [{ url: imageUrl, width: profile.avatar_url ? 400 : 1200, height: profile.avatar_url ? 400 : 630, alt: `${name}'s profile on Afriilink` }],
    },
    twitter: {
      card: profile.avatar_url ? 'summary' : 'summary_large_image',
      site: '@afriilink', title: `${name} on Afriilink`, description: bio, images: [imageUrl],
    },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('username', params.username.toLowerCase())
    .single()

  if (!profile) notFound()

  const now = new Date().toISOString()

  // Fetch active links, respecting schedule and expiry
  const { data: allLinks } = await supabaseAdmin
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('active', true)
    .order('position')

  // Filter client-side for schedule/expiry
  // (Supabase doesn't support OR IS NULL in simple filters easily)
  const links = (allLinks ?? []).filter((link: any) => {
    // If scheduled, must be past schedule time
    if (link.scheduled_at && link.scheduled_at > now) return false
    // If expiry set, must not be past expiry
    if (link.expires_at && link.expires_at < now) return false
    return true
  })

  return <ProfilePage profile={profile} links={links} />
}
