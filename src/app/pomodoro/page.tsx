import { Metadata } from 'next';
import { headers } from 'next/headers';
import PomodoroClient from './PomodoroClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

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
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/pomodoro'
        }
    };
}

export default function PomodoroPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Pomodoro tekniği nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pomodoro tekniği, Francesco Cirillo tarafından geliştirilen bir zaman yönetimi yöntemidir. 25 dakika odaklanarak çalışma, ardından 5 dakika kısa mola şeklinde döngüler halinde uygulanır. Her 4 Pomodoro sonrası 15-30 dakika uzun mola verilir."
                }
            },
            {
                "@type": "Question",
                "name": "Pomodoro tekniği öğrencilere nasıl yardımcı olur?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Pomodoro tekniği, öğrencilerin konsantrasyonunu artırır, erteleme alışkanlığını kırar ve beyin yorgunluğunu azaltır. 25 dakikalık odaklı çalışma periyotları, uzun ders çalışma seanslarına kıyasla daha verimli öğrenme sağlar."
                }
            },
            {
                "@type": "Question",
                "name": "Pomodoro aralıkları özelleştirilebilir mi?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet, UniPlanner Pro Pomodoro sayacında çalışma süresi, kısa mola ve uzun mola sürelerini ihtiyacınıza göre ayarlayabilirsiniz. Standart 25/5 yerine 50/10 gibi kendi ritminize uygun aralıklar belirleyebilirsiniz."
                }
            },
            {
                "@type": "Question",
                "name": "Günde kaç Pomodoro yapmalıyım?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Başlangıç için günde 4-6 Pomodoro (2-3 saat odaklanmış çalışma) idealdir. Deneyim kazandıkça günde 8-12 Pomodoro'ya çıkabilirsiniz. Önemli olan sayıdan çok kaliteli, kesintisiz çalışmadır."
                }
            }
        ]
    };

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <BreadcrumbSchema items={[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Pomodoro Sayacı', href: '/pomodoro' }
            ]} />
            <PomodoroClient />
        </>
    );
}
