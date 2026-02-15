'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function AuthStateHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  const handleAuthState = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is authenticated
        router.refresh();
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    }
  }, [router]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Check for OAuth errors in URL
    const error = searchParams.get('error');
    if (error) {
      console.error('OAuth error:', error, searchParams.get('error_description'));
    }

    handleAuthState();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Force refresh to ensure everything is up to date
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [handleAuthState, searchParams, router]);

  return null;
}
