"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTasks } from "@/hooks/useTasks";
import { Suspense } from "react";

type NavItem = {
  label: string;
  filter: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Todas", filter: "all", href: "/?filter=all" },
  { label: "Hoje", filter: "today", href: "/?filter=today" },
  { label: "Fazendo", filter: "doing", href: "/?filter=doing" },
  { label: "Concluídas", filter: "done", href: "/?filter=done" },
  { label: "Bloqueadas", filter: "blocked", href: "/?filter=blocked" },
];

function SidebarInner() {
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get("filter") || "all";
  const { counts } = useTasks();

  return (
    <aside
      style={{ width: "240px", minWidth: "240px" }}
      className="flex flex-col h-screen bg-ink-primary border-r border-r-[rgba(243,238,226,0.06)] select-none overflow-hidden"
    >
      {/* App name */}
      <div className="px-6 pt-7 pb-6">
        <span
          className="font-fraunces text-gold text-xl font-semibold tracking-tight leading-none block"
        >
          ThiagoPlanner
        </span>
        <span
          className="font-ibm-plex-mono text-[rgba(243,238,226,0.4)] text-[10px] uppercase tracking-label mt-1.5 block"
        >
          Planejador
        </span>
      </div>

      {/* Divider */}
      <div className="mx-6 h-px bg-[rgba(243,238,226,0.07)]" />

      {/* Nav */}
      <nav className="flex-1 px-3 pt-5 overflow-y-auto">
        <p className="font-ibm-plex-mono text-[rgba(243,238,226,0.35)] text-[9px] uppercase tracking-label px-3 mb-2">
          Tarefas
        </p>

        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = currentFilter === item.filter;
            const count =
              item.filter === "all"
                ? counts.all
                : item.filter === "today"
                ? counts.today
                : item.filter === "doing"
                ? counts.doing
                : item.filter === "done"
                ? counts.done
                : item.filter === "blocked"
                ? counts.blocked
                : 0;

            return (
              <li key={item.filter}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-md transition-colors duration-150
                    ${
                      isActive
                        ? "bg-[rgba(190,140,74,0.15)] text-gold"
                        : "text-[rgba(243,238,226,0.65)] hover:text-on-dark hover:bg-[rgba(243,238,226,0.05)]"
                    }
                  `}
                >
                  <span className="font-inter text-sm font-medium leading-none">
                    {item.label}
                  </span>
                  {count > 0 && (
                    <span
                      className={`
                        font-jetbrains-mono text-[11px] leading-none px-1.5 py-0.5 rounded-sm
                        ${
                          isActive
                            ? "text-gold bg-[rgba(190,140,74,0.2)]"
                            : "text-[rgba(243,238,226,0.35)] bg-[rgba(243,238,226,0.06)]"
                        }
                      `}
                    >
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom stats */}
      <div className="px-6 py-5 border-t border-[rgba(243,238,226,0.07)]">
        <p className="font-ibm-plex-mono text-[rgba(243,238,226,0.35)] text-[9px] uppercase tracking-label mb-3">
          Resumo
        </p>
        <div className="space-y-2">
          <StatRow label="A fazer" value={counts.todo} />
          <StatRow label="Fazendo" value={counts.doing} accent="gold" />
          <StatRow label="Concluídas" value={counts.done} accent="green" />
          <StatRow label="Bloqueadas" value={counts.blocked} accent="red" />
        </div>
      </div>
    </aside>
  );
}

function StatRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "gold" | "green" | "red";
}) {
  const valueColor =
    accent === "gold"
      ? "text-gold"
      : accent === "green"
      ? "text-var-pos"
      : accent === "red"
      ? "text-var-neg"
      : "text-[rgba(243,238,226,0.5)]";

  return (
    <div className="flex items-center justify-between">
      <span className="font-inter text-[rgba(243,238,226,0.45)] text-xs">
        {label}
      </span>
      <span className={`font-jetbrains-mono text-xs font-medium ${valueColor}`}>
        {value}
      </span>
    </div>
  );
}

export function Sidebar() {
  return (
    <Suspense
      fallback={
        <aside
          style={{ width: "240px", minWidth: "240px" }}
          className="flex flex-col h-screen bg-ink-primary"
        />
      }
    >
      <SidebarInner />
    </Suspense>
  );
}
