"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Task, TaskStatus } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

interface TaskDetailProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (
    id: string,
    updates: Partial<Pick<Task, "title" | "description" | "status" | "tags">>
  ) => void;
  onAddStep: (taskId: string, text: string) => void;
  onToggleStep: (taskId: string, stepId: string) => void;
  onDeleteStep: (taskId: string, stepId: string) => void;
  onAddComment: (taskId: string, text: string) => void;
  onDeleteTask: (id: string) => void;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "A fazer" },
  { value: "doing", label: "Fazendo" },
  { value: "done", label: "Concluída" },
  { value: "blocked", label: "Bloqueada" },
];

const statusSelectClass: Record<TaskStatus, string> = {
  todo: "text-ink-secondary bg-cream-inset",
  doing: "text-gold-deep bg-[rgba(190,140,74,0.18)]",
  done: "text-var-pos bg-var-pos-tint",
  blocked: "text-var-neg bg-var-neg-tint",
};

export function TaskDetail({
  task,
  onClose,
  onUpdateTask,
  onAddStep,
  onToggleStep,
  onDeleteStep,
  onAddComment,
  onDeleteTask,
}: TaskDetailProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [newStep, setNewStep] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newComment, setNewComment] = useState("");
  const [addingTag, setAddingTag] = useState(false);

  const titleRef = useRef<HTMLTextAreaElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);
  const newStepRef = useRef<HTMLInputElement>(null);
  const newTagRef = useRef<HTMLInputElement>(null);

  // Sync if task changes (e.g. from outside)
  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
  }, [task.id]); // Only reset when task ID changes

  // Auto-grow textareas
  function autoGrow(el: HTMLTextAreaElement | null) {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  useEffect(() => {
    autoGrow(titleRef.current);
  }, [title]);

  useEffect(() => {
    autoGrow(descRef.current);
  }, [description]);

  // Debounced save for title
  const titleTimer = useRef<NodeJS.Timeout | null>(null);
  function handleTitleChange(val: string) {
    setTitle(val);
    if (titleTimer.current) clearTimeout(titleTimer.current);
    titleTimer.current = setTimeout(() => {
      if (val.trim() && val.trim() !== task.title) {
        onUpdateTask(task.id, { title: val.trim() });
      }
    }, 600);
  }

  // Debounced save for description
  const descTimer = useRef<NodeJS.Timeout | null>(null);
  function handleDescriptionChange(val: string) {
    setDescription(val);
    if (descTimer.current) clearTimeout(descTimer.current);
    descTimer.current = setTimeout(() => {
      if (val !== task.description) {
        onUpdateTask(task.id, { description: val });
      }
    }, 600);
  }

  function handleStatusChange(status: TaskStatus) {
    onUpdateTask(task.id, { status });
  }

  function handleAddStep() {
    const text = newStep.trim();
    if (!text) return;
    onAddStep(task.id, text);
    setNewStep("");
    newStepRef.current?.focus();
  }

  function handleAddTag() {
    const tag = newTag.trim().toLowerCase();
    if (!tag || task.tags.includes(tag)) {
      setNewTag("");
      setAddingTag(false);
      return;
    }
    onUpdateTask(task.id, { tags: [...task.tags, tag] });
    setNewTag("");
    setAddingTag(false);
  }

  function handleRemoveTag(tag: string) {
    onUpdateTask(task.id, { tags: task.tags.filter((t) => t !== tag) });
  }

  function handleAddComment() {
    const text = newComment.trim();
    if (!text) return;
    onAddComment(task.id, text);
    setNewComment("");
  }

  const completedSteps = task.steps.filter((s) => s.done).length;
  const totalSteps = task.steps.length;

  return (
    <div
      className="panel-slide-in flex flex-col h-full bg-cream-card border-l border-[rgba(26,20,16,0.08)]"
      style={{ width: "480px", minWidth: "480px" }}
    >
      {/* Panel Header */}
      <div className="bg-ink-primary px-6 pt-6 pb-5 flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          {/* Editable title */}
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            rows={1}
            className="flex-1 bg-transparent font-fraunces text-on-dark text-xl font-semibold leading-snug resize-none outline-none placeholder:text-[rgba(243,238,226,0.3)] focus:outline-none min-h-0"
            style={{ overflow: "hidden" }}
          />
          <button
            onClick={onClose}
            className="flex-shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center rounded-sm text-[rgba(243,238,226,0.5)] hover:text-on-dark hover:bg-[rgba(243,238,226,0.08)] transition-colors"
            aria-label="Fechar"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Status + actions row */}
        <div className="flex items-center gap-2 mt-4">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className={`
              font-ibm-plex-mono text-[10px] uppercase tracking-label
              px-3 py-1.5 rounded-pill cursor-pointer border-0 outline-none appearance-none
              transition-colors duration-150
              ${statusSelectClass[task.status]}
            `}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white text-ink-primary text-sm normal-case tracking-normal font-inter">
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex-1" />

          {totalSteps > 0 && (
            <span className="font-jetbrains-mono text-[11px] text-[rgba(243,238,226,0.4)]">
              {completedSteps}/{totalSteps} etapas
            </span>
          )}

          <button
            onClick={() => {
              if (window.confirm("Excluir esta tarefa?")) {
                onDeleteTask(task.id);
                onClose();
              }
            }}
            className="w-7 h-7 flex items-center justify-center rounded-sm text-[rgba(243,238,226,0.35)] hover:text-var-neg hover:bg-[rgba(185,28,28,0.12)] transition-colors"
            aria-label="Excluir tarefa"
            title="Excluir tarefa"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 space-y-6">
          {/* Description */}
          <section>
            <SectionLabel>Descrição</SectionLabel>
            <textarea
              ref={descRef}
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Adicione uma descrição..."
              rows={2}
              className="w-full bg-cream-inset rounded-md px-3 py-2.5 font-inter text-sm text-ink-primary placeholder:text-[rgba(26,20,16,0.3)] outline-none focus:ring-2 focus:ring-gold/40 transition-shadow resize-none mt-2 min-h-[60px]"
              style={{ overflow: "hidden" }}
              onInput={(e) => autoGrow(e.currentTarget)}
            />
          </section>

          {/* Tags */}
          <section>
            <SectionLabel>Tags</SectionLabel>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="group flex items-center gap-1 font-ibm-plex-mono text-[10px] uppercase tracking-label text-[rgba(26,20,16,0.55)] bg-cream-inset px-2.5 py-1 rounded-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="opacity-0 group-hover:opacity-100 text-[rgba(26,20,16,0.4)] hover:text-var-neg transition-all leading-none ml-0.5"
                    aria-label={`Remover tag ${tag}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {addingTag ? (
                <input
                  ref={newTagRef}
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTag();
                    if (e.key === "Escape") {
                      setAddingTag(false);
                      setNewTag("");
                    }
                  }}
                  onBlur={handleAddTag}
                  autoFocus
                  placeholder="nova-tag"
                  className="font-ibm-plex-mono text-[10px] uppercase tracking-label text-ink-secondary bg-cream-inset px-2.5 py-1 rounded-sm w-24 outline-none focus:ring-2 focus:ring-gold/40"
                />
              ) : (
                <button
                  onClick={() => setAddingTag(true)}
                  className="font-ibm-plex-mono text-[10px] uppercase tracking-label text-[rgba(26,20,16,0.35)] bg-cream-inset hover:bg-[rgba(190,140,74,0.12)] hover:text-gold-deep px-2.5 py-1 rounded-sm transition-colors"
                >
                  + tag
                </button>
              )}
            </div>
          </section>

          {/* Divider */}
          <Divider />

          {/* Steps */}
          <section>
            <div className="flex items-center justify-between">
              <SectionLabel>Etapas</SectionLabel>
              {totalSteps > 0 && (
                <span className="font-jetbrains-mono text-[11px] text-[rgba(26,20,16,0.4)]">
                  {completedSteps}/{totalSteps}
                </span>
              )}
            </div>

            {/* Step progress */}
            {totalSteps > 0 && (
              <div className="mt-2 mb-3 h-1 bg-cream-inset rounded-pill overflow-hidden">
                <div
                  className="h-full bg-gold rounded-pill transition-all duration-300"
                  style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                />
              </div>
            )}

            <ul className="space-y-1 mt-2">
              {task.steps.map((step) => (
                <li key={step.id} className="group flex items-start gap-2.5 py-1">
                  <button
                    onClick={() => onToggleStep(task.id, step.id)}
                    className={`
                      flex-shrink-0 mt-0.5 w-4 h-4 rounded-xs border transition-all duration-150
                      ${
                        step.done
                          ? "bg-var-pos border-var-pos text-white"
                          : "border-[rgba(26,20,16,0.25)] bg-white hover:border-gold"
                      }
                      flex items-center justify-center
                    `}
                    aria-label={step.done ? "Reabrir etapa" : "Concluir etapa"}
                  >
                    {step.done && <CheckIcon />}
                  </button>
                  <span
                    className={`
                      flex-1 font-inter text-sm leading-snug
                      ${step.done ? "line-through text-[rgba(26,20,16,0.35)]" : "text-ink-primary"}
                    `}
                  >
                    {step.text}
                  </span>
                  <button
                    onClick={() => onDeleteStep(task.id, step.id)}
                    className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-[rgba(26,20,16,0.3)] hover:text-var-neg transition-all text-base leading-none"
                    aria-label="Remover etapa"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>

            {/* Add step */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-4 h-4 flex-shrink-0 flex items-center justify-center">
                <div className="w-3 h-3 rounded-xs border border-dashed border-[rgba(26,20,16,0.2)]" />
              </div>
              <input
                ref={newStepRef}
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddStep();
                  if (e.key === "Escape") setNewStep("");
                }}
                placeholder="Adicionar etapa..."
                className="flex-1 font-inter text-sm text-ink-primary placeholder:text-[rgba(26,20,16,0.3)] bg-transparent outline-none py-1"
              />
            </div>
          </section>

          <Divider />

          {/* Comments */}
          <section>
            <SectionLabel>Comentários</SectionLabel>

            {task.comments.length > 0 && (
              <ul className="space-y-3 mt-3">
                {task.comments.map((comment) => (
                  <li key={comment.id} className="bg-cream-inset rounded-md px-3 py-2.5">
                    <p className="font-inter text-sm text-ink-primary leading-relaxed whitespace-pre-wrap">
                      {comment.text}
                    </p>
                    <p className="font-jetbrains-mono text-[10px] text-[rgba(26,20,16,0.35)] mt-1.5">
                      {formatDateTime(comment.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {/* Add comment */}
            <div className="mt-3 space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  autoGrow(e.currentTarget);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                    handleAddComment();
                  }
                }}
                placeholder="Escrever comentário..."
                rows={2}
                className="w-full bg-cream-inset rounded-md px-3 py-2.5 font-inter text-sm text-ink-primary placeholder:text-[rgba(26,20,16,0.3)] outline-none focus:ring-2 focus:ring-gold/40 transition-shadow resize-none min-h-[60px]"
                style={{ overflow: "hidden" }}
              />
              <div className="flex items-center justify-between">
                <span className="font-ibm-plex-mono text-[10px] text-[rgba(26,20,16,0.3)] uppercase tracking-label">
                  ⌘ + Enter para enviar
                </span>
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="font-inter text-xs font-medium px-4 py-1.5 bg-ink-primary text-on-dark rounded-pill hover:bg-ink-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Comentar
                </button>
              </div>
            </div>
          </section>

          <Divider />

          {/* History */}
          <section>
            <SectionLabel>Histórico</SectionLabel>

            <ol className="mt-3 relative">
              {/* Timeline line */}
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[rgba(26,20,16,0.08)]" />

              <div className="space-y-3">
                {[...task.history].reverse().map((entry) => (
                  <li key={entry.id} className="flex items-start gap-3 pl-0">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-[11px] h-[11px] rounded-full bg-cream-inset border border-[rgba(26,20,16,0.15)] mt-0.5" />

                    <div className="flex-1 min-w-0">
                      <span className="font-inter text-sm text-ink-primary leading-none">
                        {entry.action}
                      </span>
                      {entry.detail && (
                        <span className="font-ibm-plex-mono text-[11px] text-[rgba(26,20,16,0.5)] ml-1.5">
                          {entry.detail}
                        </span>
                      )}
                      <p className="font-jetbrains-mono text-[10px] text-[rgba(26,20,16,0.3)] mt-0.5">
                        {formatDateTime(entry.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </div>
            </ol>
          </section>

          {/* Bottom padding */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}

// Sub-components

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-ibm-plex-mono text-[10px] uppercase tracking-label text-[rgba(26,20,16,0.4)]">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="h-px bg-[rgba(26,20,16,0.06)]" />;
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 2l10 10M12 2L2 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M2 3.5h9M5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M4.5 3.5l.5 7h3l.5-7"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M2 5l2.5 2.5 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
