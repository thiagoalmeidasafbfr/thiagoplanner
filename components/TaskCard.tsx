"use client";

import { Task, TaskStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig: Record<
  TaskStatus,
  { label: string; chipClass: string }
> = {
  todo: {
    label: "A fazer",
    chipClass:
      "bg-cream-inset text-ink-secondary",
  },
  doing: {
    label: "Fazendo",
    chipClass:
      "bg-[rgba(190,140,74,0.18)] text-gold-deep",
  },
  done: {
    label: "Concluída",
    chipClass:
      "bg-var-pos-tint text-var-pos",
  },
  blocked: {
    label: "Bloqueada",
    chipClass:
      "bg-var-neg-tint text-var-neg",
  },
};

export function TaskCard({ task, isSelected, onClick }: TaskCardProps) {
  const status = statusConfig[task.status];
  const completedSteps = task.steps.filter((s) => s.done).length;
  const totalSteps = task.steps.length;

  return (
    <article
      onClick={onClick}
      className={`
        bg-cream-card rounded-md px-5 py-4
        border transition-all duration-150 cursor-pointer
        ${
          isSelected
            ? "border-gold shadow-card-hover"
            : "border-[rgba(26,20,16,0.08)] shadow-card hover:shadow-card-hover hover:-translate-y-[1px]"
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: title + meta */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-inter text-sm font-semibold text-ink-primary leading-snug truncate">
            {task.title}
          </h3>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-ibm-plex-mono text-[10px] uppercase tracking-label text-[rgba(26,20,16,0.45)] bg-cream-inset px-2 py-0.5 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom row: steps, comments, date */}
          <div className="flex items-center gap-4 mt-3">
            {totalSteps > 0 && (
              <span className="font-jetbrains-mono text-[11px] text-[rgba(26,20,16,0.45)] flex items-center gap-1.5">
                <StepsIcon />
                {completedSteps}/{totalSteps} etapas
              </span>
            )}

            {task.comments.length > 0 && (
              <span className="font-jetbrains-mono text-[11px] text-[rgba(26,20,16,0.45)] flex items-center gap-1">
                <CommentIcon />
                {task.comments.length}
              </span>
            )}

            <span className="font-jetbrains-mono text-[11px] text-[rgba(26,20,16,0.3)] ml-auto">
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>

        {/* Right: status chip */}
        <div className="flex-shrink-0 mt-0.5">
          <span
            className={`
              font-ibm-plex-mono text-[10px] uppercase tracking-label
              px-2.5 py-1 rounded-pill leading-none
              ${status.chipClass}
            `}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Step progress bar */}
      {totalSteps > 0 && (
        <div className="mt-3 h-0.5 bg-cream-inset rounded-pill overflow-hidden">
          <div
            className="h-full bg-gold rounded-pill transition-all duration-300"
            style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
          />
        </div>
      )}
    </article>
  );
}

function StepsIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="2" width="10" height="1.5" rx="0.75" fill="currentColor" opacity="0.6" />
      <rect x="1" y="5.25" width="7" height="1.5" rx="0.75" fill="currentColor" opacity="0.6" />
      <rect x="1" y="8.5" width="5" height="1.5" rx="0.75" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M1 2.5A1.5 1.5 0 0 1 2.5 1h7A1.5 1.5 0 0 1 11 2.5v5A1.5 1.5 0 0 1 9.5 9H7l-2 2V9H2.5A1.5 1.5 0 0 1 1 7.5v-5Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}
