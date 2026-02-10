/*
  # Property Platform Database Schema

  ## Overview
  Complete database schema for a property selling and renting platform supporting
  houses, lands, commercial properties, rooms, and annexes.

  ## New Tables

  1. **properties**
     - `id` (uuid, primary key) - Unique property identifier
     - `user_id` (uuid, foreign key) - Property owner/poster
     - `title` (text) - Property title
     - `description` (text) - Detailed description
     - `price` (decimal) - Property price
     - `category` (text) - Property category (house, land, commercial, room, annex)
     - `listing_type` (text) - For sale or rent
     - `location` (text) - Property location
     - `city` (text) - City name
     - `district` (text) - District name
     - `bedrooms` (integer) - Number of bedrooms (nullable)
     - `bathrooms` (integer) - Number of bathrooms (nullable)
     - `area_sqft` (decimal) - Area in square feet
     - `contact_number` (text) - Contact phone number
     - `is_featured` (boolean) - Featured listing flag
     - `is_active` (boolean) - Active listing flag
     - `views_count` (integer) - Number of views
     - `created_at` (timestamptz) - Creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp

  2. **property_images**
     - `id` (uuid, primary key) - Unique image identifier
     - `property_id` (uuid, foreign key) - Associated property
     - `image_url` (text) - Image URL
     - `is_primary` (boolean) - Primary image flag
     - `display_order` (integer) - Display order
     - `created_at` (timestamptz) - Creation timestamp

  3. **favorites**
     - `id` (uuid, primary key) - Unique favorite identifier
     - `user_id` (uuid, foreign key) - User who favorited
     - `property_id` (uuid, foreign key) - Favorited property
     - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Users can only edit their own properties
  - Anyone can view active properties
  - Users can manage their own favorites
*/

-- Create properties table
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
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create property_images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, property_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_user_id ON properties(user_id);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_is_active ON properties(is_active);
CREATE INDEX IF NOT EXISTS idx_properties_is_featured ON properties(is_featured);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON favorites(property_id);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Properties policies
CREATE POLICY "Anyone can view active properties"
  ON properties FOR SELECT
  USING (is_active = true);

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

-- Property images policies
CREATE POLICY "Anyone can view property images"
  ON property_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = property_images.property_id
      AND properties.is_active = true
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

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();