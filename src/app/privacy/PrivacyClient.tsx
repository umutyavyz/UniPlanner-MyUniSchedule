'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';
import { translations } from '@/lib/i18n';

export default function PrivacyPage() {
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

  const t = translations[language].privacyPage;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-1">
        <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8">
          <ArrowLeft size={20} className="mr-2" />
          {t.backToHome}
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                <Shield size={32} />
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
                    <Lock size={18} /> {t.storage.title}
                </h3>
                <p>
                    {t.storage.content}
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Eye size={18} /> {t.collection.title}
                </h3>
                <p>
                    {t.collection.content}
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t.thirdParty.title}
                </h3>
                <p>
                    {t.thirdParty.content}
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {t.contact.title}
                </h3>
                <p dangerouslySetInnerHTML={{ __html: t.contact.content.replace('support@myunischedule.com', '<a href="mailto:support@myunischedule.com" class="text-blue-600 hover:underline">support@myunischedule.com</a>') }} />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
