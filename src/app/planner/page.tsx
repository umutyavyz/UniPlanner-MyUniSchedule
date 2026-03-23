import { Metadata } from 'next';
import { headers } from 'next/headers';
import PlannerClient from './PlannerClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Ders Programı Oluşturucu - Haftalık Üniversite Takvimi'
        : 'Course Schedule Maker - Weekly University Planner';

    const description = isTR
        ? 'Üniversite ders programınızı saniyeler içinde oluşturun. Çakışmaları otomatik tespit edin, renkli haftalık plan hazırlayın ve PDF/Resim olarak indirin. Ücretsiz!'
        : 'Create your university schedule in seconds. Auto-detect conflicts, build a colorful weekly plan, and download as PDF/Image. 100% Free!';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'ders programı hazırlama, üniversite ders programı, haftalık program, çakışma önleyici, ders programı oluşturucu'
            : 'course schedule maker, university timetable, weekly planner, conflict detector, schedule builder',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/planner'
        }
    };
}

export default function PlannerPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "UniPlanner Pro Course Scheduler",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "description": "Create university course schedules in seconds. Detect conflicts, download as PDF/Image. Free university planner.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Weekly Schedule Maker",
            "Conflict Detection",
            "PDF/Image Export",
            "CRN Support"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BreadcrumbSchema items={[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Ders Programı Oluşturucu', href: '/planner' }
            ]} />
            <PlannerClient />
        </>
    );
}
