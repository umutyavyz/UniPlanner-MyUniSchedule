export type CourseType = 'Zorunlu' | 'Seçmeli';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  classroom?: string;
  credits: number;
  type: CourseType;
  color?: string;
  schedule: {
    day: 'Pazartesi' | 'Salı' | 'Çarşamba' | 'Perşembe' | 'Cuma' | 'Cumartesi' | 'Pazar';
    startTime: string; // Format "HH:mm" e.g. "09:00"
    endTime: string;   // Format "HH:mm" e.g. "10:00"
  }[];
}

export interface ScheduledCourse extends Course {
  color?: string;
}
