import type { Task, ParaCategory, Quadrant, CodeStage } from '@/lib/types';
import { PARA_META } from '@/lib/types';
import { TaskCard } from './TaskCard';

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, q: Quadrant) => void;
  onSetPara: (id: string, p: ParaCategory) => void;
  onSetCodeStage: (id: string, s: CodeStage) => void;
  byPara: (p: ParaCategory) => Task[];
}

const paraKeys: ParaCategory[] = ['projects', 'areas', 'resources', 'archive'];

const borderColors: Record<ParaCategory, string> = {
  projects: 'border-t-quadrant-do',
  areas: 'border-t-quadrant-schedule',
  resources: 'border-t-quadrant-delegate',
  archive: 'border-t-muted-foreground',
};

export function ParaView({ tasks, onToggle, onDelete, onMove, onSetPara, onSetCodeStage, byPara }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-sm font-mono font-semibold text-foreground">PARA Method</h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">Projects · Areas · Resources · Archive</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paraKeys.map(p => {
          const items = byPara(p);
          const meta = PARA_META[p];
          const active = items.filter(t => !t.completed);
          const done = items.filter(t => t.completed);

          return (
            <div
              key={p}
              className={`rounded-xl border border-border bg-card p-4 border-t-2 ${borderColors[p]} flex flex-col min-h-[180px]`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className={`text-sm font-mono font-semibold flex items-center gap-2 ${meta.color}`}>
                    <span>{meta.icon}</span>
                    {meta.label}
                  </h3>
                  <p className="text-xs text-muted-foreground">{meta.description}</p>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{active.length}</span>
              </div>

              <div className="space-y-2 flex-1">
                {active.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onMove={onMove}
                    onSetPara={onSetPara}
                    onSetCodeStage={onSetCodeStage}
                    showMeta
                  />
                ))}
                {done.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onMove={onMove}
                    onSetPara={onSetPara}
                    onSetCodeStage={onSetCodeStage}
                    showMeta
                  />
                ))}
                {items.length === 0 && (
                  <p className="text-xs text-muted-foreground/50 text-center py-6">Empty</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
