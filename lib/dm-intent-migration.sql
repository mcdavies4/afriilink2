-- DM Intent tracking
-- Tracks when someone clicks a messaging link (WhatsApp, Telegram etc)
-- but we can't know if they actually sent a message - we track the intent (click)

-- Add link_type to links table to identify messaging links
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS link_type TEXT DEFAULT 'general';
-- link_type values: general, whatsapp, telegram, instagram_dm, twitter_dm, email, phone

-- Add device/session info to link_clicks for better analytics
ALTER TABLE public.link_clicks ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE public.link_clicks ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.link_clicks ADD COLUMN IF NOT EXISTS session_id TEXT;
ALTER TABLE public.link_clicks ADD COLUMN IF NOT EXISTS link_type TEXT;

-- Index for fast DM intent queries
CREATE INDEX IF NOT EXISTS link_clicks_type_idx ON public.link_clicks(link_type, created_at DESC);
CREATE INDEX IF NOT EXISTS links_type_idx ON public.links(link_type);
