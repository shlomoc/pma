'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check } from 'lucide-react'
import Modal from '@/components/ui/Modal'

interface AIPromptModalProps {
  isOpen: boolean
  onClose: () => void
  prompt: string
  isLoading: boolean
}

const AIPromptModal: React.FC<AIPromptModalProps> = ({
  isOpen,
  onClose,
  prompt,
  isLoading,
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy prompt:', error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Generated Prompt"
      size="lg"
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full"
            />
            <p className="text-gray-600 dark:text-gray-400 mt-4">Generating your prompt...</p>
          </div>
        ) : prompt.includes('Error') ? (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200 text-sm leading-relaxed">
              {prompt}
            </p>
            <p className="text-red-600 dark:text-red-400 text-xs mt-3">
              To use the AI feature, set your ANTHROPIC_API_KEY environment variable in .env.local
            </p>
          </div>
        ) : (
          <>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                {prompt}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopyPrompt}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${
                isCopied
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40'
              }`}
            >
              {isCopied ? (
                <>
                  <Check size={18} />
                  Copied to clipboard!
                </>
              ) : (
                <>
                  <Copy size={18} />
                  Copy Prompt
                </>
              )}
            </motion.button>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Ready to paste into Claude Code
            </p>
          </>
        )}
      </div>
    </Modal>
  )
}

export default AIPromptModal
