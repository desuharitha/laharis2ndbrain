import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Quadrant, ParaCategory } from '@/lib/types';
import { QUADRANT_META, PARA_META } from '@/lib/types';

interface Props {
  onAdd: (title: string, quadrant: Quadrant, para: ParaCategory) => void;
}

const quadrantKeys: Quadrant[] = ['do', 'schedule', 'delegate', 'eliminate'];
const paraKeys: ParaCategory[] = ['projects', 'areas', 'resources', 'archive'];

const quadrantStyles: Record<Quadrant, string> = {
  do: 'bg-quadrant-do/20 text-quadrant-do border-quadrant-do/30 hover:bg-quadrant-do/30',
  schedule: 'bg-quadrant-schedule/20 text-quadrant-schedule border-quadrant-schedule/30 hover:bg-quadrant-schedule/30',
  delegate: 'bg-quadrant-delegate/20 text-quadrant-delegate border-quadrant-delegate/30 hover:bg-quadrant-delegate/30',
  eliminate: 'bg-quadrant-eliminate/20 text-quadrant-eliminate border-quadrant-eliminate/30 hover:bg-quadrant-eliminate/30',
};

const paraStyles: Record<ParaCategory, string> = {
  projects: 'bg-quadrant-do/15 text-quadrant-do border-quadrant-do/25 hover:bg-quadrant-do/25',
  areas: 'bg-quadrant-schedule/15 text-quadrant-schedule border-quadrant-schedule/25 hover:bg-quadrant-schedule/25',
  resources: 'bg-quadrant-delegate/15 text-quadrant-delegate border-quadrant-delegate/25 hover:bg-quadrant-delegate/25',
  archive: 'bg-muted text-muted-foreground border-border hover:bg-muted/80',
};

export function QuickCapture({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [selectedQ, setSelectedQ] = useState<Quadrant>('do');
  const [selectedP, setSelectedP] = useState<ParaCategory>('projects');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value, selectedQ, selectedP);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Capture a thought..."
          className="flex-1 bg-secondary border-border placeholder:text-muted-foreground"
        />
        <Button type="submit" size="icon" disabled={!value.trim()} className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        {/* Priority */}
        <div className="flex gap-1.5 items-center flex-wrap">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono mr-1">Priority</span>
          {quadrantKeys.map(q => (
            <button
              key={q}
              type="button"
              onClick={() => setSelectedQ(q)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${quadrantStyles[q]} ${selectedQ === q ? 'ring-1 ring-offset-1 ring-offset-background ring-current' : 'opacity-40'}`}
            >
              {QUADRANT_META[q].icon} {QUADRANT_META[q].label}
            </button>
          ))}
        </div>

        {/* PARA */}
        <div className="flex gap-1.5 items-center flex-wrap">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono mr-1">PARA</span>
          {paraKeys.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedP(p)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${paraStyles[p]} ${selectedP === p ? 'ring-1 ring-offset-1 ring-offset-background ring-current' : 'opacity-40'}`}
            >
              {PARA_META[p].icon} {PARA_META[p].label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
