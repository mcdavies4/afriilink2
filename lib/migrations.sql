-- Run this in Supabase SQL Editor to add new features
-- Safe to run even if columns already exist

-- Add scheduled link support
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS scheduled_at TIMESTAMPTZ;
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Add category/section support
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'general';

-- Add referrer tracking to page_views
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS referer TEXT;

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'milestone', 'alert'
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT WITH CHECK (TRUE);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS links_scheduled_idx ON public.links(scheduled_at) WHERE scheduled_at IS NOT NULL;


-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  author_name TEXT NOT NULL,
  author_handle TEXT,
  author_avatar TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN DEFAULT TRUE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public testimonials viewable by all"
  ON public.testimonials FOR SELECT USING (approved = TRUE);

CREATE POLICY "Users manage own testimonials"
  ON public.testimonials FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS testimonials_user_id_idx
  ON public.testimonials(user_id, position);

-- Waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  feature TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT WITH CHECK (TRUE);

-- Email subscriber preferences
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS weekly_report BOOLEAN DEFAULT TRUE;
