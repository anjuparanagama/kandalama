import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import PropertyDetailsClient from "./PropertyDetailsClient";
import {
  baseMetadata,
  createBreadcrumbSchema,
  createPropertySchema,
  generateMetadata as buildMetadata,
} from "@/lib/seo";

export const revalidate = 300;

type Props = {
  params: { id: string };
};

async function getPropertyForSeo(id: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data } = await supabase
      .from("properties")
      .select(
        `
        id,
        title,
        description,
        price,
        category,
        listing_type,
        location,
        city,
        district,
        bedrooms,
        bathrooms,
        area_sqft,
        created_at,
        updated_at,
        property_images(image_url, is_primary, display_order)
      `,
      )
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const property = await getPropertyForSeo(params.id);

  if (!property) {
    return buildMetadata({
      title: "Property Details",
      description:
        "View property details, photos, and contact information on Kandalama.lk.",
      robots: { index: false, follow: true },
    });
  }

  const locationText = [property.city, property.district]
    .filter(Boolean)
    .join(", ") || property.location || "Sri Lanka";
  const actionLabel = property.listing_type === "rent" ? "for Rent" : "for Sale";
  const priceLabel = `LKR ${Number(property.price || 0).toLocaleString("en-LK")}${
    property.listing_type === "rent" ? "/month" : ""
  }`;

  const title = `${property.title} - ${actionLabel} in ${locationText}`;
  const description =
    property.description?.slice(0, 155) ||
    `${property.category} ${actionLabel.toLowerCase()} in ${locationText} at ${priceLabel} on Kandalama.lk.`;

  const images = (property.property_images as Array<{
    image_url: string;
    is_primary?: boolean;
    display_order?: number;
  }>) || [];
  const primaryImage =
    images.find((img) => img.is_primary)?.image_url ||
    images.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))[0]
      ?.image_url ||
    `${baseMetadata.baseUrl}/icon.png`;

  const canonicalUrl = `${baseMetadata.baseUrl}/properties/${property.id}`;

  return buildMetadata({
    title,
    description,
    keywords: `${property.category} ${actionLabel} ${locationText}, ${property.title}, ${property.district || "Sri Lanka"} property, Kandalama.lk`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      images: [
        {
          url: primaryImage,
          alt: property.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [primaryImage],
    },
  });
}

export default async function PropertyDetailsPage({ params }: Props) {
  const property = await getPropertyForSeo(params.id);

  const images = (property?.property_images as Array<{
    image_url: string;
    is_primary?: boolean;
    display_order?: number;
  }>) || [];
  const primaryImage =
    images.find((img) => img.is_primary)?.image_url || images[0]?.image_url;

  const propertySchema = property
    ? createPropertySchema({
        id: property.id,
        title: property.title,
        description: property.description || property.title,
        price: Number(property.price || 0),
        listing_type: property.listing_type === "rent" ? "rent" : "sale",
        category: property.category,
        image_url: primaryImage,
        created_at: property.created_at,
        updated_at: property.updated_at,
        location: property.location,
        city: property.city,
        district: property.district,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area_sqft: property.area_sqft,
      })
    : null;

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: baseMetadata.baseUrl },
    { name: "Properties", url: `${baseMetadata.baseUrl}/properties` },
    ...(property
      ? [
          {
            name: property.title,
            url: `${baseMetadata.baseUrl}/properties/${property.id}`,
          },
        ]
      : []),
  ]);

  return (
    <>
      {propertySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(propertySchema),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <PropertyDetailsClient />
    </>
  );
}
