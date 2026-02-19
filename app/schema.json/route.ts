import { createOrganizationSchema } from "@/lib/seo";

export async function GET() {
  const schema = createOrganizationSchema();

  return Response.json(schema, {
    headers: {
      "Content-Type": "application/ld+json",
    },
  });
}
