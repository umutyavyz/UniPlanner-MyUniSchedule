import { Metadata } from 'next';
import { headers } from 'next/headers';
import FinalCalculatorClient from './FinalCalculatorClient';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || '';
    const country = headersList.get('x-vercel-ip-country');
    const isTR = country === 'TR' || acceptLanguage.includes('tr');

    const title = isTR
        ? 'Vize Final Hesaplama - Dersi Geçmek İçin Kaç Almam Lazım?'
        : 'Final Exam Calculator - What Grade Do I Need to Pass?';

    const description = isTR
        ? 'Vize notunuzu girerek final sınavından kaç almanız gerektiğini anında hesaplayın. Ücretsiz vize final hesaplama aracı.'
        : 'Calculate the minimum final exam grade you need to pass your course. Free midterm final grade calculator.';

    return {
        title: title,
        description: description,
        keywords: isTR
            ? 'vize final hesaplama, final notu hesaplama, dersi geçmek için kaç almam lazım, üniversite not hesaplama'
            : 'final grade calculator, exam grade calculator, what grade do i need, university grade calculator',
        openGraph: {
            title: title,
            description: description,
            type: 'website',
        },
        alternates: {
            canonical: 'https://www.myunischedule.com/final-calculator'
        }
    };
}

export default function FinalCalculatorPage() {
    const webAppSchema = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "UniPlanner Pro Final Grade Calculator",
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "description": "Calculate the minimum grade needed on your final exam to pass the course. Free university grade calculator.",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "featureList": [
            "Calculate Required Final Grade",
            "Midterm/Final Percentage Support",
            "Pass/Fail Grade Calculation"
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Vize final ortalaması nasıl hesaplanır?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Vize final ortalaması genellikle vize notunun %40'ı ve final notunun %60'ı alınarak hesaplanır. Bazı üniversitelerde bu oran %30-%70 veya %50-%50 olabilir."
                }
            },
            {
                "@type": "Question",
                "name": "Dersi geçmek için kaç almam lazım?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Dersi geçmek için gereken minimum not, vize notunuza ve vize/final ağırlık oranına bağlıdır. Örneğin, vizeden 60 aldıysanız ve geçme notu 50 ise, %40-%60 oranıyla finalden en az 43 almanız gerekir."
                }
            },
            {
                "@type": "Question",
                "name": "Final sınavına girmesem ne olur?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Final sınavına girmeseniz final notunuz 0 olarak işlenir. Bu durumda sadece vize notunuzun ağırlığı kadar puan alırsınız ve genellikle dersi geçemezsiniz."
                }
            },
            {
                "@type": "Question",
                "name": "Bütünleme sınavı ortalamaya dahil mi?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet, bütünleme sınavı final yerine geçer ve aynı ağırlıkla ortalamaya dahil edilir. Bütünlemeden alınan not, final notu olarak işlenir."
                }
            },
            {
                "@type": "Question",
                "name": "Vize notu düşükse dersi geçebilir miyim?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Evet, finalden yüksek not alarak dersi geçebilirsiniz. Ancak vize notunuz çok düşükse (örneğin 20), finalden çok yüksek bir not almanız gerekebilir veya dersi geçmeniz mümkün olmayabilir."
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <FinalCalculatorClient />
        </>
    );
}
