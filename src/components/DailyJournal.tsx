import { useState, useMemo } from 'react';
import { format, parseISO, isToday, isYesterday, subDays } from 'date-fns';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, Trophy, Lightbulb, ArrowRight, PenLine, Trash2, Sun, AlignLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { JournalEntry, Task } from '@/lib/types';

const MORNING_PAGES_TARGET = 750; // ~3 pages worth of words

interface Props {
  entries: JournalEntry[];
  getEntry: (date: string) => JournalEntry | undefined;
  saveEntry: (date: string, fields: Partial<Pick<JournalEntry, 'gratitude' | 'wins' | 'lessons' | 'tomorrow' | 'freeform' | 'morningPages'>>) => void;
  deleteEntry: (date: string) => void;
  todayKey: () => string;
  tasks: Task[];
}

const promptSections = [
  { key: 'gratitude' as const, label: 'Gratitude', icon: Sparkles, placeholder: "What am I grateful for today?", color: 'text-primary' },
  { key: 'wins' as const, label: 'Wins', icon: Trophy, placeholder: "What did I accomplish today?", color: 'text-success' },
  { key: 'lessons' as const, label: 'Lessons Learned', icon: Lightbulb, placeholder: "What did I learn today?", color: 'text-quadrant-schedule' },
  { key: 'tomorrow' as const, label: 'Tomorrow\'s Focus', icon: ArrowRight, placeholder: "What's my #1 priority for tomorrow?", color: 'text-quadrant-delegate' },
  { key: 'freeform' as const, label: 'Free Thoughts', icon: PenLine, placeholder: "Stream of consciousness...", color: 'text-muted-foreground' },
];

function formatDateLabel(dateStr: string): string {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'EEEE, MMM d');
}

export function DailyJournal({ entries, getEntry, saveEntry, deleteEntry, todayKey, tasks }: Props) {
  const today = todayKey();
  const [selectedDate, setSelectedDate] = useState(today);
  const entry = getEntry(selectedDate);

  const [localValues, setLocalValues] = useState<Record<string, string>>({});

  const getValue = (key: string) => {
    if (localValues[key] !== undefined) return localValues[key];
    return entry ? (entry as any)[key] || '' : '';
  };

  const handleChange = (key: string, value: string) => {
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleBlur = (key: string) => {
    const val = getValue(key);
    saveEntry(selectedDate, { [key]: val });
    setLocalValues(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const navigateDate = (direction: -1 | 1) => {
    const d = parseISO(selectedDate);
    const newDate = direction === 1
      ? new Date(d.getTime() + 86400000)
      : new Date(d.getTime() - 86400000);
    const newKey = newDate.toISOString().slice(0, 10);
    if (newKey <= today) {
      setSelectedDate(newKey);
      setLocalValues({});
    }
  };

  // Tasks completed today
  const todayStart = new Date(selectedDate).setHours(0, 0, 0, 0);
  const todayEnd = todayStart + 86400000;
  const completedToday = tasks.filter(t => t.completed && t.createdAt >= todayStart && t.createdAt < todayEnd);

  // Streak calculation
  const streak = useMemo(() => {
    let count = 0;
    let checkDate = today;
    while (true) {
      const e = getEntry(checkDate);
      const hasContent = e && (e.gratitude || e.wins || e.lessons || e.tomorrow || e.freeform);
      if (!hasContent && checkDate !== today) break;
      if (hasContent) count++;
      const d = parseISO(checkDate);
      checkDate = new Date(d.getTime() - 86400000).toISOString().slice(0, 10);
    }
    return count;
  }, [entries, today, getEntry]);

  const hasContent = entry && (entry.gratitude || entry.wins || entry.lessons || entry.tomorrow || entry.freeform);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-sm font-mono font-semibold text-foreground">Daily Reflection</h2>
        <div className="flex-1 h-px bg-border" />
        {streak > 0 && (
          <span className="text-xs text-primary font-mono">🔥 {streak} day streak</span>
        )}
      </div>

      {/* Date navigator */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
        <button
          onClick={() => navigateDate(-1)}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="text-center">
          <p className="text-sm font-mono font-semibold text-foreground">{formatDateLabel(selectedDate)}</p>
          <p className="text-[10px] text-muted-foreground">{format(parseISO(selectedDate), 'MMMM d, yyyy')}</p>
        </div>
        <button
          onClick={() => navigateDate(1)}
          disabled={selectedDate >= today}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-20"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Journal prompts */}
      <div className="space-y-3">
        {promptSections.map(section => {
          const Icon = section.icon;
          return (
            <div key={section.key} className="rounded-xl border border-border bg-card p-3">
              <label className={`flex items-center gap-2 text-xs font-mono font-semibold mb-2 ${section.color}`}>
                <Icon className="h-3.5 w-3.5" />
                {section.label}
              </label>
              <Textarea
                value={getValue(section.key)}
                onChange={e => handleChange(section.key, e.target.value)}
                onBlur={() => handleBlur(section.key)}
                placeholder={section.placeholder}
                className="text-sm min-h-[70px] bg-muted/30 border-border/50 placeholder:text-muted-foreground/40 resize-none"
              />
            </div>
          );
        })}
      </div>

      {/* Today's completed tasks */}
      {completedToday.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-3">
          <h3 className="text-xs font-mono font-semibold text-success flex items-center gap-2 mb-2">
            ✅ Completed ({completedToday.length})
          </h3>
          <ul className="space-y-1">
            {completedToday.map(t => (
              <li key={t.id} className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-success shrink-0" />
                {t.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Past entries list */}
      {entries.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-3">
          <h3 className="text-xs font-mono font-semibold text-foreground mb-3 flex items-center gap-2">
            <BookOpen className="h-3.5 w-3.5" />
            Past Reflections
          </h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {entries.filter(e => e.date !== selectedDate).slice(0, 14).map(e => {
              const preview = e.gratitude || e.wins || e.lessons || e.freeform || '';
              return (
                <button
                  key={e.id}
                  onClick={() => { setSelectedDate(e.date); setLocalValues({}); }}
                  className={`w-full text-left p-2 rounded-lg border transition-all ${
                    e.date === selectedDate ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-border bg-secondary/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-foreground">{formatDateLabel(e.date)}</span>
                    <span className="text-[10px] text-muted-foreground">{format(parseISO(e.date), 'MMM d')}</span>
                  </div>
                  {preview && (
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{preview}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
