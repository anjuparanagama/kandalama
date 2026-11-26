import type { Metadata } from "next";
import { metadata as propertiesMetadata } from "./metadata";

export const metadata: Metadata = propertiesMetadata;

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
