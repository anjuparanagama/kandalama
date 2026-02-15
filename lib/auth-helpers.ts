/**
 * Get the correct redirect URL for OAuth callbacks
 * Uses NEXT_PUBLIC_BASE_URL if available, falls back to window.location.origin
 */
export function getOAuthRedirectUrl(path: string = '/auth/callback'): string {
  // In browser context
  if (typeof window !== 'undefined') {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    return `${baseUrl}${path}`;
  }

  // Server-side fallback
  return `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${path}`;
}
