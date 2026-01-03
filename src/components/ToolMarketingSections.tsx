'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Calculator, Clock, Target, BookOpen, Brain, TrendingUp,
    Shield, Zap, CheckCircle, ArrowRight, Sparkles, BarChart3,
    Award, Lightbulb, Users, Heart, ChevronDown, ArrowDown
} from 'lucide-react';

type ToolType = 'gpa' | 'final' | 'pomodoro' | 'attendance' | 'notes' | 'exams' | 'budget' | 'flashcards' | 'goals' | 'assignments';

interface ToolMarketingSectionsProps {
    lang: 'tr' | 'en';
    tool: ToolType;
    hideScrollIndicator?: boolean;
}

const toolContent = {
    gpa: {
        tr: {
            heroTitle: 'Akademik Başarınızı Takip Edin',
            heroDesc: 'Not ortalamanızı hesaplayın, hedeflerinizi belirleyin ve akademik gelişiminizi izleyin.',
            features: [
                { icon: Calculator, title: 'Kolay Hesaplama', desc: 'Derslerinizi ve notlarınızı girin, anında ortalamanızı görün.' },
                { icon: TrendingUp, title: 'Trend Analizi', desc: 'Dönemler arası gelişiminizi grafiklerle takip edin.' },
                { icon: Target, title: 'Hedef Belirleme', desc: 'Hedef GPA belirleyin ve gereken notları hesaplayın.' }
            ],
            faq: [
                { q: 'Hangi not sistemleri destekleniyor?', a: '4.0, 100lük ve harf notu sistemleri desteklenmektedir.' },
                { q: 'AKTS kredileri hesaba katılıyor mu?', a: 'Evet, ders kredilerine göre ağırlıklı ortalama hesaplanır.' },
                { q: 'Verilerim kaydediliyor mu?', a: 'Tüm veriler cihazınızda yerel olarak saklanır.' }
            ],
            ctaTitle: 'Akademik Hedeflerinize Ulaşın',
            ctaButton: 'Hemen Hesapla',
            relatedTools: [
                { href: '/final-calculator', title: 'Final Hesaplama', icon: Calculator },
                { href: '/exams', title: 'Sınav Takvimi', icon: BookOpen }
            ]
        },
        en: {
            heroTitle: 'Track Your Academic Success',
            heroDesc: 'Calculate your GPA, set goals, and monitor your academic progress.',
            features: [
                { icon: Calculator, title: 'Easy Calculation', desc: 'Enter your courses and grades, see your GPA instantly.' },
                { icon: TrendingUp, title: 'Trend Analysis', desc: 'Track your progress across semesters with charts.' },
                { icon: Target, title: 'Goal Setting', desc: 'Set target GPA and calculate required grades.' }
            ],
            faq: [
                { q: 'Which grading systems are supported?', a: '4.0, 100-point, and letter grade systems are supported.' },
                { q: 'Are ECTS credits considered?', a: 'Yes, weighted average is calculated based on course credits.' },
                { q: 'Is my data saved?', a: 'All data is stored locally on your device.' }
            ],
            ctaTitle: 'Reach Your Academic Goals',
            ctaButton: 'Calculate Now',
            relatedTools: [
                { href: '/final-calculator', title: 'Final Calculator', icon: Calculator },
                { href: '/exams', title: 'Exam Calendar', icon: BookOpen }
            ]
        }
    },
    final: {
        tr: {
            heroTitle: 'Dersi Geçmek İçin Kaç Almalısın?',
            heroDesc: 'Vize notunuza göre finalde kaç almanız gerektiğini hesaplayın. Lab ve ödev notlarını da ekleyebilirsiniz.',
            features: [
                { icon: Target, title: 'Hedef Belirleme', desc: 'Geçme notuna göre minimum final puanını hesaplayın.' },
                { icon: BarChart3, title: 'Senaryo Analizi', desc: 'Farklı final notlarında ne olacağını görün.' },
                { icon: Sparkles, title: 'Ek Bileşenler', desc: 'Lab, ödev ve proje notlarını hesaba katın.' }
            ],
            faq: [
                { q: 'Vize ağırlığını değiştirebilir miyim?', a: 'Evet, gelişmiş ayarlardan vize ve final ağırlıklarını ayarlayabilirsiniz.' },
                { q: 'Lab notunu nasıl eklerim?', a: 'Gelişmiş ayarlardan "Ekle" butonuyla lab, ödev veya proje ekleyebilirsiniz.' },
                { q: 'Geçme notu 50 mi 60 mı?', a: 'Üniversitenize göre değişir, ayarlardan geçme notunu değiştirebilirsiniz.' }
            ],
            ctaTitle: 'Finalde Başarılı Ol',
            ctaButton: 'Notunu Hesapla',
            relatedTools: [
                { href: '/gpa-calculator', title: 'GPA Hesaplama', icon: Calculator },
                { href: '/pomodoro', title: 'Pomodoro Sayacı', icon: Clock }
            ]
        },
        en: {
            heroTitle: 'What Grade Do You Need to Pass?',
            heroDesc: 'Calculate the minimum final grade you need based on your midterm. Add lab and homework grades too.',
            features: [
                { icon: Target, title: 'Goal Setting', desc: 'Calculate minimum final score based on passing grade.' },
                { icon: BarChart3, title: 'Scenario Analysis', desc: 'See what happens with different final grades.' },
                { icon: Sparkles, title: 'Extra Components', desc: 'Include lab, homework and project grades.' }
            ],
            faq: [
                { q: 'Can I change the midterm weight?', a: 'Yes, you can adjust midterm and final weights in advanced settings.' },
                { q: 'How do I add lab grade?', a: 'Use the "Add" button in advanced settings for lab, homework or projects.' },
                { q: 'Is passing grade 50 or 60?', a: 'It varies by university, you can change it in settings.' }
            ],
            ctaTitle: 'Succeed in Your Finals',
            ctaButton: 'Calculate Now',
            relatedTools: [
                { href: '/gpa-calculator', title: 'GPA Calculator', icon: Calculator },
                { href: '/pomodoro', title: 'Pomodoro Timer', icon: Clock }
            ]
        }
    },
    pomodoro: {
        tr: {
            heroTitle: 'Odaklanarak Çalış, Verimli Ol',
            heroDesc: 'Pomodoro tekniği ile çalışma sürelerinizi yönetin. 25 dakika çalış, 5 dakika dinlen.',
            features: [
                { icon: Clock, title: 'Zaman Yönetimi', desc: '25/5 dakikalık döngülerle odaklanmayı artırın.' },
                { icon: Brain, title: 'Beyin Gücü', desc: 'Düzenli molalar ile zihinsel yorgunluğu azaltın.' },
                { icon: Award, title: 'Başarı Takibi', desc: 'Tamamlanan pomodoro sayısını takip edin.' }
            ],
            faq: [
                { q: 'Pomodoro tekniği nedir?', a: '25 dakika odaklanıp 5 dakika mola veren bir zaman yönetimi tekniğidir.' },
                { q: 'Süreleri değiştirebilir miyim?', a: 'Evet, çalışma ve mola sürelerini özelleştirebilirsiniz.' },
                { q: 'Bildirim alabilir miyim?', a: 'Evet, süre bittiğinde sesli ve görsel bildirim alırsınız.' }
            ],
            ctaTitle: 'Çalışmaya Başla',
            ctaButton: 'Pomodoro Başlat',
            relatedTools: [
                { href: '/goals', title: 'Haftalık Hedefler', icon: Target },
                { href: '/notes', title: 'Ders Notları', icon: BookOpen }
            ]
        },
        en: {
            heroTitle: 'Focus and Be Productive',
            heroDesc: 'Manage your study time with Pomodoro technique. Work 25 minutes, rest 5 minutes.',
            features: [
                { icon: Clock, title: 'Time Management', desc: 'Increase focus with 25/5 minute cycles.' },
                { icon: Brain, title: 'Brain Power', desc: 'Reduce mental fatigue with regular breaks.' },
                { icon: Award, title: 'Progress Tracking', desc: 'Track completed pomodoro count.' }
            ],
            faq: [
                { q: 'What is Pomodoro technique?', a: 'A time management method with 25 minutes focus and 5 minutes break.' },
                { q: 'Can I customize durations?', a: 'Yes, you can customize work and break durations.' },
                { q: 'Will I get notifications?', a: 'Yes, you get audio and visual notifications when time is up.' }
            ],
            ctaTitle: 'Start Studying',
            ctaButton: 'Start Pomodoro',
            relatedTools: [
                { href: '/goals', title: 'Weekly Goals', icon: Target },
                { href: '/notes', title: 'Notes', icon: BookOpen }
            ]
        }
    },
    attendance: {
        tr: {
            heroTitle: 'Devamsızlığını Takip Et',
            heroDesc: 'Her ders için katılım durumunuzu takip edin, devamsızlık limitini aşmayın.',
            features: [
                { icon: CheckCircle, title: 'Kolay Takip', desc: 'Tek tıkla katılım durumunuzu kaydedin.' },
                { icon: Shield, title: 'Limit Uyarısı', desc: 'Devamsızlık limitine yaklaştığınızda uyarı alın.' },
                { icon: BarChart3, title: 'İstatistikler', desc: 'Ders bazlı katılım yüzdelerini görün.' }
            ],
            faq: [
                { q: 'Devamsızlık limiti nedir?', a: 'Çoğu üniversitede %30 devamsızlık dersten kalmanıza neden olur.' },
                { q: 'Mazeret ekleyebilir miyim?', a: 'Evet, mazeretli devamsızlıkları ayrı işaretleyebilirsiniz.' },
                { q: 'Verilerim kaydediliyor mu?', a: 'Evet, tüm veriler tarayıcınızda yerel olarak saklanır.' }
            ],
            ctaTitle: 'Derslerini Kaçırma',
            ctaButton: 'Takibe Başla',
            relatedTools: [
                { href: '/planner', title: 'Ders Programı', icon: BookOpen },
                { href: '/exams', title: 'Sınav Takvimi', icon: Target }
            ]
        },
        en: {
            heroTitle: 'Track Your Attendance',
            heroDesc: 'Monitor attendance for each course, stay within absence limits.',
            features: [
                { icon: CheckCircle, title: 'Easy Tracking', desc: 'Record attendance with one click.' },
                { icon: Shield, title: 'Limit Warning', desc: 'Get warnings when approaching absence limit.' },
                { icon: BarChart3, title: 'Statistics', desc: 'See attendance percentages by course.' }
            ],
            faq: [
                { q: 'What is the absence limit?', a: 'Most universities fail you at 30% absence rate.' },
                { q: 'Can I add excused absences?', a: 'Yes, you can mark excused absences separately.' },
                { q: 'Is my data saved?', a: 'Yes, all data is stored locally in your browser.' }
            ],
            ctaTitle: "Don't Miss Your Classes",
            ctaButton: 'Start Tracking',
            relatedTools: [
                { href: '/planner', title: 'Schedule', icon: BookOpen },
                { href: '/exams', title: 'Exam Calendar', icon: Target }
            ]
        }
    },
    notes: {
        tr: {
            heroTitle: 'Ders Notlarını Organize Et',
            heroDesc: 'Tüm ders notlarınızı tek bir yerde toplayın, düzenleyin ve kolayca erişin.',
            features: [
                { icon: BookOpen, title: 'Kolay Organizasyon', desc: 'Notlarınızı derse göre kategorize edin.' },
                { icon: Target, title: 'Hızlı Arama', desc: 'Aradığınız notu saniyeler içinde bulun.' },
                { icon: Shield, title: 'Güvenli Saklama', desc: 'Notlarınız cihazınızda güvenle saklanır.' }
            ],
            faq: [
                { q: 'Notlarımı düzenleyebilir miyim?', a: 'Evet, tüm notlarınızı istediğiniz zaman düzenleyebilirsiniz.' },
                { q: 'Markdown destekleniyor mu?', a: 'Evet, notlarınızda temel Markdown formatlaması kullanabilirsiniz.' },
                { q: 'Notlarımı dışa aktarabilir miyim?', a: 'Yakında notları PDF olarak dışa aktarma özelliği eklenecek.' }
            ],
            ctaTitle: 'Notlarını Düzenle',
            ctaButton: 'Not Almaya Başla',
            relatedTools: [
                { href: '/flashcards', title: 'Flashcards', icon: BookOpen },
                { href: '/exams', title: 'Sınav Takvimi', icon: Target }
            ]
        },
        en: {
            heroTitle: 'Organize Your Notes',
            heroDesc: 'Collect all your course notes in one place, organize and access easily.',
            features: [
                { icon: BookOpen, title: 'Easy Organization', desc: 'Categorize notes by course.' },
                { icon: Target, title: 'Quick Search', desc: 'Find the note you need in seconds.' },
                { icon: Shield, title: 'Safe Storage', desc: 'Your notes are stored safely on your device.' }
            ],
            faq: [
                { q: 'Can I edit my notes?', a: 'Yes, you can edit all your notes anytime.' },
                { q: 'Is Markdown supported?', a: 'Yes, you can use basic Markdown formatting in your notes.' },
                { q: 'Can I export my notes?', a: 'PDF export feature will be added soon.' }
            ],
            ctaTitle: 'Organize Your Notes',
            ctaButton: 'Start Taking Notes',
            relatedTools: [
                { href: '/flashcards', title: 'Flashcards', icon: BookOpen },
                { href: '/exams', title: 'Exam Calendar', icon: Target }
            ]
        }
    },
    exams: {
        tr: {
            heroTitle: 'Sınavlarını Takip Et',
            heroDesc: 'Tüm sınavlarınızı takvimde görün, geri sayım ile hazırlanın.',
            features: [
                { icon: Clock, title: 'Geri Sayım', desc: 'Her sınava kaç gün kaldığını görün.' },
                { icon: Target, title: 'Önceliklendirme', desc: 'Yaklaşan sınavlara odaklanın.' },
                { icon: CheckCircle, title: 'Tamamlama', desc: 'Bitirdiğiniz sınavları işaretleyin.' }
            ],
            faq: [
                { q: 'Birden fazla sınav ekleyebilir miyim?', a: 'Evet, istediğiniz kadar sınav ekleyebilirsiniz.' },
                { q: 'Hatırlatıcı alabilir miyim?', a: 'Yakında bildirim özelliği eklenecek.' },
                { q: 'Sınavları sıralayabilir miyim?', a: 'Sınavlar otomatik olarak tarihe göre sıralanır.' }
            ],
            ctaTitle: 'Sınavlara Hazırlan',
            ctaButton: 'Sınav Ekle',
            relatedTools: [
                { href: '/pomodoro', title: 'Pomodoro', icon: Clock },
                { href: '/notes', title: 'Ders Notları', icon: BookOpen }
            ]
        },
        en: {
            heroTitle: 'Track Your Exams',
            heroDesc: 'See all your exams on calendar, prepare with countdown.',
            features: [
                { icon: Clock, title: 'Countdown', desc: 'See how many days until each exam.' },
                { icon: Target, title: 'Prioritization', desc: 'Focus on upcoming exams.' },
                { icon: CheckCircle, title: 'Completion', desc: 'Mark completed exams.' }
            ],
            faq: [
                { q: 'Can I add multiple exams?', a: 'Yes, you can add as many exams as you want.' },
                { q: 'Can I get reminders?', a: 'Notification feature will be added soon.' },
                { q: 'Can I sort exams?', a: 'Exams are automatically sorted by date.' }
            ],
            ctaTitle: 'Prepare for Exams',
            ctaButton: 'Add Exam',
            relatedTools: [
                { href: '/pomodoro', title: 'Pomodoro', icon: Clock },
                { href: '/notes', title: 'Notes', icon: BookOpen }
            ]
        }
    },
    budget: {
        tr: {
            heroTitle: 'Bütçeni Yönet',
            heroDesc: 'Gelir ve giderlerini takip et, tasarruf hedeflerini belirle.',
            features: [
                { icon: TrendingUp, title: 'Harcama Analizi', desc: 'Nereye para harcadığını gör.' },
                { icon: Target, title: 'Tasarruf Hedefleri', desc: 'Hedef belirle ve ilerlemeni takip et.' },
                { icon: BarChart3, title: 'Grafikler', desc: 'Aylık harcamalarını grafikle görüntüle.' }
            ],
            faq: [
                { q: 'Kategoriler özelleştirilebilir mi?', a: 'Evet, kendi kategorilerinizi oluşturabilirsiniz.' },
                { q: 'Birden fazla para birimi destekleniyor mu?', a: 'Şu anda TL üzerinden hesaplama yapılmaktadır.' },
                { q: 'Verilerim güvende mi?', a: 'Evet, tüm veriler cihazınızda yerel olarak saklanır.' }
            ],
            ctaTitle: 'Finansını Kontrol Et',
            ctaButton: 'Bütçe Oluştur',
            relatedTools: [
                { href: '/goals', title: 'Hedefler', icon: Target },
                { href: '/planner', title: 'Program', icon: BookOpen }
            ]
        },
        en: {
            heroTitle: 'Manage Your Budget',
            heroDesc: 'Track income and expenses, set savings goals.',
            features: [
                { icon: TrendingUp, title: 'Spending Analysis', desc: 'See where you spend money.' },
                { icon: Target, title: 'Savings Goals', desc: 'Set goals and track progress.' },
                { icon: BarChart3, title: 'Charts', desc: 'View monthly expenses in charts.' }
            ],
            faq: [
                { q: 'Can categories be customized?', a: 'Yes, you can create your own categories.' },
                { q: 'Are multiple currencies supported?', a: 'Currently calculations are in TRY.' },
                { q: 'Is my data safe?', a: 'Yes, all data is stored locally on your device.' }
            ],
            ctaTitle: 'Control Your Finances',
            ctaButton: 'Create Budget',
            relatedTools: [
                { href: '/goals', title: 'Goals', icon: Target },
                { href: '/planner', title: 'Schedule', icon: BookOpen }
            ]
        }
    },
    flashcards: {
        tr: {
            heroTitle: 'Flashcard ile Öğren',
            heroDesc: 'Kartlarla tekrar yaparak öğrenmeyi pekiştirin.',
            features: [
                { icon: Brain, title: 'Aktif Hatırlama', desc: 'Kartları çevirerek hafızanızı test edin.' },
                { icon: Award, title: 'Aralıklı Tekrar', desc: 'Zorlandığınız kartlara daha sık bakın.' },
                { icon: BookOpen, title: 'Kategorizasyon', desc: 'Kartları derse göre gruplandırın.' }
            ],
            faq: [
                { q: 'Kaç kart oluşturabilirim?', a: 'İstediğiniz kadar kart oluşturabilirsiniz.' },
                { q: 'Kartları paylaşabilir miyim?', a: 'Yakında paylaşım özelliği eklenecek.' },
                { q: 'Resim ekleyebilir miyim?', a: 'Şu anda sadece metin desteği vardır.' }
            ],
            ctaTitle: 'Etkili Öğren',
            ctaButton: 'Kart Oluştur',
            relatedTools: [
                { href: '/notes', title: 'Notlar', icon: BookOpen },
                { href: '/pomodoro', title: 'Pomodoro', icon: Clock }
            ]
        },
        en: {
            heroTitle: 'Learn with Flashcards',
            heroDesc: 'Reinforce learning by reviewing with cards.',
            features: [
                { icon: Brain, title: 'Active Recall', desc: 'Test your memory by flipping cards.' },
                { icon: Award, title: 'Spaced Repetition', desc: 'Review difficult cards more often.' },
                { icon: BookOpen, title: 'Categorization', desc: 'Group cards by course.' }
            ],
            faq: [
                { q: 'How many cards can I create?', a: 'You can create as many cards as you want.' },
                { q: 'Can I share cards?', a: 'Sharing feature will be added soon.' },
                { q: 'Can I add images?', a: 'Currently only text is supported.' }
            ],
            ctaTitle: 'Learn Effectively',
            ctaButton: 'Create Cards',
            relatedTools: [
                { href: '/notes', title: 'Notes', icon: BookOpen },
                { href: '/pomodoro', title: 'Pomodoro', icon: Clock }
            ]
        }
    },
    goals: {
        tr: {
            heroTitle: 'Haftalık Hedeflerini Belirle',
            heroDesc: 'Hedefler koyun, ilerlemenizi takip edin ve başarıya ulaşın.',
            features: [
                { icon: Target, title: 'Hedef Belirleme', desc: 'Haftalık ve günlük hedefler belirleyin.' },
                { icon: CheckCircle, title: 'İlerleme Takibi', desc: 'Tamamlanan hedefleri işaretleyin.' },
                { icon: TrendingUp, title: 'Motivasyon', desc: 'Başarılarınızı görün ve motive olun.' }
            ],
            faq: [
                { q: 'Hedefleri tekrarlayabilir miyim?', a: 'Evet, haftalık tekrarlanan hedefler oluşturabilirsiniz.' },
                { q: 'Öncelik belirleyebilir miyim?', a: 'Evet, hedeflere öncelik atayabilirsiniz.' },
                { q: 'Geçmiş hedefleri görebilir miyim?', a: 'Evet, tamamlanmış hedefler arşivlenir.' }
            ],
            ctaTitle: 'Hedeflerine Ulaş',
            ctaButton: 'Hedef Belirle',
            relatedTools: [
                { href: '/pomodoro', title: 'Pomodoro', icon: Clock },
                { href: '/assignments', title: 'Ödevler', icon: BookOpen }
            ]
        },
        en: {
            heroTitle: 'Set Weekly Goals',
            heroDesc: 'Set goals, track progress and achieve success.',
            features: [
                { icon: Target, title: 'Goal Setting', desc: 'Set weekly and daily goals.' },
                { icon: CheckCircle, title: 'Progress Tracking', desc: 'Mark completed goals.' },
                { icon: TrendingUp, title: 'Motivation', desc: 'See your achievements and stay motivated.' }
            ],
            faq: [
                { q: 'Can I repeat goals?', a: 'Yes, you can create weekly recurring goals.' },
                { q: 'Can I set priorities?', a: 'Yes, you can assign priority to goals.' },
                { q: 'Can I see past goals?', a: 'Yes, completed goals are archived.' }
            ],
            ctaTitle: 'Reach Your Goals',
            ctaButton: 'Set Goals',
            relatedTools: [
                { href: '/pomodoro', title: 'Pomodoro', icon: Clock },
                { href: '/assignments', title: 'Assignments', icon: BookOpen }
            ]
        }
    },
    assignments: {
        tr: {
            heroTitle: 'Ödevlerini Takip Et',
            heroDesc: 'Tüm ödevlerinizi ve deadline\'larınızı tek yerden yönetin.',
            features: [
                { icon: Clock, title: 'Deadline Takibi', desc: 'Yaklaşan teslim tarihlerini görün.' },
                { icon: CheckCircle, title: 'Tamamlama', desc: 'Bitirdiğiniz ödevleri işaretleyin.' },
                { icon: Target, title: 'Önceliklendirme', desc: 'Acil ödevlere odaklanın.' }
            ],
            faq: [
                { q: 'Hatırlatıcı alabilir miyim?', a: 'Yakında bildirim özelliği eklenecek.' },
                { q: 'Ödevleri kategorize edebilir miyim?', a: 'Evet, derse göre kategorize edebilirsiniz.' },
                { q: 'Dosya ekleyebilir miyim?', a: 'Şu anda dosya ekleme desteklenmemektedir.' }
            ],
            ctaTitle: 'Ödevlerini Yönet',
            ctaButton: 'Ödev Ekle',
            relatedTools: [
                { href: '/exams', title: 'Sınavlar', icon: Target },
                { href: '/goals', title: 'Hedefler', icon: CheckCircle }
            ]
        },
        en: {
            heroTitle: 'Track Your Assignments',
            heroDesc: 'Manage all your assignments and deadlines in one place.',
            features: [
                { icon: Clock, title: 'Deadline Tracking', desc: 'See upcoming due dates.' },
                { icon: CheckCircle, title: 'Completion', desc: 'Mark completed assignments.' },
                { icon: Target, title: 'Prioritization', desc: 'Focus on urgent assignments.' }
            ],
            faq: [
                { q: 'Can I get reminders?', a: 'Notification feature will be added soon.' },
                { q: 'Can I categorize assignments?', a: 'Yes, you can categorize by course.' },

                { q: 'Can I attach files?', a: 'File attachment is not currently supported.' }
            ],
            ctaTitle: 'Manage Assignments',
            ctaButton: 'Add Assignment',
            relatedTools: [
                { href: '/exams', title: 'Exams', icon: Target },
                { href: '/goals', title: 'Goals', icon: CheckCircle }
            ]
        }
    }
};

interface ToolMarketingSectionsProps {
    lang: 'tr' | 'en';
    tool: ToolType;
    hideScrollIndicator?: boolean;
    hideFaq?: boolean;
}

export default function ToolMarketingSections({ lang, tool, hideScrollIndicator = false, hideFaq = false }: ToolMarketingSectionsProps) {
    const content = toolContent[tool]?.[lang];

    if (!content) return null;

    const scrollToContent = () => {
        document.getElementById('marketing-content')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="w-full">
            {/* Scroll Indicator */}
            {!hideScrollIndicator && (
                <div className="py-8 text-center bg-gradient-to-b from-transparent to-white dark:to-gray-950">
                    <button
                        onClick={scrollToContent}
                        className="inline-flex flex-col items-center gap-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <span className="text-sm font-medium">
                            {lang === 'tr' ? 'Daha fazla bilgi' : 'More info'}
                        </span>
                        <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center animate-bounce">
                            <ChevronDown size={18} />
                        </div>
                    </button>
                </div>
            )}

            {/* Marketing Content - Always Visible */}
            <div id="marketing-content" className="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">

                {/* Hero Section */}
                <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6 drop-shadow-sm">
                            {content.heroTitle}
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            {content.heroDesc}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {content.features.map((feature: any, idx: number) => {
                            const Icon = feature.icon;
                            return (
                                <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                                    <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        <Icon size={28} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* FAQ Section */}
                {!hideFaq && (
                    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
                        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                                {lang === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}
                            </h2>
                            <div className="space-y-4">
                                {content.faq.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className="text-blue-600 dark:text-blue-400">Q.</span> {item.q}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 pl-6 leading-relaxed">
                                            {item.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Related Tools */}
                <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                        {lang === 'tr' ? 'Diğer Araçlarımızı Keşfedin' : 'Explore Other Tools'}
                    </h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {content.relatedTools.map((item: any, idx: number) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={idx}
                                    href={item.href}
                                    className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all group"
                                >
                                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        <Icon size={20} />
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-white">{item.title}</span>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-blue-600 dark:bg-blue-900/30 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="relative max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            {content.ctaTitle}
                        </h2>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:bg-blue-50 transition-colors transform hover:scale-105 active:scale-95 duration-200"
                        >
                            {content.ctaButton}
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

