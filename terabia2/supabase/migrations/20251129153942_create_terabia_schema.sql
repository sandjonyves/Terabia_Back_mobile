/*
  # Terabia Agricultural Marketplace - Database Schema

  ## Overview
  Complete database schema for a multi-role marketplace platform connecting farmers, buyers, delivery agencies, and administrators.

  ## 1. New Tables

  ### users
  Extended user profile with role-based attributes
  - `id` (uuid, primary key) - Links to auth.users
  - `role` (enum) - buyer | seller | delivery | admin
  - `name` (text) - Full name
  - `phone` (text) - Contact number
  - `city` (text) - User location
  - `gender` (text) - Optional gender
  - `cni` (text) - National ID for sellers/delivery agencies
  - `avatar_url` (text) - Profile photo
  - `is_active` (boolean) - Account status
  - `is_verified` (boolean) - Verification status for sellers/agencies
  - `rating` (numeric) - Average rating (for sellers/agencies)
  - `total_ratings` (integer) - Number of ratings received
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### categories
  Product categorization
  - `id` (serial, primary key)
  - `name` (text) - Category name
  - `slug` (text) - URL-friendly identifier
  - `icon` (text) - Icon identifier
  - `description` (text)
  - `created_at` (timestamptz)

  ### products
  Seller product listings
  - `id` (serial, primary key)
  - `seller_id` (uuid, foreign key)
  - `category_id` (integer, foreign key)
  - `title` (text) - Product name
  - `description` (text)
  - `price` (numeric) - Price in XAF
  - `currency` (text) - Default XAF
  - `stock` (integer) - Available quantity
  - `unit` (text) - kg, piece, bunch, etc.
  - `images` (jsonb) - Array of image URLs
  - `location_city` (text)
  - `location_coords` (jsonb) - {lat, lng}
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### orders
  Purchase orders
  - `id` (serial, primary key)
  - `buyer_id` (uuid, foreign key)
  - `order_number` (text, unique) - Generated order reference
  - `items` (jsonb) - Array of {productId, qty, price, title}
  - `subtotal` (numeric)
  - `delivery_fee` (numeric)
  - `total` (numeric)
  - `status` (enum) - pending | accepted | in_transit | delivered | cancelled
  - `payment_status` (enum) - pending | success | failed
  - `delivery_address` (text)
  - `delivery_city` (text)
  - `delivery_coords` (jsonb)
  - `delivery_agency_id` (uuid, nullable)
  - `buyer_notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### deliveries
  Delivery tracking
  - `id` (serial, primary key)
  - `order_id` (integer, foreign key, unique)
  - `agency_id` (uuid, nullable foreign key)
  - `status` (enum) - available | accepted | en_route | delivered | cancelled
  - `pickup_address` (text)
  - `pickup_coords` (jsonb)
  - `delivery_address` (text)
  - `delivery_coords` (jsonb)
  - `estimated_fee` (numeric)
  - `actual_fee` (numeric)
  - `accepted_at` (timestamptz)
  - `picked_at` (timestamptz)
  - `delivered_at` (timestamptz)
  - `notes` (text)
  - `created_at` (timestamptz)

  ### transactions
  Payment records
  - `id` (serial, primary key)
  - `order_id` (integer, foreign key)
  - `amount` (numeric)
  - `provider` (text) - MTN | Orange | M-Pesa
  - `status` (enum) - pending | success | failed
  - `payment_reference` (text, unique)
  - `phone_number` (text) - Payer phone
  - `metadata` (jsonb) - Provider-specific data
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### reviews
  Product and service reviews
  - `id` (serial, primary key)
  - `order_id` (integer, foreign key)
  - `reviewer_id` (uuid, foreign key)
  - `reviewee_id` (uuid, foreign key) - Seller or delivery agency
  - `rating` (integer) - 1-5
  - `comment` (text)
  - `type` (enum) - product | delivery
  - `created_at` (timestamptz)

  ## 2. Security (RLS)
  - Enable RLS on all tables
  - Authenticated users can read their own data
  - Role-based policies for create/update/delete
  - Buyers can create orders and reviews
  - Sellers can manage their products and view orders
  - Delivery agencies can view/accept available deliveries
  - Admins have elevated access

  ## 3. Indexes
  - Products: seller_id, category_id, is_active
  - Orders: buyer_id, status, created_at
  - Deliveries: agency_id, status
  - Transactions: order_id, payment_reference
*/

-- Create enums
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'delivery', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'accepted', 'in_transit', 'delivered', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failed');
CREATE TYPE delivery_status AS ENUM ('available', 'accepted', 'en_route', 'delivered', 'cancelled');
CREATE TYPE review_type AS ENUM ('product', 'delivery');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'buyer',
  name text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  gender text,
  cni text,
  avatar_url text,
  is_active boolean DEFAULT true,
  is_verified boolean DEFAULT false,
  rating numeric(3, 2) DEFAULT 0,
  total_ratings integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id serial PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  seller_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id integer NOT NULL REFERENCES categories(id),
  title text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  currency text DEFAULT 'XAF',
  stock integer DEFAULT 0 CHECK (stock >= 0),
  unit text DEFAULT 'kg',
  images jsonb DEFAULT '[]'::jsonb,
  location_city text NOT NULL,
  location_coords jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  buyer_id uuid NOT NULL REFERENCES users(id),
  order_number text UNIQUE NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric(10, 2) NOT NULL,
  delivery_fee numeric(10, 2) DEFAULT 0,
  total numeric(10, 2) NOT NULL,
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  delivery_address text NOT NULL,
  delivery_city text NOT NULL,
  delivery_coords jsonb,
  delivery_agency_id uuid REFERENCES users(id),
  buyer_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id serial PRIMARY KEY,
  order_id integer UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  agency_id uuid REFERENCES users(id),
  status delivery_status DEFAULT 'available',
  pickup_address text NOT NULL,
  pickup_coords jsonb,
  delivery_address text NOT NULL,
  delivery_coords jsonb,
  estimated_fee numeric(10, 2),
  actual_fee numeric(10, 2),
  accepted_at timestamptz,
  picked_at timestamptz,
  delivered_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id serial PRIMARY KEY,
  order_id integer NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL,
  provider text NOT NULL,
  status payment_status DEFAULT 'pending',
  payment_reference text UNIQUE NOT NULL,
  phone_number text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id serial PRIMARY KEY,
  order_id integer NOT NULL REFERENCES orders(id),
  reviewer_id uuid NOT NULL REFERENCES users(id),
  reviewee_id uuid NOT NULL REFERENCES users(id),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  type review_type NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deliveries_agency ON deliveries(agency_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);
CREATE INDEX IF NOT EXISTS idx_transactions_order ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(payment_reference);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view seller and agency profiles"
  ON users FOR SELECT
  TO authenticated
  USING (role IN ('seller', 'delivery') AND is_active = true);

-- RLS Policies: Categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies: Products
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Sellers can create products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = seller_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'seller')
  );

CREATE POLICY "Sellers can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.uid() = seller_id)
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.uid() = seller_id);

-- RLS Policies: Orders
CREATE POLICY "Buyers can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view orders for their products"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM products p, jsonb_array_elements(orders.items) AS item
      WHERE p.id = (item->>'productId')::integer
      AND p.seller_id = auth.uid()
    )
  );

CREATE POLICY "Delivery agencies can view assigned orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = delivery_agency_id);

CREATE POLICY "Buyers can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = buyer_id AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'buyer')
  );

CREATE POLICY "Buyers can update own pending orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = buyer_id AND status = 'pending')
  WITH CHECK (auth.uid() = buyer_id);

-- RLS Policies: Deliveries
CREATE POLICY "Delivery agencies can view available deliveries"
  ON deliveries FOR SELECT
  TO authenticated
  USING (
    status = 'available' AND
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'delivery')
  );

CREATE POLICY "Agencies can view accepted deliveries"
  ON deliveries FOR SELECT
  TO authenticated
  USING (auth.uid() = agency_id);

CREATE POLICY "Agencies can update accepted deliveries"
  ON deliveries FOR UPDATE
  TO authenticated
  USING (auth.uid() = agency_id)
  WITH CHECK (auth.uid() = agency_id);

-- RLS Policies: Transactions
CREATE POLICY "Users can view related transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = transactions.order_id
      AND o.buyer_id = auth.uid()
    )
  );

-- RLS Policies: Reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Buyers can create reviews for completed orders"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM orders
      WHERE id = order_id
      AND buyer_id = auth.uid()
      AND status = 'delivered'
    )
  );

-- Insert default categories
INSERT INTO categories (name, slug, icon, description) VALUES
  ('Vegetables', 'vegetables', '🥬', 'Fresh vegetables and greens'),
  ('Fruits', 'fruits', '🍎', 'Seasonal fruits'),
  ('Grains & Cereals', 'grains-cereals', '🌾', 'Rice, corn, wheat, and more'),
  ('Livestock', 'livestock', '🐄', 'Cattle, goats, sheep'),
  ('Poultry', 'poultry', '🐔', 'Chickens, ducks, eggs'),
  ('Dairy', 'dairy', '🥛', 'Milk, cheese, butter'),
  ('Roots & Tubers', 'roots-tubers', '🥔', 'Cassava, yams, potatoes'),
  ('Spices & Herbs', 'spices-herbs', '🌿', 'Fresh and dried spices')
ON CONFLICT (slug) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  order_num text;
BEGIN
  order_num := 'TRB' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('orders_id_seq')::text, 6, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();

-- Function to update seller/agency ratings
CREATE OR REPLACE FUNCTION update_user_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET 
    rating = (
      SELECT AVG(rating)::numeric(3,2)
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM reviews
      WHERE reviewee_id = NEW.reviewee_id
    )
  WHERE id = NEW.reviewee_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rating_after_review AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_user_rating();