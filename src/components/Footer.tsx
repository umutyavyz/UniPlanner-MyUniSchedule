import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, Code2 } from 'lucide-react';

interface FooterProps {
  t: any;
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 px-4 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-linear-to-tr from-blue-600 to-indigo-600 p-2 rounded-lg text-white">
                <Code2 size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">UniPlanner Pro</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
              {t.landing?.features?.learning?.desc || "Building useful tools for students."}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.footer.tools}</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.scheduleMaker}
                </Link>
              </li>
              <li>
                <Link href="/gpa-calculator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.gpaCalculator}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.footer.contact}</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.contact}
                </Link>
              </li>
              <li>
                <a href="mailto:support@myunischedule.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  support@myunischedule.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.settings}</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} UniPlanner Pro. {t.footer.rights}
          </p>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
              {t.footer.developedBy} 
              <a href="https://github.com/umutyavyz" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-1">
                Umut Yavuz
              </a>
            </span>
            <div className="flex gap-3">
              <a href="https://github.com/umutyavyz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github size={18} />
              </a>
              <a href="https://www.linkedin.com/in/umutyavyz/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
