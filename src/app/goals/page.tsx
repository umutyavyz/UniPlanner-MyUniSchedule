import { Metadata } from 'next';
import { headers } from 'next/headers';
import GoalsClient from './GoalsClient';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Haftalık Hedefler - Akademik Hedef Takibi'
        : 'Weekly Goals - Academic Goal Tracker';

    const description = isTR
        ? 'Haftalık akademik hedeflerinizi belirleyin ve takip edin. Streak sistemi ile motivasyonunuzu koruyun.'
        : 'Set and track your weekly academic goals. Keep your motivation with streak system.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'haftalık hedef, akademik hedef, hedef takip, streak, verimlilik'
            : 'weekly goals, academic goals, goal tracking, streak, productivity',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/goals'
        }
    };
}

export default function GoalsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Weekly Goals",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "description": "Set and track weekly academic goals. Maintain streaks and boost motivation. Free goal tracker.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Weekly Goal Setting",
            "Streak Tracking",
            "Progress Visualization"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <GoalsClient />
        </>
    );
}
