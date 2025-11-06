'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Edit2 } from 'lucide-react'
import { Task } from '@/types/kanban'
import { truncateText } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false)

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
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={!isDragging ? { y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' } : {}}
      whileDrag={{ scale: 1.05, opacity: 0.95 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 cursor-grab active:cursor-grabbing transition-all duration-200"
      {...attributes}
      {...listeners}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex-1 pr-2">{task.title}</h3>

        {/* Action Buttons */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1"
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(task)
              }}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
              title="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(task.id)
              }}
              className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
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
