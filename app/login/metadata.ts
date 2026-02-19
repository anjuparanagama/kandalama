import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";

export const metadata: Metadata = generateMetadata({
  title: "Login - Kandalama.lk",
  description:
    "Sign in to your Kandalama.lk account to manage your properties and messages.",
  robots: {
    index: false,
  },
});
