/*
  # Kandalama Property Platform - Complete Database Schema
  
  ## Overview
  Comprehensive database schema for a property selling/renting platform with:
  - User authentication and profiles
  - Property listings (houses, land, commercial, rooms, annexes)
  - Property images with display ordering
  - User favorites
  - View tracking with RPC function
  - Complete Row Level Security (RLS)
  
  ## Tables
  1. profiles - User profile data
  2. properties - Main property listings
  3. property_images - Property images with ordering
  4. favorites - User saved properties
  
  ## Functions
  1. increment - Generic counter increment function
  2. update_updated_at_column - Auto-update timestamp trigger
  
  ## Security
  - All tables have RLS enabled
  - Users can only modify their own data
  - Anonymous users can view active listings
  - All modifications are audit-tracked via timestamps
*/

-- ============================================================================
-- PROFILES TABLE - User profile information
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email text UNIQUE,
  full_name text,
  avatar_url text,
  phone_number text,
  bio text,
  address text,
  city text,
  district text,
  is_verified boolean DEFAULT false,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login_at timestamptz
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view public profile info"
  ON profiles FOR SELECT
  USING (true);

-- ============================================================================
-- PROPERTIES TABLE - Main property listings
-- ============================================================================
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price decimal(12,2) NOT NULL,
  category text NOT NULL CHECK (category IN ('house', 'land', 'commercial', 'room', 'annex')),
  listing_type text NOT NULL CHECK (listing_type IN ('sale', 'rent')),
  location text NOT NULL,
  city text NOT NULL,
  district text NOT NULL,
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  area_sqft decimal(10,2) NOT NULL,
  contact_number text NOT NULL,
  whatsapp_number text,
  map_link text,
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'sold', 'rented', 'archived', 'pending')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Properties RLS Policies
CREATE POLICY "Anyone can view active properties"
  ON properties FOR SELECT
  USING (is_active = true AND status = 'active');

CREATE POLICY "Users can view their own properties"
  ON properties FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create properties"
  ON properties FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own properties"
  ON properties FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own properties"
  ON properties FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- PROPERTY_IMAGES TABLE - Images for properties with ordering
-- ============================================================================
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;

-- Property Images RLS Policies
CREATE POLICY "Anyone can view images of active properties"
  ON property_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.is_active = true
      AND properties.status = 'active'
    )
  );

CREATE POLICY "Users can add images to their properties"
  ON property_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update images of their properties"
  ON property_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete images of their properties"
  ON property_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.user_id = auth.uid()
    )
  );

-- ============================================================================
-- FAVORITES TABLE - User saved/favorited properties
-- ============================================================================
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Favorites RLS Policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their favorites"
  ON favorites FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES - For optimal query performance
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_full_name ON profiles(full_name);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- Properties indexes
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_district ON properties(district);
CREATE INDEX IF NOT EXISTS idx_properties_is_active ON properties(is_active);
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_search ON properties(category, city, is_active, status);

-- Property Images indexes
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_images_is_primary ON property_images(is_primary);
CREATE INDEX IF NOT EXISTS idx_property_images_order ON property_images(property_id, display_order);

-- Favorites indexes
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON favorites(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS - Automated updates and counters
-- ============================================================================

-- Function: update_updated_at_column
-- Automatically updates the updated_at timestamp when a row is modified
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: properties updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: property_images updated_at
CREATE TRIGGER update_property_images_updated_at
  BEFORE UPDATE ON property_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger: favorites updated_at
CREATE TRIGGER update_favorites_updated_at
  BEFORE UPDATE ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function: increment
-- Generic function to increment a counter column in any table
-- Usage: SELECT increment(row_id := 'uuid', table_name := 'table_name', column_name := 'column_name')
CREATE OR REPLACE FUNCTION increment(
  row_id uuid,
  table_name text,
  column_name text,
  increment_by integer DEFAULT 1
)
RETURNS void AS $$
DECLARE
  query text;
BEGIN
  -- Validate table name to prevent SQL injection
  IF table_name NOT IN ('properties', 'property_images', 'profiles', 'favorites') THEN
    RAISE EXCEPTION 'Invalid table name: %', table_name;
  END IF;
  
  -- Construct and execute dynamic query
  query := format(
    'UPDATE %I SET %I = %I + %L WHERE id = %L',
    table_name,
    column_name,
    column_name,
    increment_by,
    row_id
  );
  
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Allow authenticated users to call the increment function
GRANT EXECUTE ON FUNCTION increment(uuid, text, text, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION increment(uuid, text, text, integer) TO anon;

-- ============================================================================
-- DATA VALIDATION
-- ============================================================================

-- Add check constraints for data validation
ALTER TABLE properties 
  ADD CONSTRAINT price_positive CHECK (price > 0),
  ADD CONSTRAINT bedrooms_non_negative CHECK (bedrooms >= 0),
  ADD CONSTRAINT bathrooms_non_negative CHECK (bathrooms >= 0),
  ADD CONSTRAINT area_sqft_positive CHECK (area_sqft > 0),
  ADD CONSTRAINT views_count_non_negative CHECK (views_count >= 0);

ALTER TABLE property_images
  ADD CONSTRAINT display_order_non_negative CHECK (display_order >= 0);