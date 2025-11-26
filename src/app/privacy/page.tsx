import { Metadata } from 'next';
import { headers } from 'next/headers';
import PrivacyClient from './PrivacyClient';
import { translations } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const country = headersList.get('x-vercel-ip-country');
  const isTR = country === 'TR' || acceptLanguage.includes('tr');

  return {
    title: isTR ? 'Gizlilik Politikası | UniPlanner Pro' : 'Privacy Policy | UniPlanner Pro',
    description: isTR 
      ? 'UniPlanner Pro Gizlilik Politikası. Verilerinizin nasıl korunduğunu ve saklandığını öğrenin.' 
      : 'UniPlanner Pro Privacy Policy. Learn how your data is protected and stored.',
    alternates: {
      canonical: 'https://www.myunischedule.com/privacy'
    }
  };
}

export default function PrivacyPage() {
  return <PrivacyClient />;
}
