import { useState, useCallback, useEffect } from 'react';
import type { Task, Quadrant, ParaCategory, CodeStage } from '@/lib/types';

const STORAGE_KEY = 'laharis2ndbrain-tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Task[];
    // Migrate old tasks missing para/codeStage
    return parsed.map(t => ({
      ...t,
      para: t.para || 'projects',
      codeStage: t.codeStage || 'capture',
      tags: t.tags || [],
    }));
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((title: string, quadrant: Quadrant, para: ParaCategory = 'projects') => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      quadrant,
      para,
      codeStage: 'capture',
      completed: false,
      createdAt: Date.now(),
      tags: [],
    };
    setTasks(prev => [task, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, quadrant: Quadrant) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, quadrant } : t));
  }, []);

  const setParaCategory = useCallback((id: string, para: ParaCategory) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, para } : t));
  }, []);

  const setCodeStage = useCallback((id: string, codeStage: CodeStage) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, codeStage } : t));
  }, []);

  const updateNote = useCallback((id: string, note: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, note } : t));
  }, []);

  const byQuadrant = (q: Quadrant) => tasks.filter(t => t.quadrant === q);
  const byPara = (p: ParaCategory) => tasks.filter(t => t.para === p);
  const byCodeStage = (s: CodeStage) => tasks.filter(t => t.codeStage === s);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
  };

  return {
    tasks, addTask, toggleTask, deleteTask, moveTask,
    setParaCategory, setCodeStage, updateNote,
    byQuadrant, byPara, byCodeStage, stats,
  };
}
