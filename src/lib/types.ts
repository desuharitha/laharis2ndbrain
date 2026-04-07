export type Quadrant = 'do' | 'schedule' | 'delegate' | 'eliminate';
export type ParaCategory = 'projects' | 'areas' | 'resources' | 'archive';
export type CodeStage = 'capture' | 'organize' | 'distill' | 'express';

export interface Task {
  id: string;
  title: string;
  quadrant: Quadrant;
  para: ParaCategory;
  codeStage: CodeStage;
  completed: boolean;
  createdAt: number;
  note?: string;
  tags?: string[];
}

export const QUADRANT_META: Record<Quadrant, { label: string; subtitle: string; icon: string }> = {
  do: { label: 'Do', subtitle: 'Urgent & Important', icon: '🔥' },
  schedule: { label: 'Schedule', subtitle: 'Important, Not Urgent', icon: '📅' },
  delegate: { label: 'Delegate', subtitle: 'Urgent, Not Important', icon: '🤝' },
  eliminate: { label: 'Eliminate', subtitle: 'Neither', icon: '🗑️' },
};

export const PARA_META: Record<ParaCategory, { label: string; description: string; icon: string; color: string }> = {
  projects: { label: 'Projects', description: 'Short-term efforts with a goal', icon: '🎯', color: 'text-quadrant-do' },
  areas: { label: 'Areas', description: 'Ongoing responsibilities', icon: '🔄', color: 'text-quadrant-schedule' },
  resources: { label: 'Resources', description: 'Topics of interest', icon: '📚', color: 'text-quadrant-delegate' },
  archive: { label: 'Archive', description: 'Completed & inactive', icon: '🗄️', color: 'text-muted-foreground' },
};

export const CODE_META: Record<CodeStage, { label: string; description: string; icon: string; step: number }> = {
  capture: { label: 'Capture', description: 'Collect what resonates', icon: '📥', step: 1 },
  organize: { label: 'Organize', description: 'Sort into PARA', icon: '📂', step: 2 },
  distill: { label: 'Distill', description: 'Find the essence', icon: '💎', step: 3 },
  express: { label: 'Express', description: 'Share & create', icon: '🚀', step: 4 },
};
