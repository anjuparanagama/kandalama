'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

export interface IFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  listing_type: string;
  location: string;
  city: string;
  district: string;
  bedrooms: string;
  bathrooms: string;
  area_sqft: string;
  contact_number: string;
  map_link: string;
  whatsapp_number: string;
}

interface UsePostAdReturn {
  formData: IFormData;
  step: number;
  loading: boolean;
  authLoading: boolean;
  uploadProgress: number;
  images: File[];
  previews: string[];
  errors: Record<string, string>;
  showAlert: boolean;
  uploadingToCloudinary: boolean;
  updateFormData: (field: string, value: string) => void;
  validateStep: (currentStep: number) => boolean;
  validateAllSteps: () => boolean;
  isStepValid: (currentStep: number) => boolean;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setImages: (images: File[] | ((prev: File[]) => File[])) => void;
  setPreviews: (previews: string[] | ((prev: string[]) => string[])) => void;
  setErrors: (errors: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
}

const initialFormData: IFormData = {
  title: '',
  description: '',
  price: '',
  category: '',
  listing_type: '',
  location: '',
  city: '',
  district: '',
  bedrooms: '',
  bathrooms: '',
  area_sqft: '',
  contact_number: '',
  map_link: '',
  whatsapp_number: '',
};

export const usePostAd = (): UsePostAdReturn => {
  const router = useRouter();
  const isSubmittingRef = useRef(false);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<IFormData>(initialFormData);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { uploadMultiple, uploading: uploadingToCloudinary } = useCloudinaryUpload({
    onProgress: (current, total) => {
      setUploadProgress(Math.round((current / total) * 100));
    },
  });

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login?redirect=/post-ad');
          return;
        }
        setAuthLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login?redirect=/post-ad');
      }
    };
    checkAuth();
  }, [router]);

  const updateFormData = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const validateStep = useCallback((currentStep: number): boolean => {
    const { title, category, listing_type, price, description, area_sqft, location, district, city } = formData;
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      // Validate Step 1: Basic Information
      if (!title.trim()) {
        newErrors.title = 'Property title is required';
      }
      if (!category) {
        newErrors.category = 'Property type is required';
      }
      if (!listing_type) {
        newErrors.listing_type = 'Listing type is required';
      }
      if (!price || parseFloat(price) <= 0) {
        newErrors.price = 'Valid price is required';
      }
    } else if (currentStep === 2) {
      // Validate Step 2: Property Details
      if (!description.trim()) {
        newErrors.description = 'Description is required';
      }
      if (!area_sqft || parseFloat(area_sqft) <= 0) {
        newErrors.area_sqft = 'Valid area is required';
      }
      if (!location.trim()) {
        newErrors.location = 'Location is required';
      }
      if (!district) {
        newErrors.district = 'District is required';
      }
      if (!city) {
        newErrors.city = 'City is required';
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setShowAlert(true);
      return false;
    }
    setShowAlert(false);
    return true;
  }, [formData]);

  const isStepValid = useCallback((currentStep: number): boolean => {
    const { title, category, listing_type, price, description, area_sqft, location, district, city } = formData;

    if (currentStep === 1) {
      return !!(title.trim() && category && listing_type && price && parseFloat(price) > 0);
    } else if (currentStep === 2) {
      return !!(description.trim() && area_sqft && parseFloat(area_sqft) > 0 && location.trim() && district && city);
    }

    return true;
  }, [formData]);

  const validateAllSteps = useCallback((): boolean => {
    const { title, category, listing_type, price, description, area_sqft, location, district, city, contact_number } = formData;
    const newErrors: Record<string, string> = {};

    // Validate Step 1 fields
    if (!title.trim()) {
      newErrors.title = 'Property title is required';
    }
    if (!category) {
      newErrors.category = 'Property type is required';
    }
    if (!listing_type) {
      newErrors.listing_type = 'Listing type is required';
    }
    if (!price || parseFloat(price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    // Validate Step 2 fields
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!area_sqft || parseFloat(area_sqft) <= 0) {
      newErrors.area_sqft = 'Valid area is required';
    }
    if (!location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!district) {
      newErrors.district = 'District is required';
    }
    if (!city) {
      newErrors.city = 'City is required';
    }

    // Validate Step 3 fields
    if (!contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    }

    if (images.length === 0) {
      newErrors.images = 'At least one property image is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowAlert(true);
      return false;
    }

    setErrors({});
    setShowAlert(false);
    return true;
  }, [formData, images.length]);

  const nextStep = useCallback(() => {
    if (!isStepValid(step)) {
      validateStep(step);
      return;
    }
    if (step < 3) {
      setErrors({});
      setShowAlert(false);
      setStep(step + 1);
    }
  }, [step, isStepValid, validateStep]);

  const prevStep = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all steps before submission
    if (!validateAllSteps()) {
      return;
    }

    // Prevent multiple submissions
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setUploadProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login?redirect=/post-ad');
        return;
      }

      // 1. Create property first
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert([
          {
            user_id: user.id,
            title: formData.title,
            description: formData.description,
            price: parseFloat(formData.price),
            category: formData.category,
            listing_type: formData.listing_type,
            location: formData.location,
            city: formData.city,
            district: formData.district,
            bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
            bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : 0,
            area_sqft: parseFloat(formData.area_sqft),
            contact_number: formData.contact_number,
            whatsapp_number: formData.whatsapp_number || null,
            map_link: formData.map_link || null,
          },
        ])
        .select()
        .single();

      if (propertyError) throw propertyError;

      // 2. Upload images to Cloudinary and save URLs to database
      if (images.length > 0) {
        try {
          const imageUrls = await uploadMultiple(images);

          // 3. Save image URLs to property_images table
          const propertyImages = imageUrls.map((url, index) => ({
            property_id: property.id,
            image_url: url,
            is_primary: index === 0,
            display_order: index,
          }));

          const { error: imagesError } = await supabase
            .from('property_images')
            .insert(propertyImages);

          if (imagesError) {
            console.error('Error saving image references:', imagesError);
            // Continue anyway - property was created
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          // Continue - property was created even if images failed
          toast.warning('Property created successfully, but image upload failed. You can add images later by editing the property.', { duration: 5000 });
        }
      }

      toast.success('Property posted successfully!', { duration: 3000 });
      router.push(`/properties/${property.id}`);
    } catch (error) {
      console.error('Error posting ad:', error);
      toast.error('Failed to post advertisement. Please try again.', { duration: 5000 });
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  return {
    formData,
    step,
    loading,
    authLoading,
    uploadProgress,
    images,
    previews,
    errors,
    showAlert,
    uploadingToCloudinary,
    updateFormData,
    validateStep,
    validateAllSteps,
    isStepValid,
    nextStep,
    prevStep,
    handleSubmit,
    setImages,
    setPreviews,
    setErrors,
  };
};
