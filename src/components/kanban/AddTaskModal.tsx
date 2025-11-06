'use client'

import React, { useState, useEffect } from 'react'
import { Task } from '@/types/kanban'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (title: string, description: string) => void
  initialTask?: Task
  isEditing?: boolean
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  isEditing = false,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{ title?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isEditing && initialTask) {
      setTitle(initialTask.title)
      setDescription(initialTask.description)
    } else {
      setTitle('')
      setDescription('')
    }
    setErrors({})
  }, [isOpen, initialTask, isEditing])

  const validate = (): boolean => {
    const newErrors: { title?: string } = {}

    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 200))
      onSave(title.trim(), description.trim())
      setTitle('')
      setDescription('')
      setErrors({})
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Add New Task'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          autoFocus
        />

        <Textarea
          label="Description (Optional)"
          placeholder="Add notes, details, or description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />

        {/* Form Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="flex-1"
          >
            {isEditing ? 'Update Task' : 'Add Task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddTaskModal
