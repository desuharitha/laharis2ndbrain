import { Brain, CheckCircle2, Flame } from 'lucide-react';

interface Props {
  total: number;
  completed: number;
  active: number;
}

export function StatsBar({ total, completed, active }: Props) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="flex gap-6 items-center">
      <div className="flex items-center gap-2 text-sm">
        <Brain className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Captured:</span>
        <span className="font-mono font-semibold text-foreground">{total}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Flame className="h-4 w-4 text-quadrant-do" />
        <span className="text-muted-foreground">Active:</span>
        <span className="font-mono font-semibold text-foreground">{active}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <CheckCircle2 className="h-4 w-4 text-success" />
        <span className="text-muted-foreground">Done:</span>
        <span className="font-mono font-semibold text-foreground">{completed}</span>
        {total > 0 && <span className="text-xs text-muted-foreground">({pct}%)</span>}
      </div>
    </div>
  );
}
