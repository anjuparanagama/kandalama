import type { Metadata } from "next";

export const baseMetadata = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://kandalama.app",
  siteName: "Kandalama.lk",
  siteDescription:
    "Kandalama.lk is Sri Lanka's premier property and real estate marketplace. Buy, sell, or rent houses, lands, commercial properties, rooms, and annexes across Sri Lanka.",
  siteKeywords:
    "property Sri Lanka, houses for sale Sri Lanka, houses for rent Colombo, annex for rent Sri Lanka, rooms for rent Colombo, boarding rooms Sri Lanka, land for sale Sri Lanka, commercial property, real estate Sri Lanka, Kandalama.lk",
  twitterHandle: "@kandalamalk",
};

export function generateMetadata(override: Partial<Metadata> = {}): Metadata {
  const metadataBase = new URL(baseMetadata.baseUrl);

  return {
    metadataBase,
    title: {
      default: "Kandalama.lk - Buy, Sell, and Rent Properties in Sri Lanka",
      template: "%s | Kandalama.lk",
    },
    description: baseMetadata.siteDescription,
    keywords: baseMetadata.siteKeywords,
    viewport: "width=device-width, initial-scale=1, maximum-scale=10",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_LK",
      url: baseMetadata.baseUrl,
      siteName: baseMetadata.siteName,
      title: "Kandalama.lk - Buy, Sell, and Rent Properties in Sri Lanka",
      description: baseMetadata.siteDescription,
      images: [
        {
          url: "/icon.png",
          width: 512,
          height: 512,
          alt: "Kandalama.lk - Property Marketplace Sri Lanka",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Kandalama.lk - Buy, Sell, and Rent Properties in Sri Lanka",
      description: baseMetadata.siteDescription,
      images: ["/icon.png"],
    },
    alternates: {
      canonical: baseMetadata.baseUrl,
    },
    ...override,
  };
}

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    name: "Kandalama.lk",
    url: baseMetadata.baseUrl,
    logo: `${baseMetadata.baseUrl}/icon.png`,
    image: `${baseMetadata.baseUrl}/icon.png`,
    description: baseMetadata.siteDescription,
    areaServed: {
      "@type": "Country",
      name: "Sri Lanka",
    },
    sameAs: [
      "https://www.facebook.com/kandalama.lk",
      "https://www.instagram.com/kandalama.lk",
      "https://twitter.com/kandalamalk",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@kandalama.app",
      areaServed: "LK",
      availableLanguage: ["English", "Sinhala", "Tamil"],
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "LK",
      addressLocality: "Sri Lanka",
    },
  };
}

export function createPropertySchema(property: {
  id: string;
  title: string;
  description: string;
  price: number;
  listing_type: "rent" | "sale" | "sell";
  category: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  location?: string;
  city?: string;
  district?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
}) {
  const propertyUrl = `${baseMetadata.baseUrl}/properties/${property.id}`;
  const isRent = property.listing_type === "rent";

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    description: property.description,
    url: propertyUrl,
    image: property.image_url || `${baseMetadata.baseUrl}/icon.png`,
    datePosted: property.created_at,
    dateModified: property.updated_at || property.created_at,
    offers: {
      "@type": "Offer",
      url: propertyUrl,
      priceCurrency: "LKR",
      price: property.price,
      priceValidUntil: new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      )
        .toISOString()
        .split("T")[0],
      availability: "https://schema.org/InStock",
      businessFunction: isRent
        ? "http://purl.org/goodrelations/v1#LeaseOut"
        : "http://purl.org/goodrelations/v1#Sell",
    },
    about: {
      "@type": "Accommodation",
      name: property.title,
      description: property.description,
      numberOfRooms: property.bedrooms || undefined,
      numberOfBathroomsTotal: property.bathrooms || undefined,
      floorSize: property.area_sqft
        ? {
            "@type": "QuantitativeValue",
            value: property.area_sqft,
            unitCode: "FTK",
          }
        : undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: property.location || undefined,
        addressLocality: property.city || property.location || "Sri Lanka",
        addressRegion: property.district || undefined,
        addressCountry: "LK",
      },
    },
  };
}

export function createBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function createWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: baseMetadata.siteName,
    url: baseMetadata.baseUrl,
    description: baseMetadata.siteDescription,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseMetadata.baseUrl}/properties?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    about: {
      "@type": "Thing",
      name: "Sri Lanka Real Estate and Property Marketplace",
      description: "An online platform connecting property buyers, sellers, and renters in Sri Lanka.",
    },
  };
}

