import { Check, Trash2, ArrowRight, FolderOpen, Zap } from 'lucide-react';
import type { Task, Quadrant, ParaCategory, CodeStage } from '@/lib/types';
import { QUADRANT_META, PARA_META, CODE_META } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, q: Quadrant) => void;
  onSetPara?: (id: string, p: ParaCategory) => void;
  onSetCodeStage?: (id: string, s: CodeStage) => void;
  showMeta?: boolean;
}

const quadrantKeys: Quadrant[] = ['do', 'schedule', 'delegate', 'eliminate'];
const paraKeys: ParaCategory[] = ['projects', 'areas', 'resources', 'archive'];
const codeKeys: CodeStage[] = ['capture', 'organize', 'distill', 'express'];

const codeBadgeColors: Record<CodeStage, string> = {
  capture: 'bg-code-capture/20 text-code-capture',
  organize: 'bg-code-organize/20 text-code-organize',
  distill: 'bg-code-distill/20 text-code-distill',
  express: 'bg-code-express/20 text-code-express',
};

export function TaskCard({ task, onToggle, onDelete, onMove, onSetPara, onSetCodeStage, showMeta = false }: Props) {
  return (
    <div className={`group flex items-start gap-3 rounded-lg px-3 py-2.5 bg-secondary/50 border border-border/50 hover:border-border transition-all ${task.completed ? 'opacity-50' : ''}`}>
      <button
        onClick={() => onToggle(task.id)}
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors mt-0.5 ${task.completed ? 'bg-primary border-primary' : 'border-muted-foreground/40 hover:border-primary'}`}
      >
        {task.completed && <Check className="h-3 w-3 text-primary-foreground" />}
      </button>

      <div className="flex-1 min-w-0">
        <span className={`text-sm block ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
          {task.title}
        </span>
        {showMeta && (
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${codeBadgeColors[task.codeStage]}`}>
              {CODE_META[task.codeStage].icon} {CODE_META[task.codeStage].label}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {PARA_META[task.para].icon} {PARA_META[task.para].label}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-muted">
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs">Eisenhower</DropdownMenuLabel>
            {quadrantKeys.filter(q => q !== task.quadrant).map(q => (
              <DropdownMenuItem key={q} onClick={() => onMove(task.id, q)}>
                {QUADRANT_META[q].icon} {QUADRANT_META[q].label}
              </DropdownMenuItem>
            ))}
            {onSetPara && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">PARA</DropdownMenuLabel>
                {paraKeys.filter(p => p !== task.para).map(p => (
                  <DropdownMenuItem key={p} onClick={() => onSetPara(task.id, p)}>
                    {PARA_META[p].icon} {PARA_META[p].label}
                  </DropdownMenuItem>
                ))}
              </>
            )}
            {onSetCodeStage && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs">CODE Stage</DropdownMenuLabel>
                {codeKeys.filter(s => s !== task.codeStage).map(s => (
                  <DropdownMenuItem key={s} onClick={() => onSetCodeStage(task.id, s)}>
                    {CODE_META[s].icon} {CODE_META[s].label}
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <button onClick={() => onDelete(task.id)} className="p-1 rounded hover:bg-destructive/20">
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
        </button>
      </div>
    </div>
  );
}
