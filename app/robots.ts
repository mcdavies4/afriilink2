import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriilink2.vercel.app'

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/u/'],
        disallow: ['/dashboard', '/analytics', '/settings', '/upgrade', '/api/'],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
    host: appUrl,
  }
}
