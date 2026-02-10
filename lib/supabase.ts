import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Property = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: 'house' | 'land' | 'commercial' | 'room' | 'annex';
  listing_type: 'sale' | 'rent';
  location: string;
  city: string;
  district: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  contact_number: string;
  is_featured: boolean;
  is_active: boolean;
  views_count: number;
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
};

export type Favorite = {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
};
