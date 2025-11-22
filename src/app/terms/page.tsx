import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-1">
        <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home / Ana Sayfaya Dön
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-400">
                <FileText size={32} />
            </div>
            <h1 className="text-4xl font-bold">Terms of Service / Kullanım Şartları</h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none space-y-12">
          
          {/* English Section */}
          <section className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded uppercase tracking-wide">English</span>
                Terms of Service
            </h2>
            
            <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <p>
                    By accessing this website we assume you accept these terms and conditions. Do not continue to use UniPlanner Pro if you do not agree to take all of the terms and conditions stated on this page.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle size={18} /> License
                </h3>
                <p>
                    Unless otherwise stated, UniPlanner Pro and/or its licensors own the intellectual property rights for all material on UniPlanner Pro. All intellectual property rights are reserved. You may access this from UniPlanner Pro for your own personal use subjected to restrictions set in these terms and conditions.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertCircle size={18} /> Disclaimer
                </h3>
                <p>
                    The materials on UniPlanner Pro's website are provided on an 'as is' basis. UniPlanner Pro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>

                <p>
                    Further, UniPlanner Pro does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
                </p>
            </div>
          </section>

          {/* Turkish Section */}
          <section className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded uppercase tracking-wide">Türkçe</span>
                Kullanım Şartları
            </h2>
            
            <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <p>
                    Bu web sitesine erişerek bu şartlar ve koşulları kabul ettiğinizi varsayıyoruz. Bu sayfada belirtilen tüm şartlar ve koşulları kabul etmiyorsanız UniPlanner Pro'yu kullanmaya devam etmeyin.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle size={18} /> Lisans
                </h3>
                <p>
                    Aksi belirtilmedikçe, UniPlanner Pro ve/veya lisans verenleri, UniPlanner Pro üzerindeki tüm materyallerin fikri mülkiyet haklarına sahiptir. Tüm fikri mülkiyet hakları saklıdır. Bu şartlar ve koşullarda belirlenen kısıtlamalara tabi olarak, kendi kişisel kullanımınız için UniPlanner Pro'dan buna erişebilirsiniz.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <AlertCircle size={18} /> Sorumluluk Reddi
                </h3>
                <p>
                    UniPlanner Pro web sitesindeki materyaller 'olduğu gibi' sağlanmaktadır. UniPlanner Pro, açık veya zımni hiçbir garanti vermez ve işbu belgeyle, satılabilirlik, belirli bir amaca uygunluk veya fikri mülkiyet haklarının ihlal edilmemesi veya diğer hak ihlalleri dahil ancak bunlarla sınırlı olmamak üzere diğer tüm garantileri reddeder ve geçersiz kılar.
                </p>
            </div>
          </section>

        </div>
      </div>
      
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm mt-auto">
        <p>© 2025 UniPlanner Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
