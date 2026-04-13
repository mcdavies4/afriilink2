'use client'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

interface Props {
  enabled: boolean
  onToggle: (dark: boolean) => void
}

export function DarkModeToggle({ enabled, onToggle }: Props) {
  if (!enabled) return null

  return (
    <button
      onClick={() => onToggle(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
      style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
      title="Toggle dark mode"
    >
      <Sun size={12} />
      <span>Light</span>
    </button>
  )
}
