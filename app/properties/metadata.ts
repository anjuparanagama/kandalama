import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Properties - Buy, Sell & Rent Houses, Lands & Commercial Properties",
  description:
    "Browse thousands of properties for sale and rent in Sri Lanka. Find houses, lands, apartments, and commercial properties with advanced filters and detailed listings on Kandalama.lk.",
  keywords:
    "buy property Sri Lanka, rent property Sri Lanka, houses for sale, lands for sale, apartments, commercial property, real estate listings",
  openGraph: {
    title: "Properties - Kandalama.lk",
    description:
      "Browse thousands of properties for sale and rent in Sri Lanka",
    url: "https://kandalama.app/properties",
  },
});
