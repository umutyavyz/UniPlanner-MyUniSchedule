import React from 'react';
import { Settings } from '@/types/settings';
import { translations } from '@/lib/i18n';
import AdUnit from './AdUnit';

interface SEOContentProps {
  settings: Settings;
}

export default function SEOContent({ settings }: SEOContentProps) {
  const t = translations[settings.language];
  // @ts-ignore
  const info = t.scheduleInfo || { title: '', articles: [] };

  return (
    <section className="w-full bg-white dark:bg-gray-950 py-12 px-4 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-gray-100">
          {info.title}
        </h2>
        
        <div className="space-y-12">
          {info.articles.map((article: any, index: number) => (
            <React.Fragment key={index}>
              <article className="prose dark:prose-invert max-w-none">
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  {article.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {article.content}
                </p>
              </article>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
