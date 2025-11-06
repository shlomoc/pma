export interface Task {
  id: string
  title: string
  description: string
  columnId: string
  order: number
  createdAt: number
}

export interface Column {
  id: string
  title: string
  order: number
}

export interface KanbanBoard {
  columns: Column[]
  tasks: Task[]
}
