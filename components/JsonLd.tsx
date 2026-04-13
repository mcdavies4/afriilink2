export function JsonLd() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriilink2.vercel.app'

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${appUrl}/#website`,
        url: appUrl,
        name: 'Afriilink',
        description: 'One link. All your hustle. The premium link-in-bio platform for African creators.',
        publisher: { '@id': `${appUrl}/#organization` },
        potentialAction: {
          '@type': 'SearchAction',
          target: { '@type': 'EntryPoint', urlTemplate: `${appUrl}/u/{search_term_string}` },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${appUrl}/#organization`,
        name: 'Afriilink',
        url: appUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${appUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://twitter.com/afriilink',
          'https://instagram.com/afriilink',
        ],
      },
      {
        '@type': 'SoftwareApplication',
        name: 'Afriilink',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        offers: [
          {
            '@type': 'Offer',
            name: 'Free Plan',
            price: '0',
            priceCurrency: 'USD',
          },
          {
            '@type': 'Offer',
            name: 'Premium Plan',
            price: '10',
            priceCurrency: 'USD',
            billingIncrement: 'P1M',
          },
        ],
        description: 'Link-in-bio platform for African creators',
        url: appUrl,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// Per-profile structured data
export function ProfileJsonLd({ profile, links }: { profile: any; links: any[] }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriilink2.vercel.app'
  const profileUrl = `${appUrl}/u/${profile.username}`

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: profile.name ?? profile.username,
      url: profileUrl,
      description: profile.bio,
      image: profile.avatar_url,
      sameAs: links
        .filter((l: any) => l.url && l.url !== '#')
        .map((l: any) => l.url)
        .slice(0, 10),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
