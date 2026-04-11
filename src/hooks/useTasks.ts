import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Task, Quadrant, ParaCategory, CodeStage } from '@/lib/types';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks from database
  useEffect(() => {
    if (!user) { setTasks([]); setLoading(false); return; }

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTasks(data.map(t => ({
          id: t.id,
          title: t.title,
          quadrant: t.quadrant as Quadrant,
          para: t.para as ParaCategory,
          codeStage: t.code_stage as CodeStage,
          completed: t.completed,
          createdAt: new Date(t.created_at).getTime(),
          note: t.note ?? undefined,
          tags: t.tags ?? [],
        })));
      }
      setLoading(false);
    };

    fetchTasks();
  }, [user]);

  const addTask = useCallback(async (title: string, quadrant: Quadrant, para: ParaCategory = 'projects') => {
    if (!user) return;
    const { data, error } = await supabase
      .from('tasks')
      .insert({ user_id: user.id, title: title.trim(), quadrant, para, code_stage: 'capture' as const })
      .select()
      .single();

    if (!error && data) {
      const task: Task = {
        id: data.id, title: data.title,
        quadrant: data.quadrant as Quadrant, para: data.para as ParaCategory,
        codeStage: data.code_stage as CodeStage, completed: data.completed,
        createdAt: new Date(data.created_at).getTime(),
        note: data.note ?? undefined, tags: data.tags ?? [],
      };
      setTasks(prev => [task, ...prev]);
    }
  }, [user]);

  const toggleTask = useCallback(async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    const { error } = await supabase.from('tasks').update({ completed: !task.completed }).eq('id', id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [tasks]);

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (!error) setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const moveTask = useCallback(async (id: string, quadrant: Quadrant) => {
    const { error } = await supabase.from('tasks').update({ quadrant }).eq('id', id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, quadrant } : t));
  }, []);

  const setParaCategory = useCallback(async (id: string, para: ParaCategory) => {
    const { error } = await supabase.from('tasks').update({ para }).eq('id', id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, para } : t));
  }, []);

  const setCodeStage = useCallback(async (id: string, codeStage: CodeStage) => {
    const { error } = await supabase.from('tasks').update({ code_stage: codeStage }).eq('id', id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, codeStage } : t));
  }, []);

  const updateNote = useCallback(async (id: string, note: string) => {
    const { error } = await supabase.from('tasks').update({ note }).eq('id', id);
    if (!error) setTasks(prev => prev.map(t => t.id === id ? { ...t, note } : t));
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
    byQuadrant, byPara, byCodeStage, stats, loading,
  };
}
