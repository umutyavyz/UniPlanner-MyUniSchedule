'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Calculator, Sparkles, Target, ChevronDown, Plus, Trash2, FlaskConical, FileText } from 'lucide-react';
import { translations } from '@/lib/i18n';
import PageWrapper from '@/components/PageWrapper';
import PageHeader from '@/components/PageHeader';
import ToolMarketingSections from '@/components/ToolMarketingSections';

interface ExtraComponent {
    id: string;
    name: string;
    grade: string;
    weight: string;
}

export default function FinalCalculatorClient() {
    const [mounted, setMounted] = useState(false);
    const [vize, setVize] = useState<string>('');
    const [vizeWeight, setVizeWeight] = useState<string>('40');
    const [passGrade, setPassGrade] = useState<string>('50');
    const [result, setResult] = useState<number | null>(null);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [extraComponents, setExtraComponents] = useState<ExtraComponent[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const parsedFn = savedSettings ? JSON.parse(savedSettings) : {};
    const lang = parsedFn.language || 'tr';

    // Calculate total weight used by components
    const totalExtraWeight = extraComponents.reduce((sum, c) => sum + (parseFloat(c.weight) || 0), 0);
    const vizeWeightNum = parseFloat(vizeWeight) || 0;
    const finalWeight = Math.max(0, 100 - vizeWeightNum - totalExtraWeight);

    const addComponent = () => {
        setExtraComponents([...extraComponents, {
            id: Date.now().toString(),
            name: lang === 'tr' ? 'Lab / Ödev' : 'Lab / Homework',
            grade: '',
            weight: '10'
        }]);
    };

    const updateComponent = (id: string, field: keyof ExtraComponent, value: string) => {
        setExtraComponents(extraComponents.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ));
    };

    const removeComponent = (id: string) => {
        setExtraComponents(extraComponents.filter(c => c.id !== id));
    };

    const calculateNeeded = () => {
        const v = parseFloat(vize);
        const w = parseFloat(vizeWeight);
        const p = parseFloat(passGrade);

        if (isNaN(v) || isNaN(w) || isNaN(p)) return;

        // Calculate vize contribution
        let totalContribution = v * (w / 100);

        // Add extra components contribution
        extraComponents.forEach(comp => {
            const grade = parseFloat(comp.grade) || 0;
            const weight = parseFloat(comp.weight) || 0;
            totalContribution += grade * (weight / 100);
        });

        const neededScore = p - totalContribution;
        const finalWeightPercent = finalWeight / 100;

        if (finalWeightPercent <= 0) {
            // No final needed
            setResult(totalContribution >= p ? 0 : 101);
            return;
        }

        let requiredFinal = neededScore / finalWeightPercent;
        requiredFinal = Math.ceil(requiredFinal);
        if (requiredFinal < 0) requiredFinal = 0;

        setResult(requiredFinal);
    };

    // Quick scenarios
    const scenarios = result !== null && result > 0 && result <= 100 ? [
        { grade: Math.max(0, result - 10), status: 'fail', label: lang === 'tr' ? 'Kalırsın' : 'Fail' },
        { grade: result, status: 'pass', label: lang === 'tr' ? 'Geçersin' : 'Pass' },
        { grade: Math.min(100, result + 20), status: 'good', label: lang === 'tr' ? 'Rahatça' : 'Safely' },
    ] : [];

    const handleReset = () => {
        setVize('');
        setVizeWeight('40');
        setPassGrade('50');
        setExtraComponents([]);
        setResult(null);
    };

    if (!mounted) return null;

    return (
        <PageWrapper>
            <PageHeader
                title={lang === 'tr' ? 'Not Hesaplama' : 'Grade Calculator'}
                subtitle={lang === 'tr' ? 'Final için gereken not' : 'Required final grade'}
                icon={Calculator}
                iconGradient="from-emerald-500 to-teal-500"
            />

            <main className="max-w-lg mx-auto px-4 py-8">
                {/* Hero Card */}
                <div className="bg-white dark:bg-white/[0.02] rounded-3xl border border-gray-100 dark:border-white/5 p-6 sm:p-8 shadow-xl shadow-gray-200/50 dark:shadow-none">

                    {/* Main Input */}
                    <div className="text-center mb-8">
                        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                            {lang === 'tr' ? 'Vize Notun' : 'Midterm Grade'}
                        </label>
                        <div className="flex items-baseline justify-center gap-1">
                            <input
                                type="number"
                                value={vize}
                                onChange={(e) => setVize(e.target.value)}
                                className="w-24 sm:w-28 text-4xl sm:text-5xl font-bold text-center bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 outline-none text-gray-900 dark:text-white pb-2 transition-colors"
                                placeholder="75"
                                min="0"
                                max="100"
                            />
                            <span className="text-xl sm:text-2xl text-gray-400 font-medium">/100</span>
                        </div>
                    </div>

                    {/* Advanced Options Toggle */}
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mb-6 py-2 transition-colors"
                    >
                        {lang === 'tr' ? 'Gelişmiş Ayarlar' : 'Advanced Settings'}
                        <ChevronDown size={16} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Advanced Options */}
                    {showAdvanced && (
                        <div className="space-y-6 mb-6 animate-fade-in">
                            {/* Weight Distribution */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                        {lang === 'tr' ? 'Vize Etkisi' : 'Midterm Weight'}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={vizeWeight}
                                            onChange={(e) => setVizeWeight(e.target.value)}
                                            className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 dark:text-white text-center"
                                            min="0"
                                            max="100"
                                        />
                                        <span className="text-gray-400 font-medium w-6">%</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                        {lang === 'tr' ? 'Geçme Notu' : 'Passing Grade'}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={passGrade}
                                            onChange={(e) => setPassGrade(e.target.value)}
                                            className="flex-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-gray-900 dark:text-white text-center"
                                            min="0"
                                            max="100"
                                        />
                                        <span className="text-transparent w-6">%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Extra Components (Lab, Homework, etc.) */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                        {lang === 'tr' ? 'Ek Bileşenler (Lab, Ödev, Proje)' : 'Extra Components (Lab, Homework, Project)'}
                                    </label>
                                    <button
                                        onClick={addComponent}
                                        className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
                                    >
                                        <Plus size={14} />
                                        {lang === 'tr' ? 'Ekle' : 'Add'}
                                    </button>
                                </div>

                                {extraComponents.map((comp) => (
                                    <div key={comp.id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                                <FlaskConical size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                value={comp.name}
                                                onChange={(e) => updateComponent(comp.id, 'name', e.target.value)}
                                                className="flex-1 bg-transparent text-sm font-medium text-gray-900 dark:text-white outline-none"
                                                placeholder={lang === 'tr' ? 'Bileşen adı' : 'Component name'}
                                            />
                                            <button
                                                onClick={() => removeComponent(comp.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">{lang === 'tr' ? 'Aldığın Not' : 'Your Grade'}</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={comp.grade}
                                                        onChange={(e) => updateComponent(comp.id, 'grade', e.target.value)}
                                                        className="flex-1 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-center text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                        placeholder="80"
                                                        min="0"
                                                        max="100"
                                                    />
                                                    <span className="text-sm text-gray-400 w-8">/100</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">{lang === 'tr' ? 'Ağırlık' : 'Weight'}</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={comp.weight}
                                                        onChange={(e) => updateComponent(comp.id, 'weight', e.target.value)}
                                                        className="flex-1 bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-center text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                        placeholder="10"
                                                        min="0"
                                                        max="100"
                                                    />
                                                    <span className="text-sm text-gray-400 w-8">%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Weight Distribution Summary */}
                            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                                <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    {lang === 'tr' ? 'Ağırlık Dağılımı' : 'Weight Distribution'}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">
                                        {lang === 'tr' ? 'Vize' : 'Midterm'}: <b>{vizeWeightNum}%</b>
                                    </span>
                                    {extraComponents.length > 0 && (
                                        <span className="text-gray-600 dark:text-gray-300">
                                            + {lang === 'tr' ? 'Ek' : 'Extra'}: <b>{totalExtraWeight}%</b>
                                        </span>
                                    )}
                                    <span className="text-gray-600 dark:text-gray-300">
                                        + Final: <b className={finalWeight < 0 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}>{finalWeight}%</b>
                                    </span>
                                    <span className="ml-auto text-gray-400">= 100%</span>
                                </div>
                                {finalWeight < 0 && (
                                    <p className="text-xs text-red-500 mt-2">
                                        {lang === 'tr' ? 'Uyarı: Toplam ağırlık 100%\'ü aşıyor!' : 'Warning: Total weight exceeds 100%!'}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Calculate Button */}
                    <button
                        onClick={calculateNeeded}
                        className="group w-full relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg">
                            <Calculator size={20} />
                            {lang === 'tr' ? 'Hesapla' : 'Calculate'}
                        </div>
                    </button>

                    {/* Result */}
                    {result !== null && (
                        <div className="mt-8 animate-fade-in">
                            <div className={`p-6 rounded-2xl text-center ${result > 100
                                ? 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800'
                                : result <= 0
                                    ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800'
                                    : 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800'
                                }`}>

                                {result <= 0 ? (
                                    <>
                                        <div className="text-5xl mb-2">🎉</div>
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            {lang === 'tr' ? 'Zaten Geçtin!' : 'Already Passed!'}
                                        </div>
                                        <p className="text-sm text-green-600/70 dark:text-green-400/70 mt-2">
                                            {lang === 'tr' ? 'Finale girmesen bile geçiyorsun' : 'You pass even without taking the final'}
                                        </p>
                                    </>
                                ) : result > 100 ? (
                                    <>
                                        <div className="text-5xl mb-2">😔</div>
                                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                            {lang === 'tr' ? 'Mümkün Değil' : 'Not Possible'}
                                        </div>
                                        <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-2">
                                            {lang === 'tr' ? '100 alsan bile yetmiyor...' : 'Even 100 is not enough...'}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <Target size={18} className="text-blue-500" />
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                {lang === 'tr' ? 'Hedef Final Notu' : 'Target Final Grade'}
                                            </span>
                                        </div>
                                        <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
                                            {result}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {lang === 'tr'
                                                ? `Final etkisi: %${finalWeight}`
                                                : `Final weight: ${finalWeight}%`}
                                        </p>
                                    </>
                                )}
                            </div>

                            {/* Scenarios */}
                            {scenarios.length > 0 && (
                                <div className="mt-6">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 text-center">
                                        {lang === 'tr' ? 'Olası Senaryolar' : 'Possible Scenarios'}
                                    </p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {scenarios.map((s, i) => (
                                            <div
                                                key={i}
                                                className={`p-3 rounded-xl text-center ${s.status === 'fail'
                                                    ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400'
                                                    : s.status === 'pass'
                                                        ? 'bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400'
                                                        : 'bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400'
                                                    }`}
                                            >
                                                <div className="text-lg font-bold">{s.grade}</div>
                                                <div className="text-xs opacity-80">{s.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Reset */}
                    <button
                        onClick={handleReset}
                        className="w-full mt-6 text-gray-400 dark:text-gray-500 text-sm font-medium hover:text-gray-600 dark:hover:text-gray-300 py-2 flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <RefreshCw size={14} />
                        {lang === 'tr' ? 'Sıfırla' : 'Reset'}
                    </button>
                </div>

                {/* Tips Card */}
                <div className="mt-6 p-5 bg-white/50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-amber-600 dark:text-amber-400 flex-shrink-0">
                            <Sparkles size={16} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                {lang === 'tr' ? 'İpucu' : 'Tip'}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                {lang === 'tr'
                                    ? 'Lab veya ödev varsa "Gelişmiş Ayarlar"dan ekleyebilirsin. Örn: Vize %30, Lab %20, Final %50.'
                                    : 'If you have lab or homework, add them from "Advanced Settings". Ex: Midterm 30%, Lab 20%, Final 50%.'}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Marketing Sections */}
            <ToolMarketingSections lang={lang as 'tr' | 'en'} tool="final" hideScrollIndicator={true} />
        </PageWrapper>
    );
}
