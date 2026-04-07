import type { Task, Quadrant, ParaCategory, CodeStage } from '@/lib/types';
import { QUADRANT_META } from '@/lib/types';
import { TaskCard } from './TaskCard';

interface Props {
  quadrant: Quadrant;
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, q: Quadrant) => void;
  onSetPara?: (id: string, p: ParaCategory) => void;
  onSetCodeStage?: (id: string, s: CodeStage) => void;
}

const borderColors: Record<Quadrant, string> = {
  do: 'border-t-quadrant-do',
  schedule: 'border-t-quadrant-schedule',
  delegate: 'border-t-quadrant-delegate',
  eliminate: 'border-t-quadrant-eliminate',
};

const glowColors: Record<Quadrant, string> = {
  do: 'shadow-quadrant-do/5',
  schedule: 'shadow-quadrant-schedule/5',
  delegate: 'shadow-quadrant-delegate/5',
  eliminate: 'shadow-quadrant-eliminate/5',
};

export function QuadrantPanel({ quadrant, tasks, onToggle, onDelete, onMove, onSetPara, onSetCodeStage }: Props) {
  const meta = QUADRANT_META[quadrant];
  const active = tasks.filter(t => !t.completed);
  const done = tasks.filter(t => t.completed);

  return (
    <div className={`rounded-xl border border-border bg-card p-4 border-t-2 ${borderColors[quadrant]} shadow-lg ${glowColors[quadrant]} flex flex-col min-h-[200px]`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-mono font-semibold flex items-center gap-2">
            <span>{meta.icon}</span>
            {meta.label}
          </h3>
          <p className="text-xs text-muted-foreground">{meta.subtitle}</p>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{active.length}</span>
      </div>
      <div className="space-y-2 flex-1">
        {active.map(t => (
          <TaskCard key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} onMove={onMove} onSetPara={onSetPara} onSetCodeStage={onSetCodeStage} showMeta />
        ))}
        {done.map(t => (
          <TaskCard key={t.id} task={t} onToggle={onToggle} onDelete={onDelete} onMove={onMove} onSetPara={onSetPara} onSetCodeStage={onSetCodeStage} showMeta />
        ))}
        {tasks.length === 0 && (
          <p className="text-xs text-muted-foreground/50 text-center py-6">No tasks yet</p>
        )}
      </div>
    </div>
  );
}
