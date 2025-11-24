import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import CookieConsent from "@/components/CookieConsent";
import { headers } from "next/headers"; // Header erişimi için eklendi

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Statik 'metadata' objesini dinamik 'generateMetadata' fonksiyonuna çevirdik
export async function generateMetadata(): Promise<Metadata> {
  // Gelen isteğin başlıklarını alıyoruz
  const headersList = await headers();
  
  // Kullanıcının dil tercihini veya Vercel gibi platformlarda IP konumunu kontrol ediyoruz
  const acceptLanguage = headersList.get('accept-language') || '';
  const country = headersList.get('x-vercel-ip-country'); // Eğer Vercel üzerinde barındırıyorsanız çalışır

  // Türkiye tespiti: IP adresi TR ise VEYA tarayıcı dili Türkçe içeriyorsa
  const isTR = country === 'TR' || acceptLanguage.includes('tr');

  // İsteğinize göre başlık mantığı
  const title = isTR
    ? 'UniPlanner Pro | Ders Programı Oluşturucu'
    : 'UniPlanner Pro | Schedule Maker'; // Yurtdışı için sadece İngilizce kısım

  const description = isTR
    ? 'Üniversite ders programınızı kolayca hazırlayın, çakışmaları görün ve PDF olarak indirin.'
    : 'Free university schedule maker. Create your weekly timetable and download as PDF.';

  return {
    metadataBase: new URL('https://www.myunischedule.com'),
    title: {
      default: title,
      template: '%s | UniPlanner Pro'
    },
    description: description,
    keywords: [
      'university schedule maker', 'timetable planner', 'college schedule', 'weekly planner',
      'ders programı hazırlama', 'üniversite ders programı', 'ders programı robotu', 'haftalık program', 'uniplanner',
      'üniversite ders programı çakışma önleyici', 'ders programı çakışma kontrolü', 'course conflict checker', 'schedule conflict preventer'
    ],
    authors: [{ name: 'Umut Yavuz' }],
    creator: 'Umut Yavuz',
    publisher: 'UniPlanner Pro',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: title,
      description: isTR ? 'Dönem planınızı dakikalar içinde hazırlayın.' : 'Plan your semester in minutes.',
      url: 'https://www.myunischedule.com',
      siteName: 'UniPlanner Pro',
      locale: isTR ? 'tr_TR' : 'en_US',
      alternateLocale: isTR ? ['en_US'] : ['tr_TR'],
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: 'UniPlanner Pro Preview',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: isTR 
        ? 'Üniversite ders programı hazırlamanın en kolay yolu.' 
        : 'The easiest way to plan your university semester.',
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7619120582243963"
          crossOrigin="anonymous"
        ></script>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DQ7DQECBK0"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-DQ7DQECBK0');
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "UniPlanner Pro",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free university schedule maker and conflict checker.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1250"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}