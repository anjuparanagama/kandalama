'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X, Plus, LogIn } from 'lucide-react';
import localFont from 'next/font/local';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const unBaron = localFont({ src: '../un-baron-prod.ttf', display: 'swap' });

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-[#003566] border-b border-gray-500 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center -space-x-5">
            <div className="p-2 rounded-lg">
              <Image src="/icon.png" alt="logo" width={60} height={50} className="object-contain" />
            </div>
            <span className={`text-2xl font-medium text-white pt-5 ${unBaron.className}`}>කණ්ඩළම<span className="text-[8px]"> Lk</span></span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  className="pl-14 pr-14 h-12 rounded-full bg-white border-0 shadow-sm placeholder:text-gray-400 focus:!bg-[#fff7d6] focus-visible:!bg-[#fff7d6] transition-colors"
                />

                <button
                  aria-label="Search"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 rounded-full p-2 h-10 w-10 flex items-center justify-center shadow"
                >
                  <Search className="h-4 w-4 text-gray-800" />
                </button>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button className="bg-[#ffb703] hover:bg-[#e6a103] text-black flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/post-ad">
              <Button className="bg-[#ffb703] hover:bg-[#e4ac29] text-black">
                <Plus className="h-4 w-4 mr-2 text-black" />
                Post Ad
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="md:hidden pb-4">
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="What are you looking for?"
              className="pl-10 pr-12 h-10 rounded-full bg-white border-0 shadow-sm w-full focus:!bg-[#fff7d6] focus-visible:!bg-[#fff7d6] transition-colors"
            />
            <button
              aria-label="Search"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 rounded-full p-2 h-9 w-9 flex items-center justify-center shadow"
            >
              <Search className="h-4 w-4 text-gray-800" />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white bg-blue-600">
          <div className="px-4 py-4 space-y-3">
            <Link href="/login" className="block">
              <Button className="w-full bg-[#ffb703] hover:bg-[#e6a103] text-black flex items-center justify-center">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link href="/post-ad" className="block">
              <Button className="w-full bg-[#ffb703] hover:bg-[#e4ac29] text-black">
                <Plus className="h-4 w-4 mr-2 text-black" />
                Post Ad
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
