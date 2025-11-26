'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Github, Linkedin, ArrowLeft, Code2, Bug, Lightbulb, ExternalLink } from 'lucide-react';
import { translations } from '@/lib/i18n';

export default function ContactPage() {
  const [language, setLanguage] = useState<'tr' | 'en'>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.language) setLanguage(parsed.language);
    } else {
      // Fallback logic if no settings saved yet
      let isTurkish = false;
      try {
        const browserLang = navigator.language;
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        isTurkish = (browserLang && browserLang.toLowerCase().startsWith('tr')) || 
                    (timeZone === 'Europe/Istanbul');
      } catch (e) {
        isTurkish = navigator.language?.toLowerCase().startsWith('tr');
      }
      setLanguage(isTurkish ? 'tr' : 'en');
    }
    setIsLoaded(true);
  }, []);

  const t = translations[language];

  if (!isLoaded) return null;

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col transition-colors">
      {/* Header Background */}
      <div className="h-48 bg-linear-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 absolute top-0 left-0 right-0 z-0"></div>

      <div className="max-w-5xl mx-auto w-full px-4 py-8 flex-1 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center text-white/90 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all mb-8 backdrop-blur-sm"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">{t.contactPage.backToHome}</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Contact & Info Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800">
              <h1 className="text-3xl font-bold mb-6 bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t.contactPage.title}
              </h1>
              
              <div className="prose dark:prose-invert max-w-none mb-8">
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t.contactPage.desc}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 flex items-start gap-3">
                  <Bug className="text-orange-500 shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t.contactPage.reportBug}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.contactPage.reportBugDesc}</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 flex items-start gap-3">
                  <Lightbulb className="text-green-500 shrink-0" size={24} />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{t.contactPage.suggestion}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.contactPage.suggestionDesc}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all hover:border-blue-300 dark:hover:border-blue-700 group">
                <div className="bg-white dark:bg-gray-700 p-3 rounded-full text-blue-600 dark:text-blue-400 shadow-sm group-hover:scale-110 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.contactPage.emailSupport}</h3>
                  <a href="mailto:support@myunischedule.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    support@myunischedule.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Card Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden sticky top-8">
              <div className="h-24 bg-linear-to-br from-gray-800 to-gray-900 dark:from-black dark:to-gray-900 relative">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)]" style={{ backgroundSize: '16px 16px' }}></div>
              </div>
              
              <div className="px-6 pb-8 relative">
                <div className="w-24 h-24 -mt-12 mb-4 rounded-2xl bg-white dark:bg-gray-800 p-1 shadow-lg mx-auto rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <Code2 size={40} />
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Umut Yavuz</h2>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{t.contactPage.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 px-4">
                    {t.contactPage.bio}
                  </p>
                </div>

                <div className="space-y-3">
                  <a 
                    href="https://github.com/umutyavyz" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Github size={20} className="text-gray-700 dark:text-gray-300" />
                      <span className="font-medium text-sm text-gray-700 dark:text-gray-200">GitHub</span>
                    </div>
                    <ExternalLink size={16} className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200" />
                  </a>

                  <a 
                    href="https://www.linkedin.com/in/umutyavyz/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Linkedin size={20} className="text-blue-700 dark:text-blue-400" />
                      <span className="font-medium text-sm text-blue-700 dark:text-blue-300">LinkedIn</span>
                    </div>
                    <ExternalLink size={16} className="text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-200" />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}