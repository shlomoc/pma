'use client'

import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'

export default function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-3 rounded-lg bg-white dark:bg-gray-800
                 border border-gray-200 dark:border-gray-700 shadow-md
                 hover:shadow-lg transition-all duration-200 z-50
                 text-gray-900 dark:text-gray-100"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  )
}
