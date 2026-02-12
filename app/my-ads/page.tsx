'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Property } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Edit2,
  Trash2,
  Plus,
  ChevronLeft,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function MyAdsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProperties();
  }, []);

  async function fetchUserProperties() {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/my-ads');
        return;
      }

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(image_url, is_primary, display_order)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setProperties((data as any) || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      alert('Failed to load your ads. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProperty(propertyId: string) {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this property? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    setDeleting(propertyId);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (error) throw error;

      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      alert('Property deleted successfully!');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setDeleting(null);
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link href="/properties">
            <Button variant="outline" className="mb-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to All Properties
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-blue-950 mb-2">My Advertisements</h1>
          <p className="text-gray-600">Manage and edit your property listings</p>
        </div>

        {properties.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">No advertisements yet</h3>
              <p className="text-gray-600 mb-6">
                Start by creating your first property listing
              </p>
              <Link href="/post-ad">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Ad
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => {
              const primaryImage = (property as any).property_images?.find(
                (img: any) => img.is_primary
              )?.image_url || (property as any).property_images?.[0]?.image_url;

              return (
                <Card key={property.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="md:w-48 h-40 flex-shrink-0 bg-gray-200">
                      <img
                        src={primaryImage || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1600'}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {property.location}, {property.city}, {property.district}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-blue-600 capitalize">
                            For {property.listing_type}
                          </Badge>
                          <Badge variant="outline" className="capitalize">
                            {property.category}
                          </Badge>
                          {property.is_featured && (
                            <Badge className="bg-yellow-600">Featured</Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center gap-2">
                            <Bed className="h-4 w-4 text-gray-600" />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                        )}
                        {property.bathrooms > 0 && (
                          <div className="flex items-center gap-2">
                            <Bath className="h-4 w-4 text-gray-600" />
                            <span>{property.bathrooms} Baths</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Maximize className="h-4 w-4 text-gray-600" />
                          <span>{property.area_sqft} sqft</span>
                        </div>
                        <div className="text-gray-600 text-xs">
                          Posted: {new Date(property.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPrice(property.price)}
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/properties/${property.id}`}>
                            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                              View
                            </Button>
                          </Link>
                          <Link href={`/edit-ad/${property.id}`}>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              <Edit2 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDeleteProperty(property.id)}
                            disabled={deleting === property.id}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deleting === property.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}

            <div className="mt-8">
              <Link href="/post-ad">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Post New Ad
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
