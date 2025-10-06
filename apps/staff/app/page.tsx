import { redirect } from 'next/navigation';

/**
 * Redirect root of staff module to the scan page.  In a full SSR
 * implementation you would check session cookies here.
 */
export default function Home() {
  redirect('/scan');
}
