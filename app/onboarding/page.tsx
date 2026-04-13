'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  {
    id: 'profile',
    emoji: '👤',
    title: 'Set up your profile',
    subtitle: 'Add your name and a short bio so visitors know who you are',
  },
  {
    id: 'links',
    emoji: '🔗',
    title: 'Add your first links',
    subtitle: 'Add your Instagram, WhatsApp, YouTube or shop — anything you want to share',
  },
  {
    id: 'theme',
    emoji: '🎨',
    title: 'Choose your theme',
    subtitle: 'Pick a look that matches your style',
  },
  {
    id: 'share',
    emoji: '🚀',
    title: 'Share your page',
    subtitle: 'Your page is live! Put the link in your Instagram bio, WhatsApp status, everywhere',
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const isLast = step === STEPS.length - 1

  const handleNext = async () => {
    if (isLast) {
      setLoading(true)
      router.push('/dashboard')
      return
    }
    setStep(v => v + 1)
  }

  const stepActions: Record<string, React.ReactNode> = {
    profile: (
      <Link href="/settings"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm"
        style={{ background: 'var(--brand)' }}>
        Go to settings <ArrowRight size={15} />
      </Link>
    ),
    links: (
      <Link href="/dashboard"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm"
        style={{ background: 'var(--brand)' }}>
        Add links now <ArrowRight size={15} />
      </Link>
    ),
    theme: (
      <Link href="/settings"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm"
        style={{ background: 'var(--brand)' }}>
        Choose theme <ArrowRight size={15} />
      </Link>
    ),
  }

  const current = STEPS[step]

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-xl">Afriilink</span>
          </Link>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? '24px' : '8px',
                height: '8px',
                background: i <= step ? 'var(--brand)' : 'var(--border-strong)',
              }} />
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border text-center animate-scale-in"
          style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>

          {/* Emoji */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6"
            style={{ background: 'var(--bg-elevated)' }}>
            {current.emoji}
          </div>

          {/* Step number */}
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
            STEP {step + 1} OF {STEPS.length}
          </p>

          <h1 className="text-2xl font-bold mb-3">{current.title}</h1>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            {current.subtitle}
          </p>

          {/* Action button */}
          <div className="space-y-3">
            {stepActions[current.id] ?? (
              <button onClick={handleNext} disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
                {loading
                  ? <Loader2 size={15} className="animate-spin" />
                  : <><Check size={15} /> Go to my dashboard</>}
              </button>
            )}

            <button onClick={handleNext}
              className="w-full py-2.5 text-sm font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}>
              {isLast ? 'Done' : 'Skip this step →'}
            </button>
          </div>
        </div>

        {/* Completed steps */}
        {step > 0 && (
          <div className="mt-5 space-y-2">
            {STEPS.slice(0, step).map(s => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                style={{ background: 'rgba(0,217,126,0.08)', border: '1px solid rgba(0,217,126,0.2)' }}>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--accent-green)' }}>
                  <Check size={11} className="text-white" />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--accent-green)' }}>
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
