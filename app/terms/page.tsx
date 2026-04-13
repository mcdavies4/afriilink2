import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Afriilink',
  description: 'The terms and conditions governing use of the Afriilink platform.',
}

export default function TermsPage() {
  const lastUpdated = 'April 2025'
  const email = 'legal@afriilink.com'
  const company = 'The 36th Company Ltd'
  const companyNo = 'RC: 9415701'

  const sections = [
    {
      title: '1. Acceptance of Terms',
      text: `By accessing or using Afriilink ("the Service"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the Service.\n\nThese Terms constitute a legally binding agreement between you and ${company} (${companyNo}), the operator of Afriilink.`,
    },
    {
      title: '2. Description of Service',
      text: 'Afriilink is a link-in-bio platform that allows users to create a single public page containing their links, social profiles, and other content. We offer both a free tier and a paid Premium subscription.',
    },
    {
      title: '3. Account Registration',
      items: [
        'You must provide accurate and complete information when creating an account.',
        'You are responsible for maintaining the security of your account and password.',
        'You must notify us immediately of any unauthorised use of your account.',
        'You must be at least 13 years old to use Afriilink.',
        'One person may not maintain more than one free account.',
        'You are responsible for all activity that occurs under your account.',
      ],
    },
    {
      title: '4. Acceptable Use',
      subtitle: 'You agree NOT to use Afriilink to:',
      items: [
        'Post content that is illegal, harmful, threatening, abusive, or defamatory',
        'Infringe on any intellectual property rights of others',
        'Distribute spam, malware, or other harmful software',
        'Impersonate any person or entity',
        'Collect or harvest personal information about other users',
        'Use the platform for any fraudulent or deceptive purpose',
        'Violate any applicable laws or regulations',
        'Attempt to gain unauthorised access to our systems',
        'Post content that promotes violence, discrimination, or hatred',
        'Sell or transfer your account to another person',
      ],
      footer: 'We reserve the right to suspend or terminate accounts that violate these rules without notice.',
    },
    {
      title: '5. Content Ownership',
      content: [
        {
          subtitle: 'Your content',
          text: 'You retain full ownership of all content you post on Afriilink, including your links, bio, images, and profile information.',
        },
        {
          subtitle: 'Licence to us',
          text: 'By posting content on Afriilink, you grant us a non-exclusive, royalty-free, worldwide licence to display, distribute, and promote that content as part of operating the Service (e.g. showing your public profile to visitors).',
        },
        {
          subtitle: 'Our content',
          text: 'All other content on Afriilink — including our design, code, logos, and platform features — is owned by The 36th Company Ltd and protected by intellectual property law.',
        },
      ],
    },
    {
      title: '6. Free & Premium Plans',
      content: [
        {
          subtitle: 'Free plan',
          text: 'The free plan is provided at no cost and includes basic features as described on our pricing page. We reserve the right to modify or discontinue features available on the free plan with reasonable notice.',
        },
        {
          subtitle: 'Premium plan',
          text: 'The Premium plan is available at $10 per month, billed monthly. You can cancel at any time. Your Premium features remain active until the end of your current billing period. We do not offer refunds for partial months.',
        },
        {
          subtitle: 'Price changes',
          text: 'We reserve the right to change our pricing. We will give you at least 30 days notice before any price increase affects your subscription.',
        },
      ],
    },
    {
      title: '7. Payments & Refunds',
      items: [
        'Payments are processed securely by Stripe.',
        'Subscriptions renew automatically each month until cancelled.',
        'You can cancel your subscription at any time from your Settings page.',
        'We do not offer refunds for subscription fees already paid.',
        'If a payment fails, we will notify you and your account may be downgraded to the free plan.',
      ],
    },
    {
      title: '8. Privacy',
      text: 'Your use of Afriilink is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using Afriilink, you consent to the collection and use of your information as described in our Privacy Policy.',
    },
    {
      title: '9. Disclaimers',
      text: 'Afriilink is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or completely secure.\n\nWe are not responsible for the content of links posted by users on their Afriilink pages. We do not endorse any external websites or services linked through our platform.',
    },
    {
      title: '10. Limitation of Liability',
      text: `To the maximum extent permitted by law, ${company} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Service. Our total liability to you shall not exceed the amount you paid us in the 12 months preceding the claim.`,
    },
    {
      title: '11. Termination',
      text: 'We may suspend or terminate your account at any time for violations of these Terms, or for any other reason with or without notice. You may delete your account at any time from your Settings page. Upon termination, your public profile will be removed and your data will be deleted in accordance with our Privacy Policy.',
    },
    {
      title: '12. Changes to Terms',
      text: 'We may update these Terms from time to time. We will notify you of significant changes by email or through the platform. Your continued use of Afriilink after changes are posted constitutes acceptance of the updated Terms.',
    },
    {
      title: '13. Governing Law',
      text: 'These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these Terms or your use of Afriilink shall be subject to the exclusive jurisdiction of the courts of England and Wales.',
    },
    {
      title: '14. Contact',
      text: `For questions about these Terms, contact us at:\n\n${company}\n${companyNo}\nEmail: ${email}`,
    },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-bold text-base">Afriilink</span>
          </Link>
          <Link href="/" className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)' }}>
            ← Back to home
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: 'var(--bg-elevated)', color: 'var(--brand)', border: '1px solid var(--border-strong)' }}>
            📋 Terms of Service
          </div>
          <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: {lastUpdated}</p>
        </div>

        <div className="space-y-5">
          {sections.map(section => (
            <section key={section.title} className="bg-white rounded-2xl p-6 border"
              style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                {section.title}
              </h2>

              {'subtitle' in section && section.subtitle && (
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                  {section.subtitle}
                </p>
              )}

              {'text' in section && (
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                  {section.text}
                </p>
              )}

              {'items' in section && section.items && (
                <>
                  <ul className="space-y-2">
                    {section.items.map(item => (
                      <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--brand)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {'footer' in section && section.footer && (
                    <p className="text-sm mt-4 pt-4 border-t font-medium leading-relaxed"
                      style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
                      {section.footer}
                    </p>
                  )}
                </>
              )}

              {'content' in section && section.content && (
                <div className="space-y-4">
                  {section.content.map(item => (
                    <div key={item.subtitle}>
                      <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                        {item.subtitle}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2025 {company}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="hover:underline" style={{ color: 'var(--brand)' }}>Privacy Policy</Link>
            <Link href="/" className="hover:underline" style={{ color: 'var(--text-muted)' }}>Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
