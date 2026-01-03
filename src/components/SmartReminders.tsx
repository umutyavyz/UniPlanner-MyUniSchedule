'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, Bell, AlertTriangle, Calendar, ClipboardList, Flame, Trophy, Clock, TrendingDown } from 'lucide-react';

interface Reminder {
    id: string;
    type: 'exam' | 'assignment' | 'attendance' | 'motivation' | 'budget';
    title: string;
    message: string;
    icon: React.ReactNode;
    color: string;
    priority: 'low' | 'medium' | 'high';
    timestamp: number;
}

export default function SmartReminders() {
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [dismissed, setDismissed] = useState<string[]>([]);
    const [mounted, setMounted] = useState(false);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const lang = (savedSettings ? JSON.parse(savedSettings).language || 'tr' : 'tr') as 'tr' | 'en';

    const generateReminders = useCallback(() => {
        const newReminders: Reminder[] = [];
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        // Check Exams
        const savedExams = localStorage.getItem('exams');
        if (savedExams) {
            const exams = JSON.parse(savedExams);
            exams.forEach((exam: any) => {
                const examDate = new Date(exam.date);
                const daysUntil = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                if (daysUntil === 1) {
                    newReminders.push({
                        id: `exam-tomorrow-${exam.id}`,
                        type: 'exam',
                        title: lang === 'tr' ? '⚠️ Yarın Sınavın Var!' : '⚠️ Exam Tomorrow!',
                        message: lang === 'tr'
                            ? `${exam.course} sınavın yarın. Bu gece çalışmayı unutma!`
                            : `Your ${exam.course} exam is tomorrow. Don't forget to study tonight!`,
                        icon: <Calendar className="w-5 h-5" />,
                        color: 'bg-red-500',
                        priority: 'high',
                        timestamp: Date.now()
                    });
                } else if (daysUntil === 3) {
                    newReminders.push({
                        id: `exam-3days-${exam.id}`,
                        type: 'exam',
                        title: lang === 'tr' ? '📚 Sınava 3 Gün Kaldı' : '📚 3 Days Until Exam',
                        message: lang === 'tr'
                            ? `${exam.course} sınavına hazırlanma zamanı!`
                            : `Time to prepare for your ${exam.course} exam!`,
                        icon: <Calendar className="w-5 h-5" />,
                        color: 'bg-amber-500',
                        priority: 'medium',
                        timestamp: Date.now()
                    });
                } else if (daysUntil === 7) {
                    newReminders.push({
                        id: `exam-week-${exam.id}`,
                        type: 'exam',
                        title: lang === 'tr' ? '📅 Sınava 1 Hafta Kaldı' : '📅 1 Week Until Exam',
                        message: lang === 'tr'
                            ? `${exam.course} sınavı için çalışma planı yap.`
                            : `Make a study plan for ${exam.course} exam.`,
                        icon: <Calendar className="w-5 h-5" />,
                        color: 'bg-blue-500',
                        priority: 'low',
                        timestamp: Date.now()
                    });
                }
            });
        }

        // Check Assignments
        const savedAssignments = localStorage.getItem('assignments');
        if (savedAssignments) {
            const assignments = JSON.parse(savedAssignments);
            assignments.forEach((assignment: any) => {
                if (assignment.status === 'completed') return;

                const dueDate = new Date(assignment.dueDate);
                const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                if (daysUntil <= 0) {
                    newReminders.push({
                        id: `assignment-overdue-${assignment.id}`,
                        type: 'assignment',
                        title: lang === 'tr' ? '🚨 Ödev Süresi Geçti!' : '🚨 Assignment Overdue!',
                        message: lang === 'tr'
                            ? `"${assignment.title}" ödevinin süresi geçti!`
                            : `"${assignment.title}" is past its deadline!`,
                        icon: <ClipboardList className="w-5 h-5" />,
                        color: 'bg-red-600',
                        priority: 'high',
                        timestamp: Date.now()
                    });
                } else if (daysUntil === 1) {
                    newReminders.push({
                        id: `assignment-tomorrow-${assignment.id}`,
                        type: 'assignment',
                        title: lang === 'tr' ? '⏰ Ödev Yarın Teslim!' : '⏰ Assignment Due Tomorrow!',
                        message: lang === 'tr'
                            ? `"${assignment.title}" ödevini yarın teslim etmelisin.`
                            : `"${assignment.title}" is due tomorrow.`,
                        icon: <ClipboardList className="w-5 h-5" />,
                        color: 'bg-red-500',
                        priority: 'high',
                        timestamp: Date.now()
                    });
                } else if (daysUntil <= 3) {
                    newReminders.push({
                        id: `assignment-soon-${assignment.id}`,
                        type: 'assignment',
                        title: lang === 'tr' ? `📋 ${daysUntil} Gün Kaldı` : `📋 ${daysUntil} Days Left`,
                        message: lang === 'tr'
                            ? `"${assignment.title}" ödevine ${daysUntil} gün kaldı.`
                            : `${daysUntil} days left for "${assignment.title}".`,
                        icon: <ClipboardList className="w-5 h-5" />,
                        color: 'bg-amber-500',
                        priority: 'medium',
                        timestamp: Date.now()
                    });
                }
            });
        }

        // Check Attendance
        const savedAttendance = localStorage.getItem('attendance');
        if (savedAttendance) {
            const courses = JSON.parse(savedAttendance);
            courses.forEach((course: any) => {
                const percentage = (course.attendedClasses / course.totalClasses) * 100;
                const remaining = course.totalClasses - course.attendedClasses;
                const minRequired = Math.ceil(course.totalClasses * (course.requiredPercentage / 100));
                const canMiss = course.attendedClasses + remaining - minRequired;

                if (canMiss <= 1 && canMiss >= 0) {
                    newReminders.push({
                        id: `attendance-critical-${course.id}`,
                        type: 'attendance',
                        title: lang === 'tr' ? '⚠️ Devamsızlık Kritik!' : '⚠️ Attendance Critical!',
                        message: lang === 'tr'
                            ? `${course.name} dersinde sadece ${canMiss} devamsızlık hakkın kaldı!`
                            : `Only ${canMiss} absence(s) left for ${course.name}!`,
                        icon: <AlertTriangle className="w-5 h-5" />,
                        color: 'bg-red-500',
                        priority: 'high',
                        timestamp: Date.now()
                    });
                } else if (canMiss <= 3 && canMiss > 1) {
                    newReminders.push({
                        id: `attendance-warning-${course.id}`,
                        type: 'attendance',
                        title: lang === 'tr' ? '📊 Devamsızlık Uyarısı' : '📊 Attendance Warning',
                        message: lang === 'tr'
                            ? `${course.name} dersinde ${canMiss} devamsızlık hakkın kaldı.`
                            : `${canMiss} absences left for ${course.name}.`,
                        icon: <AlertTriangle className="w-5 h-5" />,
                        color: 'bg-amber-500',
                        priority: 'medium',
                        timestamp: Date.now()
                    });
                }
            });
        }

        // Check Pomodoro Streak for motivation
        const savedPomodoroStats = localStorage.getItem('pomodoro_stats');
        if (savedPomodoroStats) {
            const stats = JSON.parse(savedPomodoroStats);
            if (stats.streak >= 3) {
                newReminders.push({
                    id: `motivation-streak-${stats.streak}`,
                    type: 'motivation',
                    title: lang === 'tr' ? '🔥 Harikasın!' : '🔥 Amazing!',
                    message: lang === 'tr'
                        ? `${stats.streak} gündür streak'ini koruyorsun! Devam et!`
                        : `You've maintained a ${stats.streak} day streak! Keep going!`,
                    icon: <Flame className="w-5 h-5" />,
                    color: 'bg-orange-500',
                    priority: 'low',
                    timestamp: Date.now()
                });
            }
            if (stats.totalPomodoros >= 50 && stats.totalPomodoros % 50 === 0) {
                newReminders.push({
                    id: `motivation-milestone-${stats.totalPomodoros}`,
                    type: 'motivation',
                    title: lang === 'tr' ? '🏆 Kilometre Taşı!' : '🏆 Milestone!',
                    message: lang === 'tr'
                        ? `${stats.totalPomodoros} pomodoro tamamladın! Tebrikler!`
                        : `You've completed ${stats.totalPomodoros} pomodoros! Congratulations!`,
                    icon: <Trophy className="w-5 h-5" />,
                    color: 'bg-yellow-500',
                    priority: 'low',
                    timestamp: Date.now()
                });
            }
        }

        // Check Weekly Goals completion
        const savedGoals = localStorage.getItem('weekly_goals');
        if (savedGoals) {
            const weeks = JSON.parse(savedGoals);
            const weekKeys = Object.keys(weeks);
            if (weekKeys.length > 0) {
                const lastWeek = weeks[weekKeys[weekKeys.length - 1]];
                if (lastWeek && lastWeek.goals.length > 0) {
                    const completed = lastWeek.goals.filter((g: any) => g.completed).length;
                    const total = lastWeek.goals.length;
                    if (completed === total) {
                        newReminders.push({
                            id: `goals-complete-${lastWeek.weekStart}`,
                            type: 'motivation',
                            title: lang === 'tr' ? '✨ Haftalık Hedefler Tamam!' : '✨ Weekly Goals Complete!',
                            message: lang === 'tr'
                                ? 'Bu haftaki tüm hedeflerini tamamladın!'
                                : 'You completed all your goals this week!',
                            icon: <Trophy className="w-5 h-5" />,
                            color: 'bg-emerald-500',
                            priority: 'low',
                            timestamp: Date.now()
                        });
                    }
                }
            }
        }

        // Check Budget
        const savedTransactions = localStorage.getItem('budget_transactions');
        const savedBudgetGoals = localStorage.getItem('budget_goals');
        if (savedTransactions && savedBudgetGoals) {
            const transactions = JSON.parse(savedTransactions);
            const goals = JSON.parse(savedBudgetGoals);

            const thisMonth = new Date().toISOString().slice(0, 7);
            const monthlyExpense = transactions
                .filter((t: any) => t.date.startsWith(thisMonth) && t.type === 'expense')
                .reduce((sum: number, t: any) => sum + t.amount, 0);

            const percentUsed = (monthlyExpense / goals.monthlyLimit) * 100;

            if (percentUsed >= 90 && percentUsed < 100) {
                newReminders.push({
                    id: `budget-warning-${thisMonth}`,
                    type: 'budget',
                    title: lang === 'tr' ? '💰 Bütçe Uyarısı' : '💰 Budget Warning',
                    message: lang === 'tr'
                        ? `Aylık bütçenin %${Math.round(percentUsed)}'ını kullandın!`
                        : `You've used ${Math.round(percentUsed)}% of your monthly budget!`,
                    icon: <TrendingDown className="w-5 h-5" />,
                    color: 'bg-amber-500',
                    priority: 'medium',
                    timestamp: Date.now()
                });
            } else if (percentUsed >= 100) {
                newReminders.push({
                    id: `budget-exceeded-${thisMonth}`,
                    type: 'budget',
                    title: lang === 'tr' ? '🚨 Bütçe Aşıldı!' : '🚨 Budget Exceeded!',
                    message: lang === 'tr'
                        ? `Aylık bütçeni aştın! Harcamalarına dikkat et.`
                        : `You've exceeded your monthly budget! Watch your spending.`,
                    icon: <TrendingDown className="w-5 h-5" />,
                    color: 'bg-red-500',
                    priority: 'high',
                    timestamp: Date.now()
                });
            }
        }

        // Filter out dismissed reminders
        const dismissedSet = new Set(dismissed);
        return newReminders.filter(r => !dismissedSet.has(r.id));
    }, [lang, dismissed]);

    useEffect(() => {
        setMounted(true);
        const savedDismissed = localStorage.getItem('dismissed_reminders');
        if (savedDismissed) {
            const parsed = JSON.parse(savedDismissed);
            // Only keep dismissals from last 24 hours
            const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
            const valid = parsed.filter((d: any) => d.timestamp > oneDayAgo);
            setDismissed(valid.map((d: any) => d.id));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            const generated = generateReminders();
            // Sort by priority
            generated.sort((a, b) => {
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            });
            setReminders(generated);
        }
    }, [mounted, generateReminders]);

    const dismissReminder = (id: string) => {
        const newDismissed = [...dismissed, id];
        setDismissed(newDismissed);
        setReminders(prev => prev.filter(r => r.id !== id));

        // Save to localStorage with timestamp
        const savedDismissed = localStorage.getItem('dismissed_reminders');
        const existing = savedDismissed ? JSON.parse(savedDismissed) : [];
        existing.push({ id, timestamp: Date.now() });
        localStorage.setItem('dismissed_reminders', JSON.stringify(existing));
    };

    if (!mounted || reminders.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
            {reminders.slice(0, 3).map((reminder) => (
                <div
                    key={reminder.id}
                    className={`${reminder.color} text-white p-4 rounded-2xl shadow-2xl animate-slide-in-right flex items-start gap-3`}
                >
                    <div className="flex-shrink-0 p-2 bg-white/20 rounded-xl">
                        {reminder.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm">{reminder.title}</h4>
                        <p className="text-sm opacity-90 mt-0.5">{reminder.message}</p>
                    </div>
                    <button
                        onClick={() => dismissReminder(reminder.id)}
                        className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}
