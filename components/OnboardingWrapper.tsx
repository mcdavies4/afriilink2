'use client'
import { useState, useEffect } from 'react'
import { OnboardingModal } from './OnboardingModal'

interface Props {
  profile: any
}

export function OnboardingWrapper({ profile }: Props) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Show onboarding if not completed and account is less than 10 minutes old
    const isNew = profile?.onboarding_completed === false ||
      (profile?.created_at && Date.now() - new Date(profile.created_at).getTime() < 10 * 60 * 1000)

    if (isNew && !profile?.onboarding_completed) {
      setTimeout(() => setShow(true), 800)
    }
  }, [profile])

  if (!show) return null

  return (
    <OnboardingModal
      username={profile?.username ?? ''}
      onComplete={() => setShow(false)}
    />
  )
}
