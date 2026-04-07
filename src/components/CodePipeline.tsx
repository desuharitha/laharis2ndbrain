import type { Task, Quadrant, ParaCategory, CodeStage } from '@/lib/types';
import { CODE_META } from '@/lib/types';
import { TaskCard } from './TaskCard';

interface Props {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, q: Quadrant) => void;
  onSetPara: (id: string, p: ParaCategory) => void;
  onSetCodeStage: (id: string, s: CodeStage) => void;
  byCodeStage: (s: CodeStage) => Task[];
}

const codeKeys: CodeStage[] = ['capture', 'organize', 'distill', 'express'];

const borderColors: Record<CodeStage, string> = {
  capture: 'border-t-code-capture',
  organize: 'border-t-code-organize',
  distill: 'border-t-code-distill',
  express: 'border-t-code-express',
};

const textColors: Record<CodeStage, string> = {
  capture: 'text-code-capture',
  organize: 'text-code-organize',
  distill: 'text-code-distill',
  express: 'text-code-express',
};

const dotColors: Record<CodeStage, string> = {
  capture: 'bg-code-capture',
  organize: 'bg-code-organize',
  distill: 'bg-code-distill',
  express: 'bg-code-express',
};

export function CodePipeline({ tasks, onToggle, onDelete, onMove, onSetPara, onSetCodeStage, byCodeStage }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-sm font-mono font-semibold text-foreground">CODE Pipeline</h2>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">Capture → Organize → Distill → Express</span>
      </div>

      {/* Pipeline progress bar */}
      <div className="flex items-center gap-1 px-2">
        {codeKeys.map((stage, i) => {
          const count = byCodeStage(stage).filter(t => !t.completed).length;
          return (
            <div key={stage} className="flex-1 flex items-center gap-1">
              <div className="flex-1 text-center">
                <div className={`text-[10px] font-mono uppercase tracking-wider ${textColors[stage]}`}>
                  {CODE_META[stage].icon} {CODE_META[stage].label}
                </div>
                <div className={`h-1.5 rounded-full mt-1 ${dotColors[stage]}/20`}>
                  <div
                    className={`h-full rounded-full ${dotColors[stage]} transition-all`}
                    style={{ width: count > 0 ? '100%' : '0%', opacity: count > 0 ? 1 : 0.2 }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{count}</span>
              </div>
              {i < codeKeys.length - 1 && (
                <span className="text-muted-foreground/30 text-xs mt-[-8px]">→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Stage columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {codeKeys.map(stage => {
          const items = byCodeStage(stage);
          const meta = CODE_META[stage];
          const active = items.filter(t => !t.completed);
          const done = items.filter(t => t.completed);

          return (
            <div
              key={stage}
              className={`rounded-xl border border-border bg-card p-3 border-t-2 ${borderColors[stage]} flex flex-col min-h-[160px]`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`text-xs font-mono font-semibold ${textColors[stage]}`}>
                  Step {meta.step}: {meta.label}
                </h3>
                <span className="text-[10px] text-muted-foreground font-mono">{active.length}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">{meta.description}</p>

              <div className="space-y-1.5 flex-1">
                {active.map(t => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onMove={onMove}
                    onSetPara={onSetPara}
                    onSetCodeStage={onSetCodeStage}
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
                  />
                ))}
                {items.length === 0 && (
                  <p className="text-[10px] text-muted-foreground/40 text-center py-4">Empty</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
