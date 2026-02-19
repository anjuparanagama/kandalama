import Image from "next/image";
import React from "react";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  fill?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "scale-down";
  objectPosition?: string;
  sizes?: string;
  className?: string;
  isExternal?: boolean; // For non-optimized external images
}

/**
 * Optimized Image Component
 * Handles both internal and external images with proper SEO attributes
 * Automatically optimizes format and responsive sizing
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  fill = false,
  objectFit = "cover",
  objectPosition = "center",
  sizes,
  className,
  isExternal = false,
  ...props
}: OptimizedImageProps) {
  // Validate alt text for SEO
  if (!alt || alt.trim().length === 0) {
    console.warn(`Image without alt text: ${src}`);
  }

  // For external images that can't be optimized
  if (isExternal) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading="lazy"
        decoding="async"
        {...props}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={className}
        sizes={
          sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        }
        style={{
          objectFit,
          objectPosition,
        }}
      />
    );
  }

  if (!width || !height) {
    console.warn(`Image requires width and height: ${src}`);
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 400}
      height={height || 300}
      priority={priority}
      className={className}
      sizes={sizes || "(max-width: 768px) 100vw, 50vw"}
    />
  );
}

/**
 * Best practices for image SEO:
 * 1. Always include descriptive alt text
 * 2. Use proper file names (e.g., colombo-house-for-rent.jpg)
 * 3. Compress images before upload
 * 4. Use WebP format when possible
 * 5. Optimize image size for context
 *
 * For property images:
 * - Alt: "3 bedroom house in Colombo with garden view"
 * - Filename: "3-bed-house-colombo-garden.jpg"
 * - Size: Appropriate for preview (400x300) and detail (1200x800)
 */

/**
 * Helper function to generate SEO-friendly image alt text
 */
export function generatePropertyImageAltText(
  property: {
    category?: string;
    location?: string;
    bedrooms?: number;
    bathrooms?: number;
    title?: string;
  },
  imageContext: "listing" | "detail" | "thumbnail" = "listing",
): string {
  const parts: string[] = [];

  if (property.category) parts.push(property.category);
  if (property.bedrooms) parts.push(`${property.bedrooms} bedroom`);
  if (property.bathrooms) parts.push(`${property.bathrooms} bathroom`);
  if (property.location) parts.push(`in ${property.location}`);
  if (property.title) parts.push(`- ${property.title}`);

  const altText = parts.join(" ");
  return altText || "Property image";
}

/**
 * Helper function to generate image filename from property details
 */
export function generatePropertyImageFilename(
  property: {
    id?: string;
    title?: string;
    location?: string;
    category?: string;
  },
  index: number = 0,
): string {
  const parts: string[] = [];

  if (property.title) {
    parts.push(
      property.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 30),
    );
  }

  if (property.location) {
    parts.push(
      property.location
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
    );
  }

  if (property.category) {
    parts.push(property.category.toLowerCase());
  }

  const filename = parts.join("-") || "property";
  return `${filename}-${index + 1}.jpg`;
}

export default OptimizedImage;
