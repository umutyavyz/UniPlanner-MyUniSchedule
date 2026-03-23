import { Metadata } from 'next';
import { headers } from 'next/headers';
import AssignmentsClient from './AssignmentsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Ödev Takip Sistemi - Deadline Hatırlatıcı'
        : 'Assignment Tracker - Deadline Reminder';

    const description = isTR
        ? 'Üniversite ödevlerinizi ve teslim tarihlerini takip edin. Öncelik belirleyin, deadline\'ları kaçırmayın.'
        : 'Track your university assignments and due dates. Set priorities, never miss a deadline.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'ödev takip, deadline hatırlatıcı, teslim tarihi takip, üniversite ödev, ödev yönetimi'
            : 'assignment tracker, deadline reminder, due date tracker, university homework, task management',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/assignments'
        }
    };
}

export default function AssignmentsPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Üniversite ödevlerini nasıl takip edebilirim?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Ödevlerinizi takip etmek için teslim tarihi, ders adı, öncelik seviyesi ve tamamlanma durumu gibi bilgileri kayıt altına alın. UniPlanner Pro Ödev Takip aracı ile deadline'larınızı görsel olarak takip edebilir ve acil ödevlerinizi önceliklendirebilirsiniz."
                }
            },
            {
                "@type": "Question",
                "name": "Ödev ve projeleri organize etmenin en iyi yolu nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Büyük projeleri küçük görevlere bölün. Her göreve gerçekçi bir son tarih koyun ve öncelik seviyeleri (yüksek/orta/düşük) atayın. Pomodoro tekniği ile çalışarak her oturumda hangi ödev veya proje parçası üzerinde çalışacağınızı planlayın."
                }
            },
            {
                "@type": "Question",
                "name": "Deadline'ı kaçırırsam ne olur?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Çoğu üniversitede geç teslim edilen ödevler için not kesintisi uygulanır ya da ödev kabul edilmez. Deadline'ı kaçıracağınızı anlarsanız hocayla önceden iletişime geçerek uzatma talep edin. Geç teslim yapmak, hiç teslim etmemekten iyidir."
                }
            }
        ]
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Assignment Tracker",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "description": "Track assignments and projects with due dates and priority levels. Never miss a deadline.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Deadline Tracking",
            "Priority Levels",
            "Status Management"
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
                { name: 'Ödev Takip', href: '/assignments' }
            ]} />
            <AssignmentsClient />
        </>
    );
}
