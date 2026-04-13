import { UsernameChecker } from '@/components/UsernameChecker'
import { SocialProof } from '@/components/SocialProof'
import { JsonLd } from '@/components/JsonLd'
import Link from 'next/link'
import { ArrowRight, Zap, BarChart3, Palette, Globe, Star, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen mesh-bg overflow-hidden">
      {/* Nav */}
      <nav className="sticky top-0 z-50 glass border-b" style={{borderColor:'var(--border)'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#6c63ff,#ff3cac)'}}>
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Afriilink</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm" style={{color:'var(--text-secondary)'}}>
            <a href="#features" className="hover:text-[#6c63ff] transition-colors">Features</a>
            <a href="#pricing" className="hover:text-[#6c63ff] transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium px-3 py-2 transition-colors" style={{color:'var(--text-secondary)'}}>Sign in</Link>
            <Link href="/register" className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all active:scale-95" style={{background:'var(--brand)'}}>
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold mb-8 animate-fade-up" style={{background:'var(--bg-elevated)',border:'1px solid var(--border-strong)',color:'var(--brand)'}}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{background:'var(--accent-green)'}}></span>
          Built for African creators. Ready for the world.
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 animate-fade-up delay-100" style={{lineHeight:'1.05'}}>
          One link.<br /><span className="gradient-text">All your hustle.</span>
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-up delay-200 font-light leading-relaxed" style={{color:'var(--text-secondary)'}}>
          Share your boutique, socials, portfolio and more — from a single beautiful page. Faster than Linktree. Built for you.
        </p>
        <div className="w-full max-w-md mx-auto animate-fade-up delay-300">
          <UsernameChecker />
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 animate-fade-up delay-400">
          <Link href="/u/demo" className="text-sm font-medium transition-colors" style={{color:'var(--text-muted)'}}>
            View live example →
          </Link>
        </div>
        <p className="text-sm mt-2 animate-fade-up delay-500" style={{color:'var(--text-muted)'}}>Free forever. No credit card. Setup in 2 minutes.</p>
      </section>

      {/* Mock profile preview */}
      <section className="max-w-sm mx-auto px-4 pb-20 animate-fade-up" style={{animationDelay:'0.5s'}}>
        <div className="relative">
          <div className="absolute inset-0 opacity-20 blur-3xl rounded-3xl scale-95" style={{background:'linear-gradient(180deg,#6c63ff,#ff3cac)'}} />
          <div className="relative bg-white rounded-3xl border overflow-hidden" style={{borderColor:'var(--border)',boxShadow:'var(--shadow-lg)'}}>
            <div className="h-24 relative" style={{background:'linear-gradient(135deg,#6c63ff,#a855f7,#ff3cac)'}}>
              <div className="absolute inset-0 opacity-30" style={{backgroundImage:'radial-gradient(circle at 20% 80%,#ff6b35 0%,transparent 50%)'}} />
            </div>
            <div className="px-5 pb-5">
              <div className="-mt-8 mb-4">
                <div className="w-16 h-16 rounded-2xl border-4 border-white flex items-center justify-center text-white font-bold text-xl shadow-md" style={{background:'linear-gradient(135deg,#6c63ff,#ff3cac)'}}>AK</div>
              </div>
              <h3 className="font-bold text-base mb-0.5">Adaeze Kalu</h3>
              <p className="text-xs mb-1" style={{color:'var(--brand)'}}>afriilink.com/adaeze</p>
              <p className="text-xs mb-4" style={{color:'var(--text-secondary)'}}>Fashion designer & creator 🇳🇬 · Lagos</p>
              {[
                {icon:'🛍️',label:'My Boutique — Shop Now',bg:'rgba(108,99,255,0.08)',border:'rgba(108,99,255,0.2)'},
                {icon:'📱',label:'WhatsApp Me Directly',bg:'rgba(0,217,126,0.08)',border:'rgba(0,217,126,0.2)'},
                {icon:'▶️',label:'Latest YouTube Video',bg:'rgba(255,107,53,0.08)',border:'rgba(255,107,53,0.2)'},
                {icon:'📸',label:'Instagram @adaezekalu',bg:'rgba(255,60,172,0.08)',border:'rgba(255,60,172,0.2)'},
              ].map(l => (
                <div key={l.label} className="flex items-center gap-3 p-3 rounded-xl mb-2 border cursor-pointer" style={{background:l.bg,borderColor:l.border}}>
                  <span className="text-base">{l.icon}</span>
                  <span className="text-xs font-semibold flex-1" style={{color:'var(--text-primary)'}}>{l.label}</span>
                  <span className="text-xs" style={{color:'var(--text-muted)'}}>›</span>
                </div>
              ))}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t" style={{borderColor:'var(--border)'}}>
                {[['12k','Views'],['3.4k','Clicks'],['28%','CTR']].map(([v,l]) => (
                  <div key={l} className="text-center">
                    <div className="font-bold text-base" style={{color:'var(--brand)'}}>{v}</div>
                    <div className="text-[10px]" style={{color:'var(--text-muted)'}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <SocialProof />

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Better than Linktree.<br /><span className="gradient-text-2">Built for you.</span></h2>
          <p style={{color:'var(--text-secondary)'}}>Everything you need to turn followers into customers.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {icon:<Zap size={22} style={{color:'var(--accent-yellow)'}} />,bg:'rgba(255,209,102,0.12)',title:'Blazing Fast',desc:'Loads in under 1 second on 3G. Optimised for every network.'},
            {icon:<Palette size={22} style={{color:'var(--brand)'}} />,bg:'rgba(108,99,255,0.1)',title:'Beautiful Themes',desc:'Stunning themes designed by professionals. Premium feels standard.'},
            {icon:<BarChart3 size={22} style={{color:'var(--accent-green)'}} />,bg:'rgba(0,217,126,0.1)',title:'Real Analytics',desc:'Know exactly which links perform. Track clicks, views and CTR.'},
            {icon:<Globe size={22} style={{color:'var(--accent-orange)'}} />,bg:'rgba(255,107,53,0.1)',title:'African Ecosystems',desc:'WhatsApp, Paystack, Flutterwave — built in, not bolted on.'},
            {icon:<Star size={22} style={{color:'var(--accent-pink)'}} />,bg:'rgba(255,60,172,0.1)',title:'Monetise Everything',desc:'Sell products, accept tips, take bookings — from one page.'},
            {icon:<CheckCircle2 size={22} style={{color:'var(--brand-light)'}} />,bg:'rgba(108,99,255,0.08)',title:'No-code Setup',desc:'Live in 2 minutes. No technical skills required.'},
          ].map(f => (
            <div key={f.title} className="bg-white rounded-2xl p-6 border hover-lift" style={{borderColor:'var(--border)',boxShadow:'var(--shadow-sm)'}}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{background:f.bg}}>{f.icon}</div>
              <h3 className="font-bold mb-2 text-base">{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{color:'var(--text-secondary)'}}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">Simple, honest pricing</h2>
          <p style={{color:'var(--text-secondary)'}}>Start free. Upgrade when you are ready to grow.</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-8 border" style={{borderColor:'var(--border)',boxShadow:'var(--shadow-sm)'}}>
            <div className="text-3xl font-bold mb-1">Free</div>
            <div className="text-sm mb-6" style={{color:'var(--text-muted)'}}>Forever. No card needed.</div>
            {['Unlimited links','Mobile-optimised page','Basic themes','Afriilink branding'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm mb-3">
                <CheckCircle2 size={16} style={{color:'var(--accent-green)',flexShrink:0}} /><span>{f}</span>
              </div>
            ))}
            <Link href="/register" className="block text-center mt-8 font-semibold py-3 rounded-xl border-2 transition-colors" style={{borderColor:'var(--brand)',color:'var(--brand)'}}>Get started</Link>
          </div>
          <div className="rounded-2xl p-8 text-white relative overflow-hidden" style={{background:'linear-gradient(135deg,#6c63ff,#a855f7)',boxShadow:'0 8px 32px rgba(108,99,255,0.4)'}}>
            <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full" style={{background:'var(--accent-yellow)',color:'#0f0e1a'}}>PREMIUM</div>
            <div className="text-3xl font-bold mb-1">$10<span className="text-lg font-normal opacity-70"> / month</span></div>
            <div className="text-sm mb-6 opacity-70">For serious creators</div>
            {['Everything in Free','All 6 premium themes','Full analytics dashboard','Custom accent colours','Remove Afriilink branding','Profile & header image upload','Priority support'].map(f => (
              <div key={f} className="flex items-center gap-2 text-sm mb-3">
                <CheckCircle2 size={16} style={{color:'var(--accent-yellow)',flexShrink:0}} /><span>{f}</span>
              </div>
            ))}
            <Link href="/register" className="block text-center mt-8 bg-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity" style={{color:'var(--brand)'}}>Start free trial</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/60" style={{borderColor:'var(--border)'}}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#6c63ff,#ff3cac)'}}>
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="font-bold">Afriilink</span>
          </div>
          <p className="text-sm" style={{color:'var(--text-muted)'}}>© 2025 Afriilink by The 36th Company Ltd.</p>
          <div className="flex items-center gap-5 text-sm" style={{color:'var(--text-muted)'}}>
            <Link href="/privacy" className="hover:text-[#6c63ff] transition-colors">Privacy</Link>
            <Link href="/waitlist" className="hover:text-[#6c63ff] transition-colors">Coming soon</Link>
            <Link href="/terms" className="hover:text-[#6c63ff] transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
      <JsonLd />
    </div>
  )
}
