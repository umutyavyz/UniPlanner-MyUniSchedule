import { Metadata } from 'next';
import { headers } from 'next/headers';
import NotesClient from './NotesClient';

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
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/notes'
        }
    };
}

export default function NotesPage() {
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
            <NotesClient />
        </>
    );
}
