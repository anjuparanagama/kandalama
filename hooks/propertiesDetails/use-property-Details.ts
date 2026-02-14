import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Property, PropertyImage } from '@/lib/supabase';

export function usePropertyDetails(propertyId: string) {
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [showLightbox, setShowLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [seller, setSeller] = useState<{ name?: string; avatar_url?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (propertyId) {
      fetchCurrentUser();
      fetchProperty(propertyId);
    }
  }, [propertyId]);

  async function fetchCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({ id: user.id });
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }

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
        
        // Check if current user is the owner
        if (currentUser && (propertyData as any).user_id === currentUser.id) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
        
        const sortedImages = (propertyData as any).property_images?.sort(
          (a: PropertyImage, b: PropertyImage) => a.display_order - b.display_order
        ) || [];
        
        // limit to max 6 images (1 main + 5 thumbnails)
        setImages((sortedImages as PropertyImage[]).slice(0, 6));

        // Increment views count
        await supabase.rpc('increment', {
          row_id: id,
          table_name: 'properties',
          column_name: 'views_count',
        });

        // Fetch seller profile from 'profiles' table (if exists)
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

        // Fetch similar properties
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
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProperty() {
    if (!property) return;

    const confirmDelete = window.confirm(
      'Are you sure you want to delete this property? This action cannot be undone.'
    );

    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (error) throw error;

      alert('Property deleted successfully!');
      router.push('/properties');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete property. Please try again.');
    } finally {
      setIsDeleting(false);
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

  return {
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
  };
}
