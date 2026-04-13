import type { Metadata, Viewport } from 'next'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://afriilink2.vercel.app'
const APP_NAME = 'Afriilink'
const APP_DESCRIPTION = 'One link. All your hustle. The premium link-in-bio platform built for African creators — share your links, socials, and products from one beautiful page.'

export const viewport: Viewport = {
  themeColor: '#6c63ff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — One link. All your hustle.`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    'link in bio', 'African creators', 'linktree alternative',
    'creator tools', 'Nigeria creators', 'link page',
    'social media links', 'creator economy Africa',
    'bio link', 'all my links', 'link tree',
  ],
  authors: [{ name: 'Afriilink', url: APP_URL }],
  creator: 'Afriilink',
  publisher: 'The 36th Company Ltd',
  category: 'technology',

  // Favicons & icons
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icon.svg', color: '#6c63ff' },
    ],
  },

  manifest: '/site.webmanifest',

  // Open Graph — Facebook, LinkedIn, WhatsApp, Telegram
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — One link. All your hustle.`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Afriilink — One link. All your hustle.',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter / X
  twitter: {
    card: 'summary_large_image',
    site: '@afriilink',
    creator: '@afriilink',
    title: `${APP_NAME} — One link. All your hustle.`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: '/twitter-image.jpg',
        width: 1200,
        height: 600,
        alt: 'Afriilink — One link. All your hustle.',
      },
    ],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification (add your codes here when you have them)
  // verification: {
  //   google: 'your-google-site-verification-code',
  // },

  alternates: {
    canonical: APP_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>{children}</body>
    </html>
  )
}
