export type TaskStatus = 'todo' | 'doing' | 'done' | 'blocked'

export type Step = {
  id: string
  text: string
  done: boolean
  createdAt: string
}

export type Comment = {
  id: string
  text: string
  createdAt: string
}

export type HistoryEntry = {
  id: string
  action: string
  detail?: string
  timestamp: string
}

export type Task = {
  id: string
  title: string
  description: string
  status: TaskStatus
  tags: string[]
  steps: Step[]
  comments: Comment[]
  history: HistoryEntry[]
  createdAt: string
  updatedAt: string
}

export type FilterType = 'all' | 'today' | 'doing' | 'done' | 'blocked'
