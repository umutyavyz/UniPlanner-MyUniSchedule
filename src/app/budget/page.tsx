import { Metadata } from 'next';
import { headers } from 'next/headers';
import BudgetClient from './BudgetClient';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Bütçe Takibi - Öğrenci Gelir Gider Takibi'
        : 'Budget Tracker - Student Income Expense Tracker';

    const description = isTR
        ? 'Öğrenci bütçenizi kolayca takip edin. Gelir ve giderlerinizi kategorilere ayırın, aylık harcamalarınızı analiz edin.'
        : 'Easily track your student budget. Categorize your income and expenses, analyze your monthly spending.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'bütçe takip, gelir gider, para yönetimi, öğrenci bütçe, harcama takip'
            : 'budget tracker, income expense, money management, student budget, expense tracker',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/budget'
        }
    };
}

export default function BudgetPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Budget Tracker",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "description": "Track your student budget, income, and expenses. Visualize spending with charts. Free budget tracker.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Income & Expense Tracking",
            "Category breakdown",
            "Monthly Analysis"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BudgetClient />
        </>
    );
}
