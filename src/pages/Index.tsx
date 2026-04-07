import { Brain } from 'lucide-react';
import { QuickCapture } from '@/components/QuickCapture';
import { QuadrantPanel } from '@/components/QuadrantPanel';
import { StatsBar } from '@/components/StatsBar';
import { useTasks } from '@/hooks/useTasks';
import type { Quadrant } from '@/lib/types';

const quadrantKeys: Quadrant[] = ['do', 'schedule', 'delegate', 'eliminate'];

const Index = () => {
  const { addTask, toggleTask, deleteTask, moveTask, byQuadrant, stats } = useTasks();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-mono font-bold tracking-tight text-foreground">
                Laharis<span className="text-primary">2nd</span>Brain
              </h1>
              <p className="text-xs text-muted-foreground">Capture · Prioritize · Execute</p>
            </div>
          </div>
          <StatsBar {...stats} />
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Quick Capture */}
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-sm font-mono font-semibold text-foreground mb-3 flex items-center gap-2">
            ⚡ Quick Capture
          </h2>
          <QuickCapture onAdd={addTask} />
        </section>

        {/* Eisenhower Matrix */}
        <section>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-sm font-mono font-semibold text-foreground">Eisenhower Matrix</h2>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quadrantKeys.map(q => (
              <QuadrantPanel
                key={q}
                quadrant={q}
                tasks={byQuadrant(q)}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onMove={moveTask}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
