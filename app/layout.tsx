import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import I18nProvider from '@/components/I18nProvider';
import { AuthStateHandler } from '@/components/AuthStateHandler';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://kandalama.app'),
  title: 'Kandalama Lk - Buy, Sell, and Rent Properties in Sri Lanka',
  description: 'Sri Lanka\'s trusted property marketplace for buying, selling, and renting houses, lands, commercial properties, and more.',
  openGraph: {
    images: [
      {
        url: '/icon.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: '/icon.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <I18nProvider>
          <AuthStateHandler />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </I18nProvider>
      </body>
    </html>
  );
}
