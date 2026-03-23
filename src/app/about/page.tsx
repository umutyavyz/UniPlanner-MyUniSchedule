import { Metadata } from 'next';
import { headers } from 'next/headers';
import AboutClient from './AboutClient';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const country = headersList.get('x-vercel-ip-country');
  const isTR = country === 'TR' || acceptLanguage.includes('tr');

  const title = isTR
    ? 'Hakkımızda | UniPlanner Pro'
    : 'About Us | UniPlanner Pro';

  const description = isTR
    ? 'UniPlanner Pro, üniversite öğrencilerinin akademik hayatını kolaylaştırmak için geliştirilmiş ücretsiz bir araçlar platformudur. Misyonumuz, öğrencilere ücretsiz ve gizlilik odaklı araçlar sunmaktır.'
    : 'UniPlanner Pro is a free toolkit for university students to simplify academic life. Our mission is to provide free, privacy-focused tools for students worldwide.';

  return {
    title,
    description,
    keywords: isTR
      ? 'uniplanner hakkında, üniversite araçları, öğrenci platformu, ücretsiz akademik araçlar'
      : 'about uniplanner, university tools, student platform, free academic tools',
    openGraph: {
      title,
      description,
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    alternates: {
      canonical: 'https://www.myunischedule.com/about',
    },
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
