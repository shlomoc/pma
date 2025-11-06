'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, Column } from '@/types/kanban'
import { v4 as uuidv4 } from 'uuid'

interface KanbanState {
  columns: Column[]
  tasks: Task[]
  addColumn: (title: string) => void
  deleteColumn: (id: string) => void
  renameColumn: (id: string, title: string) => void
  addTask: (title: string, description: string, columnId: string) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  reorderTasks: (tasks: Task[]) => void
  initialize: () => void
}

const defaultColumns: Column[] = [
  { id: 'todo', title: 'TODO', order: 0 },
  { id: 'in-progress', title: 'In Progress', order: 1 },
  { id: 'completed', title: 'Completed', order: 2 },
]

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      columns: defaultColumns,
      tasks: [],

      addColumn: (title: string) => {
        const newColumn: Column = {
          id: uuidv4(),
          title,
          order: get().columns.length,
        }
        set((state) => ({
          columns: [...state.columns, newColumn],
        }))
      },

      deleteColumn: (id: string) => {
        set((state) => ({
          columns: state.columns.filter((col) => col.id !== id),
          tasks: state.tasks.filter((task) => task.columnId !== id),
        }))
      },

      renameColumn: (id: string, title: string) => {
        set((state) => ({
          columns: state.columns.map((col) =>
            col.id === id ? { ...col, title } : col
          ),
        }))
      },

      addTask: (title: string, description: string, columnId: string) => {
        const newTask: Task = {
          id: uuidv4(),
          title,
          description,
          columnId,
          order: get().tasks.filter((t) => t.columnId === columnId).length,
          createdAt: Date.now(),
        }
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }))
      },

      updateTask: (id: string, updates: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }))
      },

      deleteTask: (id: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }))
      },

      reorderTasks: (tasks: Task[]) => {
        set({ tasks })
      },

      initialize: () => {
        // This is called on hydration to ensure default columns exist
        const state = get()
        if (state.columns.length === 0) {
          set({ columns: defaultColumns })
        }
      },
    }),
    {
      name: 'kanban-storage',
      version: 1,
    }
  )
)
