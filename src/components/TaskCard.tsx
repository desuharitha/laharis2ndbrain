import { Check, Trash2, ArrowRight } from 'lucide-react';
import type { Task, Quadrant } from '@/lib/types';
import { QUADRANT_META } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, q: Quadrant) => void;
}

const quadrantKeys: Quadrant[] = ['do', 'schedule', 'delegate', 'eliminate'];

export function TaskCard({ task, onToggle, onDelete, onMove }: Props) {
  return (
    <div className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 bg-secondary/50 border border-border/50 hover:border-border transition-all ${task.completed ? 'opacity-50' : ''}`}>
      <button
        onClick={() => onToggle(task.id)}
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-primary border-primary' : 'border-muted-foreground/40 hover:border-primary'}`}
      >
        {task.completed && <Check className="h-3 w-3 text-primary-foreground" />}
      </button>

      <span className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
        {task.title}
      </span>

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded hover:bg-muted">
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {quadrantKeys.filter(q => q !== task.quadrant).map(q => (
              <DropdownMenuItem key={q} onClick={() => onMove(task.id, q)}>
                {QUADRANT_META[q].icon} Move to {QUADRANT_META[q].label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <button onClick={() => onDelete(task.id)} className="p-1 rounded hover:bg-destructive/20">
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
        </button>
      </div>
    </div>
  );
}
