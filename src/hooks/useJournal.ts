import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { JournalEntry } from '@/lib/types';

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useJournal() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setEntries([]); setLoading(false); return; }

    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data) {
        setEntries(data.map(e => ({
          id: e.id,
          date: e.date,
          gratitude: e.gratitude,
          wins: e.wins,
          lessons: e.lessons,
          tomorrow: e.tomorrow,
          freeform: e.freeform,
          morningPages: e.morning_pages,
          createdAt: new Date(e.created_at).getTime(),
          updatedAt: new Date(e.updated_at).getTime(),
        })));
      }
      setLoading(false);
    };

    fetchEntries();
  }, [user]);

  const getEntry = useCallback((date: string): JournalEntry | undefined => {
    return entries.find(e => e.date === date);
  }, [entries]);

  const getTodayEntry = useCallback((): JournalEntry | undefined => {
    return getEntry(todayKey());
  }, [getEntry]);

  const saveEntry = useCallback(async (date: string, fields: Partial<Pick<JournalEntry, 'gratitude' | 'wins' | 'lessons' | 'tomorrow' | 'freeform' | 'morningPages'>>) => {
    if (!user) return;

    // Map camelCase to snake_case for DB
    const dbFields: Record<string, string> = {};
    if (fields.gratitude !== undefined) dbFields.gratitude = fields.gratitude;
    if (fields.wins !== undefined) dbFields.wins = fields.wins;
    if (fields.lessons !== undefined) dbFields.lessons = fields.lessons;
    if (fields.tomorrow !== undefined) dbFields.tomorrow = fields.tomorrow;
    if (fields.freeform !== undefined) dbFields.freeform = fields.freeform;
    if (fields.morningPages !== undefined) dbFields.morning_pages = fields.morningPages;

    const existing = entries.find(e => e.date === date);

    if (existing) {
      const { error } = await supabase.from('journal_entries').update(dbFields).eq('id', existing.id);
      if (!error) {
        setEntries(prev => prev.map(e => e.date === date ? { ...e, ...fields, updatedAt: Date.now() } : e));
      }
    } else {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({ user_id: user.id, date, ...dbFields })
        .select()
        .single();

      if (!error && data) {
        const entry: JournalEntry = {
          id: data.id, date: data.date,
          gratitude: data.gratitude, wins: data.wins,
          lessons: data.lessons, tomorrow: data.tomorrow,
          freeform: data.freeform, morningPages: data.morning_pages,
          createdAt: new Date(data.created_at).getTime(),
          updatedAt: new Date(data.updated_at).getTime(),
        };
        setEntries(prev => [entry, ...prev]);
      }
    }
  }, [user, entries]);

  const deleteEntry = useCallback(async (date: string) => {
    const existing = entries.find(e => e.date === date);
    if (!existing) return;
    const { error } = await supabase.from('journal_entries').delete().eq('id', existing.id);
    if (!error) setEntries(prev => prev.filter(e => e.date !== date));
  }, [entries]);

  const sortedEntries = [...entries].sort((a, b) => b.date.localeCompare(a.date));

  return { entries: sortedEntries, getEntry, getTodayEntry, saveEntry, deleteEntry, todayKey, loading };
}
