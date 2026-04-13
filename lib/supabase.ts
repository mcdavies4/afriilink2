import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

// Hardcoded to avoid env var issues in browser
const SUPABASE_URL = 'https://sthprxjcwfpljcuubnzj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aHByeGpjd2ZwbGpjdXVibnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMzQ5MTgsImV4cCI6MjA5MDgxMDkxOH0.Bo8EMEePYBG0DMVLs0yC0ot5TukzFprLh-7N0WTdEB4'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0aHByeGpjd2ZwbGpjdXVibnpqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTIzNDkxOCwiZXhwIjoyMDkwODEwOTE4fQ.DVucWnE-OAst9hqqENM9V7ULRgeSJzYh5Tps937_VH0'

// Browser client - uses SSR createBrowserClient so session cookies work with middleware
export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Admin client - server only, full access
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Export constants for server client
export { SUPABASE_URL, SUPABASE_ANON_KEY }
