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
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "UniPlanner Pro GPA Calculator",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "Any",
    "description": "Calculate your university GPA/CGPA easily. Supports 4.0 scale and AA/BA letter grades. Free online GPA calculator.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Calculate Semester GPA",
      "Calculate Cumulative GPA (CGPA)",
      "Supports 4.0 Scale",
      "Letter Grade Support (AA, BA, etc.)"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Çan eğrisi sistemi nedir?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Çan eğrisi (Bağıl Değerlendirme Sistemi), sınıfın genel başarısına göre notların belirlendiği bir sistemdir. Sınıf ortalaması düşükse, düşük puanlarla yüksek harf notları alınabilir."
        }
      },
      {
        "@type": "Question",
        "name": "FF alınan ders ortalamayı nasıl etkiler?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FF notunun katsayısı 0.00'dır. Bu, o dersin kredisinin toplam krediye eklendiği ancak puan havuzuna 0 puan katkı yaptığı anlamına gelir. Bu durum ortalamayı ciddi şekilde düşürür."
        }
      },
      {
        "@type": "Question",
        "name": "DC ve DD ile geçilir mi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DC ve DD notları Koşullu Geçer notlardır. Eğer genel ortalamanız 2.00 ve üzerindeyse bu derslerden geçmiş sayılırsınız. Ancak ortalamanız tutmuyorsa bu dersleri tekrar almanız gerekir."
        }
      },
      {
        "@type": "Question",
        "name": "Yaz okulu ortalamayı etkiler mi?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Evet, yaz okulunda alınan dersler ve notlar transkripte işlenir ve GANO hesaplamasına dahil edilir. Yaz okulu, düşük notlu dersleri yükseltmek için etkili bir yöntemdir."
        }
      },
      {
        "@type": "Question",
        "name": "Transkript nedir ve ne işe yarar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Transkript (Not Döküm Belgesi), öğrencinin üniversite eğitimi boyunca aldığı tüm dersleri, kredilerini, harf notlarını ve ortalamalarını resmi olarak gösteren belgedir."
        }
      },
      {
        "@type": "Question",
        "name": "Yatay geçiş için ortalama kaç olmalı?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yatay geçiş yapabilmek için genellikle GANO'nun en az 2.29 (4'lük sistemde) olması istenir. Popüler üniversiteler ve bölümler için rekabetçi ortalamalar 3.00 ve üzeridir."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GPACalculatorClient />
    </>
  );
}
