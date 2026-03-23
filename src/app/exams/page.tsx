import { Metadata } from 'next';
import { headers } from 'next/headers';
import ExamsClient from './ExamsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Sınav Takvimi - Vize Final Tarihleri Takibi'
        : 'Exam Calendar - Midterm Final Date Tracker';

    const description = isTR
        ? 'Üniversite sınav tarihlerinizi takip edin. Vize, final ve quiz tarihlerini kaydedin, geri sayım görün.'
        : 'Track your university exam dates. Save midterm, final and quiz dates, see countdown timers.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'sınav takvimi, vize tarihi, final tarihi, üniversite sınav, sınav geri sayım'
            : 'exam calendar, midterm date, final date, university exam, exam countdown',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/exams'
        }
    };
}

export default function ExamsPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Sınav için ne kadar önceden çalışmaya başlamalıyım?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Vize sınavları için en az 2 hafta, final sınavları için en az 3-4 hafta önceden çalışmaya başlamak önerilir. Konuyu daha önce kavramış ve düzenli çalışmışsanız 1 hafta yoğun tekrar yeterli olabilir."
                }
            },
            {
                "@type": "Question",
                "name": "Vize ile final sınavı arasındaki fark nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Vize sınavı dönemin ortasında, ilk yarının konularını kapsayan sınavdır. Final sınavı ise dönemin sonunda tüm konuları kapsayabilir. Genellikle vize %40, final %60 ağırlıkla ortalamaya katılır, ancak bu oran üniversiteden üniversiteye değişir."
                }
            },
            {
                "@type": "Question",
                "name": "Sınav takvimimi nasıl yönetebilirim?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Tüm sınav tarihlerini tek bir yerde toplayın, aralarındaki süreye göre çalışma planı yapın. Aynı güne denk gelen sınavlar için önceden bölüm sekreterliğiyle iletişime geçin. UniPlanner Pro Sınav Takvimi aracı ile geri sayım takip edebilirsiniz."
                }
            }
        ]
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Exam Calendar",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "description": "Track midterm and final exam dates with countdowns. Organize your study schedule.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Exam Date Tracking",
            "Countdown Timers",
            "Study Schedule Integration"
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
                { name: 'Sınav Takvimi', href: '/exams' }
            ]} />
            <ExamsClient />
        </>
    );
}
