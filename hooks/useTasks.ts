"use client";

import { useState, useEffect, useCallback } from "react";
import { Task, TaskStatus, Step, Comment, HistoryEntry, FilterType } from "@/lib/types";
import { generateId } from "@/lib/utils";
import { seedTasks } from "@/lib/seeds";

const STORAGE_KEY = "thiagoplanner_tasks";

function loadFromStorage(): Task[] {
  if (typeof window === "undefined") return seedTasks;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedTasks;
    return JSON.parse(raw) as Task[];
  } catch {
    return seedTasks;
  }
}

function saveToStorage(tasks: Task[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore
  }
}

function makeHistoryEntry(action: string, detail?: string): HistoryEntry {
  return {
    id: generateId(),
    action,
    detail,
    timestamp: new Date().toISOString(),
  };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    setTasks(loadFromStorage());
    setHydrated(true);
  }, []);

  // Persist whenever tasks change (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveToStorage(tasks);
    }
  }, [tasks, hydrated]);

  const addTask = useCallback((title: string) => {
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId(),
      title,
      description: "",
      status: "todo",
      tags: [],
      steps: [],
      comments: [],
      history: [makeHistoryEntry("Tarefa criada")],
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [task, ...prev]);
    return task;
  }, []);

  const updateTask = useCallback(
    (id: string, updates: Partial<Pick<Task, "title" | "description" | "status" | "tags">>) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== id) return t;
          const now = new Date().toISOString();
          const historyEntries: HistoryEntry[] = [];

          if (updates.status && updates.status !== t.status) {
            historyEntries.push(
              makeHistoryEntry("Status alterado", `${t.status} → ${updates.status}`)
            );
          }
          if (updates.title && updates.title !== t.title) {
            historyEntries.push(makeHistoryEntry("Título alterado", updates.title));
          }
          if (updates.description !== undefined && updates.description !== t.description) {
            historyEntries.push(makeHistoryEntry("Descrição atualizada"));
          }

          return {
            ...t,
            ...updates,
            updatedAt: now,
            history: [...t.history, ...historyEntries],
          };
        })
      );
    },
    []
  );

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addStep = useCallback((taskId: string, text: string) => {
    const step: Step = {
      id: generateId(),
      text,
      done: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          steps: [...t.steps, step],
          updatedAt: new Date().toISOString(),
          history: [
            ...t.history,
            makeHistoryEntry("Etapa adicionada", text),
          ],
        };
      })
    );
  }, []);

  const toggleStep = useCallback((taskId: string, stepId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const step = t.steps.find((s) => s.id === stepId);
        if (!step) return t;
        const done = !step.done;
        const action = done ? "Etapa concluída" : "Etapa reaberta";
        return {
          ...t,
          steps: t.steps.map((s) =>
            s.id === stepId ? { ...s, done } : s
          ),
          updatedAt: new Date().toISOString(),
          history: [...t.history, makeHistoryEntry(action, step.text)],
        };
      })
    );
  }, []);

  const deleteStep = useCallback((taskId: string, stepId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const step = t.steps.find((s) => s.id === stepId);
        return {
          ...t,
          steps: t.steps.filter((s) => s.id !== stepId),
          updatedAt: new Date().toISOString(),
          history: [
            ...t.history,
            makeHistoryEntry("Etapa removida", step?.text),
          ],
        };
      })
    );
  }, []);

  const addComment = useCallback((taskId: string, text: string) => {
    const comment: Comment = {
      id: generateId(),
      text,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          comments: [...t.comments, comment],
          updatedAt: new Date().toISOString(),
          history: [...t.history, makeHistoryEntry("Comentário adicionado")],
        };
      })
    );
  }, []);

  const getFilteredTasks = useCallback(
    (filter: FilterType): Task[] => {
      switch (filter) {
        case "today": {
          const today = new Date().toDateString();
          return tasks.filter(
            (t) => new Date(t.createdAt).toDateString() === today
          );
        }
        case "doing":
          return tasks.filter((t) => t.status === "doing");
        case "done":
          return tasks.filter((t) => t.status === "done");
        case "blocked":
          return tasks.filter((t) => t.status === "blocked");
        default:
          return tasks;
      }
    },
    [tasks]
  );

  const counts = {
    all: tasks.length,
    today: (() => {
      const today = new Date().toDateString();
      return tasks.filter((t) => new Date(t.createdAt).toDateString() === today).length;
    })(),
    doing: tasks.filter((t) => t.status === "doing").length,
    done: tasks.filter((t) => t.status === "done").length,
    blocked: tasks.filter((t) => t.status === "blocked").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  return {
    tasks,
    hydrated,
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
