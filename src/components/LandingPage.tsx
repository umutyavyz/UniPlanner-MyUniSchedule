import React from 'react';
import { translations } from '@/lib/i18n';
import { Settings } from '@/types/settings';
import AdPlaceholder from './AdPlaceholder';
import Link from 'next/link';
import { GraduationCap, Briefcase, Home, CheckCircle2, ArrowRight, ShieldCheck, Printer, Share2, Lock } from 'lucide-react';
import SEOContent from './SEOContent';

interface LandingPageProps {
  settings: Settings;
  onStart: () => void;
}

export default function LandingPage({ settings, onStart }: LandingPageProps) {
  const t = translations[settings.language];
  const tl = t.landing;

  return (
    <div className="w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      
      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <GraduationCap size={48} />
            </div>
            <h3 className="text-xl font-bold mb-3">{tl.features.learning.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{tl.features.learning.desc}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
              <Briefcase size={48} />
            </div>
            <h3 className="text-xl font-bold mb-3">{tl.features.workLife.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{tl.features.workLife.desc}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <Home size={48} />
            </div>
            <h3 className="text-xl font-bold mb-3">{tl.features.family.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{tl.features.family.desc}</p>
          </div>
        </div>
      </section>

      {/* Breeze Section (Tablet Image) */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 relative">
           {/* Placeholder for Tablet Image - Using a CSS representation */}
           <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[300px] w-[450px] md:h-[400px] md:w-[600px] shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-full w-full overflow-hidden rounded-[2rem] bg-white dark:bg-gray-900 flex relative">
                    {/* Mock UI */}
                    <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900 flex">
                      {/* Sidebar Mock */}
                      <div className="w-1/4 h-full border-r border-gray-200 dark:border-gray-800 p-4 space-y-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-6"></div>
                        <div className="h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"></div>
                        <div className="h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"></div>
                        <div className="h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"></div>
                      </div>
                      {/* Calendar Mock */}
                      <div className="flex-1 p-4">
                        <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 grid grid-cols-5 gap-2">
                           <div className="col-span-1 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg h-24 mt-8"></div>
                           <div className="col-span-1 bg-green-100/50 dark:bg-green-900/20 rounded-lg h-32 mt-4"></div>
                           <div className="col-span-1 bg-purple-100/50 dark:bg-purple-900/20 rounded-lg h-20 mt-12"></div>
                           <div className="col-span-1 bg-orange-100/50 dark:bg-orange-900/20 rounded-lg h-28 mt-2"></div>
                           <div className="col-span-1 bg-red-100/50 dark:bg-red-900/20 rounded-lg h-24 mt-10"></div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex-1 text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{tl.breeze.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {tl.breeze.desc}
          </p>
        </div>
      </section>

      {/* Save Print Share Section */}
      <section className="py-20 px-4 md:px-8 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="flex-1 text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">{tl.share.title}</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                    {tl.share.desc}
                </p>
            </div>
            <div className="flex-1 flex justify-center gap-6">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-blue-500 transform rotate-6">
                    <Printer size={64} />
                </div>
                <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-green-500 transform -rotate-6 mt-12">
                    <Share2 size={64} />
                </div>
            </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 flex justify-center">
            <div className="relative">
                <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50"></div>
                <Lock size={120} className="text-orange-500 relative z-10" />
            </div>
        </div>
        <div className="flex-1 text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{tl.privacy.title}</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {tl.privacy.desc}
          </p>
        </div>
      </section>

      {/* Impact Banner */}
      <section className="py-16 px-4 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-center">
        <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                "{tl.impact.text}"
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {tl.impact.source}
            </p>
        </div>
      </section>

      {/* How To Section */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{tl.howto.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-5 left-6 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                <h3 className="text-xl font-bold mt-4 mb-3">{tl.howto.step1.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{tl.howto.step1.desc}</p>
            </div>
            <div className="relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-5 left-6 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                <h3 className="text-xl font-bold mt-4 mb-3">{tl.howto.step2.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{tl.howto.step2.desc}</p>
            </div>
            <div className="relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute -top-5 left-6 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                <h3 className="text-xl font-bold mt-4 mb-3">{tl.howto.step3.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{tl.howto.step3.desc}</p>
            </div>
        </div>
      </section>

      {/* SEO Content - Placed before FAQ for better flow */}
      <SEOContent settings={settings} />

      {/* FAQ Section */}
      <section className="py-20 px-4 md:px-8 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{tl.faq.title}</h2>
        <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border-b border-gray-200 dark:border-gray-800 pb-6">
                    <h3 className="text-lg font-bold mb-2">
                        {/* @ts-ignore */}
                        {tl.faq[`q${i}`].q}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {/* @ts-ignore */}
                        {tl.faq[`q${i}`].a}
                    </p>
                </div>
            ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 opacity-10 dark:opacity-20"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">
                {tl.cta.title}
            </h2>
            <div className="flex justify-center items-center gap-4">
                <button 
                    onClick={onStart}
                    className="group relative px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                    <span className="flex items-center gap-3">
                        {tl.cta.button}
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
                </button>
            </div>
            <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm font-medium">
                {settings.language === 'tr' ? 'Ücretsiz • Üyelik Gerektirmez • Anında İndir' : 'Free • No Sign Up Required • Instant Download'}
            </p>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 text-center text-sm">
        <div className="flex justify-center gap-6 mb-8">
            <Link href="/contact" className="hover:text-white transition-colors">Contacts</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
        </div>
        <p>© 2025 UniPlanner Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
