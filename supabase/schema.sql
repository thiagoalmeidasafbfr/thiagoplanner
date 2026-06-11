-- Run this in the Supabase SQL Editor before deploying
-- Project: thiagoplanner

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  status text not null default 'todo'
    check (status in ('todo', 'doing', 'done', 'blocked')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists steps (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  text text not null default '',
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  text text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists task_history (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  action text not null,
  detail text,
  timestamp timestamptz not null default now()
);

-- Indexes
create index if not exists steps_task_id_idx on steps(task_id);
create index if not exists comments_task_id_idx on comments(task_id);
create index if not exists task_history_task_id_idx on task_history(task_id);
create index if not exists tasks_created_at_idx on tasks(created_at desc);

-- Disable RLS (personal use — single owner, no auth)
alter table tasks disable row level security;
alter table steps disable row level security;
alter table comments disable row level security;
alter table task_history disable row level security;
