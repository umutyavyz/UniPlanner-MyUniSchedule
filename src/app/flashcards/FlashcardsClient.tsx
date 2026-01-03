'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, RotateCcw, ChevronLeft, ChevronRight, Shuffle, BookOpen, Layers, Edit2, X, Check } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import ToolMarketingSections from '@/components/ToolMarketingSections';

interface Card {
    id: string;
    front: string;
    back: string;
    known: boolean;
}

interface Deck {
    id: string;
    name: string;
    color: string;
    cards: Card[];
    createdAt: string;
}

export default function FlashcardsClient() {
    const [mounted, setMounted] = useState(false);
    const [decks, setDecks] = useState<Deck[]>([]);
    const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
    const [isStudying, setIsStudying] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isAddingDeck, setIsAddingDeck] = useState(false);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newDeck, setNewDeck] = useState({ name: '', color: '#3B82F6' });
    const [newCard, setNewCard] = useState({ front: '', back: '' });
    const [studyCards, setStudyCards] = useState<Card[]>([]);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem('flashcards');
        if (saved) {
            setDecks(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('flashcards', JSON.stringify(decks));
        }
    }, [decks, mounted]);

    const savedSettings = typeof window !== 'undefined' ? localStorage.getItem('settings') : null;
    const lang = savedSettings ? JSON.parse(savedSettings).language || 'tr' : 'tr';

    const colors = ['#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444'];

    const addDeck = () => {
        if (!newDeck.name.trim()) return;
        const deck: Deck = {
            id: Date.now().toString(),
            name: newDeck.name,
            color: newDeck.color,
            cards: [],
            createdAt: new Date().toISOString()
        };
        setDecks([...decks, deck]);
        setNewDeck({ name: '', color: '#3B82F6' });
        setIsAddingDeck(false);
    };

    const deleteDeck = (id: string) => {
        setDecks(decks.filter(d => d.id !== id));
        if (selectedDeck?.id === id) {
            setSelectedDeck(null);
        }
    };

    const addCard = () => {
        if (!newCard.front.trim() || !newCard.back.trim() || !selectedDeck) return;
        const card: Card = {
            id: Date.now().toString(),
            front: newCard.front,
            back: newCard.back,
            known: false
        };
        const updatedDecks = decks.map(d =>
            d.id === selectedDeck.id ? { ...d, cards: [...d.cards, card] } : d
        );
        setDecks(updatedDecks);
        setSelectedDeck({ ...selectedDeck, cards: [...selectedDeck.cards, card] });
        setNewCard({ front: '', back: '' });
        setIsAddingCard(false);
    };

    const deleteCard = (cardId: string) => {
        if (!selectedDeck) return;
        const updatedCards = selectedDeck.cards.filter(c => c.id !== cardId);
        const updatedDecks = decks.map(d =>
            d.id === selectedDeck.id ? { ...d, cards: updatedCards } : d
        );
        setDecks(updatedDecks);
        setSelectedDeck({ ...selectedDeck, cards: updatedCards });
    };

    const markCardKnown = (known: boolean) => {
        if (!selectedDeck || studyCards.length === 0) return;
        const currentCard = studyCards[currentCardIndex];
        const updatedCards = selectedDeck.cards.map(c =>
            c.id === currentCard.id ? { ...c, known } : c
        );
        const updatedDecks = decks.map(d =>
            d.id === selectedDeck.id ? { ...d, cards: updatedCards } : d
        );
        setDecks(updatedDecks);

        // Move to next card
        if (currentCardIndex < studyCards.length - 1) {
            setCurrentCardIndex(currentCardIndex + 1);
            setIsFlipped(false);
        }
    };

    const startStudy = (shuffle: boolean = false) => {
        if (!selectedDeck || selectedDeck.cards.length === 0) return;
        let cards = [...selectedDeck.cards];
        if (shuffle) {
            cards = cards.sort(() => Math.random() - 0.5);
        }
        setStudyCards(cards);
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setIsStudying(true);
    };

    const resetProgress = () => {
        if (!selectedDeck) return;
        const updatedCards = selectedDeck.cards.map(c => ({ ...c, known: false }));
        const updatedDecks = decks.map(d =>
            d.id === selectedDeck.id ? { ...d, cards: updatedCards } : d
        );
        setDecks(updatedDecks);
        setSelectedDeck({ ...selectedDeck, cards: updatedCards });
    };

    if (!mounted) return null;

    // Study Mode
    if (isStudying && selectedDeck && studyCards.length > 0) {
        const currentCard = studyCards[currentCardIndex];
        const progress = ((currentCardIndex + 1) / studyCards.length) * 100;

        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors flex flex-col">
                {/* Study Header */}
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                        <button
                            onClick={() => setIsStudying(false)}
                            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">{selectedDeck.name}</span>
                        </button>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {currentCardIndex + 1} / {studyCards.length}
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-1 bg-gray-200 dark:bg-gray-800">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </header>

                {/* Card */}
                <main className="flex-1 flex items-center justify-center p-4">
                    <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="w-full max-w-lg aspect-[3/2] cursor-pointer perspective-1000"
                    >
                        <div
                            className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Front */}
                            <div
                                className="absolute inset-0 backface-hidden bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-center p-8"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <div className="text-center">
                                    <p className="text-xs uppercase tracking-wider text-gray-400 mb-4">
                                        {lang === 'tr' ? 'Soru' : 'Question'}
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {currentCard.front}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-8">
                                        {lang === 'tr' ? 'Cevabı görmek için tıkla' : 'Tap to reveal answer'}
                                    </p>
                                </div>
                            </div>
                            {/* Back */}
                            <div
                                className="absolute inset-0 backface-hidden bg-blue-600 rounded-3xl shadow-2xl flex items-center justify-center p-8 rotate-y-180"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            >
                                <div className="text-center">
                                    <p className="text-xs uppercase tracking-wider text-blue-200 mb-4">
                                        {lang === 'tr' ? 'Cevap' : 'Answer'}
                                    </p>
                                    <p className="text-2xl font-semibold text-white">
                                        {currentCard.back}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Controls */}
                <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                    <div className="max-w-lg mx-auto flex items-center justify-between">
                        <button
                            onClick={() => { setCurrentCardIndex(Math.max(0, currentCardIndex - 1)); setIsFlipped(false); }}
                            disabled={currentCardIndex === 0}
                            className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl disabled:opacity-30 transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="flex gap-4">
                            <button
                                onClick={() => markCardKnown(false)}
                                className="px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                            >
                                {lang === 'tr' ? 'Tekrar Et' : 'Again'}
                            </button>
                            <button
                                onClick={() => markCardKnown(true)}
                                className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                            >
                                {lang === 'tr' ? 'Biliyorum' : 'Got it'}
                            </button>
                        </div>

                        <button
                            onClick={() => { setCurrentCardIndex(Math.min(studyCards.length - 1, currentCardIndex + 1)); setIsFlipped(false); }}
                            disabled={currentCardIndex === studyCards.length - 1}
                            className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl disabled:opacity-30 transition-colors"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Deck Detail View
    if (selectedDeck) {
        const knownCount = selectedDeck.cards.filter(c => c.known).length;

        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
                    <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedDeck(null)}
                                className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedDeck.color }} />
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">{selectedDeck.name}</h1>
                        </div>
                        <ModeToggle />
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-8">
                    {/* Stats & Actions */}
                    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {selectedDeck.cards.length}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {lang === 'tr' ? 'Toplam Kart' : 'Total Cards'}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {knownCount}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {lang === 'tr' ? 'Öğrenilen' : 'Learned'}
                                </div>
                            </div>
                        </div>

                        {selectedDeck.cards.length > 0 && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => startStudy(false)}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    <BookOpen size={18} />
                                    {lang === 'tr' ? 'Çalış' : 'Study'}
                                </button>
                                <button
                                    onClick={() => startStudy(true)}
                                    className="py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    title={lang === 'tr' ? 'Karıştır' : 'Shuffle'}
                                >
                                    <Shuffle size={18} />
                                </button>
                                <button
                                    onClick={resetProgress}
                                    className="py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    title={lang === 'tr' ? 'Sıfırla' : 'Reset'}
                                >
                                    <RotateCcw size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Add Card */}
                    {!isAddingCard ? (
                        <button
                            onClick={() => setIsAddingCard(true)}
                            className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus size={20} />
                            {lang === 'tr' ? 'Kart Ekle' : 'Add Card'}
                        </button>
                    ) : (
                        <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {lang === 'tr' ? 'Ön Yüz (Soru)' : 'Front (Question)'}
                                    </label>
                                    <textarea
                                        value={newCard.front}
                                        onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        {lang === 'tr' ? 'Arka Yüz (Cevap)' : 'Back (Answer)'}
                                    </label>
                                    <textarea
                                        value={newCard.back}
                                        onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                                        rows={2}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white resize-none"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={addCard} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                                        {lang === 'tr' ? 'Ekle' : 'Add'}
                                    </button>
                                    <button onClick={() => setIsAddingCard(false)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                        {lang === 'tr' ? 'İptal' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cards List */}
                    {selectedDeck.cards.length > 0 ? (
                        <div className="space-y-3">
                            {selectedDeck.cards.map((card, index) => (
                                <div
                                    key={card.id}
                                    className={`p-4 bg-white dark:bg-gray-900 rounded-xl border ${card.known ? 'border-emerald-200 dark:border-emerald-800' : 'border-gray-200 dark:border-gray-800'}`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs text-gray-400">#{index + 1}</span>
                                                {card.known && <Check size={14} className="text-emerald-500" />}
                                            </div>
                                            <p className="font-medium text-gray-900 dark:text-white">{card.front}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{card.back}</p>
                                        </div>
                                        <button
                                            onClick={() => deleteCard(card.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            {lang === 'tr' ? 'Bu destede henüz kart yok' : 'No cards in this deck yet'}
                        </div>
                    )}
                </main>
            </div>
        );
    }

    // Decks List View
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
                                {lang === 'tr' ? 'Çalışma Kartları' : 'Flashcards'}
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {lang === 'tr' ? 'Hafıza kartları ile öğrenin' : 'Learn with memory cards'}
                            </p>
                        </div>
                    </div>
                    <ModeToggle />
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Add Deck */}
                {!isAddingDeck ? (
                    <button
                        onClick={() => setIsAddingDeck(true)}
                        className="w-full mb-6 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        {lang === 'tr' ? 'Yeni Deste Oluştur' : 'Create New Deck'}
                    </button>
                ) : (
                    <div className="mb-6 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {lang === 'tr' ? 'Deste Adı' : 'Deck Name'}
                                </label>
                                <input
                                    type="text"
                                    value={newDeck.name}
                                    onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 dark:text-white"
                                    placeholder={lang === 'tr' ? 'Matematik Formülleri' : 'Math Formulas'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {lang === 'tr' ? 'Renk' : 'Color'}
                                </label>
                                <div className="flex gap-2">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setNewDeck({ ...newDeck, color })}
                                            className={`w-8 h-8 rounded-full transition-transform ${newDeck.color === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : ''}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={addDeck} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors">
                                    {lang === 'tr' ? 'Oluştur' : 'Create'}
                                </button>
                                <button onClick={() => setIsAddingDeck(false)} className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                    {lang === 'tr' ? 'İptal' : 'Cancel'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Decks Grid */}
                {decks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {decks.map((deck) => (
                            <div
                                key={deck.id}
                                onClick={() => setSelectedDeck(deck)}
                                className="p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: deck.color }} />
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteDeck(deck.id); }}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{deck.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <Layers size={14} />
                                    <span>{deck.cards.length} {lang === 'tr' ? 'kart' : 'cards'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !isAddingDeck && (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Layers className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {lang === 'tr' ? 'Henüz deste oluşturulmamış' : 'No decks created yet'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {lang === 'tr' ? 'Çalışma kartları için deste oluşturun' : 'Create a deck to start adding flashcards'}
                        </p>
                    </div>
                )}
            </main>

            {/* Marketing Sections */}
            <ToolMarketingSections lang={lang} tool="flashcards" />
        </div>
    );
}
