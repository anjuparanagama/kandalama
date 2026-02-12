'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import FilterSidebar from '@/components/FilterSidebar';
import { supabase, Property } from '@/lib/supabase';
import dummyProperties from '@/lib/dummyData';
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
