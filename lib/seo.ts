import type { Metadata } from "next";

export const baseMetadata = {
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://kandalama.app",
  siteName: "Kandalama.lk",
  siteDescription:
    "Sri Lanka's trusted property marketplace for buying, selling, and renting houses, lands, commercial properties, and more.",
  siteKeywords:
    "property, rent, buy, sell, real estate Sri Lanka, houses, lands, commercial property, apartments",
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
      locale: "en_US",
      url: baseMetadata.baseUrl,
      siteName: baseMetadata.siteName,
      title: "Kandalama.lk - Buy, Sell, and Rent Properties in Sri Lanka",
      description: baseMetadata.siteDescription,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Kandalama.lk - Property Marketplace Sri Lanka",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Kandalama.lk - Buy, Sell, and Rent Properties",
      description: baseMetadata.siteDescription,
      images: ["/og-image.png"],
    },
    alternates: {
      canonical: baseMetadata.baseUrl,
      languages: {
        "en-US": `${baseMetadata.baseUrl}/en`,
        si: `${baseMetadata.baseUrl}/si`,
        ta: `${baseMetadata.baseUrl}/ta`,
      },
    },
    ...override,
  };
}

export function createOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kandalama.lk",
    url: baseMetadata.baseUrl,
    logo: `${baseMetadata.baseUrl}/logo.png`,
    description: baseMetadata.siteDescription,
    sameAs: [
      "https://www.facebook.com/kandalama.lk",
      "https://www.instagram.com/kandalama.lk",
      "https://twitter.com/kandalamalk",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "support@kandalama.app",
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
  listing_type: "rent" | "sell";
  category: string;
  image_url?: string;
  created_at?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateProperty",
    name: property.title,
    description: property.description,
    url: `${baseMetadata.baseUrl}/properties/${property.id}`,
    image: property.image_url || `${baseMetadata.baseUrl}/placeholder.png`,
    datePublished: property.created_at,
    priceCurrency: "LKR",
    price: property.price.toString(),
    priceValidUntil: new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    availability: "https://schema.org/InStock",
    offerType: property.listing_type === "rent" ? "Lease" : "Sale",
    location: {
      "@type": "Place",
      name: property.location || "Sri Lanka",
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsUnitConfiguration: property.bathrooms,
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
