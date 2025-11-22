import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.myunischedule.com'),
  title: {
    default: 'UniPlanner Pro | Schedule Maker & Ders Programı Oluşturucu',
    template: '%s | UniPlanner Pro'
  },
  description: 'Free university schedule maker. Create your weekly timetable and download as PDF. / Üniversite ders programınızı kolayca hazırlayın, çakışmaları görün ve PDF olarak indirin.',
  keywords: [
    'university schedule maker', 'timetable planner', 'college schedule', 'weekly planner',
    'ders programı hazırlama', 'üniversite ders programı', 'ders programı robotu', 'haftalık program', 'uniplanner'
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
    title: 'UniPlanner Pro | Schedule Maker & Ders Programı',
    description: 'Plan your semester in minutes. / Dönem planınızı dakikalar içinde hazırlayın.',
    url: 'https://www.myunischedule.com',
    siteName: 'UniPlanner Pro',
    locale: 'en_US',
    alternateLocale: ['tr_TR'],
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
    title: 'UniPlanner Pro | Schedule Maker',
    description: 'The easiest way to plan your university semester. / Üniversite ders programı hazırlamanın en kolay yolu.',
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
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
