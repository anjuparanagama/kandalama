'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase, Property, PropertyImage } from '@/lib/supabase';
import dummyProperties from '@/lib/dummyData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PropertyCard from '@/components/PropertyCard';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Phone,
  Heart,
  Share2,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import Link from 'next/link';

export default function PropertyDetailsPage() {
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [seller, setSeller] = useState<{ name?: string; avatar_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  async function fetchProperty(id: string) {
    try {
      const { data: propertyData } = await supabase
        .from('properties')
        .select(`
          *,
          property_images(*)
        `)
        .eq('id', id)
        .maybeSingle();
      if (propertyData) {
        setProperty(propertyData as any);
        const sortedImages = (propertyData as any).property_images?.sort(
          (a: PropertyImage, b: PropertyImage) => a.display_order - b.display_order
        ) || [];
          // limit to max 6 images (1 main + 5 thumbnails)
          setImages((sortedImages as PropertyImage[]).slice(0, 6));

        await supabase.rpc('increment', {
          row_id: id,
          table_name: 'properties',
          column_name: 'views_count',
        });

        // try to fetch seller profile from a 'profiles' table (if exists)
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, avatar_url')
            .eq('id', propertyData.user_id)
            .maybeSingle();
          if (profile) {
            setSeller({ name: (profile as any).full_name, avatar_url: (profile as any).avatar_url });
          }
        } catch (_) {
          // ignore if profiles table doesn't exist
        }

        const { data: similar } = await supabase
          .from('properties')
          .select(`
            *,
            property_images(image_url, is_primary, display_order)
          `)
          .eq('category', propertyData.category)
          .eq('is_active', true)
          .neq('id', id)
          .limit(4);

        if (similar) setSimilarProperties(similar as any);
      } else if (process.env.NODE_ENV === 'development') {
        const demo = dummyProperties.find((p) => p.id === id);
        if (demo) {
          setProperty(demo as any);
            // limit to max 6 images (1 main + 5 thumbnails)
            setImages(((demo.property_images || []) as PropertyImage[]).slice(0, 6));
          setSeller({ name: (demo as any).seller_name, avatar_url: (demo as any).seller_avatar });
          setSimilarProperties(
            dummyProperties.filter((p) => p.category === demo.category && p.id !== demo.id).slice(0, 4) as any
          );
        }
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  }

  const nextImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    if (images.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

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

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Property not found</h2>
          <Link href="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const defaultImage = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1600';
  const currentImage = images[currentImageIndex]?.image_url || defaultImage;

  // thumbnails: exclude the current main image and show up to 5 slots
  const otherImages = images.filter((_, i) => i !== currentImageIndex).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/properties">
            <Button variant="outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative h-96 md:h-[500px] bg-gray-900">
                <img
                  src={currentImage}
                  alt={property.title}
                  className="w-full h-full object-cover cursor-zoom-in"
                  onClick={() => setShowLightbox(true)}
                />
                <div className="absolute top-3 left-3 text-white text-sm px-2 py-1 pointer-events-none">
                  කණ්ඩලම.Lk
                </div>
                {images.length > 1 && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-white/90 hover:bg-white"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-white/90 hover:bg-white"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {otherImages.length > 0 && (
                <div
                  className="p-4 grid gap-2"
                  style={{ gridTemplateColumns: `repeat(${otherImages.length}, minmax(0, 1fr))` }}
                >
                  {otherImages.map((img) => {
                    const realIndex = images.findIndex((i) => i.id === img.id);
                    return (
                      <button
                        key={img.id}
                        onClick={() => {
                          if (realIndex >= 0) setCurrentImageIndex(realIndex);
                          setShowLightbox(true);
                        }}
                        className={`h-20 rounded-lg overflow-hidden border-2 ${
                          realIndex === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                        }`}
                      >
                        <img src={img.image_url} alt={`Thumb`} className="w-full h-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              )}

              {showLightbox && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
                  <div className="absolute inset-0" onClick={() => setShowLightbox(false)} />
                  <div className="relative max-w-[95vw] max-h-[95vh] w-full px-4">
                    <button
                      onClick={() => setShowLightbox(false)}
                      className="absolute top-4 right-4 z-50 bg-black/40 rounded-full p-2"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>

                    <div className="relative flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-2 z-40 bg-black/40 rounded-full p-2"
                      >
                        <ChevronLeft className="h-6 w-6 text-white" />
                      </button>

                      <img
                        src={images[currentImageIndex]?.image_url || currentImage}
                        alt={`Large view ${currentImageIndex + 1}`}
                        className="max-h-[80vh] max-w-full object-contain mx-auto"
                      />
                      <div className="absolute top-6 left-6 text-white text-sm px-3 py-1 pointer-events-none">
                        කණ්ඩලම.Lk
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-2 z-40 bg-black/40 rounded-full p-2"
                      >
                        <ChevronRight className="h-6 w-6 text-white" />
                      </button>
                    </div>

                    {images.length > 1 && (
                      <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto">
                        {images.map((img, idx) => (
                          <button
                            key={img.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(idx);
                            }}
                            className={`w-20 h-20 rounded overflow-hidden border-2 ${
                              idx === currentImageIndex ? 'border-blue-600' : 'border-transparent'
                            }`}
                          >
                            <img src={img.image_url} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
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
                  <h1 className="text-2xl md:text-3xl font-bold mb-1 sm:mb-4">{property.title}</h1>
                  <div className="flex items-center text-gray-600 text-base md:text-2xl mb-1 sm:mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.location}, {property.city}, {property.district}
                  </div>
                  <div className="text-2xl md:text-4xl font-bold text-blue-600">
                    {formatPrice(property.price)}
                  </div>
                </div>

                <div className="border-t pt-0 sm:pt-6">
                  <h2 className="text-xl font-semibold mb-4">Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {property.bedrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Bedrooms</p>
                          <p className="font-semibold">{property.bedrooms}</p>
                        </div>
                      </div>
                    )}
                    {property.bathrooms > 0 && (
                      <div className="flex items-center gap-2">
                        <Bath className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Bathrooms</p>
                          <p className="font-semibold">{property.bathrooms}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Maximize className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-sm text-gray-600">Area</p>
                        <p className="font-semibold">{property.area_sqft} sqft</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4 flex flex-col">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Contact Seller</h3>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {seller?.avatar_url ? (
                      <img src={seller.avatar_url} alt={seller.name || 'Seller'} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{seller?.name || 'Seller'}</div>
                      <div className="text-xs text-gray-500">{property.contact_number}</div>
                    </div>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3">
                    <Phone className="h-4 w-4 mr-2" />
                    {property.contact_number}
                  </Button>
                  {(property as any).whatsapp_number ? (
                    <a
                      href={`https://wa.me/${((property as any).whatsapp_number || '').replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open WhatsApp chat with ${(property as any).whatsapp_number}`}
                    >
                      <Button className="w-full bg-green-500 hover:bg-green-600 py-3 flex items-center justify-center gap-2">
                        <MessageSquare className="h-5 w-5 text-white" />
                        <span className="text-white font-medium">{(property as any).whatsapp_number}</span>
                      </Button>
                    </a>
                  ) : null}
                </div>
                <div className="pt-4 border-t text-sm text-gray-600">
                  <p>
                    <strong>Views:</strong> {property.views_count}
                  </p>
                  <p className="mt-2">
                    <strong>Posted:</strong>{' '}
                    {new Date(property.created_at).toLocaleDateString()}
                  </p>
                </div>
                {(property as any).latitude || (property as any).longitude || property.location ? (
                  <div className="pt-4 border-t">
                    <a
                      href={
                        (property as any).map_link
                          ? (property as any).map_link
                          : (property as any).latitude && (property as any).longitude
                          ? `https://www.google.com/maps?q=${encodeURIComponent(`${(property as any).latitude},${(property as any).longitude}`)}`
                          : `https://www.google.com/maps?q=${encodeURIComponent(`${property.location} ${property.city} ${property.district}`)}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-blue-600 hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {similarProperties.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
