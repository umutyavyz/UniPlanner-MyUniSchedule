import { Metadata } from 'next';
import { headers } from 'next/headers';
import ExamsClient from './ExamsClient';

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
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/exams'
        }
    };
}

export default function ExamsPage() {
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
            <ExamsClient />
        </>
    );
}
