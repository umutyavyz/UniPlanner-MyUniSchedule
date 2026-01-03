import { Metadata } from 'next';
import { headers } from 'next/headers';
import AttendanceClient from './AttendanceClient';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Devamsızlık Takibi - Ders Katılım Hesaplayıcı'
        : 'Attendance Tracker - Class Participation Calculator';

    const description = isTR
        ? 'Üniversite derslerinize katılımınızı takip edin. Devamsızlık limitinizi aşmamak için kalan hakkınızı görün.'
        : 'Track your university class attendance. See how many classes you can miss before reaching the limit.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'devamsızlık takibi, yoklama takibi, ders katılım, devamsızlık hesaplama, üniversite devamsızlık'
            : 'attendance tracker, class participation, attendance calculator, university attendance',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/attendance'
        }
    };
}

export default function AttendancePage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Attendance Tracker",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "description": "Track your university class attendance and calculate remaining skip rights. Free attendance tracker.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Track Absences",
            "Calculate Remaining Rights",
            "Visual Status Indicators"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AttendanceClient />
        </>
    );
}
