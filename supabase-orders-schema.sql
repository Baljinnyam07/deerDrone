-- ============================================================
-- DEER Droneshop - Extended Schema: Profiles, Orders, Leads
-- Run this in your Supabase SQL Editor AFTER supabase-schema.sql
-- ============================================================

-- 1. Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'full_name');
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','paid','confirmed','packing','shipped','delivered','cancelled')),
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  payment_method text NOT NULL DEFAULT 'qpay'
    CHECK (payment_method IN ('qpay','bank_transfer')),
  shipping_method text NOT NULL DEFAULT 'ub'
    CHECK (shipping_method IN ('ub','rural')),
  shipping_address jsonb NOT NULL DEFAULT '{}'::jsonb,
  shipping_cost numeric NOT NULL DEFAULT 0,
  subtotal numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  notes text,
  source text NOT NULL DEFAULT 'web'
    CHECK (source IN ('web','chatbot','admin')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create orders" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);


-- 3. Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  line_total numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
DROP POLICY IF EXISTS "Order items viewable by order owner" ON order_items;

CREATE POLICY "Order items viewable by order owner"
  ON order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );


-- 4. Leads (Chatbot)
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  phone text,
  interest text,
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','qualified','contacted','closed')),
  source_page text,
  session_id text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create leads" ON leads;
DROP POLICY IF EXISTS "Authenticated can view leads" ON leads;
DROP POLICY IF EXISTS "Authenticated can update leads" ON leads;


-- 5. Helper: Auto-generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  seq_num integer;
BEGIN
  SELECT count(*) + 1 INTO seq_num FROM orders;
  NEW.order_number := 'ORD-' || lpad(seq_num::text, 5, '0');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_order_number ON orders;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();


-- 6. Helper: Updated_at auto-set
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- 7. Helper: Reserve and restore stock atomically for server-side checkout
CREATE OR REPLACE FUNCTION reserve_product_stock(target_product_id uuid, requested_qty integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_rows integer;
BEGIN
  IF requested_qty IS NULL OR requested_qty < 1 THEN
    RETURN false;
  END IF;

  UPDATE products
  SET stock_qty = stock_qty - requested_qty
  WHERE id = target_product_id
    AND stock_qty >= requested_qty;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  RETURN updated_rows = 1;
END;
$$;

CREATE OR REPLACE FUNCTION restore_product_stock(target_product_id uuid, restore_qty integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated_rows integer;
BEGIN
  IF restore_qty IS NULL OR restore_qty < 1 THEN
    RETURN false;
  END IF;

  UPDATE products
  SET stock_qty = stock_qty + restore_qty
  WHERE id = target_product_id;

  GET DIAGNOSTICS updated_rows = ROW_COUNT;
  RETURN updated_rows = 1;
END;
$$;

REVOKE ALL ON FUNCTION reserve_product_stock(uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION restore_product_stock(uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION reserve_product_stock(uuid, integer) TO service_role;
GRANT EXECUTE ON FUNCTION restore_product_stock(uuid, integer) TO service_role;
