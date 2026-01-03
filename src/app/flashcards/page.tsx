import { Metadata } from 'next';
import { headers } from 'next/headers';
import FlashcardsClient from './FlashcardsClient';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Çalışma Kartları - Flashcard Oluşturucu'
        : 'Flashcards - Study Card Creator';

    const description = isTR
        ? 'Hafıza kartları ile etkili çalışın. Kendi flashcard destelerinizi oluşturun ve öğrenme sürecinizi takip edin.'
        : 'Study effectively with flashcards. Create your own decks and track your learning progress.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'flashcard, hafıza kartı, çalışma kartı, ezber, ders çalışma, öğrenme'
            : 'flashcard, memory card, study card, memorization, studying, learning',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/flashcards'
        }
    };
}

export default function FlashcardsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Flashcards",
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Any",
        "description": "Create and study flashcards online. Track your learning progress with spaced repetition. Free flashcard maker.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Create unlimited decks",
            "Spaced Repetition",
            "Progress Tracking"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <FlashcardsClient />
        </>
    );
}
