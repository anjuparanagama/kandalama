import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/sonner";
import I18nProvider from "@/components/I18nProvider";
import { AuthStateHandler } from "@/components/AuthStateHandler";
import {
  generateMetadata,
  createOrganizationSchema,
  createWebSiteSchema,
} from "@/lib/seo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = generateMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = createOrganizationSchema();
  const websiteSchema = createWebSiteSchema();

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        {/* SEO and Meta Tags */}
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />

        {/* Verification Tags */}
        <meta
          name="google-site-verification"
          content="YOUR_GOOGLE_VERIFICATION_CODE"
        />
        <meta name="google-adsense-account" content="ca-pub-8602593942705279" />

        {/* Additional SEO Meta Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta
          name="author"
          content="Kandalama.lk - Sri Lanka Property Marketplace"
        />
        <meta name="distribution" content="global" />

        {/* Canonical and Structured Data */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        {/* Google Analytics */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || ""}`}
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || ""}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Adsterra Popunder */}
        <Script
          id="adsterra-script-2"
          src="https://pl31065929.profitableratecpmnetwork.com/e3/7f/11/e37f114cb3d9eb343ae06ad429cd26d7.js"
          strategy="afterInteractive"
        />
      </head>
      <body className={inter.className}>
        <I18nProvider>
          <AuthStateHandler />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>

            {/* Adsterra 728x90 Banner */}
            <div className=" justify-center w-full my-6 overflow-hidden hidden md:flex min-h-[90px]">
              <Script
                id="adsterra-options"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
            atOptions = {
              'key' : '27ca43d58cf4e4c5288278edd5dc55b7',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
          `,
                }}
              />
              <Script
                id="adsterra-invoke"
                src="https://www.highrevenueformat.com/27ca43d58cf4e4c5288278edd5dc55b7/invoke.js"
                strategy="afterInteractive"
              />
            </div>

            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </I18nProvider>
        {/* Adsterra Social Bar */}
        <div className="hidden md:block">
          <Script
            id="adsterra-social-bar"
            src="https://pl31065932.profitableratecpmnetwork.com/d7/16/44/d716442e64dc7a1318d170a3fdf09d2f.js"
            strategy="afterInteractive"
          />
        </div>
      </body>
    </html>
  );
}
