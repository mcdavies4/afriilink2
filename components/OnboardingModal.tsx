'use client'
import { useState, useEffect } from 'react'
import { X, ArrowRight, Check, Link2, Palette, Share2, BarChart3 } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  {
    icon: '👋',
    title: "Welcome to Afriilink!",
    desc: "You're one step away from having a beautiful link page. Let's get you set up in 2 minutes.",
    action: null,
    actionLabel: "Let's go →",
  },
  {
    icon: '🔗',
    title: 'Add your first links',
    desc: 'Add links to your shop, social profiles, WhatsApp, YouTube — anything you want to share.',
    action: '/dashboard',
    actionLabel: 'Add my first link →',
  },
  {
    icon: '🎨',
    title: 'Customise your page',
    desc: 'Choose a theme and add your profile photo to make your page stand out.',
    action: '/settings',
    actionLabel: 'Go to settings →',
  },
  {
    icon: '🌍',
    title: 'Share your link',
    desc: 'Put your Afriilink in your Instagram bio, WhatsApp status, Twitter, and everywhere else.',
    action: null,
    actionLabel: 'Done — take me to my dashboard',
  },
]

interface Props {
  username: string
  onComplete: () => void
}

export function OnboardingModal({ username, onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  const handleNext = async () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboarding_completed: true }),
      })
      onComplete()
    }
  }

  const current = STEPS[step]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl w-full max-w-sm animate-scale-in overflow-hidden"
        style={{ boxShadow: 'var(--shadow-lg)' }}>

        {/* Progress bar */}
        <div className="h-1 w-full" style={{ background: 'var(--bg-elevated)' }}>
          <div className="h-full transition-all duration-500 rounded-full"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: 'linear-gradient(90deg,#6c63ff,#ff3cac)' }} />
        </div>

        {/* Dismiss */}
        <button onClick={onComplete} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
          <X size={16} />
        </button>

        <div className="p-8 text-center">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-1.5 mb-6">
            {STEPS.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? '20px' : '6px',
                  height: '6px',
                  background: i <= step ? 'var(--brand)' : 'var(--border-strong)',
                }} />
            ))}
          </div>

          {/* Icon */}
          <div className="text-5xl mb-5">{current.icon}</div>

          <h2 className="text-xl font-bold mb-3">{current.title}</h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
            {current.desc}
          </p>

          {/* Profile URL on first step */}
          {step === 0 && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-6 text-sm font-medium"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
                <span className="text-white font-bold" style={{ fontSize: '8px' }}>A</span>
              </div>
              <span className="flex-1 text-left truncate" style={{ color: 'var(--brand)' }}>
                afriilink.com/u/{username}
              </span>
              <Check size={14} style={{ color: 'var(--accent-green)' }} />
            </div>
          )}

          {/* Action button */}
          {current.action ? (
            <Link href={current.action} onClick={handleNext}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
              {current.actionLabel} <ArrowRight size={16} />
            </Link>
          ) : (
            <button onClick={handleNext}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all active:scale-95"
              style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
              {current.actionLabel} {step < STEPS.length - 1 && <ArrowRight size={16} />}
            </button>
          )}

          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="mt-3 text-xs font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}>
              ← Back
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
