'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function AuthStateHandler() {
  const router = useRouter();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // User just signed in
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        router.refresh();
      } else if (event === 'USER_UPDATED') {
        // User info was updated
        router.refresh();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  return null;
}
