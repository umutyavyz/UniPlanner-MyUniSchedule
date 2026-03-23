'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    GraduationCap, ChevronDown, Calendar, BarChart3, Calculator,
    Clock, UserCheck, ClipboardList, CalendarCheck, Layers,
    Wallet, Briefcase, FileText, Target, Flame, ArrowRight,
    BookOpen
} from 'lucide-react';
import { ModeToggle } from './mode-toggle';

const toolGroups = [
    {
        label: 'Academic',
        labelTR: 'Akademik',
        colorClass: 'text-blue-600 dark:text-blue-400',
        dotClass: 'bg-blue-500',
        tools: [
            { href: '/planner', icon: Calendar, label: 'Schedule Maker', labelTR: 'Ders Programı', desc: 'Weekly timetable', descTR: 'Haftalık program' },
            { href: '/gpa-calculator', icon: BarChart3, label: 'GPA Calculator', labelTR: 'GPA Hesaplama', desc: 'Semester & cumulative', descTR: 'Dönem & genel ortalama' },
            { href: '/final-calculator', icon: Calculator, label: 'Grade Calculator', labelTR: 'Vize/Final Hesap', desc: 'What grade do you need?', descTR: 'Kaç almanız gerekiyor?' },
            { href: '/exams', icon: CalendarCheck, label: 'Exam Calendar', labelTR: 'Sınav Takvimi', desc: 'Track exam dates', descTR: 'Sınav tarihlerini takip et' },
            { href: '/flashcards', icon: Layers, label: 'Flashcards', labelTR: 'Flashcard', desc: 'Spaced repetition', descTR: 'Aralıklı tekrar' },
            { href: '/notes', icon: FileText, label: 'Course Notes', labelTR: 'Ders Notları', desc: 'Organize your notes', descTR: 'Notlarını düzenle' },
        ],
    },
    {
        label: 'Productivity',
        labelTR: 'Verimlilik',
        colorClass: 'text-violet-600 dark:text-violet-400',
        dotClass: 'bg-violet-500',
        tools: [
            { href: '/pomodoro', icon: Clock, label: 'Pomodoro Timer', labelTR: 'Pomodoro', desc: 'Focus sessions', descTR: 'Odak seansları' },
            { href: '/assignments', icon: ClipboardList, label: 'Assignments', labelTR: 'Ödev Takip', desc: 'Never miss deadlines', descTR: 'Deadline\'ları kaçırma' },
            { href: '/attendance', icon: UserCheck, label: 'Attendance', labelTR: 'Devamsızlık', desc: 'Track absences', descTR: 'Devamsızlık takibi' },
            { href: '/goals', icon: Target, label: 'Weekly Goals', labelTR: 'Haftalık Hedefler', desc: 'Build momentum', descTR: 'Motivasyon oluştur' },
            { href: '/daily-planner', icon: BookOpen, label: 'Daily Planner', labelTR: 'Günlük Planlayıcı', desc: 'Hour-by-hour schedule', descTR: 'Saatlik plan' },
            { href: '/habits', icon: Flame, label: 'Habit Tracker', labelTR: 'Alışkanlık Takibi', desc: 'Build daily habits', descTR: 'Günlük alışkanlıklar' },
        ],
    },
    {
        label: 'Career & Finance',
        labelTR: 'Kariyer & Finans',
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        dotClass: 'bg-emerald-500',
        tools: [
            { href: '/applications', icon: Briefcase, label: 'Job Tracker', labelTR: 'İş Başvuruları', desc: 'Track applications', descTR: 'Başvuru takibi' },
            { href: '/budget', icon: Wallet, label: 'Budget Manager', labelTR: 'Bütçe Yönetimi', desc: 'Income & expenses', descTR: 'Gelir & gider' },
        ],
    },
];

export default function DesktopNav() {
    const pathname = usePathname();
    const [toolsOpen, setToolsOpen] = useState(false);
    const [lang, setLang] = useState<'tr' | 'en'>('tr');
    const menuRef = useRef<HTMLDivElement>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const savedSettings = localStorage.getItem('settings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            if (parsed.language) setLang(parsed.language);
        } else {
            const browserLang = navigator.language.toLowerCase();
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (!browserLang.startsWith('tr') && tz !== 'Europe/Istanbul') {
                setLang('en');
            }
        }
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setToolsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const openMenu = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setToolsOpen(true);
    };

    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setToolsOpen(false), 150);
    };

    const isTR = lang === 'tr';

    return (
        <header className="hidden md:block sticky top-0 z-50 border-b border-gray-200/70 dark:border-white/[0.07] bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
                        <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-xl text-white">
                            <GraduationCap size={18} />
                        </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        UniPlanner<span className="text-blue-600 dark:text-blue-400">.</span>
                    </span>
                </Link>

                {/* Nav links */}
                <nav className="flex items-center gap-1 flex-1">
                    {/* Tools dropdown */}
                    <div
                        ref={menuRef}
                        className="relative"
                        onMouseEnter={openMenu}
                        onMouseLeave={scheduleClose}
                    >
                        <button
                            onClick={() => setToolsOpen(o => !o)}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${toolsOpen
                                ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06]'
                                }`}
                        >
                            {isTR ? 'Araçlar' : 'Tools'}
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {/* Mega menu */}
                        {toolsOpen && (
                            <div
                                className="absolute top-full left-0 mt-1.5 w-[640px] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden animate-fade-in"
                                onMouseEnter={openMenu}
                                onMouseLeave={scheduleClose}
                            >
                                <div className="p-5 grid grid-cols-3 gap-x-6 gap-y-1">
                                    {toolGroups.map((group) => (
                                        <div key={group.label}>
                                            <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${group.colorClass}`}>
                                                {isTR ? group.labelTR : group.label}
                                            </div>
                                            <div className="space-y-0.5">
                                                {group.tools.map((tool) => {
                                                    const isActive = pathname === tool.href;
                                                    return (
                                                        <Link
                                                            key={tool.href}
                                                            href={tool.href}
                                                            onClick={() => setToolsOpen(false)}
                                                            className={`flex items-start gap-2.5 px-2.5 py-2 rounded-xl transition-colors group/item ${isActive
                                                                ? 'bg-blue-50 dark:bg-blue-500/10'
                                                                : 'hover:bg-gray-50 dark:hover:bg-white/[0.05]'
                                                                }`}
                                                        >
                                                            <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 transition-colors ${isActive
                                                                ? 'bg-blue-100 dark:bg-blue-500/20'
                                                                : 'bg-gray-100 dark:bg-gray-800 group-hover/item:bg-gray-200 dark:group-hover/item:bg-gray-700'
                                                                }`}>
                                                                <tool.icon size={13} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'} />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className={`text-xs font-semibold leading-tight ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'}`}>
                                                                    {isTR ? tool.labelTR : tool.label}
                                                                </div>
                                                                <div className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight mt-0.5">
                                                                    {isTR ? tool.descTR : tool.desc}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {/* Footer */}
                                <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-3 bg-gray-50/80 dark:bg-white/[0.02] flex items-center justify-between">
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {isTR ? '14 ücretsiz araç · kayıt gerekmez' : '14 free tools · no signup required'}
                                    </span>
                                    <Link
                                        href="/planner"
                                        onClick={() => setToolsOpen(false)}
                                        className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                    >
                                        {isTR ? 'En Popülere Git' : 'Go to Most Popular'}
                                        <ArrowRight size={11} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/about"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/about'
                            ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06]'
                            }`}
                    >
                        {isTR ? 'Hakkında' : 'About'}
                    </Link>

                    <Link
                        href="/contact"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${pathname === '/contact'
                            ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/[0.06]'
                            }`}
                    >
                        {isTR ? 'İletişim' : 'Contact'}
                    </Link>
                </nav>

                {/* Right side */}
                <div className="flex items-center gap-3 shrink-0">
                    <ModeToggle />
                    <Link
                        href="/planner"
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                        {isTR ? 'Ücretsiz Başla' : 'Get Started'}
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </header>
    );
}
