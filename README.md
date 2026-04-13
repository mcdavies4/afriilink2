# Afriilink 🌍 — One link. All your hustle.

Premium link-in-bio platform for African creators.

## Stack
- Next.js 14 + Tailwind CSS 3
- Supabase (Auth + Database)
- Vercel (Hosting)

## Setup

### 1. Install
```bash
npm install
```

### 2. Set environment variables
Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Set up database
- Open Supabase → SQL Editor
- Paste and run the entire contents of `lib/database.sql`
- This creates all tables, policies and triggers

### 4. Run
```bash
npm run dev
```

## Deploy to Vercel
1. Push to GitHub
2. Import on vercel.com
3. Add the 4 environment variables
4. Deploy — no build command changes needed

## Profile URLs
Public pages live at: `/u/[username]`
Demo page: `/u/demo`
