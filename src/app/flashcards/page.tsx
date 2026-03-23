import { Metadata } from 'next';
import { headers } from 'next/headers';
import FlashcardsClient from './FlashcardsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

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
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/flashcards'
        }
    };
}

export default function FlashcardsPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Flashcard ile çalışmak neden etkilidir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Flashcard yöntemi, aktif hatırlama (active recall) ilkesine dayanır. Bir kartı görüp cevabı hatırlamaya çalışmak, pasif okumaya kıyasla bilgiyi çok daha kalıcı hale getirir. Spaced repetition (aralıklı tekrar) ile birleştirildiğinde en etkili öğrenme yöntemlerinden biridir."
                }
            },
            {
                "@type": "Question",
                "name": "Spaced repetition (aralıklı tekrar) nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Spaced repetition, bilgiyi unutmadan hemen önce tekrar etme prensibine dayanan bir öğrenme tekniğidir. İyi bilinen kartlar daha uzun aralıklarla, zor kartlar daha sık gösterilir. Bu yöntem hem ezberleme süresini kısaltır hem de bilginin uzun süreli belleğe aktarılmasını sağlar."
                }
            },
            {
                "@type": "Question",
                "name": "Hangi dersler için flashcard kullanmalıyım?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Flashcard özellikle tanım, terim, formül, tarih, kelime ve kavram gibi ezberlenmesi gereken bilgiler için idealdir. Anatomi, yabancı dil, hukuk, muhasebe ve tarih gibi bilgi yoğun dersler için çok etkilidir."
                }
            }
        ]
    };

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <BreadcrumbSchema items={[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Flashcard Çalışma', href: '/flashcards' }
            ]} />
            <FlashcardsClient />
        </>
    );
}
