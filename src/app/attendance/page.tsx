import { Metadata } from 'next';
import { headers } from 'next/headers';
import AttendanceClient from './AttendanceClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Devamsızlık Takibi - Ders Katılım Hesaplayıcı'
        : 'Attendance Tracker - Class Participation Calculator';

    const description = isTR
        ? 'Üniversite derslerinize katılımınızı takip edin. Devamsızlık limitinizi aşmamak için kalan hakkınızı görün.'
        : 'Track your university class attendance. See how many classes you can miss before reaching the limit.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'devamsızlık takibi, yoklama takibi, ders katılım, devamsızlık hesaplama, üniversite devamsızlık'
            : 'attendance tracker, class participation, attendance calculator, university attendance',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/attendance'
        }
    };
}

export default function AttendancePage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Üniversitede devamsızlık sınırı nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Türkiye'deki çoğu üniversitede teorik dersler için devamsızlık sınırı toplam ders saatinin %30'u, uygulamalı dersler için %20'sidir. Örneğin haftada 3 saatlik bir derste 14 hafta boyunca en fazla 12-13 saat devamsızlık yapılabilir."
                }
            },
            {
                "@type": "Question",
                "name": "Devamsızlık sınırını aşarsam ne olur?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Devamsızlık sınırını aşan öğrenciler o dersin final sınavına giremez ve ders başarısız sayılır (DZ notu). Bu durum ortalamayı ciddi şekilde etkileyebilir. Notunuz ne olursa olsun, sınıra ulaştıktan sonra dersi tekrar almanız gerekir."
                }
            },
            {
                "@type": "Question",
                "name": "Sağlık raporu devamsızlığa sayılır mı?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Üniversitelerin büyük çoğunluğunda sağlık raporu devamsızlığı affetmez, yalnızca belgelenmiş mazereti olan öğrencilere ek haklar tanınabilir. Rapor durumunuz için mutlaka bölüm sekreterliğine veya öğrenci işlerine başvurun."
                }
            },
            {
                "@type": "Question",
                "name": "Kaç derse daha girebilirim nasıl hesaplanır?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Kalan devamsızlık hakkı şu formülle hesaplanır: İzin verilen maksimum devamsızlık saati eksi şimdiye kadar yapılan devamsızlık saati. UniPlanner Pro Devamsızlık Takip aracı bunu otomatik olarak hesaplar ve sizi uyarır."
                }
            }
        ]
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Attendance Tracker",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "description": "Track your university class attendance and calculate remaining skip rights. Free attendance tracker.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Track Absences",
            "Calculate Remaining Rights",
            "Visual Status Indicators"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <BreadcrumbSchema items={[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Devamsızlık Takibi', href: '/attendance' }
            ]} />
            <AttendanceClient />
        </>
    );
}
