import { Metadata } from 'next';
import { headers } from 'next/headers';
import AssignmentsClient from './AssignmentsClient';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Ödev Takip Sistemi - Deadline Hatırlatıcı'
        : 'Assignment Tracker - Deadline Reminder';

    const description = isTR
        ? 'Üniversite ödevlerinizi ve teslim tarihlerini takip edin. Öncelik belirleyin, deadline\'ları kaçırmayın.'
        : 'Track your university assignments and due dates. Set priorities, never miss a deadline.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'ödev takip, deadline hatırlatıcı, teslim tarihi takip, üniversite ödev, ödev yönetimi'
            : 'assignment tracker, deadline reminder, due date tracker, university homework, task management',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/assignments'
        }
    };
}

export default function AssignmentsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Assignment Tracker",
        "applicationCategory": "ProductivityApplication",
        "operatingSystem": "Any",
        "description": "Track assignments and projects with due dates and priority levels. Never miss a deadline.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Deadline Tracking",
            "Priority Levels",
            "Status Management"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AssignmentsClient />
        </>
    );
}
