'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Flame, Check, Trash2, Trophy, Target, TrendingUp, Calendar } from 'lucide-react';

interface Habit {
    id: string;
    name: string;
    icon: string;
    color: string;
    createdAt: string;
    completedDates: string[];
}

const ICONS = ['📚', '💪', '🧘', '💧', '🏃', '🎯', '✍️', '🌙', '🍎', '🧠', '💻', '🎵', '📝', '🌿', '⭐'];
const COLORS = [
    { bg: 'bg-blue-500', light: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800' },
    { bg: 'bg-purple-500', light: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800' },
    { bg: 'bg-green-500', light: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800' },
    { bg: 'bg-orange-500', light: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800' },
    { bg: 'bg-rose-500', light: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
    { bg: 'bg-teal-500', light: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' },
];

function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

function getStreak(completedDates: string[]): number {
    if (completedDates.length === 0) return 0;
    const sorted = [...completedDates].sort().reverse();
    const today = getTodayStr();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

    let streak = 0;
    let current = sorted[0] === today ? new Date() : new Date(Date.now() - 86400000);

    for (let i = 0; i < sorted.length; i++) {
        const expected = current.toISOString().split('T')[0];
        if (sorted[i] === expected) {
            streak++;
            current = new Date(current.getTime() - 86400000);
        } else {
            break;
        }
    }
    return streak;
}

function getLast7Days(): string[] {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(Date.now() - (6 - i) * 86400000);
        return d.toISOString().split('T')[0];
    });
}

function getDayLabel(dateStr: string): string {
    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    return days[new Date(dateStr + 'T12:00:00').getDay()];
}

export default function HabitsClient() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState(ICONS[0]);
    const [newColor, setNewColor] = useState(0);
    const [activeTab, setActiveTab] = useState<'today' | 'stats'>('today');

    useEffect(() => {
        const saved = localStorage.getItem('habits_data');
        if (saved) setHabits(JSON.parse(saved));
    }, []);

    const save = (updated: Habit[]) => {
        setHabits(updated);
        localStorage.setItem('habits_data', JSON.stringify(updated));
    };

    const addHabit = () => {
        if (!newName.trim()) return;
        const habit: Habit = {
            id: Date.now().toString(),
            name: newName.trim(),
            icon: newIcon,
            color: newColor.toString(),
            createdAt: getTodayStr(),
            completedDates: [],
        };
        save([...habits, habit]);
        setNewName('');
        setNewIcon(ICONS[0]);
        setNewColor(0);
        setShowAdd(false);
    };

    const toggleToday = (id: string) => {
        const today = getTodayStr();
        save(habits.map(h => {
            if (h.id !== id) return h;
            const done = h.completedDates.includes(today);
            return {
                ...h,
                completedDates: done
                    ? h.completedDates.filter(d => d !== today)
                    : [...h.completedDates, today],
            };
        }));
    };

    const deleteHabit = (id: string) => {
        save(habits.filter(h => h.id !== id));
    };

    const today = getTodayStr();
    const last7 = getLast7Days();
    const completedToday = habits.filter(h => h.completedDates.includes(today)).length;
    const totalStreak = habits.reduce((sum, h) => sum + getStreak(h.completedDates), 0);
    const bestStreak = habits.reduce((max, h) => Math.max(max, getStreak(h.completedDates)), 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-3xl mx-auto px-4 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Flame className="text-orange-500" size={22} />
                                Habit Tracker
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAdd(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                        >
                            <Plus size={16} />
                            Add Habit
                        </button>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedToday}/{habits.length}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Today</div>
                        </div>
                        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-orange-500 flex items-center justify-center gap-1">
                                <Flame size={18} />{bestStreak}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Best Streak</div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalStreak}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total Streaks</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 mt-4 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                        {(['today', 'stats'] as const).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === tab
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                {tab === 'today' ? 'Today' : 'Statistics'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 py-4">
                {habits.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">🌱</div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No habits yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                            Start building your daily routine. Add your first habit to begin tracking streaks.
                        </p>
                        <button
                            onClick={() => setShowAdd(true)}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                        >
                            <Plus size={16} />
                            Add Your First Habit
                        </button>
                    </div>
                ) : activeTab === 'today' ? (
                    <div className="space-y-3">
                        {habits.map(habit => {
                            const colorIdx = parseInt(habit.color) % COLORS.length;
                            const color = COLORS[colorIdx];
                            const streak = getStreak(habit.completedDates);
                            const done = habit.completedDates.includes(today);

                            return (
                                <div
                                    key={habit.id}
                                    className={`bg-white dark:bg-gray-900 rounded-2xl border-2 p-4 transition-all ${done ? color.border : 'border-gray-100 dark:border-gray-800'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => toggleToday(habit.id)}
                                            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all shrink-0 ${done ? color.bg + ' shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                        >
                                            {done ? <Check className="text-white" size={20} /> : habit.icon}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-semibold text-sm ${done ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                                                {habit.name}
                                            </div>
                                            {streak > 0 && (
                                                <div className="flex items-center gap-1 mt-0.5">
                                                    <Flame size={12} className="text-orange-500" />
                                                    <span className="text-xs text-orange-500 font-medium">{streak} day streak</span>
                                                </div>
                                            )}
                                        </div>
                                        {/* 7-day mini chart */}
                                        <div className="flex gap-1 items-end">
                                            {last7.map(d => (
                                                <div key={d} className="flex flex-col items-center gap-0.5">
                                                    <div className={`w-5 h-5 rounded-md ${habit.completedDates.includes(d)
                                                        ? color.bg + ' opacity-90'
                                                        : 'bg-gray-100 dark:bg-gray-800'}`}
                                                    />
                                                    <span className="text-[9px] text-gray-400">{getDayLabel(d)}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => deleteHabit(habit.id)}
                                            className="p-1.5 text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors ml-1"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Stats Tab */
                    <div className="space-y-4">
                        {habits.map(habit => {
                            const colorIdx = parseInt(habit.color) % COLORS.length;
                            const color = COLORS[colorIdx];
                            const streak = getStreak(habit.completedDates);
                            const total = habit.completedDates.length;
                            const daysSince = Math.max(1, Math.ceil((Date.now() - new Date(habit.createdAt).getTime()) / 86400000));
                            const rate = Math.round((total / daysSince) * 100);

                            return (
                                <div key={habit.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-10 h-10 ${color.light} rounded-xl flex items-center justify-center text-xl`}>
                                            {habit.icon}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{habit.name}</div>
                                            <div className={`text-xs ${color.text}`}>Started {habit.createdAt}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className={`${color.light} rounded-xl p-2.5 text-center`}>
                                            <div className={`text-xl font-bold ${color.text}`}>{streak}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Streak</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 text-center">
                                            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{total}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-2.5 text-center">
                                            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{rate}%</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">Rate</div>
                                        </div>
                                    </div>
                                    {/* Last 28 days grid */}
                                    <div>
                                        <div className="text-xs text-gray-400 mb-2">Last 28 days</div>
                                        <div className="grid grid-cols-7 gap-1">
                                            {Array.from({ length: 28 }, (_, i) => {
                                                const d = new Date(Date.now() - (27 - i) * 86400000).toISOString().split('T')[0];
                                                return (
                                                    <div
                                                        key={d}
                                                        title={d}
                                                        className={`aspect-square rounded-sm ${habit.completedDates.includes(d)
                                                            ? color.bg + ' opacity-80'
                                                            : 'bg-gray-100 dark:bg-gray-800'}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Add Habit Modal */}
            {showAdd && (
                <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-5 animate-slide-up">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">New Habit</h2>

                        <input
                            type="text"
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addHabit()}
                            placeholder="Habit name (e.g. Read 30 minutes)"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            autoFocus
                        />

                        <div className="mb-4">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Pick an Icon</div>
                            <div className="flex flex-wrap gap-2">
                                {ICONS.map(icon => (
                                    <button
                                        key={icon}
                                        onClick={() => setNewIcon(icon)}
                                        className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${newIcon === icon
                                            ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 scale-110'
                                            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Pick a Color</div>
                            <div className="flex gap-2">
                                {COLORS.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setNewColor(i)}
                                        className={`w-8 h-8 rounded-full ${c.bg} transition-all ${newColor === i ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900 scale-110' : ''}`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAdd(false)}
                                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={addHabit}
                                disabled={!newName.trim()}
                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
                            >
                                Add Habit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
