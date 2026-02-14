'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import localFont from 'next/font/local';
import { useTranslation } from 'react-i18next';

const unBaron = localFont({ src: '../../un-baron-prod.ttf', display: 'swap' });

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
      setEmail('');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden md:flex">
          {/* Left: form */}
          <div className="w-full md:w-1/2 p-4 sm:p-6">
            <Card className="w-full">
              <CardHeader className="items-center text-center p-4 sm:p-6">
                <CardTitle>{t('forgotPassword.title')}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {success ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
                      <p className="font-semibold mb-2">{t('forgotPassword.successTitle')}</p>
                      <p className="text-sm">{t('forgotPassword.successMessage')}</p>
                    </div>
                    <Link href="/login">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                        {t('forgotPassword.backToLogin')}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600 mb-4">
                      {t('forgotPassword.description')}
                    </p>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('forgotPassword.emailLabel')}</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? t('forgotPassword.sending') : t('forgotPassword.sendButton')}
                    </Button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                      {t('forgotPassword.rememberPassword')}{' '}
                      <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
                        {t('forgotPassword.backToLoginLink')}
                      </Link>
                    </p>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right: welcome/art panel */}
          <div className="hidden md:flex md:w-1/2 bg-[#003566] text-white p-6 sm:p-8 flex-col items-center justify-center text-center">
            <Link href="/" className="flex items-center -space-x-5">
              <div className="p-2 rounded-lg">
                <Image src="/icon.png" alt="logo" width={60} height={50} className="object-contain" />
              </div>
              <span className={`text-2xl font-medium text-white pt-5 ${unBaron.className}`}>කණ්ඩළම<span className="text-[8px]"> Lk</span></span>
            </Link>
            <h2 className="text-3xl font-bold mt-4">{t('forgotPassword.panelTitle')}</h2>
            <p className="mt-2 text-white">{t('forgotPassword.panelSubtitle')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
