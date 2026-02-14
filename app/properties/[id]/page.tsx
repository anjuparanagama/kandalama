'use client';

import { useParams } from 'next/navigation';
import { useCallback } from 'react';
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
  Edit2,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { usePropertyDetails } from '@/hooks/propertiesDetails/use-property-Details';

export default function PropertyDetailsPage() {
  const { t } = useTranslation();
  const params = useParams();
  
  const {
    property,
    images,
    showLightbox,
    setShowLightbox,
    currentImageIndex,
    setCurrentImageIndex,
    similarProperties,
    seller,
    loading,
    isOwner,
    isDeleting,
    handleDeleteProperty,
    nextImage,
    prevImage,
    formatPrice,
  } = usePropertyDetails(params.id as string);

  const handleShare = useCallback(async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: property?.title || 'Check out this property',
      text: property?.description || 'Check out this amazing property on Kandalama.Lk',
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  }, [property?.title, property?.description]);

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
              <div className="relative h-64 md:h-[500px] bg-gray-900">
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
                <div className="absolute top-4 right-4">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-white/90 hover:bg-white"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              {otherImages.length > 0 && (
                <div
                  className="p-2 sm:p-4 grid gap-1 sm:gap-2"
                  style={{ gridTemplateColumns: `repeat(auto-fit, minmax(60px, 1fr))` }}
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
                        className={`h-14 sm:h-20 rounded-lg overflow-hidden border-2 ${
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
                  <h1 className="text-2xl md:text-3xl font-bold mb-1 sm:mb-3">{property.title}</h1>
                  <div className="flex items-center text-gray-600 text-sm md:text-xl mb-1 sm:mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    {property.location}, {property.city}, {property.district}
                  </div>
                  <div className="text-xl md:text-3xl font-bold text-blue-600 -mb-3 sm:mb-0">
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
                {isOwner && (
                  <div className="space-y-2 border-b pb-4">
                    <Link href={`/edit-ad/${property.id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isDeleting}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Property
                      </Button>
                    </Link>
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={handleDeleteProperty}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? 'Deleting...' : 'Delete Property'}
                    </Button>
                  </div>
                )}
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle-code-icon lucide-message-circle-code text-white">
                          <path d="m10 9-3 3 3 3"/>
                          <path d="m14 15 3-3-3-3"/>
                          <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
                        </svg>
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
