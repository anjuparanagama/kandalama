/**
 * Cloudinary utility functions for image uploads
 */

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
  folder: 'kandalama',
};

export interface CloudinaryUploadResponse {
  event?: ProgressEvent;
  info?: {
    public_id: string;
    secure_url: string;
    url: string;
    width: number;
    height: number;
    bytes: number;
    original_filename: string;
  };
}

/**
 * Upload a single image to Cloudinary
 */
export const uploadToCloudinary = (
  file: File,
  onUpload?: (result: CloudinaryUploadResponse) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', cloudinaryConfig.folder);

    fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          reject(new Error(data.error.message));
        }
        onUpload?.({ info: data });
        resolve(data.secure_url);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Upload multiple images to Cloudinary
 */
export const uploadMultipleToCloudinary = async (
  files: File[],
  onProgress?: (current: number, total: number) => void
): Promise<string[]> => {
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const url = await uploadToCloudinary(files[i]);
      urls.push(url);
      onProgress?.(i + 1, files.length);
    } catch (error) {
      console.error(`Failed to upload image ${i + 1}:`, error);
      throw error;
    }
  }

  return urls;
};

/**
 * Delete an image from Cloudinary (requires backend API call with API secret)
 * For client-side, use this to trigger a backend endpoint
 */
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Optimize Cloudinary URL with transformations
 */
export const getOptimizedImageUrl = (
  imageUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    crop?: string;
  }
): string => {
  if (!imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  const width = options?.width;
  const height = options?.height;
  const quality = options?.quality || 'auto';
  const crop = options?.crop || 'fill';

  // Transform URL: /upload/c_fill,q_auto,w_400,h_300/...
  const transformations = [
    `c_${crop}`,
    `q_${quality}`,
    width && `w_${width}`,
    height && `h_${height}`,
  ]
    .filter(Boolean)
    .join(',');

  return imageUrl.replace('/upload/', `/upload/${transformations}/`);
};
