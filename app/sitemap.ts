import { supabaseAdmin } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriilink2.vercel.app'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${appUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${appUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Dynamic profile pages
  try {
    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('username, updated_at')
      .order('created_at', { ascending: false })
      .limit(500)

    const profilePages: MetadataRoute.Sitemap = (profiles ?? []).map(p => ({
      url: `${appUrl}/u/${p.username}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...profilePages]
  } catch {
    return staticPages
  }
}
