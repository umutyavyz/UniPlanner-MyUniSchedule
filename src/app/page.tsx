'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Calculator, GraduationCap, ArrowRight, Clock, BarChart3, UserCheck, ClipboardList, CalendarCheck, Layers, Wallet, Briefcase, FileText, Target, Sparkles, Zap, Shield, Star } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

const tools = [
  {
    title: 'Ders Programı',
    description: 'Dönemlik programınızı oluşturun',
    icon: Calendar,
    href: '/planner',
    gradient: 'from-blue-500 to-indigo-600',
    featured: true
  },
  {
    title: 'Pomodoro',
    description: 'Odaklanarak çalışın',
    icon: Clock,
    href: '/pomodoro',
    gradient: 'from-rose-500 to-orange-500',
    featured: true
  },
  {
    title: 'Not Hesapla',
    description: 'Geçmek için gereken not',
    icon: Calculator,
    href: '/final-calculator',
    gradient: 'from-emerald-500 to-teal-500'
  },
  {
    title: 'GPA',
    description: 'Ortalama hesaplama',
    icon: BarChart3,
    href: '/gpa-calculator',
    gradient: 'from-violet-500 to-purple-500'
  },
  {
    title: 'Notlar',
    description: 'Ders notları',
    icon: FileText,
    href: '/notes',
    gradient: 'from-indigo-500 to-blue-500'
  },
  {
    title: 'Hedefler',
    description: 'Haftalık hedefler',
    icon: Target,
    href: '/goals',
    gradient: 'from-orange-500 to-amber-500'
  },
  {
    title: 'Devamsızlık',
    description: 'Yoklama takibi',
    icon: UserCheck,
    href: '/attendance',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    title: 'Ödevler',
    description: 'Deadline takibi',
    icon: ClipboardList,
    href: '/assignments',
    gradient: 'from-amber-500 to-orange-500'
  },
  {
    title: 'Sınavlar',
    description: 'Sınav takvimi',
    icon: CalendarCheck,
    href: '/exams',
    gradient: 'from-red-500 to-rose-500'
  },
  {
    title: 'Kartlar',
    description: 'Flashcard çalışma',
    icon: Layers,
    href: '/flashcards',
    gradient: 'from-pink-500 to-purple-500'
  },
  {
    title: 'Bütçe',
    description: 'Harcama takibi',
    icon: Wallet,
    href: '/budget',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Kariyer',
    description: 'İş başvuruları',
    icon: Briefcase,
    href: '/applications',
    gradient: 'from-slate-500 to-gray-600'
  }
];

const features = [
  { icon: Zap, title: 'Hızlı', desc: 'Anında yüklenme' },
  { icon: Shield, title: 'Güvenli', desc: 'Veriler cihazında' },
  { icon: Sparkles, title: 'Ücretsiz', desc: 'Kayıt gerektirmez' }
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const featuredTools = tools.filter(t => t.featured);
  const otherTools = tools.filter(t => !t.featured);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0f] overflow-hidden">
      {/* Subtle Gradient Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-gray-200/50 dark:border-white/5 bg-white/70 dark:bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl text-white">
                <GraduationCap size={22} />
              </div>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              UniPlanner<span className="text-blue-600 dark:text-blue-400">.</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/planner"
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Başla
              <ArrowRight size={14} />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
            <Star size={14} className="fill-current" />
            12 Araç • Tek Platform
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
            <span className="text-gray-900 dark:text-white">Akademik</span>
            <br />
            <span className="relative">
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl" />
              <span className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Başarının Anahtarı
              </span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Ders programı, pomodoro, not hesaplama ve daha fazlası.
            <br className="hidden sm:block" />
            <span className="text-gray-900 dark:text-white font-medium">Ücretsiz, hızlı ve güvenli.</span>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/planner"
              className="group relative w-full sm:w-auto"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg">
                Hemen Başla
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
            <Link
              href="#tools"
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
            >
              Araçları Keşfet
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10">
                <f.icon size={16} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.title}</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{f.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="relative z-10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredTools.map((tool, i) => (
              <Link
                key={i}
                href={tool.href}
                className="group relative p-8 rounded-3xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-none"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      {tool.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400">
                      Kullan <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools Grid */}
      <section id="tools" className="relative z-10 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tüm Araçlar
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Akademik başarı için ihtiyacın olan her şey
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {otherTools.map((tool, i) => (
              <Link
                key={i}
                href={tool.href}
                className="group relative p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all duration-200 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-105 transition-transform`}>
                  <tool.icon size={22} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 px-6 border-t border-gray-100 dark:border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">12+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Araç</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">%100</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Ücretsiz</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">∞</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Veri Güvenliği</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
            <h2 className="relative text-3xl sm:text-4xl font-bold text-white mb-4">
              Hemen Kullanmaya Başla
            </h2>
            <p className="relative text-blue-100 mb-8 max-w-md mx-auto">
              Kayıt olmadan, ücretsiz olarak tüm araçlara erişebilirsin.
            </p>
            <Link
              href="/planner"
              className="relative inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
            >
              Başla
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}