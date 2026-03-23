import { Metadata } from 'next';
import { headers } from 'next/headers';
import GoalsClient from './GoalsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

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
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/goals'
        }
    };
}

export default function GoalsPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Akademik hedef nasıl belirlenir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SMART hedef yöntemi kullanın: Spesifik (bu haftaki hangi derse çalışacaksınız?), Ölçülebilir (kaç soru çözeceksiniz?), Ulaşılabilir (gerçekçi mi?), İlgili (uzun vadeli hedefinizle bağlantılı mı?) ve Zamanlı (ne zaman tamamlanacak?). Haftalık 3-5 hedef belirlemek başlangıç için idealdir."
                }
            },
            {
                "@type": "Question",
                "name": "Streak nedir ve motivasyona nasıl katkı sağlar?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Streak, hedeflerinizi arka arkaya kaç gün veya hafta tamamladığınızı gösteren bir sayaçtır. Duolingo gibi uygulamalarda yaygın kullanılan bu mekanizma, düzenli çalışma alışkanlığı geliştirmeye yardımcı olur. Streaki kırmamak için güçlü bir motivasyon kaynağı oluşturur."
                }
            },
            {
                "@type": "Question",
                "name": "Haftalık hedefleri tamamlayamazsam ne yapmalıyım?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Hedefleri tamamlayamama sürekli oluyorsa hedefleriniz çok yüksek olabilir. Daha küçük, ulaşılabilir adımlara bölün. Her hafta %80 başarı oranını tutturmak, %100 hedefleyip sürekli başarısız olmaktan çok daha motive edicidir."
                }
            }
        ]
    };

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <BreadcrumbSchema items={[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Haftalık Hedefler', href: '/goals' }
            ]} />
            <GoalsClient />
        </>
    );
}
