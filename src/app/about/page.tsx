'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/i18n';
import { Target, Globe, ShieldCheck, ArrowLeft, Info } from 'lucide-react';

export default function AboutPage() {
  const [language, setLanguage] = useState<'tr' | 'en'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
      const parsed = JSON.parse(storedSettings);
      if (parsed.language) setLanguage(parsed.language);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('tr') || Intl.DateTimeFormat().resolvedOptions().timeZone === 'Europe/Istanbul') {
        setLanguage('tr');
      }
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const t = translations[language].aboutPage;

  return (
    <main className="min-h-screen bg-[#020817] text-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl">
        {/* Back Link */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">{t.backToHome || 'Back to Home'}</span>
          </Link>
        </div>

        {/* Title Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
            <Info className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            {t.title}
          </h1>
        </div>

        {/* Content Card */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 shadow-xl">
          <div className="space-y-8">
            {/* Misyon */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <Target className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-white">
                  {t.missionTitle}
                </h2>
              </div>
              <p className="text-slate-400 leading-relaxed pl-8">
                {t.missionContent}
              </p>
            </section>

            {/* Vizyon */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <Globe className="w-5 h-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-white">
                  {t.visionTitle}
                </h2>
              </div>
              <p className="text-slate-400 leading-relaxed pl-8">
                {t.visionContent}
              </p>
            </section>

            {/* Neden Biz */}
            <section>
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <h2 className="text-xl font-semibold text-white">
                  {t.whyUsTitle}
                </h2>
              </div>
              <p className="text-slate-400 leading-relaxed pl-8">
                {t.whyUsContent}
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
