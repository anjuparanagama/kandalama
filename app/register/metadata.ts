import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Register - Kandalama.lk",
  description:
    "Create a free Kandalama.lk account to buy, sell, or rent properties in Sri Lanka.",
  robots: {
    index: false,
  },
});
