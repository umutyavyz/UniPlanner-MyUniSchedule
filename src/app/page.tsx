'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar, Calculator, GraduationCap, ArrowRight, Clock,
  BarChart3, UserCheck, ClipboardList, CalendarCheck, Layers,
  Wallet, Briefcase, FileText, Target, Zap, Shield, Sparkles,
  CheckCircle, Flame, Download, BookOpen
} from 'lucide-react';

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Free University Student Tools",
  "description": "14 free online tools for university students to manage their academic life",
  "url": "https://www.myunischedule.com",
  "numberOfItems": 14,
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Course Schedule Maker", "url": "https://www.myunischedule.com/planner" },
    { "@type": "ListItem", "position": 2, "name": "GPA Calculator", "url": "https://www.myunischedule.com/gpa-calculator" },
    { "@type": "ListItem", "position": 3, "name": "Final Exam Grade Calculator", "url": "https://www.myunischedule.com/final-calculator" },
    { "@type": "ListItem", "position": 4, "name": "Pomodoro Timer", "url": "https://www.myunischedule.com/pomodoro" },
    { "@type": "ListItem", "position": 5, "name": "Attendance Tracker", "url": "https://www.myunischedule.com/attendance" },
    { "@type": "ListItem", "position": 6, "name": "Assignment Tracker", "url": "https://www.myunischedule.com/assignments" },
    { "@type": "ListItem", "position": 7, "name": "Exam Calendar", "url": "https://www.myunischedule.com/exams" },
    { "@type": "ListItem", "position": 8, "name": "Flashcard Study Tool", "url": "https://www.myunischedule.com/flashcards" },
    { "@type": "ListItem", "position": 9, "name": "Student Budget Manager", "url": "https://www.myunischedule.com/budget" },
    { "@type": "ListItem", "position": 10, "name": "Job Application Tracker", "url": "https://www.myunischedule.com/applications" },
    { "@type": "ListItem", "position": 11, "name": "Course Notes", "url": "https://www.myunischedule.com/notes" },
    { "@type": "ListItem", "position": 12, "name": "Weekly Goals Planner", "url": "https://www.myunischedule.com/goals" },
    { "@type": "ListItem", "position": 13, "name": "Habit Tracker", "url": "https://www.myunischedule.com/habits" },
    { "@type": "ListItem", "position": 14, "name": "Daily Planner", "url": "https://www.myunischedule.com/daily-planner" },
  ]
};

const toolCategories = [
  {
    category: 'Akademik',
    categoryEn: 'Academic',
    color: 'blue',
    tools: [
      { title: 'Ders Programı', titleEn: 'Schedule Maker', desc: 'Çakışma tespiti ile haftalık plan', descEn: 'Weekly timetable with conflict detection', icon: Calendar, href: '/planner', badge: 'Popüler', badgeEn: 'Popular' },
      { title: 'GPA Hesaplama', titleEn: 'GPA Calculator', desc: 'GANO ve YANO hesapla', descEn: 'Calculate semester & cumulative GPA', icon: BarChart3, href: '/gpa-calculator' },
      { title: 'Vize/Final Hesap', titleEn: 'Grade Calculator', desc: 'Geçmek için kaç almalısın?', descEn: 'What grade do you need to pass?', icon: Calculator, href: '/final-calculator' },
      { title: 'Sınav Takvimi', titleEn: 'Exam Calendar', desc: 'Vize & final tarihlerini takip et', descEn: 'Track midterm & final exam dates', icon: CalendarCheck, href: '/exams' },
      { title: 'Flashcard', titleEn: 'Flashcards', desc: 'Spaced repetition ile çalış', descEn: 'Study smarter with spaced repetition', icon: Layers, href: '/flashcards' },
      { title: 'Ders Notları', titleEn: 'Course Notes', desc: 'Derse göre not al ve ara', descEn: 'Take and search notes by course', icon: FileText, href: '/notes' },
    ]
  },
  {
    category: 'Verimlilik',
    categoryEn: 'Productivity',
    color: 'violet',
    tools: [
      { title: 'Pomodoro', titleEn: 'Pomodoro Timer', desc: '25 dk odaklan, 5 dk mola', descEn: '25 min focus, 5 min break — proven method', icon: Clock, href: '/pomodoro', badge: 'Favori', badgeEn: 'Favorite' },
      { title: 'Ödev Takip', titleEn: 'Assignment Tracker', desc: 'Deadline\'ları kaçırma', descEn: 'Never miss a deadline again', icon: ClipboardList, href: '/assignments' },
      { title: 'Devamsızlık', titleEn: 'Attendance Tracker', desc: 'Kalan hakkını hesapla', descEn: 'Know exactly how many classes you can miss', icon: UserCheck, href: '/attendance' },
      { title: 'Haftalık Hedefler', titleEn: 'Weekly Goals', desc: 'Streak ile motivasyonu koru', descEn: 'Set goals and build momentum with streaks', icon: Target, href: '/goals' },
      { title: 'Günlük Planlayıcı', titleEn: 'Daily Planner', desc: 'Saatlik gün planı oluştur', descEn: 'Plan your entire day hour by hour', icon: BookOpen, href: '/daily-planner', badge: 'Yeni', badgeEn: 'New' },
      { title: 'Alışkanlık Takibi', titleEn: 'Habit Tracker', desc: 'Günlük alışkanlıklar oluştur', descEn: 'Build powerful daily habits & streaks', icon: Flame, href: '/habits', badge: 'Yeni', badgeEn: 'New' },
    ]
  },
  {
    category: 'Kariyer & Finans',
    categoryEn: 'Career & Finance',
    color: 'emerald',
    tools: [
      { title: 'Staj/İş Başvuruları', titleEn: 'Job Application Tracker', desc: 'Başvuru sürecini takip et', descEn: 'Manage your entire job application pipeline', icon: Briefcase, href: '/applications' },
      { title: 'Bütçe Yönetimi', titleEn: 'Student Budget Manager', desc: 'Gelir-gider takibi', descEn: 'Track income and expenses like a pro', icon: Wallet, href: '/budget' },
    ]
  }
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-500/20',
  violet: 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-500/20',
  emerald: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-500/20',
};

const iconColorMap: Record<string, string> = {
  blue: 'from-blue-500 to-indigo-600',
  violet: 'from-violet-500 to-purple-600',
  emerald: 'from-emerald-500 to-teal-600',
};

export default function LandingPage() {
  const [lang, setLang] = useState<'tr' | 'en'>('tr');

  useEffect(() => {
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.language) { setLang(parsed.language); return; }
    }
    const browserLang = navigator.language.toLowerCase();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!browserLang.startsWith('tr') && tz !== 'Europe/Istanbul') {
      setLang('en');
    }
  }, []);

  const isTR = lang === 'tr';

  const stats = [
    { value: '14+', label: 'Ücretsiz Araç', labelEn: 'Free Tools' },
    { value: '100%', label: 'Ücretsiz', labelEn: 'Always Free' },
    { value: '0', label: 'Kayıt Gerekmez', labelEn: 'Signup Required' },
    { value: '∞', label: 'Veri Güvenliği', labelEn: 'Data Privacy' },
  ];

  const whyCards = [
    {
      icon: Shield,
      title: 'Gizlilik Önce', titleEn: 'Privacy First',
      desc: 'Tüm veriler tarayıcınızda saklanır. Hiçbir sunucuya gönderilmez.',
      descEn: 'All data is stored in your browser. Nothing is ever sent to a server.',
      color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    },
    {
      icon: Zap,
      title: 'Çevrimdışı Çalışır', titleEn: 'Works Offline',
      desc: 'İnternet bağlantısı olmadan bile tüm araçlara erişebilirsiniz.',
      descEn: 'Every tool works without an internet connection — perfect for campus Wi-Fi dead zones.',
      color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10',
    },
    {
      icon: Download,
      title: 'Ana Ekrana Ekle', titleEn: 'Install as an App',
      desc: 'Telefonunuza uygulama gibi yükleyin, tek tıkla açın.',
      descEn: 'Add to your home screen on iOS or Android — opens instantly like a native app.',
      color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10',
    },
    {
      icon: Sparkles,
      title: 'Ücretsiz & Açık', titleEn: 'Free & Ad-Supported',
      desc: 'Reklam destekli olarak tamamen ücretsiz. Abonelik yok.',
      descEn: 'All 14 tools are completely free. Kept alive by non-intrusive ads. No paywall, ever.',
      color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10',
    },
    {
      icon: CheckCircle,
      title: 'Türkçe & İngilizce', titleEn: 'Turkish & English',
      desc: 'Konum tespiti ile otomatik dil seçimi.',
      descEn: 'Automatic language detection based on your browser or location. Switch any time.',
      color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-500/10',
    },
    {
      icon: GraduationCap,
      title: 'Öğrenciler İçin', titleEn: 'Built for Students',
      desc: 'Her araç üniversite öğrencisinin ihtiyaçları gözetilerek tasarlandı.',
      descEn: 'Every tool was designed around the real problems university students face every semester.',
      color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10',
    },
  ];

  const seoArticles = isTR ? [
    {
      title: 'Ders Programı Nasıl Hazırlanır?',
      content: 'Etkili bir üniversite ders programı için önce zorunlu derslerinizi yerleştirin, ardından seçmeli dersleri boş saatlere ekleyin. UniPlanner Pro\'nun çakışma tespiti sayesinde ders programınızı kolayca oluşturabilirsiniz. Ders saatleri arasında yeterli boşluk bırakmak, gün içindeki odaklanma kalitenizi artırır.'
    },
    {
      title: 'GPA / GANO Nasıl Hesaplanır?',
      content: 'GANO hesaplaması için her dersin kredi değerini not katsayısıyla çarpıp toplam krediye bölün. Örneğin AA (4.00), BA (3.50), BB (3.00) gibi notlar kullanılır. UniPlanner GPA hesaplayıcısı bu işlemi otomatik yapar. Dönem ortalamanızı ve genel ortalamanızı ayrı ayrı takip edebilirsiniz.'
    },
    {
      title: 'Pomodoro Tekniği ile Verimli Çalışma',
      content: '25 dakika odaklanarak çalışın, 5 dakika mola verin. Her 4 pomodoro sonrası 15-30 dakika uzun mola. Bu teknik, beyin yorgunluğunu azaltarak ders çalışma verimliliğinizi önemli ölçüde yükseltir. Araştırmalar Pomodoro kullanan öğrencilerin %40 daha verimli çalıştığını göstermektedir.'
    },
    {
      title: 'Devamsızlık Hakkını Doğru Kullanmak',
      content: 'Üniversitelerde genellikle dersin %30\'u kadar devamsızlık yapılabilir. Devamsızlık takip aracımızla kalan haklarınızı anlık görüntüleyin, sınırı aşmadan önce uyarı alın. Hangi derslerin daha kritik olduğunu belirleyerek devamsızlık haklarınızı stratejik dağıtın.'
    },
  ] : [
    {
      title: 'How to Build an Effective University Schedule',
      content: 'Start by placing mandatory courses first, then fill gaps with elective classes. Use UniPlanner\'s conflict detection to ensure no overlapping classes. Leave buffer time between sessions to avoid back-to-back fatigue. A well-structured timetable reduces daily decision-making and improves focus quality throughout your semester.'
    },
    {
      title: 'How to Calculate Your GPA / CGPA',
      content: 'GPA is calculated by multiplying each course\'s grade points (A=4.0, B=3.0, C=2.0) by its credit hours, summing the results, and dividing by total credits. UniPlanner\'s GPA calculator handles both semester GPA and cumulative CGPA automatically. Track your standing against graduation requirements in real time.'
    },
    {
      title: 'Study Smarter with the Pomodoro Technique',
      content: 'The Pomodoro method uses 25-minute focused work intervals separated by 5-minute breaks. After 4 cycles, take a longer 15-30 minute rest. This approach combats mental fatigue and procrastination — studies show Pomodoro users report up to 40% higher productivity. UniPlanner\'s timer tracks your daily session count automatically.'
    },
    {
      title: 'Managing Your University Attendance Limit',
      content: 'Most universities allow up to 30% absence per course. UniPlanner\'s Attendance Tracker shows exactly how many classes you have left before hitting the limit. Distribute absences strategically across courses — prioritize mandatory labs and seminar-style classes where participation directly affects your grade.'
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <div className="min-h-screen bg-[#fafafa] dark:bg-[#080810] overflow-x-hidden">

        {/* Ambient background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute -top-32 left-1/3 w-[500px] h-[500px] bg-blue-500/8 dark:bg-blue-500/12 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-violet-500/6 dark:bg-violet-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/6 dark:bg-emerald-500/10 rounded-full blur-[80px]" />
        </div>

        {/* Mobile-only mini nav (desktop nav is in layout) */}
        <nav className="md:hidden z-40 border-b border-gray-200/60 dark:border-white/6 bg-white/70 dark:bg-[#080810]/80 backdrop-blur-xl sticky top-0">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-tr from-blue-600 to-indigo-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-linear-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-xl text-white">
                  <GraduationCap size={17} />
                </div>
              </div>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                UniPlanner<span className="text-blue-600 dark:text-blue-400">.</span>
              </span>
            </Link>
            <Link
              href="/planner"
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg"
            >
              {isTR ? 'Başla' : 'Start'}
              <ArrowRight size={12} />
            </Link>
          </div>
        </nav>

        {/* ─── Hero ─── */}
        <section className="relative z-10 pt-14 sm:pt-20 pb-12 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8">
              <Sparkles size={13} className="fill-current" />
              {isTR
                ? '14 Ücretsiz Araç · Kayıt Yok · Veri Güvenli'
                : '14 Free Tools · No Signup · Your Data Stays Private'}
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-extrabold tracking-tight leading-[1.1] mb-6">
              {isTR ? (
                <>
                  <span className="text-gray-900 dark:text-white">Üniversite Hayatının</span>
                  <br />
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-linear-to-r from-blue-600/25 to-purple-600/25 blur-2xl rounded-full" aria-hidden />
                    <span className="relative bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Süper Uygulaması
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span className="text-gray-900 dark:text-white">Every Tool You Need</span>
                  <br />
                  <span className="relative inline-block">
                    <span className="absolute inset-0 bg-linear-to-r from-blue-600/25 to-purple-600/25 blur-2xl rounded-full" aria-hidden />
                    <span className="relative bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      for University Life
                    </span>
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              {isTR ? (
                <>
                  Ders programı, GPA hesaplama, Pomodoro, devamsızlık, ödev takibi ve daha fazlası.
                  <br className="hidden sm:block" />
                  <span className="font-semibold text-gray-900 dark:text-white">Tamamen ücretsiz. Kayıt yok. Veriler sende.</span>
                </>
              ) : (
                <>
                  Schedule maker, GPA calculator, Pomodoro timer, attendance tracker, and 10 more.
                  <br className="hidden sm:block" />
                  <span className="font-semibold text-gray-900 dark:text-white">Completely free. No account. Your data never leaves your device.</span>
                </>
              )}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
              <Link href="/planner" className="group relative w-full sm:w-auto">
                <div className="absolute -inset-0.5 bg-linear-to-r from-blue-600 to-indigo-600 rounded-[14px] blur opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-2 px-7 py-3.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-[13px]">
                  {isTR ? 'Hemen Başla' : 'Get Started — Free'}
                  <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
              <Link
                href="#tools"
                className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 font-semibold rounded-[13px] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
              >
                {isTR ? 'Araçları Keşfet' : 'Explore All Tools'}
              </Link>
            </div>

            {/* Feature pills */}
            {(() => {
              const pills = isTR ? [
                { icon: Zap, text: 'Anında Yüklenir' },
                { icon: Shield, text: 'Veriler Cihazında' },
                { icon: Download, text: 'Ana Ekrana Ekle' },
                { icon: CheckCircle, text: 'Tamamen Ücretsiz' },
              ] : [
                { icon: Zap, text: 'Instant Load' },
                { icon: Shield, text: 'Private by Design' },
                { icon: Download, text: 'Install as App' },
                { icon: CheckCircle, text: 'Always Free' },
              ];
              return (
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  {pills.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/4 rounded-full border border-gray-100 dark:border-white/8 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <f.icon size={14} className="text-gray-500 dark:text-gray-400" />
                      {f.text}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>

        {/* ─── Stats ─── */}
        <section className="relative z-10 py-8 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {stats.map((s, i) => (
                <div key={i} className="text-center p-4 sm:p-5 bg-white dark:bg-white/3 rounded-2xl border border-gray-100 dark:border-white/7">
                  <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">{s.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{isTR ? s.label : s.labelEn}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Tool Categories ─── */}
        <section id="tools" className="relative z-10 py-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-14">
            {toolCategories.map((cat) => (
              <div key={cat.category}>
                {/* Category header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorMap[cat.color]}`}>
                    {isTR ? cat.category : cat.categoryEn}
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-white/6" />
                </div>

                {/* Tools grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {cat.tools.map((tool, i) => (
                    <Link
                      key={i}
                      href={tool.href}
                      className="group relative flex items-center gap-4 p-4 sm:p-5 bg-white dark:bg-white/3 border border-gray-100 dark:border-white/7 rounded-2xl hover:border-gray-200 dark:hover:border-white/14 hover:shadow-lg hover:shadow-gray-200/40 dark:hover:shadow-none transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${iconColorMap[cat.color]} flex items-center justify-center text-white shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                        <tool.icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {isTR ? tool.title : tool.titleEn}
                          </h3>
                          {tool.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-md leading-none">
                              {isTR ? tool.badge : (tool.badgeEn || tool.badge)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                          {isTR ? tool.desc : tool.descEn}
                        </p>
                      </div>
                      <ArrowRight size={15} className="text-gray-300 dark:text-gray-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Why UniPlanner ─── */}
        <section className="relative z-10 py-16 px-4 sm:px-6 bg-white/50 dark:bg-white/2 border-y border-gray-100 dark:border-white/6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {isTR ? 'Neden UniPlanner Pro?' : 'Why UniPlanner Pro?'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm sm:text-base">
                {isTR
                  ? 'Diğer uygulamalardan farklı olarak verileriniz sizinle kalır. Kayıt, abonelik veya ödeme yok.'
                  : 'Unlike other student apps, your data never leaves your device. No account, no subscription, no payment required — ever.'}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyCards.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-white dark:bg-white/3 rounded-2xl border border-gray-100 dark:border-white/7">
                  <div className={`p-2.5 ${item.bg} rounded-xl shrink-0`}>
                    <item.icon size={20} className={item.color} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {isTR ? item.title : item.titleEn}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {isTR ? item.desc : item.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SEO Content ─── */}
        <section className="relative z-10 py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
              {isTR ? 'Üniversite Öğrencileri İçin Kapsamlı Rehber' : 'University Student Guides'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {seoArticles.map((item, i) => (
                <article key={i} className="p-5 bg-white dark:bg-white/3 rounded-2xl border border-gray-100 dark:border-white/7">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{item.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{item.content}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="relative z-10 py-16 px-4 sm:px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 sm:p-12 text-center">
              <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" aria-hidden />
              <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-white/5 rounded-full" aria-hidden />

              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  {isTR ? 'Hemen Kullanmaya Başla' : 'Start Using UniPlanner — Free'}
                </h2>
                <p className="text-blue-100 mb-8 text-sm sm:text-base max-w-md mx-auto">
                  {isTR
                    ? 'Kayıt olmadan, ücretsiz olarak 14 araca erişin. Telefonunuza uygulama olarak yükleyin.'
                    : 'Access all 14 tools instantly — no signup, no credit card, no catch. Install as an app on any device.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/planner"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm"
                  >
                    {isTR ? 'Ders Programı Oluştur' : 'Create Your Schedule'}
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/gpa-calculator"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm"
                  >
                    {isTR ? 'GPA Hesapla' : 'Calculate Your GPA'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
