'use client'
import { useState, useEffect } from 'react'
import { X, Download, Smartphone } from 'lucide-react'

export function PWAInstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true)
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e)
      // Show after 30 seconds on page
      setTimeout(() => setShow(true), 30000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!prompt) return
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    if (outcome === 'accepted') setInstalled(true)
    setShow(false)
  }

  if (!show || installed) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 animate-fade-up">
      <div className="bg-white rounded-2xl p-4 border shadow-lg flex items-start gap-3"
        style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#6c63ff,#ff3cac)' }}>
          <Smartphone size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold mb-0.5">Install Afriilink</p>
          <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            Add to your home screen for quick access
          </p>
          <div className="flex gap-2">
            <button onClick={handleInstall}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all active:scale-95"
              style={{ background: 'var(--brand)' }}>
              <Download size={12} /> Install
            </button>
            <button onClick={() => setShow(false)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
              Not now
            </button>
          </div>
        </div>
        <button onClick={() => setShow(false)} className="flex-shrink-0"
          style={{ color: 'var(--text-muted)' }}>
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
