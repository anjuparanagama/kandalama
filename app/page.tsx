'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, Maximize, Building, Home as HomeIcon, DoorOpen } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { supabase, Property } from '@/lib/supabase';

export default function Home() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [latestProperties, setLatestProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchProperties();
    fetchCategoryCounts();
  }, []);

  async function fetchProperties() {
    try {
      const { data: featured } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(image_url, is_primary, display_order)
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(3);

      const { data: latest } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(image_url, is_primary, display_order)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (featured) setFeaturedProperties(featured as any);
      if (latest) setLatestProperties(latest as any);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCategoryCounts() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('category')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching category counts:', error);
        return;
      }

      const counts: Record<string, number> = {};
      (data || []).forEach((row: any) => {
        const cat = row.category || 'unknown';
        counts[cat] = (counts[cat] || 0) + 1;
      });

      setCategoryCounts(counts);
    } catch (err) {
      console.error('Error fetching category counts:', err);
    }
  }

  const categories = [
    {
      key: 'house',
      title: 'Houses',
      icon: HomeIcon,
      href: '/properties?category=house',
    },
    {
      key: 'land',
      title: 'Land',
      icon: Maximize,
      href: '/properties?category=land',
    },
    {
      key: 'commercial',
      title: 'Commercial',
      icon: Building,
      href: '/properties?category=commercial',
    },
    {
      key: 'room',
      title: 'Rooms',
      icon: DoorOpen,
      href: '/properties?category=room',
    },
    {
      key: 'annex',
      title: 'Annex',
      icon: Building2,
      href: '/properties?category=annex',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-[#003566] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Dream Property
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover the best properties for sale and rent in Sri Lanka
          </p>
          <Link href="/properties">
            <Button size="lg" className="bg-[#ffc300] text-black hover:bg-[#ffd60a] text-lg px-8 py-6">
              Browse Properties
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              icon={category.icon}
              href={category.href}
              count={categoryCounts[category.key] ?? 0}
            />
          ))}
        </div>
      </section>

      {!loading && featuredProperties.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold">Featured Properties</h2>
              <Link href="/properties?featured=true">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {!loading && latestProperties.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Latest Listings</h2>
            <Link href="/properties">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </section>
      )}

      {loading && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </section>
      )}

      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to List Your Property?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Reach thousands of potential buyers and renters
          </p>
          <Link href="/post-ad">
            <Button size="lg" className="bg-[#ffb703] hover:bg-[#e6a103] text-black text-lg px-8 py-6">
              Post Your Ad Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
