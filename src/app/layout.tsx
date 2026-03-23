import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import CookieConsent from "@/components/CookieConsent";
import ClientFooter from "@/components/ClientFooter";
import SmartReminders from "@/components/SmartReminders";
import MobileNav from "@/components/MobileNav";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import DesktopNav from "@/components/DesktopNav";
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

  // Landing page title - comprehensive branding
  const title = isTR
    ? 'UniPlanner Pro | Üniversite Öğrencileri İçin Ücretsiz Araçlar'
    : 'UniPlanner Pro | Free Tools for University Students';

  const description = isTR
    ? 'Üniversite hayatını kolaylaştıran ücretsiz araçlar: Ders programı oluşturucu, GPA hesaplama, Pomodoro sayacı, devamsızlık takibi, bütçe yönetimi ve daha fazlası. Üyelik gerektirmez!'
    : 'Free tools for university life: Schedule maker, GPA calculator, Pomodoro timer, attendance tracker, budget manager and more. No signup required!';

  return {
    metadataBase: new URL('https://www.myunischedule.com'),
    title: {
      default: title,
      template: '%s | UniPlanner Pro'
    },
    description: description,
    icons: {
      icon: '/icon', // Explicitly pointing to our dynamic icon
      shortcut: '/icon',
      apple: '/icon',
    },
    alternates: {
      canonical: 'https://www.myunischedule.com',
    },
    keywords: [
      'university schedule maker', 'timetable planner', 'college schedule', 'weekly planner',
      'ders programı hazırlama', 'üniversite ders programı', 'ders programı robotu', 'haftalık program', 'uniplanner',
      'ders programı çakışma önleyici', 'schedule conflict preventer',
      'free schedule maker', 'college timetable generator', 'university planner',
      'ders programı oluşturucu', 'ücretsiz ders programı', 'gpa calculator', 'akts hesaplama',
      'habit tracker', 'alışkanlık takipçisi', 'daily planner', 'günlük planlayıcı', 'time blocking'
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
      description: description,
      url: 'https://www.myunischedule.com',
      siteName: 'UniPlanner Pro',
      locale: isTR ? 'tr_TR' : 'en_US',
      alternateLocale: isTR ? ['en_US'] : ['tr_TR'],
      type: 'website',
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: 'UniPlanner Pro - Free Tools for University Students',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/opengraph-image'],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect user's preferred language
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const country = headersList.get('x-vercel-ip-country');
  const isTR = country === 'TR' || acceptLanguage.includes('tr');
  const lang = isTR ? 'tr' : 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="UniPlanner" />
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
              
              // Register Service Worker
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(error) {
                    console.log('SW registration failed: ', error);
                  });
                });
              }
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "UniPlanner Pro",
              "url": "https://www.myunischedule.com",
              "description": "Free online tools for university students: schedule maker, GPA calculator, Pomodoro timer, attendance tracker, and more.",
              "publisher": {
                "@type": "Organization",
                "name": "UniPlanner Pro",
                "url": "https://www.myunischedule.com"
              }
            })
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
              "url": "https://www.myunischedule.com",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free university tools: schedule maker, GPA calculator, Pomodoro timer, attendance tracker, budget manager and more. No signup required.",
              "featureList": [
                "Course Schedule Maker with Conflict Detection",
                "GPA / CGPA Calculator",
                "Final Exam Grade Calculator",
                "Pomodoro Focus Timer",
                "Attendance Tracker",
                "Assignment & Deadline Tracker",
                "Exam Calendar",
                "Flashcard Study Tool",
                "Student Budget Manager",
                "Job Application Tracker",
                "Course Notes",
                "Weekly Goals Planner"
              ]
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
          <div className="flex flex-col min-h-screen">
            <DesktopNav />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <ClientFooter />
          </div>
          <MobileNav />
          <PWAInstallPrompt />
          <SmartReminders />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}