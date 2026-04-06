-- ============================================================
-- DEER Droneshop - Step 1: Storage Bucket for Products
-- Run this in your Supabase SQL Editor
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update/Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;

CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Uploads are handled only through the admin server API using the service role key.
-- Do not add INSERT/UPDATE/DELETE policies for authenticated browser users in production.
