import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 py-12 flex-1">
        <Link href="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home / Ana Sayfaya Dön
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                <Shield size={32} />
            </div>
            <h1 className="text-4xl font-bold">Privacy Policy / Gizlilik Politikası</h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none space-y-12">
          
          {/* English Section */}
          <section className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded uppercase tracking-wide">English</span>
                Privacy Policy
            </h2>
            
            <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <p>
                    At UniPlanner Pro, accessible from myunischedule.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by UniPlanner Pro and how we use it.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Lock size={18} /> Data Storage
                </h3>
                <p>
                    UniPlanner Pro operates on a "Local-First" principle. We do not store your schedule data, course information, or personal preferences on our servers. All data generated within the application is stored locally in your browser's LocalStorage. This means your data never leaves your device unless you explicitly choose to export or share it.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Eye size={18} /> Information Collection
                </h3>
                <p>
                    We do not collect any personal identification information (PII) such as names, email addresses, or phone numbers. The application is designed to be used anonymously without any registration requirement.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Third Party Privacy Policies</h3>
                <p>
                    UniPlanner Pro's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Us</h3>
                <p>
                    If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <a href="mailto:support@myunischedule.com" className="text-blue-600 hover:underline">support@myunischedule.com</a>.
                </p>
            </div>
          </section>

          {/* Turkish Section */}
          <section className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded uppercase tracking-wide">Türkçe</span>
                Gizlilik Politikası
            </h2>
            
            <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <p>
                    myunischedule.com üzerinden erişilen UniPlanner Pro'da, ziyaretçilerimizin gizliliği ana önceliklerimizden biridir. Bu Gizlilik Politikası belgesi, UniPlanner Pro tarafından toplanan ve kaydedilen bilgi türlerini ve bunları nasıl kullandığımızı içerir.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Lock size={18} /> Veri Depolama
                </h3>
                <p>
                    UniPlanner Pro, "Önce Yerel" (Local-First) prensibiyle çalışır. Ders programı verilerinizi, ders bilgilerinizi veya kişisel tercihlerinizi sunucularımızda saklamayız. Uygulama içinde oluşturulan tüm veriler, tarayıcınızın Yerel Depolama (LocalStorage) alanında yerel olarak saklanır. Bu, verilerinizin siz açıkça dışa aktarmayı veya paylaşmayı seçmediğiniz sürece cihazınızdan asla çıkmadığı anlamına gelir.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Eye size={18} /> Bilgi Toplama
                </h3>
                <p>
                    İsim, e-posta adresi veya telefon numarası gibi herhangi bir kişisel tanımlayıcı bilgi (PII) toplamıyoruz. Uygulama, herhangi bir kayıt gereksinimi olmadan anonim olarak kullanılmak üzere tasarlanmıştır.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">İletişim</h3>
                <p>
                    Gizlilik Politikamız hakkında daha fazla bilgiye ihtiyacınız varsa veya sorularınız varsa, bizimle <a href="mailto:support@myunischedule.com" className="text-blue-600 hover:underline">support@myunischedule.com</a> adresinden iletişime geçmekten çekinmeyin.
                </p>
            </div>
          </section>

        </div>
      </div>
      
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm mt-auto">
        <p>© 2025 UniPlanner Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
