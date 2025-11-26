import { Metadata } from 'next';
import GPACalculatorClient from './GPACalculatorClient';
import { translations } from '@/lib/i18n';

export const metadata: Metadata = {
  title: translations.tr.gpaPageTitle,
  description: translations.tr.gpaPageDescription,
  keywords: translations.tr.gpaKeywords,
  openGraph: {
    title: translations.tr.gpaPageTitle,
    description: translations.tr.gpaPageDescription,
    type: 'website',
  },
};

export default function GPACalculatorPage() {
  return <GPACalculatorClient />;
}
