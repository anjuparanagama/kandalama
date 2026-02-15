import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const errorDescription = requestUrl.searchParams.get('error_description');
  const redirect = requestUrl.searchParams.get('redirect') || '/';

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    const redirectUrl = new URL('/', requestUrl.origin);
    redirectUrl.searchParams.set('error', error);
    redirectUrl.searchParams.set('error_description', errorDescription || '');
    return NextResponse.redirect(redirectUrl);
  }

  // Exchange code for session (authorization code flow)
  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    try {
      const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (sessionError) {
        console.error('Session exchange error:', sessionError);
        const redirectUrl = new URL('/', requestUrl.origin);
        redirectUrl.searchParams.set('error', 'session_error');
        return NextResponse.redirect(redirectUrl);
      }

      // Set response with auth cookie
      const response = NextResponse.redirect(new URL(redirect, requestUrl.origin));
      return response;
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      const redirectUrl = new URL('/', requestUrl.origin);
      redirectUrl.searchParams.set('error', 'exchange_error');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // If no code, just redirect to home
  return NextResponse.redirect(new URL(redirect, requestUrl.origin));
}
