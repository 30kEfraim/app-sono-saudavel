// Tipos do SleepTracker

export type SleepQuality = 'ruim' | 'regular' | 'bom';

export interface SleepRecord {
  id: string;
  date: string; // formato YYYY-MM-DD
  bedTime: string; // formato HH:mm
  wakeTime: string; // formato HH:mm
  quality: SleepQuality;
  hoursSlept: number;
}

export interface UserProfile {
  name: string;
  age: number;
  goal: string;
}

export const SLEEP_GOALS = [
  'Dormir mais rápido',
  'Parar de acordar à noite',
  'Dormir mais horas',
  'Melhorar qualidade do sono',
  'Criar uma rotina',
];
