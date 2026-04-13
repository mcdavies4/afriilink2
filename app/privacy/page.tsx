import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Afriilink',
  description: 'How Afriilink collects, uses and protects your personal information.',
}

export default function PrivacyPage() {
  const lastUpdated = 'April 2025'
  const email = 'privacy@afriilink.com'
  const company = 'The 36th Company Ltd'
  const companyNo = 'RC: 9415701'

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
            🔒 Privacy Policy
          </div>
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Last updated: {lastUpdated}</p>
        </div>

        <div className="prose-content space-y-10">

          {/* Intro */}
          <section>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Afriilink is operated by <strong>{company}</strong> ({companyNo}). This Privacy Policy explains how we collect,
              use, and protect your personal information when you use our platform at afriilink.com.
              By using Afriilink, you agree to the practices described in this policy.
            </p>
          </section>

          {[
            {
              title: '1. Information We Collect',
              content: [
                {
                  subtitle: 'Account information',
                  text: 'When you register, we collect your name, email address, username, and password (stored securely using industry-standard hashing). You may also optionally provide a profile photo, header image, and bio.',
                },
                {
                  subtitle: 'Profile content',
                  text: 'We store the links, titles, icons, and other content you add to your Afriilink page.',
                },
                {
                  subtitle: 'Analytics data',
                  text: 'We collect anonymised data about visits to your public profile page and clicks on your links, including approximate geographic location (country level only), device type, and referrer URL. We do not store full IP addresses — they are hashed immediately.',
                },
                {
                  subtitle: 'Payment information',
                  text: 'Payments are processed by Stripe. We do not store your card details. We receive confirmation of payment status and your Stripe customer ID only.',
                },
                {
                  subtitle: 'Usage data',
                  text: 'We may collect information about how you use the dashboard, such as features accessed and settings changed, to improve our product.',
                },
              ],
            },
            {
              title: '2. How We Use Your Information',
              items: [
                'To create and manage your account',
                'To display your public profile page to visitors',
                'To provide analytics about your page performance',
                'To process payments and manage your subscription',
                'To send you important service emails (account updates, security alerts)',
                'To improve and develop the Afriilink platform',
                'To comply with legal obligations',
              ],
            },
            {
              title: '3. Information Sharing',
              content: [
                {
                  subtitle: 'We do not sell your data',
                  text: 'We will never sell, rent, or share your personal information with third parties for their marketing purposes.',
                },
                {
                  subtitle: 'Service providers',
                  text: 'We share data with trusted service providers who help us operate Afriilink: Supabase (database and authentication), Cloudinary (image storage), Stripe (payment processing), and Vercel (hosting). Each is bound by strict data processing agreements.',
                },
                {
                  subtitle: 'Public profile',
                  text: 'Your username, name, bio, profile photo, header image, and active links are publicly visible to anyone who visits your Afriilink page.',
                },
                {
                  subtitle: 'Legal requirements',
                  text: 'We may disclose your information if required by law or to protect the rights, property, or safety of Afriilink, our users, or others.',
                },
              ],
            },
            {
              title: '4. Data Storage & Security',
              text: 'Your data is stored on secure servers provided by Supabase (EU region). We use industry-standard security measures including encryption in transit (HTTPS/TLS) and at rest. Passwords are hashed and never stored in plain text. Despite these measures, no system is 100% secure — please use a strong unique password.',
            },
            {
              title: '5. Cookies',
              text: 'We use essential cookies to keep you logged in and maintain your session. We do not use tracking cookies or third-party advertising cookies. You can disable cookies in your browser settings, but this will prevent you from logging in.',
            },
            {
              title: '6. Your Rights',
              items: [
                'Access — request a copy of the personal data we hold about you',
                'Correction — ask us to correct inaccurate information',
                'Deletion — request deletion of your account and associated data',
                'Portability — receive your data in a structured, machine-readable format',
                'Objection — object to certain processing of your data',
              ],
              footer: `To exercise any of these rights, email us at ${email}. We will respond within 30 days.`,
            },
            {
              title: '7. Data Retention',
              text: 'We retain your account data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or financial record-keeping purposes.',
            },
            {
              title: '8. Children\'s Privacy',
              text: 'Afriilink is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us.',
            },
            {
              title: '9. Changes to This Policy',
              text: 'We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by displaying a notice on the platform. Your continued use of Afriilink after changes constitutes acceptance of the updated policy.',
            },
            {
              title: '10. Contact Us',
              text: `If you have questions about this Privacy Policy or how we handle your data, contact us at:\n\n${company}\n${companyNo}\nEmail: ${email}`,
            },
          ].map(section => (
            <section key={section.title} className="bg-white rounded-2xl p-6 border"
              style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                {section.title}
              </h2>

              {'text' in section && typeof section.text === 'string' && (
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                  {section.text}
                </p>
              )}

              {'items' in section && section.items && (
                <>
                  <ul className="space-y-2">
                    {section.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--brand)' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {'footer' in section && section.footer && (
                    <p className="text-sm mt-4 pt-4 border-t leading-relaxed" style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
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

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2025 {company}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-muted)' }}>
            <Link href="/terms" className="hover:underline" style={{ color: 'var(--brand)' }}>Terms of Service</Link>
            <Link href="/" className="hover:underline">Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
