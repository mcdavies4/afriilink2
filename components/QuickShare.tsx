'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Copy, Check, Share2, QrCode, Download, X } from 'lucide-react'
import Image from 'next/image'

interface Props { username: string; isPremium?: boolean }

export function QuickShare({ username, isPremium = false }: Props) {
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [qrUrl, setQrUrl] = useState('')
  const [profileUrl, setProfileUrl] = useState('')

  useEffect(() => {
    const url = `${window.location.origin}/u/${username}`
    setProfileUrl(url)
  }, [username])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'My Afriilink page', url: profileUrl })
    } else {
      handleCopy()
    }
  }

  const handleQR = async () => {
    const res = await fetch('/api/qr')
    const data = await res.json()
    setQrUrl(data.qrUrl)
    setShowQR(true)
  }

  const handleDownloadQR = () => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `afriilink-${username}-qr.png`
    link.click()
  }

  const captions = [
    `🔗 Find all my links in one place → ${profileUrl}`,
    `Everything in one link 👇\n${profileUrl}`,
    `Shop · Content · Contact — all here 🌍\n${profileUrl}`,
  ]

  return (
    <>
      <div className="bg-white rounded-2xl border p-5"
        style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-1.5">
          <Share2 size={14} style={{ color: 'var(--brand)' }} /> Share your page
        </h3>

        {/* URL copy bar */}
        <div className="flex items-center gap-2 p-3 rounded-xl mb-4"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
          <span className="flex-1 text-xs font-mono truncate" style={{ color: 'var(--text-secondary)' }}>
            {profileUrl || `afriilink.com/u/${username}`}
          </span>
          <button onClick={handleCopy}
            className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg text-white transition-all active:scale-95 flex-shrink-0"
            style={{ background: 'var(--brand)' }}>
            {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy</>}
          </button>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button onClick={handleShare}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)', background: 'var(--bg-base)' }}>
            <Share2 size={13} /> Share
          </button>
          <button onClick={handleQR}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95"
            style={{ borderColor: 'var(--border-strong)', color: 'var(--text-secondary)', background: 'var(--bg-base)' }}>
            <QrCode size={13} /> QR Code
          </button>
        </div>

        {/* Caption ideas */}
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>Caption ideas</p>
        <div className="space-y-2">
          {captions.map((cap, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl text-xs"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
              <span className="flex-1 leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-secondary)' }}>
                {cap}
              </span>
              <button onClick={async () => { await navigator.clipboard.writeText(cap) }}
                className="flex-shrink-0 p-1 rounded-md hover:bg-white transition-colors"
                style={{ color: 'var(--text-muted)' }}>
                <Copy size={11} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowQR(false)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-xs text-center animate-scale-in"
            style={{ boxShadow: 'var(--shadow-lg)' }}>
            <button onClick={() => setShowQR(false)}
              className="absolute top-4 right-4" style={{ color: 'var(--text-muted)' }}>
              <X size={18} />
            </button>
            <h3 className="font-bold mb-1">Your QR Code</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Scan to visit your Afriilink page
            </p>
            {qrUrl && (
              <div className="relative w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden border"
                style={{ borderColor: 'var(--border)' }}>
                <img src={qrUrl} alt="QR Code" className="w-full h-full" />
              </div>
            )}
            <p className="text-xs mb-4 font-medium" style={{ color: 'var(--brand)' }}>
              {profileUrl}
            </p>
            {isPremium ? (
              <button onClick={handleDownloadQR}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'var(--brand)' }}>
                <Download size={15} /> Download QR
              </button>
            ) : (
              <Link href="/upgrade"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg,#6c63ff,#a855f7)' }}>
                🔒 Upgrade to download QR
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
