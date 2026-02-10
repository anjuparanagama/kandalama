import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className=" bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">About Us</h1>

            <Card>
              <CardContent className="prose prose-sm sm:prose lg:prose-lg p-6">
                <p>
                  කණ්ඩලම.Lk is a local property marketplace built to help
                  people buy, sell and rent properties across Sri Lanka. We
                  connect sellers, agents and buyers with a simple, modern
                  interface and tools to list properties with images and map
                  previews.
                </p>

                <p>
                  Our mission is to make property transactions transparent and
                  approachable for everyone. We focus on usability, clear
                  listings and fast discovery.
                </p>

                <h3>How it works</h3>
                <ul>
                  <li>Create an account or continue as a guest</li>
                  <li>Post an ad with images and a map location</li>
                  <li>Receive inquiries via phone, WhatsApp or messages</li>
                </ul>

                <div className="mt-6">
                  <Link href="/post-ad">
                    <Button>Post Your Property</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>

          <aside className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/properties" className="text-blue-600 hover:underline">
                      Browse Properties
                    </Link>
                  </li>
                  <li>
                    <Link href="/post-ad" className="text-blue-600 hover:underline">
                      Post an Ad
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-blue-600 hover:underline">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}
