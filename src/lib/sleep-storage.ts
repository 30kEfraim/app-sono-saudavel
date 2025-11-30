import { SleepRecord, UserProfile } from './types';

const STORAGE_KEYS = {
  RECORDS: 'sleeptracker_records',
  PROFILE: 'sleeptracker_profile',
};

// Helper to check if we're in browser
const isBrowser = typeof window !== 'undefined';

export function getSleepRecords(): SleepRecord[] {
  if (!isBrowser) return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading sleep records:', error);
    return [];
  }
}

export function saveSleepRecord(record: SleepRecord): void {
  if (!isBrowser) return;
  
  try {
    const records = getSleepRecords();
    const existingIndex = records.findIndex(r => r.date === record.date);
    
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }
    
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving sleep record:', error);
  }
}

export function getTodayRecord(): SleepRecord | null {
  if (!isBrowser) return null;
  
  try {
    const today = new Date().toISOString().split('T')[0];
    const records = getSleepRecords();
    return records.find(r => r.date === today) || null;
  } catch (error) {
    console.error('Error getting today record:', error);
    return null;
  }
}

export function getUserProfile(): UserProfile | null {
  if (!isBrowser) return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading user profile:', error);
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
  }
}

export function calculateHoursSlept(bedTime: string, wakeTime: string): number {
  try {
    const [bedHour, bedMinute] = bedTime.split(':').map(Number);
    const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
    
    let bedMinutes = bedHour * 60 + bedMinute;
    let wakeMinutes = wakeHour * 60 + wakeMinute;
    
    // If wake time is earlier than bed time, it means next day
    if (wakeMinutes < bedMinutes) {
      wakeMinutes += 24 * 60;
    }
    
    const totalMinutes = wakeMinutes - bedMinutes;
    return Math.round((totalMinutes / 60) * 10) / 10;
  } catch (error) {
    console.error('Error calculating hours slept:', error);
    return 0;
  }
}
