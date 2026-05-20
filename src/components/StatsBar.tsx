import { Brain, CheckCircle2, Flame } from 'lucide-react';

interface Props {
  total: number;
  completed: number;
  active: number;
}

export function StatsBar({ total, completed, active }: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex gap-3 sm:gap-6 items-center justify-around sm:justify-start rounded-lg sm:rounded-none bg-secondary/40 sm:bg-transparent px-3 py-2 sm:p-0">
      <div className="flex items-center gap-1.5 text-xs sm:text-sm">
        <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
        <span className="text-muted-foreground hidden xs:inline">Captured:</span>
        <span className="font-mono font-semibold text-foreground">{total}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs sm:text-sm">
        <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-quadrant-do" />
        <span className="text-muted-foreground hidden xs:inline">Active:</span>
        <span className="font-mono font-semibold text-foreground">{active}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xs sm:text-sm">
        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
        <span className="text-muted-foreground hidden xs:inline">Done:</span>
        <span className="font-mono font-semibold text-foreground">{completed}</span>
        {total > 0 && <span className="text-[10px] sm:text-xs text-muted-foreground">({pct}%)</span>}
      </div>
    </div>
  );
}

