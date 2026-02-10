'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import FilterSidebar from '@/components/FilterSidebar';
import { supabase, Property } from '@/lib/supabase';
import dummyProperties from '@/lib/dummyData';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

export default function PropertiesPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  async function fetchProperties() {
    try {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images(image_url, is_primary, display_order)
        `)
        .eq('is_active', true);

      const category = searchParams.get('category');
      if (category) {
        query = query.eq('category', category);
      }

      const featured = searchParams.get('featured');
      if (featured === 'true') {
        query = query.eq('is_featured', true);
      }

      const { data } = await query
        .order('created_at', { ascending: false })
        .limit(50);

      if (data && data.length > 0) {
        setProperties(data as any);
      } else if (process.env.NODE_ENV === 'development') {
        setProperties(dummyProperties as any);
      }
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
            <div>
              <h1 className="text-3xl font-bold">Properties</h1>
              <p className="text-gray-600 mt-1">
                {properties.length} properties found
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
            <FilterSidebar />
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
