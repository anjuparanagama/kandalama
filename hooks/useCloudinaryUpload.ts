/**
 * React hook for Cloudinary image uploads
 */

'use client';

import { useState, useCallback } from 'react';
import { uploadToCloudinary, uploadMultipleToCloudinary } from '@/lib/cloudinary';

export interface UseCloudinaryUploadOptions {
  onSuccess?: (urls: string[]) => void;
  onError?: (error: Error) => void;
  onProgress?: (current: number, total: number) => void;
}

export const useCloudinaryUpload = (options?: UseCloudinaryUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadSingle = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        setUploading(true);
        setError(null);
        const url = await uploadToCloudinary(file);
        return url;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed');
        setError(error);
        options?.onError?.(error);
        return null;
      } finally {
        setUploading(false);
      }
    },
    [options]
  );

  const uploadMultiple = useCallback(
    async (files: File[]): Promise<string[]> => {
      try {
        setUploading(true);
        setError(null);
        const urls = await uploadMultipleToCloudinary(files, options?.onProgress);
        options?.onSuccess?.(urls);
        return urls;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed');
        setError(error);
        options?.onError?.(error);
        return [];
      } finally {
        setUploading(false);
      }
    },
    [options]
  );

  return {
    uploadSingle,
    uploadMultiple,
    uploading,
    error,
  };
};
