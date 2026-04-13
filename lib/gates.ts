export const PLAN_GATES = {
  // Themes
  premiumThemes: ['sunset', 'forest', 'midnight', 'peach'],
  freeThemes: ['aurora', 'clean'],

  // Profile features
  customAccentColor: 'PREMIUM',
  youtubeEmbed: 'PREMIUM',
  musicEmbed: 'PREMIUM',
  darkModeToggle: 'PREMIUM',
  linkSound: 'PREMIUM',
  googleAnalytics: 'PREMIUM',
  whatsappButton: 'PREMIUM',
  removeBranding: 'PREMIUM',

  // Link features
  scheduledLinks: 'PREMIUM',
  expiringLinks: 'PREMIUM',
  linkHeatmap: 'PREMIUM',

  // Analytics
  analyticsBasic: 'PREMIUM',
  analyticsReferrers: 'PREMIUM',
  analytics30d: 'PREMIUM',
  analytics90d: 'PREMIUM',
  allTimeStats: 'PREMIUM',

  // Dashboard
  qrCodeDownload: 'PREMIUM',
  notificationCentre: 'PREMIUM',
} as const

export function isPremium(plan: string) {
  return plan === 'PREMIUM'
}

export function gate(plan: string, feature: keyof typeof PLAN_GATES) {
  const required = PLAN_GATES[feature]
  if (required === 'PREMIUM') return isPremium(plan)
  return true
}
