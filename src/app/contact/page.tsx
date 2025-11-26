import { Metadata } from 'next';
import { headers } from 'next/headers';
import ContactClient from './ContactClient';
import { translations } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const country = headersList.get('x-vercel-ip-country');
  const isTR = country === 'TR' || acceptLanguage.includes('tr');

  const t = isTR ? translations.tr : translations.en;

  return {
    title: isTR ? 'İletişim | UniPlanner Pro' : 'Contact | UniPlanner Pro',
    description: isTR 
      ? 'UniPlanner Pro ile iletişime geçin. Öneri, hata bildirimi veya destek için bize ulaşın.' 
      : 'Contact UniPlanner Pro. Reach out for suggestions, bug reports, or support.',
    alternates: {
      canonical: 'https://www.myunischedule.com/contact'
    }
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
