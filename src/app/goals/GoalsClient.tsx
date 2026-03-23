'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Target, CheckCircle, Circle, Flame, Trophy, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import ToolMarketingSections from '@/components/ToolMarketingSections';

interface Goal {
    id: string;
    title: string;
    completed: boolean;
}

interface WeekData {
    weekStart: string;
    goals: Goal[];
    completedCount: number;
}

interface GoalsStats {
    totalWeeks: number;
    perfectWeeks: number;
    currentStreak: number;
    longestStreak: number;
    totalGoalsCompleted: number;
}

export default function GoalsClient() {
    const [mounted, setMounted] = useState(false);
    const [weeks, setWeeks] = useState<Record<string, WeekData>>({});
    const [currentWeekStart, setCurrentWeekStart] = useState('');
    const [newGoal, setNewGoal] = useState('');
    const [stats, setStats] = useState<GoalsStats>({
        totalWeeks: 0,
        perfectWeeks: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalGoalsCompleted: 0
    });

    const getWeekStart = (date: Date = new Date()) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);
        d.setHours(0, 0, 0, 0);
        return d.toISOString().split('T')[0];
    };

    const getWeekEnd = (weekStart: string) => {
        const d = new Date(weekStart);
        d.setDate(d.getDate() + 6);
        return d.toISOString().split('T')[0];
    };

    useEffect(() => {
        setMounted(true);
        setCurrentWeekStart(getWeekStart());

        const savedWeeks = localStorage.getItem('weekly_goals');
        if (savedWeeks) {
            setWeeks(JSON.parse(savedWeeks));
        }

        const savedStats = localStorage.getItem('goals_stats');
        if (savedStats) {
            setStats(JSON.parse(savedStats));
        }
    }, []);

    useEffect(() => {
        if (mounted && Object.keys(weeks).length > 0) {
            localStorage.setItem('weekly_goals', JSON.stringify(weeks));

            // Calculate stats
            const weekKeys = Object.keys(weeks).sort();
            let perfectCount = 0;
            let totalCompleted = 0;
            let currentStreak = 0;
            let longestStreak = 0;
            let tempStreak = 0;

            weekKeys.forEach((weekKey, index) => {
                const week = weeks[weekKey];
                const allCompleted = week.goals.length > 0 && week.goals.every(g => g.completed);
                totalCompleted += week.goals.filter(g => g.completed).length;

                if (allCompleted) {
                    perfectCount++;
                    tempStreak++;
                    if (tempStreak > longestStreak) longestStreak = tempStreak;
                } else {
                    tempStreak = 0;
                }

                if (index === weekKeys.length - 1 || index === weekKeys.length - 2) {
                    if (allCompleted) currentStreak = tempStreak;
                }
            });

            const newStats = {
                totalWeeks: weekKeys.length,
                perfectWeeks: perfectCount,
                currentStreak,
                longestStreak,
                totalGoalsCompleted: totalCompleted
            };
            setStats(newStats);
            localStorage.setItem('goals_stats', JSON.stringify(newStats));
        }
    }, [weeks, mounted]);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const lang = (savedSettings ? JSON.parse(savedSettings).language || 'tr' : 'tr') as 'tr' | 'en';

    const currentWeek = weeks[currentWeekStart] || { weekStart: currentWeekStart, goals: [], completedCount: 0 };
    const completionPercentage = currentWeek.goals.length > 0
        ? Math.round((currentWeek.goals.filter(g => g.completed).length / currentWeek.goals.length) * 100)
        : 0;

    const addGoal = () => {
        if (!newGoal.trim()) return;
        const goal: Goal = {
            id: Date.now().toString(),
            title: newGoal,
            completed: false
        };
        setWeeks(prev => ({
            ...prev,
            [currentWeekStart]: {
                weekStart: currentWeekStart,
                goals: [...(prev[currentWeekStart]?.goals || []), goal],
                completedCount: prev[currentWeekStart]?.completedCount || 0
            }
        }));
        setNewGoal('');
    };

    const toggleGoal = (goalId: string) => {
        setWeeks(prev => {
            const week = prev[currentWeekStart];
            if (!week) return prev;
            const updatedGoals = week.goals.map(g =>
                g.id === goalId ? { ...g, completed: !g.completed } : g
            );
            return {
                ...prev,
                [currentWeekStart]: {
                    ...week,
                    goals: updatedGoals,
                    completedCount: updatedGoals.filter(g => g.completed).length
                }
            };
        });
    };

    const deleteGoal = (goalId: string) => {
        setWeeks(prev => {
            const week = prev[currentWeekStart];
            if (!week) return prev;
            const updatedGoals = week.goals.filter(g => g.id !== goalId);
            return {
                ...prev,
                [currentWeekStart]: {
                    ...week,
                    goals: updatedGoals,
                    completedCount: updatedGoals.filter(g => g.completed).length
                }
            };
        });
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeekStart(d.toISOString().split('T')[0]);
    };

    const isCurrentWeek = currentWeekStart === getWeekStart();

    const formatWeekRange = (weekStart: string) => {
        const start = new Date(weekStart);
        const end = new Date(weekStart);
        end.setDate(end.getDate() + 6);
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
        return `${start.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', options)} - ${end.toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', options)}`;
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {lang === 'tr' ? 'Haftalık Hedefler' : 'Weekly Goals'}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {lang === 'tr' ? 'Akademik hedeflerini belirle' : 'Set your academic goals'}
                            </p>
                        </div>
                    </div>
                    <ModeToggle />
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                        <Flame className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.currentStreak}</div>
                        <div className="text-xs text-gray-500">{lang === 'tr' ? 'Streak' : 'Streak'}</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                        <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.perfectWeeks}</div>
                        <div className="text-xs text-gray-500">{lang === 'tr' ? 'Tam Hafta' : 'Perfect'}</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                        <Target className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalGoalsCompleted}</div>
                        <div className="text-xs text-gray-500">{lang === 'tr' ? 'Tamamlanan' : 'Completed'}</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 text-center">
                        <Sparkles className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.longestStreak}</div>
                        <div className="text-xs text-gray-500">{lang === 'tr' ? 'En Uzun' : 'Longest'}</div>
                    </div>
                </div>

                {/* Week Navigator */}
                <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => navigateWeek('prev')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                            {formatWeekRange(currentWeekStart)}
                        </div>
                        {isCurrentWeek && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">
                                {lang === 'tr' ? 'Bu Hafta' : 'This Week'}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => navigateWeek('next')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Progress */}
                {currentWeek.goals.length > 0 && (
                    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-gray-900 dark:text-white">
                                {lang === 'tr' ? 'Haftalık İlerleme' : 'Weekly Progress'}
                            </span>
                            <span className={`text-lg font-bold ${completionPercentage === 100 ? 'text-emerald-600 dark:text-emerald-400' :
                                completionPercentage >= 50 ? 'text-blue-600 dark:text-blue-400' :
                                    'text-gray-600 dark:text-gray-400'
                                }`}>
                                %{completionPercentage}
                            </span>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${completionPercentage === 100 ? 'bg-emerald-500' :
                                    completionPercentage >= 50 ? 'bg-blue-500' :
                                        'bg-gray-400'
                                    }`}
                                style={{ width: `${completionPercentage}%` }}
                            />
                        </div>
                        {completionPercentage === 100 && (
                            <div className="mt-3 text-center text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center justify-center gap-1">
                                <Trophy size={16} />
                                {lang === 'tr' ? 'Tebrikler! Bu haftayı tamamladın!' : 'Congratulations! You completed this week!'}
                            </div>
                        )}
                    </div>
                )}

                {/* Add Goal */}
                <div className="mb-6 flex gap-3">
                    <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                        placeholder={lang === 'tr' ? 'Yeni hedef ekle...' : 'Add new goal...'}
                        className="flex-1 px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                    />
                    <button
                        onClick={addGoal}
                        className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Goals List */}
                {currentWeek.goals.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Target className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {lang === 'tr' ? 'Bu hafta için hedef yok' : 'No goals for this week'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'tr' ? 'Akademik hedeflerini ekle ve takip et' : 'Add your academic goals and track them'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {currentWeek.goals.map((goal) => (
                            <div
                                key={goal.id}
                                className={`p-4 bg-white dark:bg-gray-900 rounded-xl border transition-all ${goal.completed
                                    ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10'
                                    : 'border-gray-200 dark:border-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => toggleGoal(goal.id)}
                                        className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${goal.completed
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-emerald-500'
                                            }`}
                                    >
                                        {goal.completed && <CheckCircle size={14} />}
                                    </button>
                                    <span className={`flex-1 ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                                        {goal.title}
                                    </span>
                                    <button
                                        onClick={() => deleteGoal(goal.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Motivation */}
                {currentWeek.goals.length > 0 && completionPercentage < 100 && isCurrentWeek && (
                    <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                        {lang === 'tr'
                            ? `${currentWeek.goals.length - currentWeek.goals.filter(g => g.completed).length} hedef kaldı. Devam et!`
                            : `${currentWeek.goals.length - currentWeek.goals.filter(g => g.completed).length} goals left. Keep going!`
                        }
                    </div>
                )}
            </main>

            {/* Marketing Sections */}
            <ToolMarketingSections lang={lang} tool="goals" />
        </div>
    );
}
