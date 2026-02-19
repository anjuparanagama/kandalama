import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Privacy Policy - Kandalama.lk",
  description:
    "Read Kandalama.lk's privacy policy. We protect your personal data with industry-standard security measures.",
  robots: {
    index: false,
  },
  openGraph: {
    title: "Privacy Policy - Kandalama.lk",
    url: "https://kandalama.app/privacy",
  },
});
