'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DndContext,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Task } from '@/types/kanban'
import { useKanbanStore } from '@/stores/kanbanStore'
import Column from './Column'
import TaskCard from './TaskCard'
import AddTaskModal from './AddTaskModal'
import AddColumnModal from './AddColumnModal'
import Button from '@/components/ui/Button'
import { Plus } from 'lucide-react'

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    className: {
      active: 'active:opacity-0',
    },
  }),
}

const Board: React.FC = () => {
  const {
    columns,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    reorderTasks,
    addColumn,
    deleteColumn,
    initialize,
  } = useKanbanStore()

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [columnModalOpen, setColumnModalOpen] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<string>('todo')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Initialize store on mount (hydration)
  useEffect(() => {
    initialize()
  }, [initialize])

  // Configure drag sensors
  const sensors = useSensors(useSensor(PointerSensor))

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'Task') {
      setActiveTask(active.data.current.task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return

    const activeId = active.id
    const overId = over.id

    if (activeId === overId) return

    const activeTask = tasks.find((t) => t.id === activeId)
    const overTask = tasks.find((t) => t.id === overId)
    const overColumn = columns.find((c) => c.id === overId)

    if (!activeTask) return

    // Dragging over a column (empty area) - only move if different column
    if (overColumn && activeTask.columnId !== overColumn.id) {
      updateTask(activeTask.id, {
        columnId: overColumn.id,
      })
      return
    }

    // Dragging over another task in a different column
    if (overTask && activeTask.columnId !== overTask.columnId) {
      updateTask(activeTask.id, {
        columnId: overTask.columnId,
      })
      return
    }

    // Reorder within same column only
    if (overTask && activeTask.columnId === overTask.columnId) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId)
      const overIndex = tasks.findIndex((t) => t.id === overId)

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const newTasks = arrayMove(tasks, activeIndex, overIndex)
        reorderTasks(newTasks)
      }
    }
  }

  const handleDragEnd = () => {
    setActiveTask(null)
  }

  const handleAddTask = useCallback(
    (columnId: string) => {
      setSelectedColumnId(columnId)
      setEditingTask(null)
      setTaskModalOpen(true)
    },
    []
  )

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task)
    setTaskModalOpen(true)
  }, [])

  const handleSaveTask = useCallback(
    (title: string, description: string) => {
      if (editingTask) {
        // Update existing task
        updateTask(editingTask.id, { title, description })
      } else {
        // Add new task
        addTask(title, description, selectedColumnId)
      }
    },
    [editingTask, selectedColumnId, addTask, updateTask]
  )

  const handleAddColumn = useCallback((title: string) => {
    addColumn(title)
  }, [addColumn])

  // Get tasks sorted by column and order
  const getTasksByColumn = (columnId: string) => {
    return tasks
      .filter((task) => task.columnId === columnId)
      .sort((a, b) => a.order - b.order)
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen px-4 py-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Kanban Board
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Organize and track your coding projects with beautiful cards
            </p>
          </div>

          {/* Board */}
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 md:pb-0">
            {columns
              .sort((a, b) => a.order - b.order)
              .map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={getTasksByColumn(column.id)}
                  onAddTask={() => handleAddTask(column.id)}
                  onEditTask={handleEditTask}
                  onDeleteTask={deleteTask}
                  onDeleteColumn={deleteColumn}
                />
              ))}

            {/* Add Column Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex-1 min-w-[350px] h-fit"
            >
              <Button
                onClick={() => setColumnModalOpen(true)}
                variant="secondary"
                size="lg"
                className="w-full h-12 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Add Column
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ) : null}
      </DragOverlay>

      {/* Modals */}
      <AddTaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask || undefined}
        isEditing={!!editingTask}
      />

      <AddColumnModal
        isOpen={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        onSave={handleAddColumn}
      />
    </DndContext>
  )
}

export default Board
