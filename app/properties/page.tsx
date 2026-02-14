'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import FilterSidebar from '@/components/FilterSidebar';
import { supabase, Property } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PropertiesPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  async function fetchProperties() {
    try {
      console.log('Fetching properties with params:', {
        listing_type: searchParams.get('listing_type'),
        category: searchParams.get('category'),
        district: searchParams.get('district'),
        minPrice: searchParams.get('minPrice'),
        maxPrice: searchParams.get('maxPrice'),
        location: searchParams.get('location'),
        bedrooms: searchParams.get('bedrooms'),
        bathrooms: searchParams.get('bathrooms'),
        search: searchParams.get('search'),
      });

      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images(image_url, is_primary, display_order)
        `)
        .eq('is_active', true);

      // Listing type filter
      const listingType = searchParams.get('listing_type');
      if (listingType && listingType !== 'all') {
        console.log('Applying listing_type filter:', listingType);
        query = query.eq('listing_type', listingType);
      }

      // Category filter
      const category = searchParams.get('category');
      if (category && category !== 'all') {
        console.log('Applying category filter:', category);
        query = query.eq('category', category);
      }

      // Price range filter
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      if (minPrice) {
        console.log('Applying minPrice filter:', minPrice);
        query = query.gte('price', parseInt(minPrice));
      }
      if (maxPrice) {
        console.log('Applying maxPrice filter:', maxPrice);
        query = query.lte('price', parseInt(maxPrice));
      }

      // Bedrooms filter
      const bedrooms = searchParams.get('bedrooms');
      if (bedrooms && bedrooms !== 'any') {
        console.log('Applying bedrooms filter:', bedrooms);
        query = query.gte('bedrooms', parseInt(bedrooms));
      }

      // Bathrooms filter
      const bathrooms = searchParams.get('bathrooms');
      if (bathrooms && bathrooms !== 'any') {
        console.log('Applying bathrooms filter:', bathrooms);
        query = query.gte('bathrooms', parseInt(bathrooms));
      }

      // District filter
      const district = searchParams.get('district');
      if (district && district !== 'all') {
        console.log('Applying district filter:', district);
        query = query.ilike('district', district);
      }

      // Featured filter
      const featured = searchParams.get('featured');
      if (featured === 'true') {
        console.log('Applying featured filter');
        query = query.eq('is_featured', true);
      }

      // Location filter - combine into single OR condition
      const location = searchParams.get('location');
      const search = searchParams.get('search');
      
      if (location && location.trim()) {
        console.log('Applying location filter:', location);
        query = query.or(`location.ilike.%${location}%,city.ilike.%${location}%,district.ilike.%${location}%`);
      } else if (search && search.trim()) {
        // Search filter - combine all searchable fields
        console.log('Applying search filter:', search);
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location.ilike.%${search}%,city.ilike.%${search}%,district.ilike.%${search}%`);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Results returned:', data?.length || 0, 'properties');
      setProperties(data as any || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col sm:flex-row sm:items-end sm:gap-2">
              <h1 className="text-lg sm:text-base md:text-2xl font-bold text-blue-950">{t('properties.title')}</h1>
              <p className="text-gray-600 text-xs sm:text-sm sm:ml-2 sm:mb-1">
                ( <span className="text-blue-800">{properties.length}</span> properties found )
              </p>
            </div>
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block w-full lg:w-80 flex-shrink-0`}
          >
            <FilterSidebar isOpen={showFilters} onClose={() => setShowFilters(false)} />
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-64 bg-gray-200 animate-pulse rounded-lg"
                  ></div>
                ))}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-gray-100 rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4">
                  <SlidersHorizontal className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    horizontal={true}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
