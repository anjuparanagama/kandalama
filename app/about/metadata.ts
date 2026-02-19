import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "About Kandalama.lk - Sri Lanka's Property Marketplace",
  description:
    "Learn about Kandalama.lk, Sri Lanka's trusted property marketplace connecting buyers, sellers, and renters. Discover our mission and how we simplify property transactions.",
  keywords:
    "about kandalama, property marketplace Sri Lanka, real estate platform, property buying selling renting",
  openGraph: {
    title: "About Kandalama.lk",
    description:
      "Sri Lanka's trusted property marketplace for buying, selling, and renting properties",
    url: "https://kandalama.app/about",
  },
});
