import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_URL = 'https://sthprxjcwfpljcuubnzj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aHByeGpjd2ZwbGpjdXVibnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzQ5MTgsImV4cCI6MjA5MDgxMDkxOH0.Bo8EMEePYBG0DMVLs0yC0ot5TukzFprLh-7N0WTdEB4'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  const protectedPaths = ['/dashboard', '/analytics', '/settings', '/upgrade', '/referral', '/admin']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))
  const isAuthPage = ['/login', '/register', '/forgot-password', '/reset-password', '/auth'].some(p => pathname.startsWith(p))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthPage && user && !pathname.startsWith('/auth') && !pathname.startsWith('/reset-password')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.jpg|.*\\.ico|api/stripe/webhook|api/stats).*)'],
}
