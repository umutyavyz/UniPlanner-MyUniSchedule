'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, Clock, Tag, AlignLeft } from 'lucide-react';

interface TimeBlock {
    id: string;
    hour: number;
    minute: number;
    duration: number; // in minutes (30, 60, 90, 120)
    title: string;
    category: string;
    note: string;
    priority: 'low' | 'medium' | 'high';
}

interface DayPlan {
    blocks: TimeBlock[];
    dailyGoal: string;
}

const CATEGORIES = [
    { label: 'Study', emoji: '📚', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' },
    { label: 'Class', emoji: '🏫', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
    { label: 'Work', emoji: '💼', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
    { label: 'Exercise', emoji: '🏃', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' },
    { label: 'Personal', emoji: '🌿', color: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
    { label: 'Social', emoji: '👥', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-800' },
    { label: 'Other', emoji: '📌', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700' },
];

const PRIORITY_COLORS = {
    low: 'bg-gray-400',
    medium: 'bg-yellow-400',
    high: 'bg-red-500',
};

function getDateStr(offset: number = 0): string {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
}

function formatHour(h: number): string {
    const ampm = h < 12 ? 'AM' : 'PM';
    const display = h % 12 === 0 ? 12 : h % 12;
    return `${display}:00 ${ampm}`;
}

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

export default function DailyPlannerClient() {
    const [dayOffset, setDayOffset] = useState(0);
    const [plans, setPlans] = useState<Record<string, DayPlan>>({});
    const [showModal, setShowModal] = useState(false);
    const [selectedHour, setSelectedHour] = useState(9);
    const [editBlock, setEditBlock] = useState<TimeBlock | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState('');
    const [formCategory, setFormCategory] = useState('Study');
    const [formNote, setFormNote] = useState('');
    const [formPriority, setFormPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [formDuration, setFormDuration] = useState(60);
    const [formMinute, setFormMinute] = useState(0);

    useEffect(() => {
        const saved = localStorage.getItem('daily_planner_v2');
        if (saved) setPlans(JSON.parse(saved));
    }, []);

    const savePlans = (updated: Record<string, DayPlan>) => {
        setPlans(updated);
        localStorage.setItem('daily_planner_v2', JSON.stringify(updated));
    };

    const currentDate = getDateStr(dayOffset);
    const currentPlan: DayPlan = plans[currentDate] || { blocks: [], dailyGoal: '' };

    const openAdd = (hour: number) => {
        setSelectedHour(hour);
        setEditBlock(null);
        setFormTitle('');
        setFormCategory('Study');
        setFormNote('');
        setFormPriority('medium');
        setFormDuration(60);
        setFormMinute(0);
        setShowModal(true);
    };

    const openEdit = (block: TimeBlock) => {
        setEditBlock(block);
        setFormTitle(block.title);
        setFormCategory(block.category);
        setFormNote(block.note);
        setFormPriority(block.priority);
        setFormDuration(block.duration);
        setFormMinute(block.minute);
        setSelectedHour(block.hour);
        setShowModal(true);
    };

    const saveBlock = () => {
        if (!formTitle.trim()) return;

        const block: TimeBlock = {
            id: editBlock?.id || Date.now().toString(),
            hour: selectedHour,
            minute: formMinute,
            duration: formDuration,
            title: formTitle.trim(),
            category: formCategory,
            note: formNote,
            priority: formPriority,
        };

        const existing = currentPlan.blocks;
        const blocks = editBlock
            ? existing.map(b => b.id === editBlock.id ? block : b)
            : [...existing, block];

        savePlans({ ...plans, [currentDate]: { ...currentPlan, blocks } });
        setShowModal(false);
    };

    const deleteBlock = (id: string) => {
        const blocks = currentPlan.blocks.filter(b => b.id !== id);
        savePlans({ ...plans, [currentDate]: { ...currentPlan, blocks } });
    };

    const updateGoal = (goal: string) => {
        savePlans({ ...plans, [currentDate]: { ...currentPlan, dailyGoal: goal } });
    };

    const getBlocksForHour = (hour: number) =>
        currentPlan.blocks
            .filter(b => b.hour === hour)
            .sort((a, b) => a.minute - b.minute);

    const getCategoryStyle = (catLabel: string) =>
        CATEGORIES.find(c => c.label === catLabel)?.color || CATEGORIES[6].color;

    const getCategoryEmoji = (catLabel: string) =>
        CATEGORIES.find(c => c.label === catLabel)?.emoji || '📌';

    const totalBlocks = currentPlan.blocks.length;
    const studyMinutes = currentPlan.blocks
        .filter(b => b.category === 'Study' || b.category === 'Class')
        .reduce((sum, b) => sum + b.duration, 0);

    const dateLabel = dayOffset === 0
        ? 'Today'
        : dayOffset === 1
            ? 'Tomorrow'
            : dayOffset === -1
                ? 'Yesterday'
                : new Date(currentDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-24 md:pb-8">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Clock className="text-blue-500" size={22} />
                            Daily Planner
                        </h1>
                        <div className="flex items-center gap-1.5">
                            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg px-2.5 py-1.5">
                                {totalBlocks} blocks · {Math.floor(studyMinutes / 60)}h {studyMinutes % 60}m study
                            </div>
                        </div>
                    </div>

                    {/* Date nav */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDayOffset(d => d - 1)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div className="flex-1 text-center">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">{dateLabel}</div>
                            <div className="text-xs text-gray-400">
                                {new Date(currentDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <button
                            onClick={() => setDayOffset(d => d + 1)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Daily goal */}
                    <input
                        type="text"
                        value={currentPlan.dailyGoal}
                        onChange={e => updateGoal(e.target.value)}
                        placeholder="🎯 Set your main goal for today..."
                        className="w-full mt-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Time Grid */}
            <div className="max-w-2xl mx-auto px-4 py-4">
                <div className="space-y-2">
                    {HOURS.map(hour => {
                        const blocks = getBlocksForHour(hour);
                        const isCurrentHour = new Date().getHours() === hour && dayOffset === 0;

                        return (
                            <div key={hour} className="flex gap-3 group">
                                {/* Hour label */}
                                <div className={`w-16 shrink-0 pt-2 text-right text-xs font-medium ${isCurrentHour ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                    {formatHour(hour)}
                                    {isCurrentHour && <div className="w-2 h-2 bg-blue-500 rounded-full ml-auto mt-1" />}
                                </div>

                                {/* Blocks area */}
                                <div className={`flex-1 min-h-[3.5rem] rounded-xl border-2 border-dashed transition-colors ${blocks.length > 0
                                    ? 'border-transparent'
                                    : isCurrentHour
                                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
                                        : 'border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer'
                                    }`}
                                    onClick={() => blocks.length === 0 && openAdd(hour)}
                                >
                                    {blocks.length > 0 ? (
                                        <div className="space-y-1.5 p-1">
                                            {blocks.map(block => (
                                                <div
                                                    key={block.id}
                                                    onClick={() => openEdit(block)}
                                                    className={`rounded-lg border px-3 py-2 cursor-pointer hover:shadow-md transition-all ${getCategoryStyle(block.category)}`}
                                                >
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                                <span className={`w-2 h-2 rounded-full shrink-0 ${PRIORITY_COLORS[block.priority]}`} />
                                                                <span className="font-medium text-sm truncate">{block.title}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs opacity-70">
                                                                <span>{getCategoryEmoji(block.category)} {block.category}</span>
                                                                <span>·</span>
                                                                <span>{block.minute > 0 ? `${block.hour}:${block.minute.toString().padStart(2, '0')}` : formatHour(block.hour)}</span>
                                                                <span>·</span>
                                                                <span>{block.duration >= 60 ? `${block.duration / 60}h` : `${block.duration}m`}</span>
                                                            </div>
                                                            {block.note && (
                                                                <div className="text-xs opacity-60 mt-0.5 truncate">{block.note}</div>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={e => { e.stopPropagation(); deleteBlock(block.id); }}
                                                            className="p-1 opacity-40 hover:opacity-100 transition-opacity shrink-0"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Add more to same hour */}
                                            <button
                                                onClick={e => { e.stopPropagation(); openAdd(hour); }}
                                                className="w-full py-1 text-xs text-gray-400 hover:text-blue-500 flex items-center justify-center gap-1 rounded-lg hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                                            >
                                                <Plus size={12} /> Add block
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus size={16} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Add/Edit Block Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md p-5 animate-slide-up max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            {editBlock ? 'Edit Block' : `Add Block — ${formatHour(selectedHour)}`}
                        </h2>

                        <input
                            type="text"
                            value={formTitle}
                            onChange={e => setFormTitle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && saveBlock()}
                            placeholder="What are you doing?"
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            autoFocus
                        />

                        {/* Time & Duration */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Start Time</label>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedHour}
                                        onChange={e => setSelectedHour(parseInt(e.target.value))}
                                        className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {HOURS.map(h => (
                                            <option key={h} value={h}>{h}:00</option>
                                        ))}
                                    </select>
                                    <select
                                        value={formMinute}
                                        onChange={e => setFormMinute(parseInt(e.target.value))}
                                        className="w-20 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={0}>:00</option>
                                        <option value={15}>:15</option>
                                        <option value={30}>:30</option>
                                        <option value={45}>:45</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Duration</label>
                                <select
                                    value={formDuration}
                                    onChange={e => setFormDuration(parseInt(e.target.value))}
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={30}>30 min</option>
                                    <option value={45}>45 min</option>
                                    <option value={60}>1 hour</option>
                                    <option value={90}>1.5 hours</option>
                                    <option value={120}>2 hours</option>
                                    <option value={180}>3 hours</option>
                                </select>
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-4">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat.label}
                                        onClick={() => setFormCategory(cat.label)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${formCategory === cat.label
                                            ? cat.color + ' ring-2 ring-blue-500'
                                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        {cat.emoji} {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Priority */}
                        <div className="mb-4">
                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1.5">Priority</label>
                            <div className="flex gap-2">
                                {(['low', 'medium', 'high'] as const).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setFormPriority(p)}
                                        className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all border ${formPriority === p
                                            ? p === 'high'
                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-300 dark:border-red-700'
                                                : p === 'medium'
                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600'
                                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Note */}
                        <textarea
                            value={formNote}
                            onChange={e => setFormNote(e.target.value)}
                            placeholder="Optional note..."
                            rows={2}
                            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveBlock}
                                disabled={!formTitle.trim()}
                                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
                            >
                                {editBlock ? 'Save Changes' : 'Add Block'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
