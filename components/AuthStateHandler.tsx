'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function AuthStateHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasInitialized = useRef(false);

  const handleHashAuth = useCallback(async () => {
    // Check if there are auth params in the hash (implicit flow)
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1); // Remove #
      const params = new URLSearchParams(hash);
      
      const accessToken = params.get('access_token');
      const expiresIn = params.get('expires_in');
      const refreshToken = params.get('refresh_token');
      const tokenType = params.get('token_type');

      if (accessToken) {
        try {
          // Set the session with the token we got from the hash
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (!error && data.session) {
            // Clear the hash from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Trigger a refresh to update auth state
            router.refresh();
          }
        } catch (error) {
          console.error('Error setting session from hash:', error);
        }
        return true;
      }
    }
    return false;
  }, [router]);

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

    // First try to handle hash-based auth (implicit flow)
    handleHashAuth().then((handled) => {
      if (!handled) {
        // If no hash auth, check regular session
        handleAuthState();
      }
    });

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
  }, [handleHashAuth, handleAuthState, searchParams, router]);

  return null;
}
