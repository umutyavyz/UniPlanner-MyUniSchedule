import { Metadata } from 'next';
import { headers } from 'next/headers';
import NotesClient from './NotesClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Ders Notları - Not Defteri'
        : 'Course Notes - Notebook';

    const description = isTR
        ? 'Ders notlarınızı düzenli tutun. Ders bazlı not alma, etiketleme ve arama özellikleri.'
        : 'Keep your course notes organized. Course-based note taking, tagging and search features.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'ders notu, not defteri, üniversite notları, ders çalışma, not alma'
            : 'course notes, notebook, university notes, studying, note taking',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/notes'
        }
    };
}

export default function NotesPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Üniversitede ders notu tutmanın en iyi yöntemi nedir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Cornell yöntemi, zihin haritaları ve özetleme gibi aktif not alma teknikleri öğrenmeyi güçlendirir. Derste not alırken ana fikri yakalamaya odaklanın, sonra kendi kelimelerinizle özetleyin. Dijital not tutma araçları, notlarınızı her yerden erişilebilir ve aranabilir hale getirir."
                }
            },
            {
                "@type": "Question",
                "name": "Dersi kaçırırsam notlara nasıl ulaşırım?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Sınıf arkadaşlarından not alabilir, hocadan ders materyali talep edebilir veya hocanın paylaştığı ders notları ve sunumları inceleyebilirsiniz. UniPlanner Pro'da ders bazlı not tutarak tüm notlarınızı düzenli saklayabilirsiniz."
                }
            },
            {
                "@type": "Question",
                "name": "Dijital mi kağıt not tutmak mı daha iyidir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Araştırmalar, el yazısıyla not tutmanın kavramsal öğrenmeyi güçlendirdiğini göstermektedir. Ancak dijital notlar aranabilir, düzenlenebilir ve yedeklenebilir. En iyi yaklaşım hibrit yöntemdir: derste el yazısıyla not alın, sonra dijital ortama aktarın."
                }
            }
        ]
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Notes",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "description": "Take organized course notes. Categorize by subject, tag important topics, and access anywhere. Free student notes app.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Course-based organization",
            "Rich text editing",
            "Tagging system"
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
                { name: 'Ders Notları', href: '/notes' }
            ]} />
            <NotesClient />
        </>
    );
}
