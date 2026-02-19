import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title:
    "Post Your Property - List Home, Land & Commercial Property for Sale or Rent",
  description:
    "Easily post your property on Kandalama.lk - Sri Lanka's largest property marketplace. Reach thousands of buyers and renters with simple listing process.",
  keywords:
    "post property, list property Sri Lanka, sell house, advertise property, property listing platform",
  openGraph: {
    title: "Post Your Property - Kandalama.lk",
    description:
      "List your property on Sri Lanka's largest property marketplace",
    url: "https://kandalama.app/post-ad",
  },
});
