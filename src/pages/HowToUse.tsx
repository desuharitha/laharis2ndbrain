import { Link } from 'react-router-dom';
import { Brain, ArrowLeft, Grid3X3, FolderOpen, Workflow, BookOpen, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const sections = [
  {
    icon: <Zap className="h-5 w-5 text-primary" />,
    title: 'Quick Capture',
    content:
      'Type any thought, task, or idea into the capture bar at the top. Choose a quadrant (urgency/importance) and hit Enter. Everything starts in the Capture stage of the CODE pipeline.',
  },
  {
    icon: <Grid3X3 className="h-5 w-5 text-primary" />,
    title: 'Eisenhower Matrix',
    content:
      'Prioritize tasks across four quadrants:\n• 🔥 Do — Urgent & Important. Act now.\n• 📅 Schedule — Important but not urgent. Plan it.\n• 🤝 Delegate — Urgent but not important. Hand it off.\n• 🗑️ Eliminate — Neither. Let it go.',
  },
  {
    icon: <FolderOpen className="h-5 w-5 text-primary" />,
    title: 'PARA Method',
    content:
      'Organize information into four buckets:\n• 🎯 Projects — Short-term efforts with a clear goal.\n• 🔄 Areas — Ongoing responsibilities (health, finance).\n• 📚 Resources — Topics of interest for future reference.\n• 🗄️ Archive — Completed or inactive items.',
  },
  {
    icon: <Workflow className="h-5 w-5 text-primary" />,
    title: 'CODE Pipeline',
    content:
      'Move knowledge through four stages:\n• 📥 Capture — Collect anything that resonates.\n• 📂 Organize — Sort it into PARA categories.\n• 💎 Distill — Find the essence; add notes.\n• 🚀 Express — Share, create, and ship.',
  },
  {
    icon: <BookOpen className="h-5 w-5 text-primary" />,
    title: 'Daily Journal & Morning Pages',
    content:
      'Reflect daily with guided prompts — gratitude, wins, lessons, and tomorrow\'s focus. Use Morning Pages for free-form stream-of-consciousness writing (aim for 750 words). Past entries are saved and browsable by date.',
  },
];

const HowToUse = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border">
      <div className="container max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h1 className="text-base font-mono font-bold text-foreground">How to Use</h1>
        </div>
      </div>
    </header>

    <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
      <p className="text-sm text-muted-foreground leading-relaxed">
        <strong className="text-foreground">Laharis2ndBrain</strong> combines the Eisenhower Matrix, Tiago Forte's PARA method, and the CODE pipeline into a single productivity system — plus a daily journal with Morning Pages.
      </p>

      {sections.map((s) => (
        <section key={s.title} className="rounded-xl border border-border bg-card p-5 space-y-2">
          <div className="flex items-center gap-2">
            {s.icon}
            <h2 className="text-sm font-mono font-semibold text-foreground">{s.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{s.content}</p>
        </section>
      ))}

      <section className="rounded-xl border border-border bg-card p-5 space-y-2">
        <h2 className="text-sm font-mono font-semibold text-foreground">💡 Tips</h2>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside leading-relaxed">
          <li>Add notes to any task by expanding its card.</li>
          <li>Move tasks between quadrants, PARA categories, and CODE stages at any time.</li>
          <li>Use the stats bar to track your capture, active, and done counts.</li>
          <li>Journal entries auto-save as you type.</li>
        </ul>
      </section>
    </main>
  </div>
);

export default HowToUse;
