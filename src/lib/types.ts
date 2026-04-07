export type Quadrant = 'do' | 'schedule' | 'delegate' | 'eliminate';

export interface Task {
  id: string;
  title: string;
  quadrant: Quadrant;
  completed: boolean;
  createdAt: number;
  note?: string;
}

export const QUADRANT_META: Record<Quadrant, { label: string; subtitle: string; icon: string }> = {
  do: { label: 'Do', subtitle: 'Urgent & Important', icon: '🔥' },
  schedule: { label: 'Schedule', subtitle: 'Important, Not Urgent', icon: '📅' },
  delegate: { label: 'Delegate', subtitle: 'Urgent, Not Important', icon: '🤝' },
  eliminate: { label: 'Eliminate', subtitle: 'Neither', icon: '🗑️' },
};
