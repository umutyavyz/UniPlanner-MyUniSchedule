'use client';

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Briefcase, House, Printer, Share2, Lock, Calculator, ArrowRight } from 'lucide-react';

interface PlannerMarketingSectionsProps {
    lang: 'tr' | 'en';
}

export default function PlannerMarketingSections({ lang }: PlannerMarketingSectionsProps) {
    const t = {
        tr: {
            feature1Title: 'Akademik Başarıyı Artırın',
            feature1Desc: 'Derslerinizi ve ödevlerinizi kaçırmayın, mükemmel çalışma düzenini kurun.',
            feature2Title: 'Hayatınızı Düzenleyin',
            feature2Desc: 'İş, hobi ve dinlenme zamanlarınızı etkili bir şekilde dengeleyin.',
            feature3Title: 'Ev Yönetimi',
            feature3Desc: 'Ev işlerini, yemekleri ve aile etkinliklerini tek bir yerden takip edin.',
            weekTitle: 'Haftanızı Mükemmel Tasarlayın',
            weekDesc: 'Takvim görünümünü özelleştirin, hafta sonlarını açıp kapatın ve zaman dilimlerini yaşam tarzınıza göre ayarlayın.',
            shareTitle: 'Kolay Paylaşım Seçenekleri',
            shareDesc: 'PDF olarak indirin, resim olarak kaydedin veya tarayıcınızda saklayın. Programınız her an yanınızda.',
            privacyTitle: 'Önce Gizlilik',
            privacyDesc: 'Gizli takip yok. Program verileriniz sunucularımızda değil, kendi cihazınızda saklanır.',
            quote: '"Zaman en çok istediğimiz ama en kötü kullandığımız şeydir."',
            quoteAuthor: 'William Penn',
            howToTitle: 'Ders Programı Nasıl Hazırlanır?',
            step1Title: 'Başlangıç',
            step1Desc: 'Uygulamayı açın ve tablo ayarlarınızı yapın.',
            step2Title: 'Ekleme',
            step2Desc: 'Derslerinizi ve görevlerinizi menüden veya takvimden ekleyin.',
            step3Title: 'Güvence',
            step3Desc: 'Planınızı kaybetmemek için dışa aktarma seçeneklerini kullanın.',
            guideTitle: 'Üniversite Ders Programı Hazırlama Rehberi',
            article1Title: 'Ders Programı Nasıl Hazırlanır?',
            article1Content: 'Etkili bir ders programı hazırlamak için öncelikle zorunlu derslerinizi yerleştirin. Bu derslerin saatleri genellikle sabittir ve değiştirilemez. Ardından, boş kalan zaman dilimlerine ilgi alanlarınıza ve mezuniyet gereksinimlerinize uygun seçmeli dersleri ekleyin. UniPlanner Pro gibi araçlar kullanarak derslerin çakışıp çakışmadığını anında görebilirsiniz.',
            article2Title: 'Ders Çakışması Nedir ve Nasıl Çözülür?',
            article2Content: 'Ders çakışması, iki farklı dersin aynı gün ve saatte olması durumudur. Tam çakışma ve kısmi çakışma olarak ikiye ayrılır. Çözüm için dersin farklı bir şubesini seçebilir, dersi bir sonraki seneye bırakabilir veya hocanızdan özel izin isteyebilirsiniz.',
            gpaTitle: 'Not Ortalamanızı Saniyeler İçinde Hesaplayın',
            gpaDesc: 'Kullanımı kolay GPA hesaplayıcımız ile akademik başarınızı takip edin. Farklı not sistemleri ve dönem/genel ortalama desteği.',
            gpaCta: 'GPA Hesaplayıcıyı Dene',
            faqTitle: 'Sıkça Sorulan Sorular',
            faq1Q: 'Bu uygulama ücretsiz mi?',
            faq1A: 'Evet, tüm öğrenciler ve kullanıcılar için tamamen ücretsizdir.',
            faq2Q: 'Hangi planlama türleri var?',
            faq2A: 'Haftalık ve günlük planlama formatları desteklenmektedir.',
            faq3Q: 'Verilerim güvende mi?',
            faq3A: 'Yerel depolamaya öncelik veriyoruz. Kişisel veri toplanmaz.',
            faq4Q: 'Programımı nasıl kaydederim?',
            faq4A: 'Resim veya PDF olarak indirmek için dışa aktar butonunu kullanın.',
            ctaTitle: 'Haftalık planlamanızı bir üst seviyeye taşıyın',
            ctaButton: 'PROGRAMINI OLUŞTUR',
            ctaSubtext: 'Ücretsiz • Üyelik Gerektirmez • Anında İndir'
        },
        en: {
            feature1Title: 'Boost Academic Success',
            feature1Desc: "Don't miss your classes and assignments, build the perfect study routine.",
            feature2Title: 'Organize Your Life',
            feature2Desc: 'Effectively balance work, hobbies and rest time.',
            feature3Title: 'Home Management',
            feature3Desc: 'Track chores, meals and family activities from one place.',
            weekTitle: 'Design Your Perfect Week',
            weekDesc: 'Customize calendar view, toggle weekends and adjust time slots to your lifestyle.',
            shareTitle: 'Easy Sharing Options',
            shareDesc: 'Download as PDF, save as image or keep in browser. Your schedule is always with you.',
            privacyTitle: 'Privacy First',
            privacyDesc: 'No hidden tracking. Your schedule data is stored on your device, not our servers.',
            quote: '"Time is what we want most, but what we use worst."',
            quoteAuthor: 'William Penn',
            howToTitle: 'How to Create a Schedule?',
            step1Title: 'Start',
            step1Desc: 'Open the app and configure your table settings.',
            step2Title: 'Add',
            step2Desc: 'Add your courses and tasks from the menu or calendar.',
            step3Title: 'Secure',
            step3Desc: 'Use export options to never lose your plan.',
            guideTitle: 'University Schedule Guide',
            article1Title: 'How to Create a Schedule?',
            article1Content: 'To create an effective schedule, first place your required courses. Their times are usually fixed. Then add electives to remaining slots based on your interests and graduation requirements.',
            article2Title: 'What is Course Conflict?',
            article2Content: 'Course conflict occurs when two different courses are at the same day and time. You can choose a different section, postpone the course, or request special permission.',
            gpaTitle: 'Calculate Your GPA in Seconds',
            gpaDesc: 'Track your academic success with our easy-to-use GPA calculator. Different grading systems and semester/cumulative support.',
            gpaCta: 'Try GPA Calculator',
            faqTitle: 'Frequently Asked Questions',
            faq1Q: 'Is this app free?',
            faq1A: 'Yes, it is completely free for all students and users.',
            faq2Q: 'What planning types are available?',
            faq2A: 'Weekly and daily planning formats are supported.',
            faq3Q: 'Is my data safe?',
            faq3A: 'We prioritize local storage. No personal data is collected.',
            faq4Q: 'How do I save my schedule?',
            faq4A: 'Use the export button to download as image or PDF.',
            ctaTitle: 'Take your weekly planning to the next level',
            ctaButton: 'CREATE YOUR SCHEDULE',
            ctaSubtext: 'Free • No Sign Up • Instant Download'
        }
    };

    const text = t[lang];

    return (
        <div className="w-full bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
            {/* Features Section */}
            <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                            <GraduationCap size={48} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{text.feature1Title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{text.feature1Desc}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                            <Briefcase size={48} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{text.feature2Title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{text.feature2Desc}</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                            <House size={48} />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{text.feature3Title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{text.feature3Desc}</p>
                    </div>
                </div>
            </section>

            {/* Week Design Section */}
            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 relative">
                    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[300px] w-full max-w-[450px] md:h-[400px] md:max-w-[600px] shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="h-full w-full overflow-hidden rounded-[2rem] bg-white dark:bg-gray-900 flex relative">
                            <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900 flex">
                                <div className="w-1/4 h-full border-r border-gray-200 dark:border-gray-800 p-4 space-y-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4 mb-6"></div>
                                    <div className="h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"></div>
                                    <div className="h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"></div>
                                    <div className="h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm"></div>
                                </div>
                                <div className="flex-1 p-4">
                                    <div className="h-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 grid grid-cols-5 gap-2">
                                        <div className="col-span-1 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg h-24 mt-8"></div>
                                        <div className="col-span-1 bg-green-100/50 dark:bg-green-900/20 rounded-lg h-32 mt-4"></div>
                                        <div className="col-span-1 bg-purple-100/50 dark:bg-purple-900/20 rounded-lg h-20 mt-12"></div>
                                        <div className="col-span-1 bg-orange-100/50 dark:bg-orange-900/20 rounded-lg h-28 mt-2"></div>
                                        <div className="col-span-1 bg-red-100/50 dark:bg-red-900/20 rounded-lg h-24 mt-10"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 text-left">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{text.weekTitle}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{text.weekDesc}</p>
                </div>
            </section>

            {/* Sharing Section */}
            <section className="py-20 px-4 md:px-8 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
                    <div className="flex-1 text-left">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">{text.shareTitle}</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{text.shareDesc}</p>
                    </div>
                    <div className="flex-1 flex justify-center gap-6">
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-blue-500 transform rotate-6">
                            <Printer size={64} />
                        </div>
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg text-green-500 transform -rotate-6 mt-12">
                            <Share2 size={64} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Privacy Section */}
            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl opacity-50"></div>
                        <Lock size={120} className="text-orange-500 relative z-10" />
                    </div>
                </div>
                <div className="flex-1 text-left">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{text.privacyTitle}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">{text.privacyDesc}</p>
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-16 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 text-center">
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">{text.quote}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{text.quoteAuthor}</p>
                </div>
            </section>

            {/* How To Section */}
            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{text.howToTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { num: 1, title: text.step1Title, desc: text.step1Desc },
                        { num: 2, title: text.step2Title, desc: text.step2Desc },
                        { num: 3, title: text.step3Title, desc: text.step3Desc }
                    ].map((step) => (
                        <div key={step.num} className="relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <div className="absolute -top-5 left-6 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-bold text-lg">
                                {step.num}
                            </div>
                            <h3 className="text-xl font-bold mt-4 mb-3">{step.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SEO Guide Section */}
            <section className="w-full bg-white dark:bg-gray-950 py-12 px-4 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-gray-100">{text.guideTitle}</h2>
                    <div className="space-y-12">
                        <article className="prose dark:prose-invert max-w-none">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{text.article1Title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{text.article1Content}</p>
                        </article>
                        <article className="prose dark:prose-invert max-w-none">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{text.article2Title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{text.article2Content}</p>
                        </article>
                    </div>
                </div>
            </section>

            {/* GPA Calculator Promo */}
            <section className="py-20 px-4 md:px-8 bg-blue-50 dark:bg-blue-900/10 border-y border-blue-100 dark:border-blue-900/30">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
                            <Calculator size={16} />
                            <span>New Feature</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">{text.gpaTitle}</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{text.gpaDesc}</p>
                        <Link href="/gpa-calculator" className="inline-flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5">
                            <Calculator size={20} />
                            <span>{text.gpaCta}</span>
                        </Link>
                    </div>
                    <div className="flex-1 flex justify-center order-1 md:order-2 w-full">
                        <div className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col gap-4 md:transform md:rotate-2 md:hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="text-xs font-mono text-gray-400">gpa-calc.exe</div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="font-medium">Calculus I</span>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm">AA</span>
                                        <span className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm">4.0</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="font-medium">Physics I</span>
                                    <div className="flex gap-2">
                                        <span className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm">BA</span>
                                        <span className="px-2 py-1 bg-white dark:bg-gray-600 rounded text-sm">3.5</span>
                                    </div>
                                </div>
                                <div className="mt-4 p-4 bg-blue-600 text-white rounded-xl flex justify-between items-center">
                                    <span className="font-bold opacity-80">Total GPA</span>
                                    <span className="text-2xl font-bold">3.75</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 md:px-8 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{text.faqTitle}</h2>
                <div className="space-y-8">
                    {[
                        { q: text.faq1Q, a: text.faq1A },
                        { q: text.faq2Q, a: text.faq2A },
                        { q: text.faq3Q, a: text.faq3A },
                        { q: text.faq4Q, a: text.faq4A }
                    ].map((faq, i) => (
                        <div key={i} className="border-b border-gray-200 dark:border-gray-800 pb-6">
                            <h3 className="text-lg font-bold mb-2">{faq.q}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 opacity-10 dark:opacity-20"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 dark:text-white tracking-tight">{text.ctaTitle}</h2>
                    <div className="flex justify-center items-center gap-4">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="group relative px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <span className="flex items-center gap-3">
                                {text.ctaButton}
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all"></div>
                        </button>
                    </div>
                    <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm font-medium">{text.ctaSubtext}</p>
                </div>
            </section>
        </div>
    );
}
