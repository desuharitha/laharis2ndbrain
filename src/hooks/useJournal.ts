import { useState, useCallback, useEffect } from 'react';
import type { JournalEntry } from '@/lib/types';

const STORAGE_KEY = 'laharis2ndbrain-journal';

function loadEntries(): JournalEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(loadEntries);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const getEntry = useCallback((date: string): JournalEntry | undefined => {
    return entries.find(e => e.date === date);
  }, [entries]);

  const getTodayEntry = useCallback((): JournalEntry | undefined => {
    return getEntry(todayKey());
  }, [getEntry]);

  const saveEntry = useCallback((date: string, fields: Partial<Pick<JournalEntry, 'gratitude' | 'wins' | 'lessons' | 'tomorrow' | 'freeform' | 'morningPages'>>) => {
    setEntries(prev => {
      const existing = prev.find(e => e.date === date);
      if (existing) {
        return prev.map(e => e.date === date ? { ...e, ...fields, updatedAt: Date.now() } : e);
      }
      const entry: JournalEntry = {
        id: crypto.randomUUID(),
        date,
        gratitude: '',
        wins: '',
        lessons: '',
        tomorrow: '',
        freeform: '',
        morningPages: '',
        ...fields,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return [entry, ...prev];
    });
  }, []);

  const deleteEntry = useCallback((date: string) => {
    setEntries(prev => prev.filter(e => e.date !== date));
  }, []);

  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return { entries: sortedEntries, getEntry, getTodayEntry, saveEntry, deleteEntry, todayKey };
}
