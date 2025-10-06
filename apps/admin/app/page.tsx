'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Root page for the admin app.  It redirects users to the appropriate
 * location based on the presence of a token.  If the user is authenticated
 * the dashboard is shown; otherwise they are sent to the login page.
 */
export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return null;
}
