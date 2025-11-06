'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { Task, Column as ColumnType } from '@/types/kanban'
import TaskCard from './TaskCard'
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

interface ColumnProps {
  column: ColumnType
  tasks: Task[]
  onAddTask: () => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
  onDeleteColumn: (columnId: string) => void
}

const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  })

  const taskIds = tasks.map((task) => task.id)

  return (
    <motion.div
      ref={setNodeRef}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex-1 min-w-[280px] sm:min-w-[320px] md:min-w-[350px] bg-gray-50 rounded-xl border-2 transition-all duration-200 ${
        isOver ? 'border-blue-500 bg-blue-50/30 shadow-md' : 'border-gray-200'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">{column.title}</h2>
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold bg-gray-200 text-gray-700 rounded-full">
            {tasks.length}
          </span>
        </div>

        {/* Delete Column Button */}
        {column.id !== 'todo' && column.id !== 'in-progress' && column.id !== 'completed' && (
          <button
            onClick={() => onDeleteColumn(column.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete column"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      {/* Tasks Container */}
      <div className="p-4 space-y-3 min-h-[300px]">
        <SortableContext
          items={taskIds}
          strategy={verticalListSortingStrategy}
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <div className="text-4xl mb-2">✨</div>
              <p className="text-sm">No tasks yet</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </SortableContext>
      </div>

      {/* Add Task Button */}
      <div className="px-4 pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddTask}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 text-gray-600 font-medium rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
        >
          <Plus size={18} />
          Add Task
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Column
