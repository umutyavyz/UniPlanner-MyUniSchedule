import { ScheduledCourse } from '@/types';
import { Settings } from '@/types/settings';
import { translations } from '@/lib/i18n';

interface CalendarProps {
  courses: ScheduledCourse[];
  settings: Settings;
}

const ALL_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const START_HOUR = 8;
const END_HOUR = 23;

export default function Calendar({ courses, settings }: CalendarProps) {
  const t = translations[settings.language];

  // Determine days to show
  let daysToShow = [...ALL_DAYS];
  if (!settings.showWeekend) {
    daysToShow = daysToShow.filter(d => d !== 'saturday' && d !== 'sunday');
  }
  if (settings.startOfWeek === 'sunday') {
    const sunday = daysToShow.find(d => d === 'sunday');
    if (sunday) {
      daysToShow = [sunday, ...daysToShow.filter(d => d !== 'sunday')];
    }
  }
  
  // If daily view, show only today (or Monday if weekend is hidden and today is weekend)
  if (settings.viewType === 'daily') {
    const today = new Date();
    const dayIndex = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const todayName = dayIndex === 0 ? 'sunday' : ALL_DAYS[dayIndex - 1];
    
    if (daysToShow.includes(todayName)) {
      daysToShow = [todayName];
    } else {
      daysToShow = [daysToShow[0]];
    }
  }

  // Generate time slots
  const totalMinutes = (END_HOUR - START_HOUR) * 60;
  const slotsCount = totalMinutes / settings.timeIncrement;
  const timeSlots = Array.from({ length: slotsCount + 1 }, (_, i) => {
    const totalMin = i * settings.timeIncrement;
    const hour = START_HOUR + Math.floor(totalMin / 60);
    const min = totalMin % 60;
    return { hour, min };
  });

  // Calculate height per hour
  // If minimizeHeight is true, use minHeight slider value as a factor (e.g. 5-15 -> 30px-90px)
  // Default 60px
  const hourHeight = settings.minimizeHeight ? (settings.minHeight * 6) : 60; 

  const formatTime = (hour: number, min: number) => {
    const h = settings.clockType === '12h' ? (hour % 12 || 12) : hour;
    const m = min.toString().padStart(2, '0');
    const suffix = settings.clockType === '12h' ? (hour >= 12 ? 'PM' : 'AM') : '';
    return `${h.toString().padStart(2, '0')}:${m}${suffix ? ' ' + suffix : ''}`;
  };

  const getCoursePosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const startMin = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMin = parseInt(endTime.split(':')[1]);

    const startTotalMinutes = (startHour - START_HOUR) * 60 + startMin;
    const endTotalMinutes = (endHour - START_HOUR) * 60 + endMin;
    const durationMinutes = endTotalMinutes - startTotalMinutes;

    return {
      top: `${(startTotalMinutes / 60) * hourHeight}px`,
      height: `${(durationMinutes / 60) * hourHeight}px`
    };
  };

  // Helper to map Turkish day names from data to English keys for logic
  const mapDayToKey = (dayName: string) => {
    const map: Record<string, string> = {
      'Pazartesi': 'monday',
      'Salı': 'tuesday',
      'Çarşamba': 'wednesday',
      'Perşembe': 'thursday',
      'Cuma': 'friday',
      'Cumartesi': 'saturday',
      'Pazar': 'sunday'
    };
    return map[dayName] || dayName.toLowerCase();
  };

  return (
    <div className="flex-1 h-full overflow-auto bg-white dark:bg-gray-900 relative flex flex-col transition-colors [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
      {/* Header */}
      <div className="flex border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-20 transition-colors min-w-[800px] lg:min-w-0">
        <div className="w-14 sm:w-20 shrink-0 border-r border-gray-100 dark:border-gray-800 sticky left-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-30"></div>
        {daysToShow.map(day => (
          <div key={day} className="flex-1 py-4 text-center font-semibold text-gray-900 dark:text-white border-r border-gray-100 dark:border-gray-800 last:border-r-0 capitalize text-sm sm:text-base tracking-tight">
            {t.days[day as keyof typeof t.days]}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex relative min-w-[800px] lg:min-w-0" style={{ minHeight: `${(END_HOUR - START_HOUR) * hourHeight}px` }}>
        {/* Time Column */}
        <div className="w-14 sm:w-20 shrink-0 border-r border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 transition-colors sticky left-0 z-30 backdrop-blur-[2px]">
          {timeSlots.map((slot, i) => {
             // Only show label for full hours or if increment is large enough
             if (slot.min !== 0 && settings.timeIncrement < 30) return null;
             
             const isLast = i === timeSlots.length - 1;

             return (
              <div 
                key={i} 
                className="relative w-full text-[11px] text-gray-400 dark:text-gray-500 flex items-start justify-end pr-3 font-medium tracking-wide"
                style={{ 
                  height: isLast ? '0' : `${hourHeight}px`,
                  lineHeight: '1',
                  paddingTop: '6px'
                }}
              >
                {formatTime(slot.hour, slot.min)}
              </div>
            );
          })}
        </div>

        {/* Days Columns */}
        {daysToShow.map(day => (
          <div key={day} className="flex-1 border-r border-gray-50 dark:border-gray-800/50 last:border-r-0 relative bg-white dark:bg-gray-900 transition-colors group">
            {/* Grid Lines */}
            {timeSlots.map((slot, i) => (
              <div 
                key={i} 
                className={`absolute w-full border-b ${slot.min === 0 ? 'border-gray-100 dark:border-gray-800' : 'border-gray-50 dark:border-gray-800/30 border-dashed'}`}
                style={{ 
                  top: `${(i * settings.timeIncrement / 60) * hourHeight}px`
                }}
              ></div>
            ))}

            {/* Courses */}
            {courses.map(course => {
              return course.schedule
                .filter(s => mapDayToKey(s.day) === day)
                .map((s, i) => {
                  const style = getCoursePosition(s.startTime, s.endTime);
                  const color = course.color || '#3b82f6';
                  return (
                    <div
                      key={`${course.id}-${i}`}
                      className="absolute left-1 right-1 rounded-lg p-2 text-sm overflow-hidden shadow-sm hover:shadow-md border-l-4 transition-all cursor-pointer z-10 animate-fade-in hover:z-20 group/card backdrop-blur-[2px] text-gray-900 dark:text-gray-100"
                      style={{ 
                        top: style.top, 
                        height: style.height,
                        backgroundColor: `${color}20`, // Slightly more visible
                        borderLeftColor: color,
                        borderTopColor: `${color}30`,
                        borderRightColor: `${color}30`,
                        borderBottomColor: `${color}30`,
                        borderWidth: '1px 1px 1px 4px'
                      }}
                    >
                      <div className="font-bold text-xs sm:text-sm leading-tight mb-0.5 flex items-center gap-1.5 flex-wrap" style={{ color: color }}>
                        {course.code}
                      </div>
                      <div className="truncate font-semibold text-xs text-gray-900 dark:text-gray-100 leading-tight">{course.name}</div>
                      <div className="truncate text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 font-medium">{course.instructor}</div>
                      {course.classroom && <div className="truncate text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-gray-400 inline-block"></span>
                        {course.classroom}
                      </div>}
                      <div className="absolute bottom-1 right-1 text-[9px] font-bold bg-white/80 dark:bg-gray-950/80 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400 backdrop-blur-md shadow-sm border border-gray-100 dark:border-gray-800">
                        {s.startTime} - {s.endTime}
                      </div>
                    </div>
                  );
                });
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
