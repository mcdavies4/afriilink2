-- Run in Supabase SQL Editor

-- YouTube embed support
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS youtube_title TEXT DEFAULT 'Watch my latest video';

-- Music embed support  
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS music_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS music_type TEXT DEFAULT 'spotify'; -- 'spotify' | 'apple'

-- Dark mode preference
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dark_mode_toggle BOOLEAN DEFAULT TRUE; -- allow visitors to toggle

-- Google Analytics
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ga_measurement_id TEXT;

-- Link sounds
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS link_sound BOOLEAN DEFAULT FALSE;
