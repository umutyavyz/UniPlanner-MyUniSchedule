import { Metadata } from 'next';
import { headers } from 'next/headers';
import TermsClient from './TermsClient';
import { translations } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const country = headersList.get('x-vercel-ip-country');
  const isTR = country === 'TR' || acceptLanguage.includes('tr');

  return {
    title: isTR ? 'Kullanım Şartları | UniPlanner Pro' : 'Terms of Service | UniPlanner Pro',
    description: isTR 
      ? 'UniPlanner Pro Kullanım Şartları. Hizmet kullanım koşulları ve yasal uyarılar.' 
      : 'UniPlanner Pro Terms of Service. Conditions of use and legal disclaimers.',
    alternates: {
      canonical: 'https://www.myunischedule.com/terms'
    }
  };
}

export default function TermsPage() {
  return <TermsClient />;
}
