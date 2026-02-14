import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// USER PROFILE TYPE
// ============================================================================
export type Profile = {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  phone_number?: string;
  bio?: string;
  address?: string;
  city?: string;
  district?: string;
  is_verified: boolean;
  verified_at?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
};

// ============================================================================
// PROPERTY LISTING TYPES
// ============================================================================
export type PropertyCategory = 'house' | 'land' | 'commercial' | 'room' | 'annex';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'active' | 'sold' | 'rented' | 'archived' | 'pending';

export type Property = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: PropertyCategory;
  listing_type: ListingType;
  location: string;
  city: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  contact_number: string;
  whatsapp_number?: string;
  map_link?: string;
  is_featured: boolean;
  is_active: boolean;
  views_count: number;
  status: PropertyStatus;
  created_at: string;
  updated_at: string;
  property_images?: PropertyImage[];
};

export type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// ============================================================================
// USER FAVORITES TYPE
// ============================================================================
export type Favorite = {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  updated_at: string;
};
