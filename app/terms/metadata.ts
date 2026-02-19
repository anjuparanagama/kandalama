import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Terms and Conditions - Kandalama.lk",
  description:
    "Review the terms and conditions for using Kandalama.lk property marketplace.",
  robots: {
    index: false,
  },
  openGraph: {
    title: "Terms and Conditions - Kandalama.lk",
    url: "https://kandalama.app/terms",
  },
});
