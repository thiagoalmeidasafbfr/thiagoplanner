"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { QuickAdd } from "@/components/QuickAdd";
import { TaskCard } from "@/components/TaskCard";
import { TaskDetail } from "@/components/TaskDetail";
import { FilterBar } from "@/components/FilterBar";
import { useTasks } from "@/hooks/useTasks";
import { FilterType, Task } from "@/lib/types";

function TaskListContent() {
  const searchParams = useSearchParams();
  const filter = (searchParams.get("filter") as FilterType) || "all";

  const {
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
  } = useTasks();

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const filteredTasks = hydrated ? getFilteredTasks(filter) : [];
  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;

  const filterLabels: Record<FilterType, string> = {
    all: "Todas as tarefas",
    today: "Criadas hoje",
    doing: "Em andamento",
    done: "Concluídas",
    blocked: "Bloqueadas",
  };

  const subtitleCount =
    filteredTasks.length === 1
      ? "1 tarefa"
      : `${filteredTasks.length} tarefas`;

  const heroSubtitle =
    filter === "all"
      ? `${subtitleCount} · todos os status`
      : filter === "today"
      ? `${subtitleCount} · criadas hoje`
      : filter === "doing"
      ? `${subtitleCount} · em andamento`
      : filter === "done"
      ? `${subtitleCount} · concluídas`
      : `${subtitleCount} · bloqueadas`;

  function handleAddTask(title: string) {
    const task = addTask(title);
    setSelectedTaskId(task.id);
  }

  function handleSelectTask(task: Task) {
    setSelectedTaskId((prev) => (prev === task.id ? null : task.id));
  }

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Main column */}
      <div
        className={`
          flex flex-col flex-1 min-h-0 overflow-hidden
          transition-all duration-250
        `}
      >
        {/* Page Hero */}
        <PageHero
          title={filterLabels[filter]}
          subtitle={heroSubtitle}
        />

        {/* Content area */}
        <div className="flex-1 overflow-y-auto bg-cream-page">
          <div className="px-8 py-6 max-w-2xl">
            {/* Quick add */}
            <QuickAdd onAdd={handleAddTask} />

            {/* Filter bar */}
            <div className="mt-5 mb-4">
              <FilterBar currentFilter={filter} counts={counts} />
            </div>

            {/* Task list */}
            {!hydrated ? (
              <div className="space-y-2 mt-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-cream-card rounded-md border border-[rgba(26,20,16,0.08)] animate-pulse"
                  />
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <ul className="space-y-2">
                {filteredTasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard
                      task={task}
                      isSelected={task.id === selectedTaskId}
                      onClick={() => handleSelectTask(task)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Detail panel overlay */}
      {selectedTask && (
        <>
          {/* Backdrop for mobile / click-outside */}
          <div
            className="fixed inset-0 z-10 bg-ink-primary/10 lg:hidden"
            onClick={() => setSelectedTaskId(null)}
          />
          <div className="flex-shrink-0 z-20 h-full overflow-hidden flex" style={{boxShadow: '-4px 0 20px rgba(26,20,16,0.08)'}}>
            <TaskDetail
              task={selectedTask}
              onClose={() => setSelectedTaskId(null)}
              onUpdateTask={updateTask}
              onAddStep={addStep}
              onToggleStep={toggleStep}
              onDeleteStep={deleteStep}
              onAddComment={addComment}
              onDeleteTask={deleteTask}
            />
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ filter }: { filter: FilterType }) {
  const messages: Record<FilterType, { title: string; sub: string }> = {
    all: {
      title: "Nenhuma tarefa ainda",
      sub: "Use o campo acima para criar sua primeira tarefa.",
    },
    today: {
      title: "Nada criado hoje",
      sub: "Tarefas criadas hoje aparecerão aqui.",
    },
    doing: {
      title: "Nada em andamento",
      sub: 'Mude o status de uma tarefa para "Fazendo".',
    },
    done: {
      title: "Nenhuma tarefa concluída",
      sub: 'Tarefas marcadas como "Concluída" aparecem aqui.',
    },
    blocked: {
      title: "Nenhuma tarefa bloqueada",
      sub: "Ótimo! Nada está bloqueado no momento.",
    },
  };
  const msg = messages[filter];

  return (
    <div className="mt-12 flex flex-col items-center text-center px-4">
      <div className="w-12 h-12 rounded-xl bg-cream-inset flex items-center justify-center mb-4">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4" width="14" height="2" rx="1" fill="rgba(26,20,16,0.2)" />
          <rect x="3" y="9" width="10" height="2" rx="1" fill="rgba(26,20,16,0.15)" />
          <rect x="3" y="14" width="7" height="2" rx="1" fill="rgba(26,20,16,0.1)" />
        </svg>
      </div>
      <p className="font-fraunces text-ink-primary text-base font-semibold">{msg.title}</p>
      <p className="font-inter text-sm text-[rgba(26,20,16,0.45)] mt-1 max-w-xs">{msg.sub}</p>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div className="flex flex-col flex-1">
            <div className="bg-ink-primary px-8 pt-8 pb-7 h-24" />
            <div className="flex-1 bg-cream-page" />
          </div>
        </div>
      }
    >
      <TaskListContent />
    </Suspense>
  );
}
