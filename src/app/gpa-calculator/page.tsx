import { Metadata } from 'next';
import { headers } from 'next/headers';
import GPACalculatorClient from './GPACalculatorClient';
import { translations } from '@/lib/i18n';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const country = headersList.get('x-vercel-ip-country');
  const isTR = country === 'TR' || acceptLanguage.includes('tr');

  const t = isTR ? translations.tr : translations.en;

  return {
    title: t.gpaPageTitle,
    description: t.gpaPageDescription,
    keywords: t.gpaKeywords,
    openGraph: {
      title: t.gpaPageTitle,
      description: t.gpaPageDescription,
      type: 'website',
    },
    alternates: {
      canonical: 'https://www.myunischedule.com/gpa-calculator'
    }
  };
}

export default function GPACalculatorPage() {
  return <GPACalculatorClient />;
}
