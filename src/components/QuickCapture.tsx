import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Quadrant } from '@/lib/types';
import { QUADRANT_META } from '@/lib/types';

interface Props {
  onAdd: (title: string, quadrant: Quadrant) => void;
}

const quadrantKeys: Quadrant[] = ['do', 'schedule', 'delegate', 'eliminate'];

const quadrantStyles: Record<Quadrant, string> = {
  do: 'bg-quadrant-do/20 text-quadrant-do border-quadrant-do/30 hover:bg-quadrant-do/30',
  schedule: 'bg-quadrant-schedule/20 text-quadrant-schedule border-quadrant-schedule/30 hover:bg-quadrant-schedule/30',
  delegate: 'bg-quadrant-delegate/20 text-quadrant-delegate border-quadrant-delegate/30 hover:bg-quadrant-delegate/30',
  eliminate: 'bg-quadrant-eliminate/20 text-quadrant-eliminate border-quadrant-eliminate/30 hover:bg-quadrant-eliminate/30',
};

export function QuickCapture({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [selectedQ, setSelectedQ] = useState<Quadrant>('do');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value, selectedQ);
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
      <div className="flex gap-2 flex-wrap">
        {quadrantKeys.map(q => (
          <button
            key={q}
            type="button"
            onClick={() => setSelectedQ(q)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${quadrantStyles[q]} ${selectedQ === q ? 'ring-1 ring-offset-1 ring-offset-background ring-current' : 'opacity-50'}`}
          >
            {QUADRANT_META[q].icon} {QUADRANT_META[q].label}
          </button>
        ))}
      </div>
    </form>
  );
}
