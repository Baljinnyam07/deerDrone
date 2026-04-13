-- ============================================================
-- DEER Drone - Site Configuration & Video Management Setup
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Create Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
    key text PRIMARY KEY,
    value text,
    label text,
    description text,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Access
CREATE POLICY "Public settings are viewable by everyone" ON site_settings
FOR SELECT USING (true);

-- 4. Initial Video Slots (Empty by default)
INSERT INTO site_settings (key, label, description)
VALUES 
('home_hero', 'Нүүр хуудасны гол видео', 'Main landing hero video'),
('home_showcase_main', 'Шоурүм - Том видео', 'Large video in the showcase grid'),
('home_showcase_side', 'Шоурүм - Хажуугийн видео', 'Vertical video in the showcase grid'),
('home_feature_1', 'Нэмэлт видео 1', 'Additional feature video'),
('home_feature_2', 'Нэмэлт видео 2', 'Additional feature video')
ON CONFLICT (key) DO NOTHING;

-- 5. Create Storage Bucket for Videos
-- NOTE: If this fails, please create the bucket 'site-videos' manually in the Supabase Dashboard
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-videos', 'site-videos', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies
CREATE POLICY "Public Video Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-videos');
