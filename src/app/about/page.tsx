'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { translations } from '@/lib/i18n';
import { Target, Globe, ShieldCheck, ArrowLeft, Info, Heart, Users, Rocket } from 'lucide-react';

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
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-1">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8">
          <ArrowLeft size={20} className="mr-2" />
          {t.backToHome || 'Ana Sayfa'}
        </Link>

        {/* Title Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
            <Info size={32} />
          </div>
          <h1 className="text-4xl font-bold">{t.title}</h1>
        </div>

        {/* Content Card */}
        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="space-y-8">
            {/* Misyon */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <Target size={20} className="text-blue-600 dark:text-blue-400" />
                {t.missionTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-7">
                {t.missionContent}
              </p>
            </section>

            {/* Vizyon */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <Globe size={20} className="text-purple-600 dark:text-purple-400" />
                {t.visionTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-7">
                {t.visionContent}
              </p>
            </section>

            {/* Neden Biz */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                <ShieldCheck size={20} className="text-green-600 dark:text-green-400" />
                {t.whyUsTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-7">
                {t.whyUsContent}
              </p>
            </section>
          </div>
        </div>

        {/* Developer Section */}
        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-400">
              <Heart size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {language === 'tr' ? 'Geliştirici' : 'Developer'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'tr'
                  ? 'UniPlanner Pro, öğrenciler için öğrenciler tarafından geliştirilmiştir.'
                  : 'UniPlanner Pro is developed by students, for students.'}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <a
                  href="https://github.com/umutyavyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                >
                  Umut Yavuz
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
