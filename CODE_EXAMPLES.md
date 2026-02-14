# Cloudinary Integration - Code Examples

## 1. Using the Hook in Components

### Basic Usage
```typescript
'use client';

import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

export default function ImageUploader() {
  const { uploadSingle, uploading, error } = useCloudinaryUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadSingle(file);
    if (url) {
      console.log('Image uploaded:', url);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p style={{color: 'red'}}>{error.message}</p>}
    </div>
  );
}
```

### With Progress Callbacks
```typescript
const { uploadMultiple, uploading, error } = useCloudinaryUpload({
  onSuccess: (urls) => {
    console.log('All images uploaded:', urls);
    // Save URLs to your database
  },
  onError: (error) => {
    console.error('Upload failed:', error);
  },
  onProgress: (current, total) => {
    console.log(`Uploaded ${current}/${total} images`);
  },
});

const handleMultipleFiles = async (files: File[]) => {
  const urls = await uploadMultiple(files);
};
```

---

## 2. Optimizing Image URLs

### Display Responsive Images
```typescript
import { getOptimizedImageUrl } from '@/lib/cloudinary';

export default function PropertyGallery() {
  const imageUrl = 'https://res.cloudinary.com/...';

  // Optimize for thumbnail
  const thumbnail = getOptimizedImageUrl(imageUrl, {
    width: 150,
    height: 150,
    crop: 'fill',
    quality: 80,
  });

  // Optimize for desktop display
  const desktop = getOptimizedImageUrl(imageUrl, {
    width: 800,
    height: 600,
    crop: 'fill',
    quality: 'auto',
  });

  // Optimize for mobile display
  const mobile = getOptimizedImageUrl(imageUrl, {
    width: 400,
    height: 300,
    crop: 'fill',
    quality: 'auto',
  });

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktop} />
      <source media="(min-width: 640px)" srcSet={mobile} />
      <img src={thumbnail} alt="Property" />
    </picture>
  );
}
```

---

## 3. Batch Upload Example

```typescript
'use client';

import { useState } from 'react';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

export default function BulkUploader() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { uploadMultiple, uploading } = useCloudinaryUpload({
    onProgress: (current, total) => {
      setUploadProgress(Math.round((current / total) * 100));
    },
    onSuccess: (urls) => {
      setUploadedUrls(urls);
      setSelectedFiles([]);
    },
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) return;
    await uploadMultiple(selectedFiles);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed p-8 text-center"
      >
        <p>Drag and drop images here</p>
        <p className="text-sm text-gray-500">{selectedFiles.length} files selected</p>
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded">
          <div
            className="bg-blue-600 h-2 rounded transition-all"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Uploaded URLs */}
      {uploadedUrls.length > 0 && (
        <div>
          <p>Uploaded {uploadedUrls.length} images:</p>
          <ul>
            {uploadedUrls.map((url) => (
              <li key={url}>
                <code>{url.substring(0, 50)}...</code>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={handleSubmit} disabled={uploading || selectedFiles.length === 0}>
        {uploading ? `Uploading... ${uploadProgress}%` : 'Upload'}
      </button>
    </div>
  );
}
```

---

## 4. Image Gallery Component

```typescript
'use client';

import { useState } from 'react';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: Array<{ id: string; image_url: string }>;
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) {
    return <div>No images available</div>;
  }

  const current = images[currentIndex];
  const optimized = getOptimizedImageUrl(current.image_url, {
    width: 800,
    height: 600,
    crop: 'fill',
  });

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-2">
      {/* Main image */}
      <div className="relative bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={optimized}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-96 object-cover"
        />

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const thumb = getOptimizedImageUrl(image.image_url, {
              width: 80,
              height: 80,
              crop: 'fill',
            });
            return (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 rounded ${
                  index === currentIndex ? 'ring-2 ring-blue-600' : ''
                }`}
              >
                <img src={thumb} alt={`Thumbnail ${index + 1}`} className="w-20 h-20 object-cover rounded" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

### Usage in Property Page:
```typescript
import ImageGallery from '@/components/ImageGallery';

export default function PropertyPage({ property, images }) {
  return (
    <div>
      <h1>{property.title}</h1>
      <ImageGallery images={images} title={property.title} />
      {/* Rest of property details */}
    </div>
  );
}
```

---

## 5. Direct API Usage (Without Hook)

```typescript
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

async function handleUpload(file: File) {
  try {
    const url = await uploadToCloudinary(file, {
      info: (data) => {
        console.log('Upload info:', data);
      },
    } as any);
    return url;
  } catch (error) {
    console.error('Upload failed:', error);
  }
}

async function handleDelete(publicId: string) {
  try {
    await deleteFromCloudinary(publicId);
    console.log('Image deleted');
  } catch (error) {
    console.error('Delete failed:', error);
  }
}
```

---

## 6. Form Integration Example

```typescript
'use client';

import { useState } from 'react';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { supabase } from '@/lib/supabase';

export default function PropertyForm() {
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const { uploadMultiple, uploading, error: uploadError } = useCloudinaryUpload({
    onSuccess: setImageUrls,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Upload images if any
      let urls: string[] = [];
      if (images.length > 0) {
        urls = await uploadMultiple(images);
      }

      // 2. Create property
      const formData = new FormData(e.currentTarget);
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: formData.get('title'),
          description: formData.get('description'),
          price: parseFloat(formData.get('price') as string),
          // ... other fields
        })
        .select()
        .single();

      if (error) throw error;

      // 3. Save image URLs
      if (urls.length > 0) {
        const imageRecords = urls.map((url, index) => ({
          property_id: data.id,
          image_url: url,
          display_order: index,
          is_primary: index === 0,
        }));

        const { error: imageError } = await supabase
          .from('property_images')
          .insert(imageRecords);

        if (imageError) throw imageError;
      }

      alert('Property created successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create property');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <input type="text" name="title" required />
      <textarea name="description" required />
      <input type="number" name="price" required />

      {/* Image upload */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files || []))}
        disabled={uploading || submitting}
      />

      {uploading && <p>Uploading images...</p>}
      {uploadError && <p style={{ color: 'red' }}>{uploadError.message}</p>}

      <button type="submit" disabled={uploading || submitting}>
        {submitting ? 'Creating...' : 'Create Property'}
      </button>
    </form>
  );
}
```

---

## 7. Environment Configuration

### Development (.env.local)
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dev_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=dev_preset
```

### Production (.env.production.local)
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=prod_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=prod_preset
```

### Verification
```typescript
// Check if configured
if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
  console.warn('Cloudinary is not configured');
}
```

---

These examples cover the most common use cases. Mix and match based on your needs!
