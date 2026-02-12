'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X, Plus, LogIn, Globe, ChevronDown } from 'lucide-react';
import localFont from 'next/font/local';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const unBaron = localFont({ src: '../un-baron-prod.ttf', display: 'swap' });

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangs, setShowLangs] = useState(false);
  const langBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showLangs) return;
    const handleClick = (e: MouseEvent) => {
      if (
        langBtnRef.current &&
        !langBtnRef.current.contains(e.target as Node)
      ) {
        setShowLangs(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showLangs]);


  const languages = [
    { code: 'en', label: 'English' },
    { code: 'si', label: 'සිංහල' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLangs(false);
  };

  return (
    <nav className="bg-[#003566] border-b border-gray-500 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center -space-x-5">
            <div className="p-2 rounded-lg">
              <Image src="/icon.png" alt="logo" width={60} height={50} className="object-contain" />
            </div>
            <span className={`text-2xl font-medium text-white pt-5 ${unBaron.className}`}>කණ්ඩළම<span className="text-[8px]"> Lk</span></span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  className="pl-8 pr-14 h-12 rounded-full bg-white border-0 shadow-sm placeholder:text-gray-400 focus:!bg-[#fff7d6] focus-visible:!bg-[#fff7d6] transition-colors"
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
                {t('navbar.login')}
              </Button>
            </Link>
            <Link href="/post-ad">
              <Button className="bg-[#ffb703] hover:bg-[#e4ac29] text-black">
                <Plus className="h-4 w-4 mr-2 text-black" />
                {t('navbar.postAd')}
              </Button>
            </Link>
            <div className="relative" ref={langBtnRef}>
              <button
                className="flex items-center gap-2 bg-sky-400 hover:bg-sky-500 text-white rounded-full px-4 py-2 ml-2 shadow transition-colors focus:outline-none focus:ring-2 focus:ring-sky-300"
                onClick={() => setShowLangs((prev) => !prev)}
                aria-label="Change language"
                type="button"
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">
                  {languages.find(l => l.code === i18n.language)?.label || 'English'}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {showLangs && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`block w-full text-left px-4 py-2 hover:bg-sky-100 ${i18n.language === lang.code ? 'font-bold text-sky-600' : 'text-gray-800'}`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                {t('navbar.login')}
              </Button>
            </Link>
            <Link href="/post-ad" className="block">
              <Button className="w-full bg-[#ffb703] hover:bg-[#e4ac29] text-black">
                <Plus className="h-4 w-4 mr-2 text-black" />
                {t('navbar.postAd')}
              </Button>
            </Link>
            <div className="mt-2">
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    className={`flex-1 ${i18n.language === lang.code ? 'bg-yellow-400 text-black' : 'bg-white text-black border border-gray-300'} px-2 py-1`}
                    onClick={() => handleLanguageChange(lang.code)}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
