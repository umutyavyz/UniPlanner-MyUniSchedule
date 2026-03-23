import { Metadata } from 'next';
import { headers } from 'next/headers';
import ApplicationsClient from './ApplicationsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Staj & İş Başvuru Takibi - Başvuru Yönetimi'
        : 'Job Application Tracker - Application Management';

    const description = isTR
        ? 'Staj ve iş başvurularınızı takip edin. Başvuru durumlarını güncelleyin, mülakatları ve teklifleri yönetin.'
        : 'Track your internship and job applications. Update application statuses, manage interviews and offers.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'staj başvuru, iş başvuru takip, mülakat takip, kariyer yönetimi, başvuru durumu'
            : 'internship application, job application tracker, interview tracker, career management, application status',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/applications'
        }
    };
}

export default function ApplicationsPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Üniversite öğrencisi staj başvurusu nasıl yapılır?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Staj başvurusu için önce CV ve ön yazı hazırlayın. LinkedIn, Kariyer.net, şirket web siteleri ve üniversite kariyer merkezleri üzerinden başvurun. Başvurularınızı takip edin, mülakat davetlerini kaçırmamak için hatırlatıcılar kurun."
                }
            },
            {
                "@type": "Question",
                "name": "Birden fazla iş başvurusunu nasıl yönetirim?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Her başvuru için şirket adı, pozisyon, başvuru tarihi, durum (beklemede/mülakata davet/kabul/red) ve notları kaydedin. UniPlanner Pro İş Başvuru Takip aracı bu süreçleri organize etmenizi sağlar."
                }
            },
            {
                "@type": "Question",
                "name": "Staj süreci ne kadar sürer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Staj süreçleri şirketten şirkete değişir. Genellikle CV değerlendirme (1-2 hafta), teknik mülakat veya vaka çalışması (1 hafta), HR mülakatı ve teklif aşamalarından oluşur. Büyük şirketlerde bu süreç 1-2 ayı bulabilir."
                }
            }
        ]
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Job Applications",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "description": "Track job and internship applications. Manage interview dates and application statuses. Free career tool.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Application Status Tracking",
            "Interview Management",
            "Offer Tracking"
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
                { name: 'Staj & İş Başvuru Takibi', href: '/applications' }
            ]} />
            <ApplicationsClient />
        </>
    );
}
