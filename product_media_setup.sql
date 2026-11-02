-- ============================================================
-- DEER Drone - Rich product page content (edited from the admin)
-- Run this in your Supabase SQL Editor
-- ============================================================

-- One row per product slug. `data` holds the ProductMedia JSON
-- (hero, youtube, chapters, gallery). A product without a row falls
-- back to the built-in configuration in apps/web/lib/product-media.ts.
CREATE TABLE IF NOT EXISTS product_media (
    slug text PRIMARY KEY,
    data jsonb NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;

-- The storefront reads with the anon key; only the admin (service role) writes.
CREATE POLICY "Product media is viewable by everyone" ON product_media
FOR SELECT USING (true);
