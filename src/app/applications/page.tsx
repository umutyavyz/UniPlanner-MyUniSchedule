import { Metadata } from 'next';
import { headers } from 'next/headers';
import ApplicationsClient from './ApplicationsClient';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Staj & İş Başvuru Takibi - Başvuru Yönetimi'
        : 'Job Application Tracker - Application Management';

    const description = isTR
        ? 'Staj ve iş başvurularınızı takip edin. Başvuru durumlarını güncelleyin, mülakatları ve teklifleri yönetin.'
        : 'Track your internship and job applications. Update application statuses, manage interviews and offers.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'staj başvuru, iş başvuru takip, mülakat takip, kariyer yönetimi, başvuru durumu'
            : 'internship application, job application tracker, interview tracker, career management, application status',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/applications'
        }
    };
}

export default function ApplicationsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Job Applications",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "description": "Track job and internship applications. Manage interview dates and application statuses. Free career tool.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Application Status Tracking",
            "Interview Management",
            "Offer Tracking"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ApplicationsClient />
        </>
    );
}
