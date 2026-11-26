import type { Metadata } from "next";
import Link from "next/link";
import {
  baseMetadata,
  createBreadcrumbSchema,
  createFAQSchema,
  generateMetadata as buildMetadata,
} from "@/lib/seo";

const faqs = [
  {
    question: "What is the difference between a room and an annex in Sri Lanka?",
    answer:
      "In Sri Lanka, a room (or boarding room) is typically a single bedroom—often with shared kitchen or bathroom facilities—suited for students or working professionals. An annex is a self-contained unit attached to or within a house, usually featuring a separate entrance, private bathroom, living area, and kitchen or pantry.",
  },
  {
    question: "How much is key money for renting an annex or house in Sri Lanka?",
    answer:
      "Key money (a refundable security deposit) in Sri Lanka is commonly 3 to 6 months of rent for houses and apartments, and 1 to 3 months of rent for annexes and boarding rooms. The exact amount depends on the district, furnishing, and landlord agreement.",
  },
  {
    question: "What documents should I verify before buying land or a house in Sri Lanka?",
    answer:
      "Always verify the Title Deed (Pedigree for at least 30 years), the Survey Plan approved by the local authority, Street Line and Building Line certificates, Non-Vesting certificates, and Bim Saviya title registration if applicable. Have a licensed Notary Public or property lawyer inspect all originals before paying an advance.",
  },
  {
    question: "How is land measured and priced in Sri Lanka?",
    answer:
      "Residential land in Sri Lanka is usually measured in perches (1 perch = 272.25 sq ft), while larger plots are measured in roods (40 perches) or acres (160 perches). Prices are typically quoted per perch in Sri Lankan Rupees (LKR).",
  },
  {
    question: "Can I post a property, room, or annex for free on Kandalama.lk?",
    answer:
      "Yes. Property owners, landlords, and agents across all 25 districts of Sri Lanka can create an account on Kandalama.lk and post ads for houses, lands, commercial spaces, rooms, and annexes with photos and direct contact details.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Sri Lanka Property, Annex & Rental Guide (FAQ)",
  description:
    "Answers to common questions about renting annexes, boarding rooms, houses, and buying land in Sri Lanka—including key money, perch measurements, and deed checks.",
  keywords:
    "Sri Lanka property guide, annex vs room Sri Lanka, key money Sri Lanka, buy land Sri Lanka documents, Kandalama.lk FAQ",
  alternates: {
    canonical: `${baseMetadata.baseUrl}/guide`,
  },
  openGraph: {
    title: "Sri Lanka Property, Annex & Rental Guide | Kandalama.lk",
    description:
      "Everything you need to know about renting annexes, rooms, and buying property in Sri Lanka.",
    url: `${baseMetadata.baseUrl}/guide`,
  },
});

export default function GuidePage() {
  const faqSchema = createFAQSchema(faqs);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", url: baseMetadata.baseUrl },
    { name: "Property Guide", url: `${baseMetadata.baseUrl}/guide` },
  ]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>{" "}
          / <span className="text-gray-900 font-medium">Sri Lanka Property Guide</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Sri Lanka Property, Annex &amp; Rental Guide
          </h1>
          <p className="text-lg text-gray-600">
            Practical answers for buyers, renters, landlords, and property seekers
            across Sri Lanka—from Colombo and Gampaha to Kandy and Galle.
          </p>
        </header>

        <section aria-labelledby="faq-heading" className="space-y-6 mb-12">
          <h2 id="faq-heading" className="text-2xl font-semibold text-gray-900">
            Frequently Asked Questions
          </h2>
          {faqs.map((faq) => (
            <article
              key={faq.question}
              className="bg-white rounded-lg border p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </article>
          ))}
        </section>

        <section className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Browse Properties by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <Link
              href="/properties?category=house"
              className="p-3 rounded border hover:border-blue-500 hover:text-blue-600 font-medium"
            >
              Houses in Sri Lanka
            </Link>
            <Link
              href="/properties?category=annex"
              className="p-3 rounded border hover:border-blue-500 hover:text-blue-600 font-medium"
            >
              Annexes for Rent
            </Link>
            <Link
              href="/properties?category=room"
              className="p-3 rounded border hover:border-blue-500 hover:text-blue-600 font-medium"
            >
              Rooms &amp; Boarding
            </Link>
            <Link
              href="/properties?category=land"
              className="p-3 rounded border hover:border-blue-500 hover:text-blue-600 font-medium"
            >
              Land for Sale
            </Link>
            <Link
              href="/properties?category=commercial"
              className="p-3 rounded border hover:border-blue-500 hover:text-blue-600 font-medium"
            >
              Commercial Properties
            </Link>
            <Link
              href="/properties?listing_type=rent"
              className="p-3 rounded border hover:border-blue-500 hover:text-blue-600 font-medium"
            >
              All Rental Listings
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
