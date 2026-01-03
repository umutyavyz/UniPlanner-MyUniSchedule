'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, Wallet, PiggyBank, Coffee, Car, Home, ShoppingBag, BookOpen, Gamepad2, MoreHorizontal, Target, AlertTriangle, Calendar, ChevronDown, ChevronUp, Settings, X } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import ToolMarketingSections from '@/components/ToolMarketingSections';

interface Transaction {
    id: string;
    type: 'income' | 'expense';
    amount: number;
    category: string;
    description: string;
    date: string;
    isRecurring?: boolean;
}

interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline: string;
    color: string;
}

interface BudgetGoal {
    monthlyLimit: number;
    savingsGoal: number;
    categoryLimits: Record<string, number>;
    recurringIncome: { source: string; amount: number; dayOfMonth: number }[];
}

const categories = {
    income: [
        { id: 'allowance', icon: Wallet, label: { tr: 'Harçlık', en: 'Allowance' }, color: 'bg-blue-500' },
        { id: 'scholarship', icon: BookOpen, label: { tr: 'Burs', en: 'Scholarship' }, color: 'bg-purple-500' },
        { id: 'parttime', icon: TrendingUp, label: { tr: 'Part-time İş', en: 'Part-time Job' }, color: 'bg-green-500' },
        { id: 'other_income', icon: MoreHorizontal, label: { tr: 'Diğer', en: 'Other' }, color: 'bg-gray-500' },
    ],
    expense: [
        { id: 'food', icon: Coffee, label: { tr: 'Yemek', en: 'Food' }, color: 'bg-orange-500' },
        { id: 'transport', icon: Car, label: { tr: 'Ulaşım', en: 'Transport' }, color: 'bg-cyan-500' },
        { id: 'rent', icon: Home, label: { tr: 'Kira', en: 'Rent' }, color: 'bg-indigo-500' },
        { id: 'shopping', icon: ShoppingBag, label: { tr: 'Alışveriş', en: 'Shopping' }, color: 'bg-pink-500' },
        { id: 'education', icon: BookOpen, label: { tr: 'Eğitim', en: 'Education' }, color: 'bg-violet-500' },
        { id: 'entertainment', icon: Gamepad2, label: { tr: 'Eğlence', en: 'Entertainment' }, color: 'bg-red-500' },
        { id: 'other_expense', icon: MoreHorizontal, label: { tr: 'Diğer', en: 'Other' }, color: 'bg-gray-500' },
    ]
};

const goalColors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-amber-500'];

export default function BudgetClient() {
    const [mounted, setMounted] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
    const [goals, setGoals] = useState<BudgetGoal>({
        monthlyLimit: 5000,
        savingsGoal: 1000,
        categoryLimits: {},
        recurringIncome: []
    });
    const [isAdding, setIsAdding] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showSavingsModal, setShowSavingsModal] = useState(false);
    const [showAnalytics, setShowAnalytics] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [newTransaction, setNewTransaction] = useState({
        type: 'expense' as 'income' | 'expense',
        amount: '',
        category: 'food',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [newSavingsGoal, setNewSavingsGoal] = useState({
        name: '',
        targetAmount: '',
        deadline: ''
    });

    useEffect(() => {
        setMounted(true);
        const savedTransactions = localStorage.getItem('budget_transactions');
        const savedGoals = localStorage.getItem('budget_goals');
        const savedSavingsGoals = localStorage.getItem('savings_goals');
        if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
        if (savedGoals) setGoals({ ...goals, ...JSON.parse(savedGoals) });
        if (savedSavingsGoals) setSavingsGoals(JSON.parse(savedSavingsGoals));
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('budget_transactions', JSON.stringify(transactions));
            localStorage.setItem('budget_goals', JSON.stringify(goals));
            localStorage.setItem('savings_goals', JSON.stringify(savingsGoals));
        }
    }, [transactions, goals, savingsGoals, mounted]);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const lang = (savedSettings ? JSON.parse(savedSettings).language || 'tr' : 'tr') as 'tr' | 'en';

    const addTransaction = () => {
        if (!newTransaction.amount || parseFloat(newTransaction.amount) <= 0) return;
        const transaction: Transaction = {
            id: Date.now().toString(),
            type: newTransaction.type,
            amount: parseFloat(newTransaction.amount),
            category: newTransaction.category,
            description: newTransaction.description,
            date: newTransaction.date
        };
        setTransactions([transaction, ...transactions]);
        setNewTransaction({ type: 'expense', amount: '', category: 'food', description: '', date: new Date().toISOString().split('T')[0] });
        setIsAdding(false);
    };

    const deleteTransaction = (id: string) => {
        setTransactions(transactions.filter(t => t.id !== id));
    };

    const addSavingsGoal = () => {
        if (!newSavingsGoal.name || !newSavingsGoal.targetAmount) return;
        const goal: SavingsGoal = {
            id: Date.now().toString(),
            name: newSavingsGoal.name,
            targetAmount: parseFloat(newSavingsGoal.targetAmount),
            currentAmount: 0,
            deadline: newSavingsGoal.deadline,
            color: goalColors[savingsGoals.length % goalColors.length]
        };
        setSavingsGoals([...savingsGoals, goal]);
        setNewSavingsGoal({ name: '', targetAmount: '', deadline: '' });
        setShowSavingsModal(false);
    };

    const updateSavingsGoal = (id: string, amount: number) => {
        setSavingsGoals(savingsGoals.map(g =>
            g.id === id ? { ...g, currentAmount: Math.max(0, g.currentAmount + amount) } : g
        ));
    };

    const deleteSavingsGoal = (id: string) => {
        setSavingsGoals(savingsGoals.filter(g => g.id !== id));
    };

    const filteredTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));
    const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const expensePercentage = goals.monthlyLimit > 0 ? Math.min(100, (totalExpense / goals.monthlyLimit) * 100) : 0;

    // Calculate spending prediction
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const dayOfMonth = today.getDate();
    const dailyAvgSpending = dayOfMonth > 0 ? totalExpense / dayOfMonth : 0;
    const predictedMonthlySpending = dailyAvgSpending * daysInMonth;
    const predictedEndBalance = totalIncome - predictedMonthlySpending;
    const daysRemaining = daysInMonth - dayOfMonth;

    // Category analysis
    const expenseByCategory = categories.expense.map(cat => {
        const total = filteredTransactions.filter(t => t.type === 'expense' && t.category === cat.id).reduce((sum, t) => sum + t.amount, 0);
        const limit = goals.categoryLimits[cat.id] || 0;
        return { ...cat, total, limit, percentage: limit > 0 ? (total / limit) * 100 : 0 };
    }).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

    const getCategoryInfo = (categoryId: string, type: 'income' | 'expense') => {
        const cat = categories[type].find(c => c.id === categoryId);
        return cat || { icon: MoreHorizontal, label: { tr: categoryId, en: categoryId }, color: 'bg-gray-500' };
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {lang === 'tr' ? 'Bütçe Takibi' : 'Budget Tracker'}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {lang === 'tr' ? 'Gelir, gider ve tasarruf' : 'Income, expenses & savings'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <Settings size={20} />
                        </button>
                        <ModeToggle />
                    </div>
                </div>
            </header>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {lang === 'tr' ? 'Bütçe Ayarları' : 'Budget Settings'}
                            </h2>
                            <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {lang === 'tr' ? 'Aylık Bütçe Limiti (₺)' : 'Monthly Budget Limit (₺)'}
                                </label>
                                <input
                                    type="number"
                                    value={goals.monthlyLimit}
                                    onChange={(e) => setGoals({ ...goals, monthlyLimit: parseFloat(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {lang === 'tr' ? 'Kategori Limitleri' : 'Category Limits'}
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                    {categories.expense.map(cat => (
                                        <div key={cat.id} className="flex items-center gap-3">
                                            <span className="text-sm text-gray-600 dark:text-gray-400 w-24">{cat.label[lang]}</span>
                                            <input
                                                type="number"
                                                placeholder="₺ Limit"
                                                value={goals.categoryLimits[cat.id] || ''}
                                                onChange={(e) => setGoals({
                                                    ...goals,
                                                    categoryLimits: { ...goals.categoryLimits, [cat.id]: parseFloat(e.target.value) || 0 }
                                                })}
                                                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowSettings(false)}
                            className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            {lang === 'tr' ? 'Kaydet' : 'Save'}
                        </button>
                    </div>
                </div>
            )}

            {/* Savings Goal Modal */}
            {showSavingsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {lang === 'tr' ? 'Yeni Tasarruf Hedefi' : 'New Savings Goal'}
                            </h2>
                            <button onClick={() => setShowSavingsModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                                <X size={20} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Hedef Adı' : 'Goal Name'}
                                </label>
                                <input
                                    type="text"
                                    value={newSavingsGoal.name}
                                    onChange={(e) => setNewSavingsGoal({ ...newSavingsGoal, name: e.target.value })}
                                    placeholder={lang === 'tr' ? 'Örn: Laptop' : 'e.g. Laptop'}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Hedef Tutar (₺)' : 'Target Amount (₺)'}
                                </label>
                                <input
                                    type="number"
                                    value={newSavingsGoal.targetAmount}
                                    onChange={(e) => setNewSavingsGoal({ ...newSavingsGoal, targetAmount: e.target.value })}
                                    placeholder="5000"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Hedef Tarih' : 'Target Date'}
                                </label>
                                <input
                                    type="date"
                                    value={newSavingsGoal.deadline}
                                    onChange={(e) => setNewSavingsGoal({ ...newSavingsGoal, deadline: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={addSavingsGoal}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
                            >
                                {lang === 'tr' ? 'Oluştur' : 'Create'}
                            </button>
                            <button
                                onClick={() => setShowSavingsModal(false)}
                                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {lang === 'tr' ? 'İptal' : 'Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Month Selector */}
                <div className="mb-6">
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {lang === 'tr' ? 'Gelir' : 'Income'}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                            ₺{totalIncome.toLocaleString()}
                        </div>
                    </div>

                    <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {lang === 'tr' ? 'Gider' : 'Expense'}
                            </span>
                        </div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                            ₺{totalExpense.toLocaleString()}
                        </div>
                    </div>

                    <div className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {lang === 'tr' ? 'Bakiye' : 'Balance'}
                            </span>
                        </div>
                        <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                            ₺{balance.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Spending Prediction & Analytics */}
                <div className="mb-6 p-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Target size={20} />
                            {lang === 'tr' ? 'Ay Sonu Tahmini' : 'End of Month Prediction'}
                        </h3>
                        <span className="text-sm opacity-80">{daysRemaining} {lang === 'tr' ? 'gün kaldı' : 'days left'}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm opacity-80">{lang === 'tr' ? 'Tahmini Harcama' : 'Predicted Spending'}</p>
                            <p className="text-2xl font-bold">₺{Math.round(predictedMonthlySpending).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-sm opacity-80">{lang === 'tr' ? 'Tahmini Bakiye' : 'Predicted Balance'}</p>
                            <p className={`text-2xl font-bold ${predictedEndBalance >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                                ₺{Math.round(predictedEndBalance).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    {predictedMonthlySpending > goals.monthlyLimit && (
                        <div className="mt-4 p-3 bg-white/20 rounded-xl flex items-center gap-2">
                            <AlertTriangle size={18} />
                            <span className="text-sm">
                                {lang === 'tr'
                                    ? `Bu hızla gidersen bütçeni ₺${Math.round(predictedMonthlySpending - goals.monthlyLimit).toLocaleString()} aşarsın!`
                                    : `At this rate, you'll exceed your budget by ₺${Math.round(predictedMonthlySpending - goals.monthlyLimit).toLocaleString()}!`
                                }
                            </span>
                        </div>
                    )}
                    <p className="mt-3 text-sm opacity-70">
                        {lang === 'tr'
                            ? `Günlük ortalama: ₺${Math.round(dailyAvgSpending).toLocaleString()}`
                            : `Daily average: ₺${Math.round(dailyAvgSpending).toLocaleString()}`
                        }
                    </p>
                </div>

                {/* Savings Goals */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <PiggyBank size={20} />
                            {lang === 'tr' ? 'Tasarruf Hedefleri' : 'Savings Goals'}
                        </h3>
                        <button
                            onClick={() => setShowSavingsModal(true)}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                            <Plus size={16} />
                            {lang === 'tr' ? 'Hedef Ekle' : 'Add Goal'}
                        </button>
                    </div>
                    {savingsGoals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {savingsGoals.map(goal => {
                                const percentage = (goal.currentAmount / goal.targetAmount) * 100;
                                const remaining = goal.targetAmount - goal.currentAmount;
                                const daysUntil = goal.deadline ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                                const dailyNeeded = daysUntil && daysUntil > 0 ? remaining / daysUntil : 0;

                                return (
                                    <div key={goal.id} className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${goal.color}`} />
                                                <span className="font-medium text-gray-900 dark:text-white">{goal.name}</span>
                                            </div>
                                            <button
                                                onClick={() => deleteSavingsGoal(goal.id)}
                                                className="p-1 text-gray-400 hover:text-red-500 rounded"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <div className="flex items-baseline gap-1 mb-2">
                                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ₺{goal.currentAmount.toLocaleString()}
                                            </span>
                                            <span className="text-sm text-gray-500">/ ₺{goal.targetAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                                            <div className={`h-full ${goal.color} transition-all`} style={{ width: `${Math.min(100, percentage)}%` }} />
                                        </div>
                                        {daysUntil !== null && daysUntil > 0 && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {lang === 'tr'
                                                    ? `${daysUntil} gün kaldı • Günlük ₺${Math.round(dailyNeeded).toLocaleString()} biriktir`
                                                    : `${daysUntil} days left • Save ₺${Math.round(dailyNeeded).toLocaleString()}/day`
                                                }
                                            </p>
                                        )}
                                        <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => updateSavingsGoal(goal.id, 100)}
                                                className="flex-1 py-2 text-sm bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                                            >
                                                +₺100
                                            </button>
                                            <button
                                                onClick={() => updateSavingsGoal(goal.id, -100)}
                                                className="flex-1 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                            >
                                                -₺100
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
                            <PiggyBank className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {lang === 'tr' ? 'Henüz tasarruf hedefi yok' : 'No savings goals yet'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Budget Progress */}
                <div className="mb-6 p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-gray-900 dark:text-white">
                            {lang === 'tr' ? 'Aylık Bütçe' : 'Monthly Budget'}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            ₺{totalExpense.toLocaleString()} / ₺{goals.monthlyLimit.toLocaleString()}
                        </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className={`h-full transition-all duration-500 ${expensePercentage >= 100 ? 'bg-red-500' : expensePercentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${expensePercentage}%` }}
                        />
                    </div>
                    {expensePercentage >= 80 && (
                        <p className={`text-sm mt-2 ${expensePercentage >= 100 ? 'text-red-500' : 'text-amber-500'}`}>
                            {expensePercentage >= 100
                                ? (lang === 'tr' ? 'Bütçe aşıldı!' : 'Budget exceeded!')
                                : (lang === 'tr' ? 'Bütçe limitine yaklaşıyorsunuz' : 'Approaching budget limit')}
                        </p>
                    )}
                </div>

                {/* Category Analysis with Pie Chart */}
                {expenseByCategory.length > 0 && (
                    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-6">
                            {lang === 'tr' ? 'Harcama Dağılımı' : 'Spending Distribution'}
                        </h3>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {/* Pie Chart */}
                            <div className="relative w-48 h-48 flex-shrink-0">
                                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                    {(() => {
                                        let cumulativePercentage = 0;
                                        const pieColors = ['#f97316', '#06b6d4', '#6366f1', '#ec4899', '#8b5cf6', '#ef4444', '#6b7280'];
                                        return expenseByCategory.map((cat, index) => {
                                            const percentage = totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0;
                                            const startAngle = cumulativePercentage * 3.6;
                                            cumulativePercentage += percentage;
                                            const endAngle = cumulativePercentage * 3.6;

                                            const radius = 40;
                                            const circumference = 2 * Math.PI * radius;
                                            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
                                            const strokeDashoffset = -((cumulativePercentage - percentage) / 100) * circumference;

                                            return (
                                                <circle
                                                    key={cat.id}
                                                    cx="50"
                                                    cy="50"
                                                    r={radius}
                                                    fill="transparent"
                                                    stroke={pieColors[index % pieColors.length]}
                                                    strokeWidth="20"
                                                    strokeDasharray={strokeDasharray}
                                                    strokeDashoffset={strokeDashoffset}
                                                    className="transition-all duration-500"
                                                />
                                            );
                                        });
                                    })()}
                                </svg>
                                {/* Center Text */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        ₺{totalExpense.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {lang === 'tr' ? 'Toplam' : 'Total'}
                                    </span>
                                </div>
                            </div>

                            {/* Category Summary */}
                            <div className="flex-1 w-full">
                                <div className="space-y-3">
                                    {expenseByCategory.map((cat, index) => {
                                        const Icon = cat.icon;
                                        const percentage = totalExpense > 0 ? (cat.total / totalExpense) * 100 : 0;
                                        const pieColors = ['#f97316', '#06b6d4', '#6366f1', '#ec4899', '#8b5cf6', '#ef4444', '#6b7280'];
                                        const overLimit = cat.limit > 0 && cat.total > cat.limit;

                                        return (
                                            <div key={cat.id} className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: pieColors[index % pieColors.length] }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                                                                {cat.label[lang]}
                                                            </span>
                                                            {overLimit && (
                                                                <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                                                ₺{cat.total.toLocaleString()}
                                                            </span>
                                                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                                                                %{percentage.toFixed(1)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {cat.limit > 0 && (
                                                        <div className="mt-1">
                                                            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all ${overLimit ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                                    style={{ width: `${Math.min(100, (cat.total / cat.limit) * 100)}%` }}
                                                                />
                                                            </div>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                {lang === 'tr' ? 'Limit:' : 'Limit:'} ₺{cat.limit.toLocaleString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Quick Stats */}
                                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                {lang === 'tr' ? 'En Yüksek' : 'Highest'}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {expenseByCategory[0]?.label[lang] || '-'}
                                            </p>
                                        </div>
                                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                {lang === 'tr' ? 'Kategori Sayısı' : 'Categories'}
                                            </p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {expenseByCategory.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Transaction */}
                {!isAdding ? (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        {lang === 'tr' ? 'İşlem Ekle' : 'Add Transaction'}
                    </button>
                ) : (
                    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
                        <div className="space-y-4">
                            {/* Type Toggle */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'expense', category: 'food' })}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${newTransaction.type === 'expense' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                                >
                                    {lang === 'tr' ? 'Gider' : 'Expense'}
                                </button>
                                <button
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'income', category: 'allowance' })}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${newTransaction.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                                >
                                    {lang === 'tr' ? 'Gelir' : 'Income'}
                                </button>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Tutar (₺)' : 'Amount (₺)'}
                                </label>
                                <input
                                    type="number"
                                    value={newTransaction.amount}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white text-xl font-semibold"
                                    placeholder="0"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {lang === 'tr' ? 'Kategori' : 'Category'}
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {categories[newTransaction.type].map((cat) => {
                                        const Icon = cat.icon;
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => setNewTransaction({ ...newTransaction, category: cat.id })}
                                                className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-colors ${newTransaction.category === cat.id ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                            >
                                                <Icon size={20} />
                                                <span className="text-xs">{cat.label[lang]}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Description & Date */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {lang === 'tr' ? 'Açıklama' : 'Description'}
                                    </label>
                                    <input
                                        type="text"
                                        value={newTransaction.description}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                        placeholder={lang === 'tr' ? 'Opsiyonel' : 'Optional'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {lang === 'tr' ? 'Tarih' : 'Date'}
                                    </label>
                                    <input
                                        type="date"
                                        value={newTransaction.date}
                                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button onClick={addTransaction} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                                    {lang === 'tr' ? 'Ekle' : 'Add'}
                                </button>
                                <button onClick={() => setIsAdding(false)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    {lang === 'tr' ? 'İptal' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transactions List */}
                <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                    {lang === 'tr' ? 'Son İşlemler' : 'Recent Transactions'}
                </h3>
                {filteredTransactions.length > 0 ? (
                    <div className="space-y-3">
                        {filteredTransactions.slice(0, 20).map((transaction) => {
                            const catInfo = getCategoryInfo(transaction.category, transaction.type);
                            const Icon = catInfo.icon;
                            return (
                                <div key={transaction.id} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${transaction.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                        <Icon className={`w-5 h-5 ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 dark:text-white truncate">
                                            {transaction.description || catInfo.label[lang]}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {new Date(transaction.date).toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US')}
                                        </div>
                                    </div>
                                    <div className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {transaction.type === 'income' ? '+' : '-'}₺{transaction.amount.toLocaleString()}
                                    </div>
                                    <button onClick={() => deleteTransaction(transaction.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        {lang === 'tr' ? 'Bu ay için işlem bulunamadı' : 'No transactions for this month'}
                    </div>
                )}
            </main>

            {/* Marketing Sections */}
            <ToolMarketingSections lang={lang} tool="budget" hideScrollIndicator={true} />
        </div>
    );
}
