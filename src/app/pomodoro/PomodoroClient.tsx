'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ArrowLeft, Play, Pause, RotateCcw, Coffee, Zap, Brain, Maximize, Minimize, Moon, Sun, BarChart3, X, Flame, Clock, Target, ChevronDown } from 'lucide-react';
import { translations } from '@/lib/i18n';
import ToolMarketingSections from '@/components/ToolMarketingSections';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroSession {
    date: string;
    duration: number; // in minutes
    type: TimerMode;
}

interface PomodoroStats {
    sessions: PomodoroSession[];
    totalPomodoros: number;
    totalMinutes: number;
    streak: number;
    lastSessionDate: string;
}

export default function PomodoroClient() {
    const [mounted, setMounted] = useState(false);
    const [mode, setMode] = useState<TimerMode>('pomodoro');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [stats, setStats] = useState<PomodoroStats>({
        sessions: [],
        totalPomodoros: 0,
        totalMinutes: 0,
        streak: 0,
        lastSessionDate: ''
    });

    const { theme, setTheme } = useTheme();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sessionStartRef = useRef<number>(0);

    const [lights, setLights] = useState<{ left: string; top: string; duration: string; delay: string; color: string }[]>([]);
    const [shootingStars, setShootingStars] = useState<{ left: string; top: string; delay: string }[]>([]);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const parsedFn = savedSettings ? JSON.parse(savedSettings) : {};
    const lang = parsedFn.language || 'tr';
    const t = translations[lang as keyof typeof translations];

    const modes: Record<TimerMode, { minutes: number; label: string; icon: any; color: string; bgGradient: string }> = {
        pomodoro: {
            minutes: 25,
            label: lang === 'tr' ? 'Odaklan' : 'Focus',
            icon: Brain,
            color: 'text-rose-100',
            bgGradient: 'from-rose-400 to-orange-300 dark:from-slate-900 dark:to-slate-800'
        },
        shortBreak: {
            minutes: 5,
            label: lang === 'tr' ? 'Kısa Mola' : 'Short Break',
            icon: Coffee,
            color: 'text-teal-100',
            bgGradient: 'from-emerald-400 to-teal-300 dark:from-slate-900 dark:to-slate-800'
        },
        longBreak: {
            minutes: 15,
            label: lang === 'tr' ? 'Uzun Mola' : 'Long Break',
            icon: Zap,
            color: 'text-indigo-100',
            bgGradient: 'from-blue-400 to-indigo-400 dark:from-slate-900 dark:to-slate-800'
        }
    };

    useEffect(() => {
        setMounted(true);
        // Load stats
        const savedStats = localStorage.getItem('pomodoro_stats');
        if (savedStats) {
            const parsed = JSON.parse(savedStats);
            // Update streak
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (parsed.lastSessionDate !== today && parsed.lastSessionDate !== yesterday) {
                parsed.streak = 0;
            }
            setStats(parsed);
        }

        const newLights = Array.from({ length: 50 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: `${3 + Math.random() * 7}s`,
            delay: `${Math.random() * 5}s`,
            color: Math.random() > 0.6 ? 'bg-yellow-200' : (Math.random() > 0.5 ? 'bg-orange-300' : 'bg-white')
        }));
        setLights(newLights);

        const newShootingStars = Array.from({ length: 5 }).map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            delay: `${2 + Math.random() * 10}s`
        }));
        setShootingStars(newShootingStars);

        return () => clearInterval(intervalRef.current!);
    }, []);

    useEffect(() => {
        if (mounted && stats.totalPomodoros > 0) {
            localStorage.setItem('pomodoro_stats', JSON.stringify(stats));
        }
    }, [stats, mounted]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const recordSession = () => {
        if (mode !== 'pomodoro') return;
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        setStats(prev => {
            const newStreak = prev.lastSessionDate === today ? prev.streak :
                prev.lastSessionDate === yesterday ? prev.streak + 1 : 1;
            return {
                sessions: [...prev.sessions.slice(-99), { date: today, duration: 25, type: 'pomodoro' }],
                totalPomodoros: prev.totalPomodoros + 1,
                totalMinutes: prev.totalMinutes + 25,
                streak: newStreak,
                lastSessionDate: today
            };
        });
    };

    const toggleTimer = () => {
        if (isActive) {
            clearInterval(intervalRef.current!);
            setIsActive(false);
        } else {
            sessionStartRef.current = Date.now();
            setIsActive(true);
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!);
                        setIsActive(false);
                        recordSession();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current!);
        setIsActive(false);
        setTimeLeft(modes[mode].minutes * 60);
    };

    const changeMode = (newMode: TimerMode) => {
        setMode(newMode);
        clearInterval(intervalRef.current!);
        setIsActive(false);
        setTimeLeft(modes[newMode].minutes * 60);
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;
        try {
            if (!document.fullscreenElement) {
                await containerRef.current.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error('Error toggling fullscreen:', err);
        }
    };

    const getTodayMinutes = () => {
        const today = new Date().toISOString().split('T')[0];
        return stats.sessions.filter(s => s.date === today).reduce((sum, s) => sum + s.duration, 0);
    };

    const getWeekMinutes = () => {
        const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
        return stats.sessions.filter(s => s.date >= weekAgo).reduce((sum, s) => sum + s.duration, 0);
    };

    const getWeeklyData = () => {
        const data: { day: string; minutes: number }[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(Date.now() - i * 86400000);
            const dateStr = date.toISOString().split('T')[0];
            const dayName = date.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { weekday: 'short' });
            const minutes = stats.sessions.filter(s => s.date === dateStr).reduce((sum, s) => sum + s.duration, 0);
            data.push({ day: dayName, minutes });
        }
        return data;
    };

    if (!mounted) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const scrollToContent = () => {
        document.getElementById('marketing-content')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* Main Pomodoro Section - Full Screen */}
            <div
                ref={containerRef}
                className={`min-h-screen transition-all duration-1000 ease-in-out flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br ${modes[mode].bgGradient}`}
            >
                {/* Stats Modal */}
                {showStats && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {lang === 'tr' ? 'İstatistikler' : 'Statistics'}
                                </h2>
                                <button onClick={() => setShowStats(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-center">
                                    <Target className="w-6 h-6 text-rose-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.totalPomodoros}</div>
                                    <div className="text-xs text-rose-500">{lang === 'tr' ? 'Toplam Pomodoro' : 'Total Pomodoros'}</div>
                                </div>
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-center">
                                    <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{Math.floor(stats.totalMinutes / 60)}h</div>
                                    <div className="text-xs text-blue-500">{lang === 'tr' ? 'Toplam Süre' : 'Total Time'}</div>
                                </div>
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-center">
                                    <Flame className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.streak}</div>
                                    <div className="text-xs text-amber-500">{lang === 'tr' ? 'Gün Streak' : 'Day Streak'}</div>
                                </div>
                                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-center">
                                    <Brain className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{getTodayMinutes()}</div>
                                    <div className="text-xs text-emerald-500">{lang === 'tr' ? 'Bugün (dk)' : 'Today (min)'}</div>
                                </div>
                            </div>

                            {/* Weekly Chart */}
                            <div className="mb-4">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    {lang === 'tr' ? 'Son 7 Gün' : 'Last 7 Days'}
                                </h3>
                                <div className="flex items-end justify-between gap-2 h-24">
                                    {getWeeklyData().map((day, i) => {
                                        const maxMinutes = Math.max(...getWeeklyData().map(d => d.minutes), 25);
                                        const height = day.minutes > 0 ? Math.max(10, (day.minutes / maxMinutes) * 100) : 4;
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                <div
                                                    className={`w-full rounded-t-lg transition-all ${day.minutes > 0 ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                                                    style={{ height: `${height}%` }}
                                                />
                                                <span className="text-xs text-gray-500">{day.day}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                                {lang === 'tr' ? `Bu hafta: ${getWeekMinutes()} dakika` : `This week: ${getWeekMinutes()} minutes`}
                            </div>
                        </div>
                    </div>
                )}

                {/* Dark Mode Background */}
                <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-black/80 via-slate-900/40 to-transparent pointer-events-none z-0"></div>
                    {lights.map((light, i) => (
                        <div key={`star-${i}`} className={`absolute rounded-full w-1 h-1 blur-[1px] animate-twinkle ${light.color}`}
                            style={{ left: light.left, top: light.top, animationDuration: light.duration, animationDelay: light.delay }} />
                    ))}
                    {shootingStars.map((star, i) => (
                        <div key={`shooting-star-${i}`} className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_0_2px_rgba(255,255,255,0.1)] animate-shooting-star"
                            style={{ left: star.left, top: star.top, animationDuration: '4s', animationDelay: star.delay, animationIterationCount: 'infinite' }} />
                    ))}
                </div>

                {/* Light Mode Background */}
                <div className={`absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ${!isDark ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
                </div>

                {/* Navigation */}
                <div className={`absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 ${isFullscreen ? 'opacity-0 hover:opacity-100 transition-opacity duration-300' : ''}`}>
                    <Link href="/" className="inline-flex items-center text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 px-4 py-2 rounded-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t.terms?.backToHome || 'Home'}
                    </Link>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowStats(true)}
                            className="p-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 rounded-full hover:bg-white/20"
                            title={lang === 'tr' ? 'İstatistikler' : 'Statistics'}
                        >
                            <BarChart3 size={20} />
                        </button>
                        <button
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="relative w-10 h-10 p-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 rounded-full hover:bg-white/20 overflow-hidden"
                        >
                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${theme === 'dark' ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'}`}>
                                <Moon size={20} className="fill-current" />
                            </div>
                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${theme === 'dark' ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                                <Sun size={20} className="stroke-current" />
                            </div>
                        </button>
                        <button onClick={toggleFullscreen} className="p-2 text-white/80 hover:text-white transition-colors backdrop-blur-sm bg-white/10 rounded-full hover:bg-white/20">
                            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className={`w-full max-w-md z-10 transition-all duration-500 ${isFullscreen ? 'scale-110' : 'scale-100'}`}>
                    {/* Mode Selector */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-1.5 flex justify-between mb-12 mx-4 border border-white/20 shadow-lg">
                        {(Object.keys(modes) as TimerMode[]).map((m) => (
                            <button key={m} onClick={() => changeMode(m)}
                                className={`flex-1 flex flex-col items-center py-2 px-2 rounded-xl text-sm font-medium transition-all duration-300 ${mode === m ? 'bg-white text-gray-900 shadow-md transform scale-105' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
                                <span className="flex items-center gap-2">
                                    {React.createElement(modes[m].icon, { size: 16 })}
                                    {modes[m].label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Timer */}
                    <div className="relative mb-12 flex flex-col items-center justify-center p-12">
                        <div className="absolute inset-0">
                            <svg className="w-full h-full" viewBox="0 0 300 150">
                                <rect x="5" y="5" width="290" height="140" rx="40" ry="40" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/10" />
                                <rect x="5" y="5" width="290" height="140" rx="40" ry="40" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"
                                    className="text-white transition-all duration-1000 ease-linear"
                                    pathLength="100" strokeDasharray="100" strokeDashoffset={100 - (timeLeft / (modes[mode].minutes * 60) * 100)} />
                            </svg>
                        </div>
                        <div className="text-[8rem] leading-none font-bold text-white drop-shadow-2xl tabular-nums font-mono tracking-tighter z-10 mx-8">
                            {minutes.toString().padStart(2, '0')}<span className="animate-pulse">:</span>{seconds.toString().padStart(2, '0')}
                        </div>
                        <div className={`mt-4 text-lg font-medium tracking-widest uppercase ${modes[mode].color} opacity-80 z-10`}>
                            {isActive ? (lang === 'tr' ? 'Odaklanıyor...' : 'Focusing...') : (lang === 'tr' ? 'Hazır' : 'Ready')}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-center gap-6">
                        <button onClick={resetTimer} className="w-16 h-16 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95">
                            <RotateCcw size={24} />
                        </button>
                        <button onClick={toggleTimer} className="w-24 h-24 rounded-full bg-white text-gray-900 shadow-2xl shadow-black/20 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95">
                            {isActive ? <Pause size={40} className="fill-current" /> : <Play size={40} className="fill-current ml-2" />}
                        </button>
                    </div>

                    {/* Today's Progress */}
                    {!isFullscreen && stats.totalPomodoros > 0 && (
                        <div className="mt-8 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm">
                                <Flame size={16} className="text-amber-400" />
                                <span>{lang === 'tr' ? `Bugün: ${getTodayMinutes()} dk` : `Today: ${getTodayMinutes()} min`}</span>
                                {stats.streak > 1 && (
                                    <span className="px-2 py-0.5 bg-amber-500/20 rounded-full text-amber-300 text-xs">
                                        {stats.streak} 🔥
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer and Scroll Indicator */}
                {!isFullscreen && (
                    <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-20">
                        <div className="text-white/50 text-sm mb-6">
                            <p>{lang === 'tr' ? 'Kendini akışa bırak.' : 'Immerse yourself in the flow.'}</p>
                        </div>

                        <button
                            onClick={scrollToContent}
                            className="group flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
                        >
                            <span className="text-sm font-medium">
                                {lang === 'tr' ? 'Daha fazla bilgi' : 'More info'}
                            </span>
                            <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center">
                                <ChevronDown size={18} />
                            </div>
                        </button>
                    </div>
                )}
            </div>

            {/* Marketing Sections - Outside main container, always visible */}
            {!isFullscreen && <ToolMarketingSections lang={lang} tool="pomodoro" hideScrollIndicator={true} />}
        </>
    );
}
