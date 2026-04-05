-- DEER Droneshop Schema Setup
-- Run this in your Supabase SQL Editor

-- 1. Create Categories Table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Products Table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  brand text NOT NULL,
  price numeric NOT NULL,
  compare_price numeric,
  short_description text,
  description text,
  stock_qty integer DEFAULT 0,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  hero_note text, -- e.g., "Шинэ", "Онцгой"
  is_leasable boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Product Images Table
CREATE TABLE product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Product Specs Table
CREATE TABLE product_specs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  label text NOT NULL,
  value text NOT NULL,
  display_order integer DEFAULT 0
);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specs ENABLE ROW LEVEL SECURITY;

-- 6. Create Public Read Policies
CREATE POLICY "Public categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Public product images are viewable by everyone" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public product specs are viewable by everyone" ON product_specs FOR SELECT USING (true);

-- 7. Add Initial Data
INSERT INTO categories (name, slug) 
VALUES 
('Drone', 'drones'),
('Action Camera', 'cameras');
