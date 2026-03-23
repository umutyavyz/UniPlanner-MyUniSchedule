import { Metadata } from 'next';
import { headers } from 'next/headers';
import HabitsClient from './HabitsClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Alışkanlık Takipçisi - Günlük Alışkanlık ve Seri Takibi'
        : 'Habit Tracker - Daily Habit & Streak Tracker for Students';

    const description = isTR
        ? 'Günlük alışkanlıklarınızı takip edin, serilerinizi koruyun ve kişisel gelişiminizi izleyin. Ücretsiz alışkanlık takip uygulaması.'
        : 'Track your daily habits, maintain streaks, and monitor personal growth. Free habit tracker for university students.';

    return {
        title,
        description,
        keywords: isTR
            ? 'alışkanlık takipçisi, günlük alışkanlık, seri takibi, kişisel gelişim, verimlilik'
            : 'habit tracker, daily habits, streak tracker, personal development, productivity, student habits',
        openGraph: {
            title,
            description,
            type: 'website',
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/habits'
        }
    };
}

export default function HabitsPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Alışkanlık takipçisi nedir ve neden kullanmalıyım?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Alışkanlık takipçisi, günlük rutinlerinizi ve hedeflerinizi takip etmenizi sağlayan bir araçtır. Düzenli kullanım, yeni alışkanlıklar edinmenize, kötü alışkanlıkları bırakmanıza ve seri (streak) oluşturmanıza yardımcı olur. Araştırmalar, bir davranışın alışkanlık haline gelmesi için ortalama 66 gün tekrar gerektiğini göstermektedir."
                }
            },
            {
                "@type": "Question",
                "name": "Üniversite öğrencileri için hangi alışkanlıklar faydalıdır?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Öğrenciler için faydalı alışkanlıklar arasında günlük okuma, düzenli uyku saati, egzersiz, ders çalışma bloğu, meditasyon, su içme ve sağlıklı beslenme sayılabilir. Bu alışkanlıkları küçük adımlarla başlatmak ve gün geçtikçe artırmak en etkili yaklaşımdır."
                }
            },
            {
                "@type": "Question",
                "name": "Seri (streak) neden önemlidir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Seri, bir alışkanlığı arka arkaya kaç gün yaptığınızı gösterir. Seriler, motivasyonu artırır ve seriyi bozmak istememe duygusu davranışı pekiştirir. 'Seriyi kırma' motivasyonu, alışkanlık oluşturmanın en güçlü psikolojik araçlarından biridir."
                }
            },
            {
                "@type": "Question",
                "name": "Kaç alışkanlığı aynı anda takip etmeliyim?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Araştırmalar, aynı anda 3-5'ten fazla alışkanlık edinmeye çalışmanın başarı oranını düşürdüğünü göstermektedir. Başlangıçta 2-3 temel alışkanlıkla başlayın, bunları otomatikleştirdikten sonra yenilerini ekleyin. Kalite, kaintitenin önüne geçer."
                }
            }
        ]
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Habit Tracker",
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "description": "Free habit tracker for university students. Build daily habits, track streaks, and monitor personal growth.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Daily Habit Check-off",
            "Streak Tracking",
            "Progress Statistics",
            "Custom Habit Colors & Icons",
            "Weekly Overview"
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
                { name: 'Alışkanlık Takipçisi', href: '/habits' }
            ]} />
            <HabitsClient />
        </>
    );
}
