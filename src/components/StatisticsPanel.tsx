'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, Target, Calendar, BookOpen, X } from 'lucide-react';

interface UsageStats {
    totalSessions: number;
    totalMinutes: number;
    streak: number;
    lastVisit: string;
    toolUsage: Record<string, number>;
}

interface StatisticsPanelProps {
    lang?: 'tr' | 'en';
    onClose?: () => void;
}

const translations = {
    tr: {
        title: 'Kullanım İstatistikleri',
        totalSessions: 'Toplam Oturum',
        totalTime: 'Toplam Süre',
        streak: 'Gün Serisi',
        days: 'gün',
        minutes: 'dakika',
        mostUsed: 'En Çok Kullanılan',
        weeklyActivity: 'Haftalık Aktivite',
        noData: 'Henüz veri yok',
        tools: {
            planner: 'Ders Programı',
            gpa: 'Ortalama Hesaplama',
            final: 'Vize Final',
            pomodoro: 'Pomodoro',
            attendance: 'Devamsızlık',
            budget: 'Bütçe',
            exams: 'Sınavlar',
            assignments: 'Ödevler',
            flashcards: 'Kartlar',
            notes: 'Notlar',
            goals: 'Hedefler'
        }
    },
    en: {
        title: 'Usage Statistics',
        totalSessions: 'Total Sessions',
        totalTime: 'Total Time',
        streak: 'Day Streak',
        days: 'days',
        minutes: 'minutes',
        mostUsed: 'Most Used',
        weeklyActivity: 'Weekly Activity',
        noData: 'No data yet',
        tools: {
            planner: 'Schedule',
            gpa: 'GPA Calculator',
            final: 'Final Calculator',
            pomodoro: 'Pomodoro',
            attendance: 'Attendance',
            budget: 'Budget',
            exams: 'Exams',
            assignments: 'Assignments',
            flashcards: 'Flashcards',
            notes: 'Notes',
            goals: 'Goals'
        }
    }
};

export function useUsageStats() {
    const getStats = (): UsageStats => {
        if (typeof window === 'undefined') {
            return { totalSessions: 0, totalMinutes: 0, streak: 0, lastVisit: '', toolUsage: {} };
        }
        const saved = localStorage.getItem('usage-stats');
        return saved ? JSON.parse(saved) : { totalSessions: 0, totalMinutes: 0, streak: 0, lastVisit: '', toolUsage: {} };
    };

    const updateStats = (updates: Partial<UsageStats>) => {
        const current = getStats();
        const updated = { ...current, ...updates };
        localStorage.setItem('usage-stats', JSON.stringify(updated));
    };

    const trackToolUsage = (tool: string) => {
        const stats = getStats();
        const usage = stats.toolUsage || {};
        usage[tool] = (usage[tool] || 0) + 1;
        updateStats({ toolUsage: usage });
    };

    const trackSession = () => {
        const stats = getStats();
        const today = new Date().toDateString();
        const lastVisit = stats.lastVisit;

        let newStreak = stats.streak;
        if (lastVisit) {
            const lastDate = new Date(lastVisit);
            const diff = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
            if (diff === 1) {
                newStreak += 1;
            } else if (diff > 1) {
                newStreak = 1;
            }
        } else {
            newStreak = 1;
        }

        updateStats({
            totalSessions: stats.totalSessions + 1,
            streak: newStreak,
            lastVisit: today
        });
    };

    const trackTime = (minutes: number) => {
        const stats = getStats();
        updateStats({ totalMinutes: stats.totalMinutes + minutes });
    };

    return { getStats, updateStats, trackToolUsage, trackSession, trackTime };
}

export default function StatisticsPanel({ lang = 'tr', onClose }: StatisticsPanelProps) {
    const [stats, setStats] = useState<UsageStats | null>(null);
    const t = translations[lang];
    const { getStats } = useUsageStats();

    useEffect(() => {
        setStats(getStats());
    }, []);

    if (!stats) return null;

    const sortedTools = Object.entries(stats.toolUsage || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    const maxUsage = sortedTools.length > 0 ? sortedTools[0][1] : 1;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <BarChart3 size={20} />
                    <h2 className="font-bold">{t.title}</h2>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Stats Grid */}
            <div className="p-4 grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 text-purple-600 dark:text-purple-400 mb-1">
                        <Calendar size={16} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.totalSessions}</div>
                </div>

                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                        <Clock size={16} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalMinutes}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.minutes}</div>
                </div>

                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 text-orange-600 dark:text-orange-400 mb-1">
                        <TrendingUp size={16} />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.streak}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.days}</div>
                </div>
            </div>

            {/* Most Used Tools */}
            <div className="px-4 pb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <Target size={14} />
                    {t.mostUsed}
                </h3>
                {sortedTools.length > 0 ? (
                    <div className="space-y-2">
                        {sortedTools.map(([tool, count]) => (
                            <div key={tool} className="flex items-center gap-3">
                                <div className="w-24 text-sm text-gray-600 dark:text-gray-400 truncate">
                                    {t.tools[tool as keyof typeof t.tools] || tool}
                                </div>
                                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                                        style={{ width: `${(count / maxUsage) * 100}%` }}
                                    />
                                </div>
                                <div className="w-8 text-right text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {count}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400 text-center py-4">{t.noData}</p>
                )}
            </div>
        </div>
    );
}
