'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { translations } from '@/lib/i18n';

export default function TermsPage() {
  const [language, setLanguage] = useState<'tr' | 'en'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.language) setLanguage(parsed.language);
    } else {
      // Browser language detection fallback
      const isTurkish = navigator.language?.toLowerCase().startsWith('tr');
      setLanguage(isTurkish ? 'tr' : 'en');
    }
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const t = translations[language].terms;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-1">
        <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8">
          <ArrowLeft size={20} className="mr-2" />
          {t.backToHome}
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                <FileText size={32} />
            </div>
            <h1 className="text-4xl font-bold">{t.title}</h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none space-y-12">
          
          <section className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
            <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <p>
                    {t.intro}
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle size={18} /> {t.license.title}
                </h3>
                <p>
                    {t.license.content}
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertCircle size={18} /> {t.disclaimer.title}
                </h3>
                <p>
                    {t.disclaimer.content1}
                </p>

                <p>
                    {t.disclaimer.content2}
                </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
