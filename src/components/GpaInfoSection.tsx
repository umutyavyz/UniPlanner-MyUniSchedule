import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface GpaInfoSectionProps {
  t: any;
}

export default function GpaInfoSection({ t }: GpaInfoSectionProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    { q: t.gpaInfo.q1, a: t.gpaInfo.a1 },
    { q: t.gpaInfo.q2, a: t.gpaInfo.a2 },
    { q: t.gpaInfo.q3, a: t.gpaInfo.a3 },
    { q: t.gpaInfo.q4, a: t.gpaInfo.a4 },
    { q: t.gpaInfo.q5, a: t.gpaInfo.a5 },
    { q: t.gpaInfo.q6, a: t.gpaInfo.a6 },
  ];

  const articles = t.gpaInfo.articles || [];

  // Colors for the left border of articles to make it visually appealing
  const borderColors = [
    'border-blue-500 dark:border-blue-400',
    'border-purple-500 dark:border-purple-400',
    'border-pink-500 dark:border-pink-400',
    'border-orange-500 dark:border-orange-400',
    'border-green-500 dark:border-green-400',
    'border-teal-500 dark:border-teal-400',
    'border-indigo-500 dark:border-indigo-400',
    'border-red-500 dark:border-red-400',
    'border-cyan-500 dark:border-cyan-400',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Info Blocks Section - Dynamically rendered from articles */}
      <div className="space-y-12">
        {articles.map((article: { title: string, content: string }, index: number) => (
          <div 
            key={index} 
            className={`pl-6 border-l-4 ${borderColors[index % borderColors.length]}`}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {article.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              {article.content}
            </p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t.gpaInfo.faqTitle}
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between py-4 text-left focus:outline-none group"
              >
                <span className="font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-lg">
                  {faq.q}
                </span>
                {openFaqIndex === index ? (
                  <ChevronUp className="text-gray-400 group-hover:text-blue-500" size={24} />
                ) : (
                  <ChevronDown className="text-gray-400 group-hover:text-blue-500" size={24} />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaqIndex === index ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed pr-8">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
