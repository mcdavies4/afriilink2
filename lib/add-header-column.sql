-- Run this in Supabase SQL Editor to add header image support
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS header_url TEXT;
