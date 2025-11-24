import React from 'react';
import { Settings } from '@/types/settings';
import { translations } from '@/lib/i18n';

interface SEOContentProps {
  settings: Settings;
}

export default function SEOContent({ settings }: SEOContentProps) {
  const isTr = settings.language === 'tr';

  return (
    <section className="w-full bg-white dark:bg-gray-950 py-12 px-4 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto prose dark:prose-invert">
        <article>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            {isTr ? 'Üniversite Ders Programı Çakışma Önleyici ve Planlayıcı' : 'University Course Schedule Conflict Preventer & Planner'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {isTr 
              ? 'UniPlanner Pro, üniversite öğrencilerinin akademik hayatlarını düzenlemelerine yardımcı olan kapsamlı bir ders programı hazırlama aracıdır. Özellikle ders seçim dönemlerinde yaşanan "ders çakışması" sorununu ortadan kaldırmak için tasarlanmıştır. Manuel olarak kağıt üzerinde veya Excel tablolarında saatlerce uğraşmak yerine, derslerinizi sisteme girerek saniyeler içinde çakışma kontrolü yapabilir ve en optimize programı oluşturabilirsiniz.'
              : 'UniPlanner Pro is a comprehensive course scheduling tool designed to help university students organize their academic lives. It is specifically designed to eliminate the "course conflict" problem experienced during course selection periods. Instead of spending hours manually on paper or Excel sheets, you can enter your courses into the system to check for conflicts in seconds and create the most optimized schedule.'}
          </p>

          <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-200">
            {isTr ? 'Ders Programı Çakışma Kontrolü Nasıl Yapılır?' : 'How to Check for Course Schedule Conflicts?'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {isTr
              ? 'Ders programı hazırlarken en büyük zorluk, seçmeli ve zorunlu derslerin saatlerinin çakışıp çakışmadığını kontrol etmektir. UniPlanner Pro\'nun akıllı algoritması sayesinde:'
              : 'The biggest challenge when preparing a course schedule is checking whether elective and compulsory course times conflict. Thanks to UniPlanner Pro\'s smart algorithm:'}
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-600 dark:text-gray-400 mb-6">
            <li>
              <strong>{isTr ? 'Otomatik Çakışma Tespiti:' : 'Automatic Conflict Detection:'}</strong> 
              {isTr ? ' Eklediğiniz dersin saati, mevcut programınızdaki başka bir dersle çakışıyorsa sistem sizi anında uyarır.' : ' If the time of the course you added conflicts with another course in your current schedule, the system warns you immediately.'}
            </li>
            <li>
              <strong>{isTr ? 'Görsel Planlama:' : 'Visual Planning:'}</strong> 
              {isTr ? ' Derslerinizi haftalık takvim üzerinde renk kodlarıyla görerek boş günlerinizi ve çalışma saatlerinizi kolayca ayarlayabilirsiniz.' : ' You can easily arrange your free days and study hours by seeing your courses with color codes on the weekly calendar.'}
            </li>
            <li>
              <strong>{isTr ? 'Alternatif Senaryolar:' : 'Alternative Scenarios:'}</strong> 
              {isTr ? ' Farklı ders kombinasyonlarını deneyerek sizin için en verimli programı oluşturabilirsiniz.' : ' You can create the most efficient schedule for you by trying different course combinations.'}
            </li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-200">
            {isTr ? 'Üniversite Ders Programı Hazırlama İpuçları' : 'University Course Schedule Preparation Tips'}
          </h3>
          <div className="space-y-4 text-gray-600 dark:text-gray-400">
            <p>
              <strong>1. {isTr ? 'Kredi Yükünü Dengeleyin:' : 'Balance Credit Load:'}</strong> 
              {isTr ? ' Zorunlu derslerin yanına seçeceğiniz seçmeli derslerin zorluk derecesini ve kredi yükünü dengeli dağıtın. Tek bir güne çok fazla ağır ders koymaktan kaçının.' : ' Balance the difficulty and credit load of the elective courses you choose alongside compulsory courses. Avoid putting too many heavy courses on a single day.'}
            </p>
            <p>
              <strong>2. {isTr ? 'Kampüs Mesafeleri:' : 'Campus Distances:'}</strong> 
              {isTr ? ' Dersleriniz farklı fakültelerde veya kampüslerdeyse, ders aralarındaki yürüme mesafesini ve ulaşım süresini hesaba katın.' : ' If your courses are in different faculties or campuses, consider the walking distance and transportation time between courses.'}
            </p>
            <p>
              <strong>3. {isTr ? 'Verimli Çalışma Blokları:' : 'Productive Study Blocks:'}</strong> 
              {isTr ? ' Ders aralarında kütüphanede çalışmak veya dinlenmek için yeterli boşluklar bırakın. Blok dersler konsantrasyonu zorlayabilir.' : ' Leave enough gaps between classes to study in the library or rest. Block classes can strain concentration.'}
            </p>
          </div>

          <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800 dark:text-gray-200">
            {isTr ? 'Neden UniPlanner Pro?' : 'Why UniPlanner Pro?'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {isTr
              ? 'UniPlanner Pro, sadece bir takvim uygulaması değildir. Öğrencilerin akademik başarılarını artırmayı hedefleyen bir verimlilik aracıdır. Oluşturduğunuz programı PDF veya resim (PNG) formatında indirebilir, telefonunuzun takvimine (.ics) entegre edebilirsiniz. Verileriniz tamamen tarayıcınızda saklanır, gizliliğiniz ön plandadır.'
              : 'UniPlanner Pro is not just a calendar app. It is a productivity tool aimed at increasing students\' academic success. You can download the schedule you created in PDF or image (PNG) format and integrate it into your phone\'s calendar (.ics). Your data is stored entirely in your browser, prioritizing your privacy.'}
          </p>
        </article>
      </div>
    </section>
  );
}
