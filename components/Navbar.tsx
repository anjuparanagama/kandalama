'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Menu, X, Plus, LogIn, Globe, ChevronDown, LogOut, User, Package } from 'lucide-react';
import localFont from 'next/font/local';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/supabase';

const unBaron = localFont({ src: '../un-baron-prod.ttf', display: 'swap' });

export default function Navbar() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLangs, setShowLangs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const langBtnRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!showUserMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        // Check if click is on AlertDialog (backdrop/overlay)
        const target = e.target as HTMLElement;
        const isDialogContent = target.closest('[role="alertdialog"]') || 
                               target.closest('[data-state="open"]');
        if (!isDialogContent) {
          setShowUserMenu(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showUserMenu]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
        setLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);


  const languages = [
    { code: 'en', label: 'English' },
    { code: 'si', label: 'සිංහල' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    setShowLangs(false);
  };

  const handleLogout = async () => {
    try {
      console.log('logout: initiating signOut');
      await supabase.auth.signOut();
      console.log('logout: signOut completed');
      setUser(null);
      // redirect to home after logout
      try {
        router.push('/');
      } catch (err) {
        console.warn('Router push after logout failed', err);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
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

          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-14 h-12 rounded-full bg-white border-0 shadow-sm placeholder:text-gray-400 focus:!bg-[#fff7d6] focus-visible:!bg-[#fff7d6] transition-colors"
                />

                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 rounded-full p-2 h-10 w-10 flex items-center justify-center shadow transition-colors"
                >
                  <Search className="h-4 w-4 text-gray-800" />
                </button>
              </div>
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-4 flex-1 justify-end">
            {!user && (
              <Link href="/login">
                <Button className="bg-[#ffb703] hover:bg-[#e6a103] text-black flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('navbar.login')}
                </Button>
              </Link>
            )}
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
            {user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  className="flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full p-2.5 shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  onClick={() => setShowUserMenu((prev) => !prev)}
                  aria-label="User menu"
                  type="button"
                >
                  <User className="w-5 h-5" />
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header with user email */}
                    <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Account</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                    </div>
                    
                    {/* Menu items */}
                    <div className="py-2">
                      <Link href="/my-ads" className="block">
                        <button
                          onClick={() => setShowUserMenu(false)}
                          className="w-full text-left px-5 py-3 hover:bg-blue-50 text-gray-800 flex items-center gap-3 transition-colors duration-150 group"
                        >
                          <Package className="h-4 w-4 text-blue-600 group-hover:text-blue-700" />
                          <span className="font-medium">My Ads</span>
                        </button>
                      </Link>
                    </div>

                    {/* Logout button */}
                    <div className="border-t border-gray-100 py-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors duration-150 group"
                            type="button"
                          >
                            <LogOut className="h-4 w-4 group-hover:text-red-700" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm logout</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to log out? You will need to sign in again to access your account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel asChild>
                              <Button variant="outline">Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button onClick={() => { handleLogout(); setShowUserMenu(false); }} className="bg-red-500 hover:bg-red-600 text-white">
                                Logout
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            )}
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
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 h-10 rounded-full bg-white border-0 shadow-sm w-full focus:!bg-[#fff7d6] focus-visible:!bg-[#fff7d6] transition-colors"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-400 hover:bg-yellow-500 rounded-full p-2 h-9 w-9 flex items-center justify-center shadow transition-colors"
            >
              <Search className="h-4 w-4 text-gray-800" />
            </button>
          </form>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white bg-gradient-to-b from-blue-600 to-blue-700">
          <div className="px-4 py-4 space-y-3">
            {!user && (
              <Link href="/login" className="block">
                <Button className="w-full bg-[#ffb703] hover:bg-[#e6a103] text-black flex items-center justify-center font-semibold rounded-lg">
                  <LogIn className="h-4 w-4 mr-2" />
                  {t('navbar.login')}
                </Button>
              </Link>
            )}
            {user && (
              <>
                <div className="w-full bg-white/15 backdrop-blur-sm text-white px-4 py-4 rounded-lg flex items-center gap-3 border border-white/20">
                  <div className="flex items-center justify-center bg-blue-500 rounded-full p-2">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">Account</p>
                    <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                  </div>
                </div>
                <Link href="/my-ads" className="block">
                  <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg">
                    <Package className="h-4 w-4 mr-2" />
                    My Ads
                  </Button>
                </Link>
              </>
            )}
            <Link href="/post-ad" className="block">
              <Button className="w-full bg-[#ffb703] hover:bg-[#e6a103] text-black font-semibold rounded-lg">
                <Plus className="h-4 w-4 mr-2 text-black" />
                {t('navbar.postAd')}
              </Button>
            </Link>
            {user && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out? You will need to sign in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button onClick={() => { handleLogout(); }} className="bg-red-500 hover:bg-red-600 text-white">
                        Logout
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <div className="mt-4 pt-3 border-t border-white/20">
              <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 px-1">Language</p>
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    className={`flex-1 rounded-lg font-medium transition-all ${i18n.language === lang.code ? 'bg-[#ffb703] text-black shadow-md' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}
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
