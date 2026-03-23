import { Metadata } from 'next';
import { headers } from 'next/headers';
import BudgetClient from './BudgetClient';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';

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
            images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: title }],
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/budget'
        }
    };
}

export default function BudgetPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Öğrenci olarak bütçe nasıl yönetilir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Aylık gelirlerinizi (burs, aile desteği, part-time iş) ve sabit giderlerinizi (kira, faturalar) listeleyin. Kalan miktarı yemek, ulaşım ve kişisel harcamalara bölüştürün. 50/30/20 kuralını uygulayın: Gelirinizin %50'si ihtiyaçlar, %30'u istekler, %20'si tasarruf."
                }
            },
            {
                "@type": "Question",
                "name": "Üniversite öğrencileri için en büyük harcama kalemleri nelerdir?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Üniversite öğrencilerinin en büyük harcama kalemleri genellikle kira/yurt ücreti, yemek, ulaşım, ders kitapları ve kırtasiye, sosyal aktiviteler ve aboneliklerdir. Bu kategorileri ayrı ayrı takip etmek tasarruf fırsatlarını görmek için önemlidir."
                }
            },
            {
                "@type": "Question",
                "name": "Burs ve kredi ile geçinmek mümkün mü?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Burs ve kredi miktarına ve yaşadığınız şehre bağlı olarak değişir. İstanbul gibi pahalı şehirlerde part-time çalışmak gerekebilir. Yurt seçeneğini değerlendirin, toplu alışveriş yapın ve öğrenci indirimlerinden yararlanın."
                }
            }
        ]
    };

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <BreadcrumbSchema items={[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Bütçe Takibi', href: '/budget' }
            ]} />
            <BudgetClient />
        </>
    );
}
