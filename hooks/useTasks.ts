"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Task, TaskStatus, Step, Comment, HistoryEntry, FilterType } from "@/lib/types";
import { supabase } from "@/lib/supabase";

// ── internal DB row types ─────────────────────────────────────────────────────

type DbStep = {
  id: string;
  task_id: string;
  text: string;
  done: boolean;
  created_at: string;
};

type DbComment = {
  id: string;
  task_id: string;
  text: string;
  created_at: string;
};

type DbHistory = {
  id: string;
  task_id: string;
  action: string;
  detail: string | null;
  timestamp: string;
};

type DbTask = {
  id: string;
  title: string;
  description: string;
  status: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  steps: DbStep[];
  comments: DbComment[];
  task_history: DbHistory[];
};

// ── helpers ───────────────────────────────────────────────────────────────────

function uid() {
  return crypto.randomUUID();
}

function now() {
  return new Date().toISOString();
}

function byDate(a: string, b: string) {
  return a.localeCompare(b);
}

function dbToTask(row: DbTask): Task {
  const steps: Step[] = (row.steps ?? [])
    .map(s => ({ id: s.id, text: s.text, done: s.done, createdAt: s.created_at }))
    .sort((a, b) => byDate(a.createdAt, b.createdAt));

  const comments: Comment[] = (row.comments ?? [])
    .map(c => ({ id: c.id, text: c.text, createdAt: c.created_at }))
    .sort((a, b) => byDate(a.createdAt, b.createdAt));

  const history: HistoryEntry[] = (row.task_history ?? [])
    .map(h => ({ id: h.id, action: h.action, detail: h.detail ?? undefined, timestamp: h.timestamp }))
    .sort((a, b) => byDate(a.timestamp, b.timestamp));

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    tags: row.tags ?? [],
    steps,
    comments,
    history,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── hook ──────────────────────────────────────────────────────────────────────

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<Task[]>([]);

  useEffect(() => { ref.current = tasks; }, [tasks]);

  useEffect(() => { void fetchAll(); }, []);

  async function fetchAll() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*, steps(*), comments(*), task_history(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[useTasks] fetch error:", error.message);
    } else {
      const mapped = (data as DbTask[]).map(dbToTask);
      setTasks(mapped);
      ref.current = mapped;
    }
    setLoading(false);
  }

  // ── create ──────────────────────────────────────────────────────────────────

  const addTask = useCallback(async (title: string): Promise<Task> => {
    const ts = now();
    const id = uid();
    const histId = uid();

    const task: Task = {
      id,
      title,
      description: "",
      status: "todo",
      tags: [],
      steps: [],
      comments: [],
      history: [{ id: histId, action: "Tarefa criada", timestamp: ts }],
      createdAt: ts,
      updatedAt: ts,
    };

    setTasks(prev => [task, ...prev]);

    await supabase.from("tasks").insert({
      id,
      title,
      description: "",
      status: "todo",
      tags: [],
      created_at: ts,
      updated_at: ts,
    });
    await supabase.from("task_history").insert({
      id: histId,
      task_id: id,
      action: "Tarefa criada",
      timestamp: ts,
    });

    return task;
  }, []);

  // ── update ──────────────────────────────────────────────────────────────────

  const updateTask = useCallback(async (
    id: string,
    updates: Partial<Pick<Task, "title" | "description" | "status" | "tags">>
  ) => {
    const ts = now();
    const current = ref.current.find(t => t.id === id);
    if (!current) return;

    const histEntries: HistoryEntry[] = [];

    if (updates.status !== undefined && updates.status !== current.status) {
      histEntries.push({
        id: uid(),
        action: "Status alterado",
        detail: `${current.status} → ${updates.status}`,
        timestamp: ts,
      });
    }
    if (updates.title !== undefined && updates.title !== current.title) {
      histEntries.push({ id: uid(), action: "Título alterado", detail: updates.title, timestamp: ts });
    }
    if (updates.description !== undefined && updates.description !== current.description) {
      histEntries.push({ id: uid(), action: "Descrição atualizada", timestamp: ts });
    }

    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, ...updates, updatedAt: ts, history: [...t.history, ...histEntries] };
    }));

    const dbUpdates: Record<string, unknown> = { updated_at: ts };
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;

    await supabase.from("tasks").update(dbUpdates).eq("id", id);

    if (histEntries.length > 0) {
      await supabase.from("task_history").insert(
        histEntries.map(h => ({
          id: h.id,
          task_id: id,
          action: h.action,
          detail: h.detail ?? null,
          timestamp: h.timestamp,
        }))
      );
    }
  }, []);

  // ── delete ──────────────────────────────────────────────────────────────────

  const deleteTask = useCallback(async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await supabase.from("tasks").delete().eq("id", id);
  }, []);

  // ── steps ───────────────────────────────────────────────────────────────────

  const addStep = useCallback(async (taskId: string, text: string) => {
    const ts = now();
    const stepId = uid();
    const histId = uid();
    const step: Step = { id: stepId, text, done: false, createdAt: ts };

    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        steps: [...t.steps, step],
        updatedAt: ts,
        history: [...t.history, { id: histId, action: "Etapa adicionada", detail: text, timestamp: ts }],
      };
    }));

    await supabase.from("steps").insert({ id: stepId, task_id: taskId, text, done: false, created_at: ts });
    await supabase.from("task_history").insert({ id: histId, task_id: taskId, action: "Etapa adicionada", detail: text, timestamp: ts });
    await supabase.from("tasks").update({ updated_at: ts }).eq("id", taskId);
  }, []);

  const toggleStep = useCallback(async (taskId: string, stepId: string) => {
    const ts = now();
    const task = ref.current.find(t => t.id === taskId);
    const step = task?.steps.find(s => s.id === stepId);
    if (!step) return;

    const done = !step.done;
    const action = done ? "Etapa concluída" : "Etapa reaberta";
    const histId = uid();

    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        steps: t.steps.map(s => s.id === stepId ? { ...s, done } : s),
        updatedAt: ts,
        history: [...t.history, { id: histId, action, detail: step.text, timestamp: ts }],
      };
    }));

    await supabase.from("steps").update({ done }).eq("id", stepId);
    await supabase.from("task_history").insert({ id: histId, task_id: taskId, action, detail: step.text, timestamp: ts });
    await supabase.from("tasks").update({ updated_at: ts }).eq("id", taskId);
  }, []);

  const deleteStep = useCallback(async (taskId: string, stepId: string) => {
    const ts = now();
    const task = ref.current.find(t => t.id === taskId);
    const step = task?.steps.find(s => s.id === stepId);
    const histId = uid();

    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        steps: t.steps.filter(s => s.id !== stepId),
        updatedAt: ts,
        history: [...t.history, { id: histId, action: "Etapa removida", detail: step?.text, timestamp: ts }],
      };
    }));

    await supabase.from("steps").delete().eq("id", stepId);
    await supabase.from("task_history").insert({ id: histId, task_id: taskId, action: "Etapa removida", detail: step?.text ?? null, timestamp: ts });
    await supabase.from("tasks").update({ updated_at: ts }).eq("id", taskId);
  }, []);

  // ── comments ─────────────────────────────────────────────────────────────────

  const addComment = useCallback(async (taskId: string, text: string) => {
    const ts = now();
    const commentId = uid();
    const histId = uid();
    const comment: Comment = { id: commentId, text, createdAt: ts };

    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        comments: [...t.comments, comment],
        updatedAt: ts,
        history: [...t.history, { id: histId, action: "Comentário adicionado", timestamp: ts }],
      };
    }));

    await supabase.from("comments").insert({ id: commentId, task_id: taskId, text, created_at: ts });
    await supabase.from("task_history").insert({ id: histId, task_id: taskId, action: "Comentário adicionado", timestamp: ts });
    await supabase.from("tasks").update({ updated_at: ts }).eq("id", taskId);
  }, []);

  // ── filters & counts ─────────────────────────────────────────────────────────

  const getFilteredTasks = useCallback((filter: FilterType): Task[] => {
    switch (filter) {
      case "today": {
        const today = new Date().toDateString();
        return tasks.filter(t => new Date(t.createdAt).toDateString() === today);
      }
      case "doing":
        return tasks.filter(t => t.status === "doing");
      case "done":
        return tasks.filter(t => t.status === "done");
      case "blocked":
        return tasks.filter(t => t.status === "blocked");
      default:
        return tasks;
    }
  }, [tasks]);

  const todayStr = new Date().toDateString();
  const counts = {
    all: tasks.length,
    today: tasks.filter(t => new Date(t.createdAt).toDateString() === todayStr).length,
    doing: tasks.filter(t => t.status === "doing").length,
    done: tasks.filter(t => t.status === "done").length,
    blocked: tasks.filter(t => t.status === "blocked").length,
    todo: tasks.filter(t => t.status === "todo").length,
  };

  return {
    tasks,
    hydrated: !loading,
    addTask,
    updateTask,
    deleteTask,
    addStep,
    toggleStep,
    deleteStep,
    addComment,
    getFilteredTasks,
    counts,
  };
}
