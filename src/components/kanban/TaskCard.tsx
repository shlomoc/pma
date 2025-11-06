'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Edit2, Sparkles } from 'lucide-react'
import { Task } from '@/types/kanban'
import { truncateText } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onGenerateAIPrompt?: (task: Task) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onGenerateAIPrompt }) => {
  const [isHovered, setIsHovered] = useState(false)

  // Debug logging
  console.log(`TaskCard ${task.id}: onGenerateAIPrompt=${!!onGenerateAIPrompt}, isHovered=${isHovered}`)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => !isDragging && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileDrag={{ scale: 1.05, opacity: 0.95 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md"
      {...attributes}
      {...listeners}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex-1 pr-2">{task.title}</h3>

        {/* Action Buttons */}
        {true && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1 pointer-events-auto"
          >
            {onGenerateAIPrompt && (
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onGenerateAIPrompt(task)
                }}
                className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded transition-colors pointer-events-auto"
                title="Generate AI prompt"
              >
                <Sparkles size={16} />
              </button>
            )}
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onEdit(task)
              }}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors pointer-events-auto"
              title="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onDelete(task.id)
              }}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors pointer-events-auto"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </motion.div>
        )}
      </div>

      {/* Description Preview */}
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {truncateText(task.description, 80)}
        </p>
      )}

      {/* Empty state message */}
      {!task.description && (
        <p className="text-xs text-gray-400 dark:text-gray-500 italic">No description</p>
      )}
    </motion.div>
  )
}

export default TaskCard
