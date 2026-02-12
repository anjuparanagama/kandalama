'use client';

import { Property } from '@/lib/supabase';
import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface PropertyCardProps {
  property: Property & { property_images?: Array<{ image_url: string }> };
  horizontal?: boolean;
}

export default function PropertyCard({ property, horizontal = false }: PropertyCardProps) {
  const { t } = useTranslation();
  const primaryImage = property.property_images?.[0]?.image_url || 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (horizontal) {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-80 h-64 md:h-auto">
            <img
              src={primaryImage}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 bg-white/90 hover:bg-white"
            >
              <Heart className="h-5 w-5" />
            </Button>
            {property.is_featured && (
              <Badge className="absolute top-3 left-3 bg-blue-600">
                Featured
              </Badge>
            )}
          </div>
          <CardContent className="flex-1 p-6">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <Link href={`/properties/${property.id}`}>
                  <h3 className="text-xl font-semibold hover:text-blue-600 transition line-clamp-2">
                    {property.title}
                  </h3>
                </Link>
                <Badge variant="outline" className="capitalize shrink-0">
                  For {property.listing_type}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(property.price)}
              </p>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-4 w-4 mr-1" />
                {property.city}, {property.district}
              </div>
              <p className="text-gray-600 line-clamp-2">
                {property.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {property.bedrooms > 0 && (
                  <div className="flex items-center">
                    <Bed className="h-4 w-4 mr-1" />
                    {property.bedrooms} Beds
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center">
                    <Bath className="h-4 w-4 mr-1" />
                    {property.bathrooms} Baths
                  </div>
                )}
                <div className="flex items-center">
                  <Maximize className="h-4 w-4 mr-1" />
                  {property.area_sqft} sqft
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative h-56 overflow-hidden">
        <img
          src={primaryImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 right-3 bg-white/90 hover:bg-white"
        >
          <Heart className="h-5 w-5" />
        </Button>
        {property.is_featured && (
          <Badge className="absolute top-3 left-3 bg-blue-600">
            Featured
          </Badge>
        )}
        <Badge
          variant="secondary"
          className="absolute bottom-3 left-3 capitalize"
        >
          For {property.listing_type}
        </Badge>
      </div>
      <CardContent className="p-4 space-y-3">
        <Link href={`/properties/${property.id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600 transition line-clamp-2">
            {property.title}
          </h3>
        </Link>
        <p className="text-2xl font-bold text-blue-600">
          {formatPrice(property.price)}
        </p>
        <div className="flex items-center text-gray-600 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          {property.city}
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 pt-2 border-t">
          {property.bedrooms > 0 && (
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              {property.bedrooms}
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms}
            </div>
          )}
          <div className="flex items-center">
            <Maximize className="h-4 w-4 mr-1" />
            {property.area_sqft} sqft
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
