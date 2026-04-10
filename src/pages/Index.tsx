import { useState } from 'react';
import { Brain, Grid3X3, FolderOpen, Workflow, BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { QuickCapture } from '@/components/QuickCapture';
import { QuadrantPanel } from '@/components/QuadrantPanel';
import { ParaView } from '@/components/ParaView';
import { CodePipeline } from '@/components/CodePipeline';
import { DailyJournal } from '@/components/DailyJournal';
import { StatsBar } from '@/components/StatsBar';
import { useTasks } from '@/hooks/useTasks';
import { useJournal } from '@/hooks/useJournal';
import type { Quadrant } from '@/lib/types';

const quadrantKeys: Quadrant[] = ['do', 'schedule', 'delegate', 'eliminate'];

type ViewTab = 'eisenhower' | 'para' | 'code' | 'journal';

const tabs: { id: ViewTab; label: string; icon: React.ReactNode }[] = [
  { id: 'eisenhower', label: 'Matrix', icon: <Grid3X3 className="h-3.5 w-3.5" /> },
  { id: 'para', label: 'PARA', icon: <FolderOpen className="h-3.5 w-3.5" /> },
  { id: 'code', label: 'CODE', icon: <Workflow className="h-3.5 w-3.5" /> },
  { id: 'journal', label: 'Journal', icon: <BookOpen className="h-3.5 w-3.5" /> },
];

const Index = () => {
  const {
    tasks, addTask, toggleTask, deleteTask, moveTask,
    setParaCategory, setCodeStage, updateNote,
    byQuadrant, byPara, byCodeStage, stats,
  } = useTasks();
  const journal = useJournal();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<ViewTab>('eisenhower');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-base font-mono font-bold tracking-tight text-foreground">
                  Laharis<span className="text-primary">2nd</span>Brain
                </h1>
                <p className="text-[10px] text-muted-foreground">Capture · Organize · Distill · Express</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <StatsBar {...stats} />
              </div>
              <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-4 space-y-4">
        {/* Quick Capture */}
        <section className="rounded-xl border border-border bg-card p-4">
          <h2 className="text-xs font-mono font-semibold text-foreground mb-3 flex items-center gap-2">
            ⚡ Quick Capture
          </h2>
          <QuickCapture onAdd={addTask} />
        </section>

        <div className="sm:hidden">
          <StatsBar {...stats} />
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1 w-fit overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'eisenhower' && (
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
                  onSetPara={setParaCategory}
                  onSetCodeStage={setCodeStage}
                  onUpdateNote={updateNote}
                />
              ))}
            </div>
          </section>
        )}

        {activeTab === 'para' && (
          <ParaView
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onMove={moveTask}
            onSetPara={setParaCategory}
            onSetCodeStage={setCodeStage}
            onUpdateNote={updateNote}
            byPara={byPara}
          />
        )}

        {activeTab === 'code' && (
          <CodePipeline
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onMove={moveTask}
            onSetPara={setParaCategory}
            onSetCodeStage={setCodeStage}
            onUpdateNote={updateNote}
            byCodeStage={byCodeStage}
          />
        )}

        {activeTab === 'journal' && (
          <DailyJournal
            entries={journal.entries}
            getEntry={journal.getEntry}
            saveEntry={journal.saveEntry}
            deleteEntry={journal.deleteEntry}
            todayKey={() => journal.todayKey()}
            tasks={tasks}
          />
        )}
      </main>
    </div>
  );
};

export default Index;
