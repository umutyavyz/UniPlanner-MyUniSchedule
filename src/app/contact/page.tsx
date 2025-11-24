import React from 'react';
import Link from 'next/link';
import { Mail, Github, Linkedin, ArrowLeft } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-1">
        <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home / Ana Sayfaya Dön
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Contact Us / İletişim</h1>
        
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
          {/* Güncellenen Kısım Başlangıcı */}
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            The application is currently under development and improvements are being made daily. If you encounter any bugs, errors, or have suggestions, please feel free to report them using the links below.
            <br /><br />
            Uygulama şu an geliştirme sürecindedir ve günden güne iyileştirmeler yapılmaktadır. Herhangi bir hata (bug), eksiklik veya öneriniz olursa, lütfen aşağıdaki bağlantılardan bize bildirmekten çekinmeyin.
          </p>
          {/* Güncellenen Kısım Bitişi */}

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-blue-600 dark:text-blue-400">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Email Support</h3>
                <a href="mailto:support@myunischedule.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                  support@myunischedule.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full text-gray-900 dark:text-white">
                <Github size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Developer / Geliştirici</h3>
                <a href="https://github.com/umutyavyz" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  github.com/umutyavyz
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-full text-blue-700 dark:text-blue-300">
                <Linkedin size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">LinkedIn</h3>
                <a href="https://www.linkedin.com/in/umutyavyz/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  linkedin.com/in/umutyavyz
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm mt-auto">
        <p>© 2025 UniPlanner Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}