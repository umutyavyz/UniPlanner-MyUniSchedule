import { Metadata } from 'next';
import { headers } from 'next/headers';
import DailyPlannerClient from './DailyPlannerClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Günlük Planlayıcı - Saatlik Gün Planlama Aracı'
        : 'Daily Planner - Hourly Day Planner for Students';

    const description = isTR
        ? 'Gününüzü saate göre planlayın, görevlerinizi zaman bloklarına yerleştirin ve verimliliğinizi maksimuma çıkarın. Ücretsiz günlük planlayıcı.'
        : 'Plan your day by the hour, schedule tasks in time blocks, and maximize your productivity. Free daily planner for university students.';

    return {
        title,
        description,
        keywords: isTR
            ? 'günlük planlayıcı, saatlik plan, zaman yönetimi, günlük program, verimlilik planlayıcı'
            : 'daily planner, hourly planner, time blocking, day scheduler, productivity planner, student planner',
        openGraph: {
            title,
            description,
            type: 'website',
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/daily-planner'
        }
    };
}

export default function DailyPlannerPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Günlük planlayıcı nedir ve nasıl kullanılır?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Günlük planlayıcı, gününüzü saate göre organize etmenizi sağlayan bir araçtır. Her saat dilimine görev, ders veya aktivite ekleyerek zamanınızı daha verimli kullanabilirsiniz. Sabah planladığınızda, gün boyunca daha odaklı çalışırsınız."
                }
            },
            {
                "@type": "Question",
                "name": "Zaman bloklama (time blocking) nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Zaman bloklama, belirli görevler için özel zaman dilimleri ayırma yöntemidir. Örneğin 09:00-11:00 matematik, 11:00-12:00 e-posta ve yönetim gibi. Bu yöntem, bağlamsal geçişleri azaltır ve derin odaklanmayı artırır. Araştırmalar, zaman bloklayan kişilerin %50'ye kadar daha verimli olduğunu göstermektedir."
                }
            },
            {
                "@type": "Question",
                "name": "Üniversite öğrencileri günlük planlarını nasıl oluşturmalı?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Üniversite öğrencileri için ideal günlük plan: sabah saatlerini yüksek öncelikli çalışmaya, öğleden sonrayı derslere ve öğleden sonra geç saatleri tekrara ayırın. Öğle arası ve kısa molalar koymayı unutmayın. Akşam saatlerini hafif okuma ve yarın için planlamaya bırakın."
                }
            },
            {
                "@type": "Question",
                "name": "Günlük planımı nasıl saklayabilirim?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "UniPlanner Pro günlük planlayıcı, verilerinizi otomatik olarak tarayıcınızın yerel depolamasına kaydeder. Hesap açmanıza veya kayıt olmanıza gerek yoktur. Gizliliğiniz korunur, verileriniz cihazınızda kalır."
                }
            }
        ]
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Daily Planner",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "description": "Free hourly daily planner for university students. Schedule tasks with time blocking and boost your daily productivity.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Hourly Schedule Grid",
            "Time Blocking",
            "Task Priorities",
            "Daily Notes",
            "Persistent Storage"
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
                { name: 'Günlük Planlayıcı', href: '/daily-planner' }
            ]} />
            <DailyPlannerClient />
        </>
    );
}
