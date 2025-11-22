export type Settings = {
  clockType: '12h' | '24h';
  viewType: 'daily' | 'weekly';
  showWeekend: boolean;
  startOfWeek: 'monday' | 'sunday';
  timeIncrement: 15 | 30 | 60;
  minimizeHeight: boolean;
  minHeight: number;
  language: 'en' | 'tr';
};

export const defaultSettings: Settings = {
  clockType: '24h',
  viewType: 'weekly',
  showWeekend: true,
  startOfWeek: 'monday',
  timeIncrement: 60,
  minimizeHeight: false,
  minHeight: 10,
  language: 'tr',
};
