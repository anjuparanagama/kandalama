import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

            <Card>
              <CardContent className="prose prose-sm sm:prose lg:prose-lg p-6">
                <h2>Overview</h2>
                <p>
                  We respect your privacy. This policy explains how we collect,
                  use and protect your personal information when you use the
                  site.
                </p>

                <h2>Information We Collect</h2>
                <p>
                  We may collect contact details, property details and images
                  you upload when creating listings. We use this data to
                  display listings and provide the service.
                </p>

                <h2>Contact</h2>
                <p>If you have privacy-related questions, please contact us.</p>
              </CardContent>
            </Card>
          </main>

          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-2">Privacy Controls</h4>
                <p className="text-sm mb-4">You can request removal of your data or changes to your listings.</p>
                <Link href="/contact" className="text-blue-600 hover:underline">Request Data Changes</Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
