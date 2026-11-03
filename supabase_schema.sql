-- ========================================================
-- SUPABASE POSTGRESQL SCHEMA FOR ECOMMERCE_EXPRESS_API
-- ========================================================

-- Enable pgcrypto or uuid-ossp for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table (For JWT Auth)
CREATE TABLE IF NOT EXISTS ecommerce_express_users (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS ecommerce_express_categories (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Products Table
CREATE TABLE IF NOT EXISTS ecommerce_express_products (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  quantity INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  category_uid UUID REFERENCES ecommerce_express_categories(uid) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on category_uid for fast lookup
CREATE INDEX IF NOT EXISTS idx_ecom_exp_products_category_uid ON ecommerce_express_products(category_uid);

-- Configure Row Level Security (RLS)
ALTER TABLE ecommerce_express_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_express_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_express_products ENABLE ROW LEVEL SECURITY;

-- Allow full access for server-side API (anon/service_role keys)
DROP POLICY IF EXISTS "Public access to ecommerce_express_users" ON ecommerce_express_users;
CREATE POLICY "Public access to ecommerce_express_users" ON ecommerce_express_users FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to ecommerce_express_categories" ON ecommerce_express_categories;
CREATE POLICY "Public access to ecommerce_express_categories" ON ecommerce_express_categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to ecommerce_express_products" ON ecommerce_express_products;
CREATE POLICY "Public access to ecommerce_express_products" ON ecommerce_express_products FOR ALL USING (true) WITH CHECK (true);

-- Insert initial sample categories
INSERT INTO ecommerce_express_categories (name, description) VALUES
  ('Electronics', 'Phones, Laptops, Accessories and Gadgets'),
  ('Fashion', 'Clothing, Shoes, and Lifestyle items'),
  ('Home Appliances', 'Kitchen and living room appliances')
ON CONFLICT (name) DO NOTHING;
