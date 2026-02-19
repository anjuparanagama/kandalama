import Script from "next/script";

interface JsonLdProps {
  schema: Record<string, any>;
  id?: string;
}

/**
 * JSON-LD Structured Data Component
 * Renders structured data for SEO
 * Supports: Organization, Property, BreadcrumbList, FAQ, etc.
 */
export function JsonLd({ schema, id = "json-ld" }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      strategy="afterInteractive"
    />
  );
}

/**
 * Breadcrumb Navigation Component with Structured Data
 */
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbWithSchema({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      <JsonLd schema={schema} id="breadcrumb-schema" />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              {index === items.length - 1 ? (
                <span className="text-gray-600">{item.name}</span>
              ) : (
                <a href={item.url} className="text-blue-600 hover:underline">
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

// Export JSON-LD creation functions for use in client components
export function createPropertyJsonLd(property: {
  id: string;
  title: string;
  description: string;
  price: number;
  listing_type: "rent" | "sell";
  images?: string[];
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  created_at?: string;
  baseUrl?: string;
}) {
  const baseUrl = property.baseUrl || "https://kandalama.app";

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateProperty",
    name: property.title,
    description: property.description,
    url: `${baseUrl}/properties/${property.id}`,
    image: property.images || [],
    datePublished: property.created_at,
    priceCurrency: "LKR",
    price: property.price.toString(),
    priceValidUntil: new Date(
      Date.now() + 90 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    availability: "https://schema.org/InStock",
    offerType: property.listing_type === "rent" ? "Lease" : "Sale",
    areaServed: {
      "@type": "Country",
      name: "Sri Lanka",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location || "Sri Lanka",
      addressCountry: "LK",
    },
    ...(property.bedrooms && { numberOfRooms: property.bedrooms }),
    ...(property.bathrooms && {
      numberOfBathroomsUnitConfiguration: property.bathrooms,
    }),
  };
}

export function createFAQJsonLd(
  items: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export default JsonLd;
