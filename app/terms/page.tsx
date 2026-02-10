import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">Terms &amp; Conditions</h1>

            <Card>
              <CardContent className="prose prose-sm sm:prose lg:prose-lg p-6">
                <h2>Introduction</h2>
                <p>
                  These Terms and Conditions govern your use of the site. By
                  accessing or using our service you agree to be bound by these
                  terms.
                </p>

                <h2>Listings</h2>
                <p>
                  Users are responsible for the accuracy of the information they
                  post. We may remove listings that violate our policies.
                </p>

                <h2>Limitation of Liability</h2>
                <p>
                  The platform is provided as-is; we are not liable for any
                  transaction between users. Use caution and verify listings
                  before committing to transactions.
                </p>
              </CardContent>
            </Card>
          </main>

          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-2">Need help?</h4>
                <p className="text-sm mb-4">If you have questions about these terms, contact us.</p>
                <Link href="/contact" className="text-blue-600 hover:underline">Contact Support</Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
