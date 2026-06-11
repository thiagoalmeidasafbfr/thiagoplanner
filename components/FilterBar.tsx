"use client";

import Link from "next/link";
import { FilterType } from "@/lib/types";

interface FilterBarProps {
  currentFilter: FilterType;
  counts: {
    all: number;
    today: number;
    doing: number;
    done: number;
    blocked: number;
  };
}

const filters: { filter: FilterType; label: string }[] = [
  { filter: "all", label: "Todas" },
  { filter: "today", label: "Hoje" },
  { filter: "doing", label: "Fazendo" },
  { filter: "done", label: "Concluídas" },
  { filter: "blocked", label: "Bloqueadas" },
];

export function FilterBar({ currentFilter, counts }: FilterBarProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {filters.map(({ filter, label }) => {
        const isActive = currentFilter === filter;
        const count =
          filter === "all"
            ? counts.all
            : filter === "today"
            ? counts.today
            : filter === "doing"
            ? counts.doing
            : filter === "done"
            ? counts.done
            : filter === "blocked"
            ? counts.blocked
            : 0;

        return (
          <Link
            key={filter}
            href={`/?filter=${filter}`}
            className={`
              inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill
              font-inter text-[13px] font-medium leading-none
              transition-colors duration-150
              ${
                isActive
                  ? "bg-ink-primary text-on-dark shadow-card"
                  : "bg-cream-card text-[rgba(26,20,16,0.55)] border border-[rgba(26,20,16,0.08)] hover:border-[rgba(26,20,16,0.16)] hover:text-ink-primary"
              }
            `}
          >
            {label}
            {count > 0 && (
              <span
                className={`
                  font-jetbrains-mono text-[11px] leading-none
                  ${isActive ? "text-[rgba(243,238,226,0.5)]" : "text-[rgba(26,20,16,0.35)]"}
                `}
              >
                {count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
