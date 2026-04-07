import { useState, useCallback, useEffect } from 'react';
import type { Task, Quadrant } from '@/lib/types';

const STORAGE_KEY = 'laharis2ndbrain-tasks';

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((title: string, quadrant: Quadrant) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      quadrant,
      completed: false,
      createdAt: Date.now(),
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

  const byQuadrant = (q: Quadrant) => tasks.filter(t => t.quadrant === q);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
  };

  return { tasks, addTask, toggleTask, deleteTask, moveTask, byQuadrant, stats };
}
