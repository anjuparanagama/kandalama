import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kandalama.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/guide`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/post-ad`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Match PropertyCategory values in lib/supabase.ts
  const categories = ["house", "land", "commercial", "room", "annex"];
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/properties?category=${category}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Match ListingType values in lib/supabase.ts
  const listingRoutes: MetadataRoute.Sitemap = ["sale", "rent"].map((type) => ({
    url: `${baseUrl}/properties?listing_type=${type}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // Dynamically include active property listings from Supabase
  let propertyRoutes: MetadataRoute.Sitemap = [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { data } = await supabase
        .from("properties")
        .select("id, updated_at, created_at")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(5000);

      if (data) {
        propertyRoutes = data.map((item) => ({
          url: `${baseUrl}/properties/${item.id}`,
          lastModified: new Date(item.updated_at || item.created_at),
          changeFrequency: "weekly",
          priority: 0.7,
        }));
      }
    } catch {
      // Fallback gracefully if Supabase is unreachable during build
    }
  }

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...listingRoutes,
    ...propertyRoutes,
  ];
}
