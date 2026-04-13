import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 text-center">
      <div>
        <div className="text-6xl mb-4">🔗</div>
        <h1 className="text-3xl font-bold mb-2">Page not found</h1>
        <p className="mb-6" style={{color:'var(--text-muted)'}}>This link does not exist yet.</p>
        <Link href="/" className="text-white font-semibold px-6 py-3 rounded-xl transition-colors" style={{background:'var(--brand)'}}>Go home</Link>
      </div>
    </div>
  )
}
