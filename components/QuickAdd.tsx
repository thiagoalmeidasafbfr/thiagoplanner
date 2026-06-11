"use client";

import { useState } from "react";

interface QuickAddProps {
  onAdd: (title: string) => void;
}

export function QuickAdd({ onAdd }: QuickAddProps) {
  const [value, setValue] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
    if (e.key === "Escape") {
      setValue("");
    }
  }

  return (
    <div className="flex items-center gap-3 bg-cream-card border border-[rgba(26,20,16,0.08)] rounded-md px-4 py-3 shadow-card focus-within:border-gold focus-within:shadow-[0_0_0_3px_rgba(190,140,74,0.12)] transition-all duration-150">
      {/* Plus icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="text-gold flex-shrink-0"
      >
        <path
          d="M8 2v12M2 8h12"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Adicionar tarefa — pressione Enter para criar"
        className="flex-1 bg-transparent font-inter text-sm text-ink-primary placeholder:text-[rgba(26,20,16,0.3)] outline-none leading-none"
      />
      {value.trim() && (
        <span className="font-ibm-plex-mono text-[10px] text-[rgba(26,20,16,0.3)] uppercase tracking-label flex-shrink-0">
          Enter ↵
        </span>
      )}
    </div>
  );
}
