import Link from "next/link";
import Image from "next/image";
import { Home, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import localFont from "next/font/local";

const unBaron = localFont({ src: "../un-baron-prod.ttf", display: "swap" });

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center -space-x-2">
              <Link href="/" className="flex items-center -space-x-5">
                <div className="p-2 -ml-4 rounded-lg">
                  <Image
                    src="/icon.png"
                    alt="logo"
                    width={60}
                    height={50}
                    className="object-contain"
                  />
                </div>
                <span
                  className={`text-2xl font-medium text-white pt-5 ${unBaron.className}`}
                >
                  කණ්ඩළම<span className="text-[8px]"> Lk</span>
                </span>
              </Link>
            </div>
            <p className="text-sm text-gray-400">
              Sri Lanka's trusted property marketplace for buying, selling, and
              renting properties.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="hover:text-white transition"
                >
                  Browse Properties
                </Link>
              </li>
              <li>
                <Link href="/post-ad" className="hover:text-white transition">
                  Post an Ad
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="hover:text-white transition"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="hover:text-white transition"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="hover:text-white transition"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="hover:text-white transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} <span className={`text-xl font-medium text-white pt-5 ${unBaron.className}`}>කණ්ඩළම<span className="text-[8px]"> Lk</span></span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
