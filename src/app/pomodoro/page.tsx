import { Metadata } from 'next';
import { headers } from 'next/headers';
import PomodoroClient from './PomodoroClient';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Pomodoro Sayacı - Odaklanma ve Verimlilik Aracı'
        : 'Pomodoro Timer - Focus & Productivity Tool';

    const description = isTR
        ? 'Pomodoro tekniği ile çalışma verimliliğinizi artırın. 25 dakika odaklan, 5 dakika mola ver. Ücretsiz online Pomodoro sayacı.'
        : 'Boost your productivity with the Pomodoro technique. Focus for 25 minutes, take a 5-minute break. Free online Pomodoro timer.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'pomodoro sayacı, pomodoro tekniği, odaklanma zamanlayıcı, ders çalışma zamanlayıcı, verimlilik aracı'
            : 'pomodoro timer, pomodoro technique, focus timer, study timer, productivity tool',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/pomodoro'
        }
    };
}

export default function PomodoroPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Pomodoro Timer",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "description": "Boost productivity with the Pomodoro technique. Customizable timer, tracked sessions, and focus mode. Free online Pomodoro timer.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Customizable Timer",
            "Focus Stats",
            "Minimalist Design"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PomodoroClient />
        </>
    );
}
