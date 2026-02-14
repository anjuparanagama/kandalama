'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDistrictsByLanguage } from '../../constant/district';
import { getCitiesByDistrict } from '@/constant/cities';
import { Upload, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { usePostAd } from '@/hooks/postAd/use-postAd';

export default function PostAdPage() {
  const { t, i18n } = useTranslation();
  const districts = getDistrictsByLanguage(i18n.language);
  const {
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
    nextStep,
    prevStep,
    handleSubmit,
    setImages,
    setPreviews,
    setErrors,
  } = usePostAd();

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {authLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Verifying your login...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <h1 className="text-lg md:text-2xl font-bold text-blue-900 text-center sm:text-start ">{t('postAd.title')}</h1>
              <p className="text-gray-500 text-xs sm:text-base text-center sm:text-start">
                Fill in the details to list your property
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between px-8 sm:px-0 ">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold ${
                        s <= step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div
                        className={`h-1 w-20 sm:w-24 md:w-48 mx-2 ${
                          s < step ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-sm sm:text-base px-4 sm:px-0">
                <span className={step >= 1 ? 'text-blue-600 font-semibold' : ''}>
                  Basic Info
                </span>
                <span className={step >= 2 ? 'text-blue-600 font-semibold' : ''}>
                  Details
                </span>
                <span className={step >= 3 ? 'text-blue-600 font-semibold' : ''}>
                  Contact
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl -mb-3 sm:mb-0 text-center sm:text-left text-blue-950">
                {step === 1 && 'Basic Information'}
                {step === 2 && 'Property Details'}
                {step === 3 && 'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {showAlert && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-semibold">Please fill all required fields</p>
                </div>
              )}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Beautiful House in Colombo"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                      required
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Property Type *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => updateFormData('category', value)}
                      required
                    >
                      <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="land">Land</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="room">Room</SelectItem>
                        <SelectItem value="annex">Annex</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="listing_type">Listing Type *</Label>
                    <Select
                      value={formData.listing_type}
                      onValueChange={(value) =>
                        updateFormData('listing_type', value)
                      }
                      required
                    >
                      <SelectTrigger className={errors.listing_type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select listing type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.listing_type && <p className="text-red-500 text-sm">{errors.listing_type}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price (LKR) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g., 15000000"
                      value={formData.price}
                      onChange={(e) => updateFormData('price', e.target.value)}
                      required
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property..."
                      rows={6}
                      value={formData.description}
                      onChange={(e) =>
                        updateFormData('description', e.target.value)
                      }
                      required
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="e.g., 3"
                        value={formData.bedrooms}
                        onChange={(e) =>
                          updateFormData('bedrooms', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        placeholder="e.g., 2"
                        value={formData.bathrooms}
                        onChange={(e) =>
                          updateFormData('bathrooms', e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area_sqft">Area (sqft) *</Label>
                    <Input
                      id="area_sqft"
                      type="number"
                      placeholder="e.g., 2000"
                      value={formData.area_sqft}
                      onChange={(e) =>
                        updateFormData('area_sqft', e.target.value)
                      }
                      required
                      className={errors.area_sqft ? 'border-red-500' : ''}
                    />
                    {errors.area_sqft && <p className="text-red-500 text-sm">{errors.area_sqft}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Nugegoda"
                      value={formData.location}
                      onChange={(e) =>
                        updateFormData('location', e.target.value)
                      }
                      required
                      className={errors.location ? 'border-red-500' : ''}
                    />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => {
                          updateFormData('district', value);
                          updateFormData('city', '');
                        }}
                        required
                      >
                        <SelectTrigger className={errors.district ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {districts.map((district) => (
                            <SelectItem key={district} value={district}>{district}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => updateFormData('city', value)}
                        disabled={!formData.district}
                        required
                      >
                        <SelectTrigger className={`${!formData.district ? 'opacity-50 cursor-not-allowed' : ''} ${errors.city ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder={!formData.district ? 'Select district first' : 'Select city'} />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.district && getCitiesByDistrict(formData.district).map((city) => (
                            <SelectItem key={city} value={city}>{city}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact Number *</Label>
                    <Input
                      id="contact_number"
                      type="tel"
                      placeholder="e.g., 0771234567"
                      value={formData.contact_number}
                      onChange={(e) =>
                        updateFormData('contact_number', e.target.value)
                      }
                      className={errors.contact_number ? 'border-red-500' : ''}
                    />
                    {errors.contact_number && <p className="text-red-500 text-sm">{errors.contact_number}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                    <Input
                      id="whatsapp_number"
                      type="tel"
                      placeholder="e.g., 0771234567 (optional)"
                      value={formData.whatsapp_number}
                      onChange={(e) =>
                        updateFormData('whatsapp_number', e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Property Images (max 6) *</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-600 transition cursor-pointer ${
                        errors.images ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      onClick={() => {
                        const el = document.getElementById('image-input');
                        el?.click();
                      }}
                    >
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Click to upload images or drag and drop</p>
                      <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                      <input
                        id="image-input"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = e.target.files;
                          if (!files) return;
                          const selected = Array.from(files);
                          if (images.length + selected.length > 6) {
                            toast.error('You can upload up to 6 images only.', { duration: 3000 });
                            return;
                          }
                          const newPreviews = selected.map((file) => URL.createObjectURL(file));
                          setImages((prev) => [...prev, ...selected]);
                          setPreviews((prev) => [...prev, ...newPreviews]);
                          // Clear images error when user uploads images
                          if (errors.images) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors.images;
                              return newErrors;
                            });
                          }
                          // reset input
                          (e.target as HTMLInputElement).value = '';
                        }}
                      />

                      {previews.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">{previews.length} image{previews.length !== 1 ? 's' : ''} selected</p>
                          <div className="grid grid-cols-3 gap-2">
                            {previews.map((src, idx) => (
                              <div key={idx} className="relative">
                                <img src={src} className="w-full h-24 object-cover rounded-md" />
                                <button
                                  type="button"
                                  onClick={(ev) => {
                                    ev.stopPropagation();
                                    URL.revokeObjectURL(src);
                                    setPreviews((p) => p.filter((_, i) => i !== idx));
                                    setImages((p) => p.filter((_, i) => i !== idx));
                                  }}
                                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {uploadingToCloudinary && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mt-2">Uploading images... {uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                    {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label>Map Location (optional)</Label>
                    <Input
                      placeholder="Google Maps link or address"
                      value={formData.map_link}
                      onChange={(e) => updateFormData('map_link', e.target.value)}
                    />
                    <p className="text-sm text-gray-500">Paste a Google Maps link (preferred) or enter an address to preview.</p>

                    <div className="mt-4 border rounded overflow-hidden">
                      <iframe
                        title="Map preview"
                        src={
                          formData.map_link
                            ? (formData.map_link.includes('output=embed') || formData.map_link.includes('/embed'))
                              ? formData.map_link
                              : `https://www.google.com/maps?q=${encodeURIComponent(formData.map_link)}&output=embed`
                            : `https://www.google.com/maps?q=${encodeURIComponent(`${formData.location} ${formData.city} ${formData.district}`)}&output=embed`
                        }
                        className="w-full h-48 border-0"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <a
                        href={
                          formData.map_link
                            ? formData.map_link
                            : `https://www.google.com/maps?q=${encodeURIComponent(`${formData.location} ${formData.city} ${formData.district}`)}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Open in Google Maps
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          const link = formData.map_link
                            ? formData.map_link
                            : `https://www.google.com/maps?q=${encodeURIComponent(`${formData.location} ${formData.city} ${formData.district}`)}`;
                          navigator.clipboard?.writeText(link);
                          toast.success('Map link copied to clipboard', { duration: 2000 });
                        }}
                        className="text-sm px-3 py-1 border rounded"
                      >
                        Copy Link
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> Make sure all information is
                      accurate. Your ad will be reviewed before publishing.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {step < 3 ? (
              <Button 
                type="button" 
                onClick={nextStep} 
                className="bg-[#ffb703] hover:bg-[#e6a103] text-black font-bold"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1 stroke-3" />
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading || uploadingToCloudinary}
              >
                {uploadingToCloudinary ? `Uploading images... ${uploadProgress}%` : loading ? 'Posting...' : 'Post Advertisement'}
              </Button>
            )}
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  );
}
