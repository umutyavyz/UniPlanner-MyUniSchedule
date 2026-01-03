import React from 'react';
import Link from 'next/link';
import { Github, Linkedin, GraduationCap } from 'lucide-react';

interface FooterProps {
  t: any;
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 px-4 transition-colors mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-8 text-center md:text-left">
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <div className="bg-linear-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-500/20">
                <GraduationCap size={22} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-none tracking-tight">UniPlanner <span className="text-blue-600 dark:text-blue-400">Pro</span></span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto md:mx-0">
              {t.footer?.description || "Üniversite hayatını kolaylaştıran ücretsiz araçlar. Ders programı, not hesaplama, pomodoro ve daha fazlası."}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t.footer.tools}</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>
                <Link href="/planner" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.scheduleMaker}
                </Link>
              </li>
              <li>
                <Link href="/gpa-calculator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.gpaCalculator}
                </Link>
              </li>
              <li>
                <Link href="/final-calculator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.finalCalculator}
                </Link>
              </li>
              <li>
                <Link href="/pomodoro" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.pomodoro}
                </Link>
              </li>
              <li>
                <Link href="/attendance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.attendance}
                </Link>
              </li>
              <li className="pt-1">
                <Link
                  href="/#tools"
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  {t.footer.exploreMore || 'Daha fazlasını keşfet'}
                  <span aria-hidden="true">→</span>
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
                <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {t.footer.about}
                </Link>
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

        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col items-center gap-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} UniPlanner Pro. {t.footer.rights}
          </p>

          <div className="flex flex-col items-center gap-2">
            <a href="mailto:support@myunischedule.com" className="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              support@myunischedule.com
            </a>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                {t.footer.developedBy}
                <a href="https://github.com/umutyavyz" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-1">
                  Umut Yavuz
                </a>
              </span>
              <div className="flex gap-3 border-l border-gray-200 dark:border-gray-700 pl-3">
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
      </div>
    </footer>
  );
}
