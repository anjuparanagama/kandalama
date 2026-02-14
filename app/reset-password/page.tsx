'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('resetPassword.passwordMismatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('resetPassword.passwordTooShort'));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      setSuccess(true);

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to reset password. Please try again.');
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
                <CardTitle>{t('resetPassword.title')}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {success ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
                      <p className="font-semibold mb-2">{t('resetPassword.successTitle')}</p>
                      <p className="text-sm">{t('resetPassword.successMessage')}</p>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      {t('resetPassword.redirecting')}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="password">{t('resetPassword.newPasswordLabel')}</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">{t('resetPassword.passwordHint')}</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">{t('resetPassword.confirmPasswordLabel')}</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? t('resetPassword.updating') : t('resetPassword.resetButton')}
                    </Button>

                    <p className="text-center text-sm text-gray-600 mt-4">
                      <Link href="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
                        {t('resetPassword.backToLogin')}
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
            <h2 className="text-3xl font-bold mt-4">{t('resetPassword.panelTitle')}</h2>
            <p className="mt-2 text-white">{t('resetPassword.panelSubtitle')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
