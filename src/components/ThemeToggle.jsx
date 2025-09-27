import React from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isDark ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      aria-label="Toggle theme"
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isDark ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
      
      {/* Sun Icon */}
      <FaSun
        className={`absolute left-1 top-1 h-4 w-4 text-yellow-500 transition-opacity ${
          isDark ? 'opacity-0' : 'opacity-100'
        }`}
      />
      
      {/* Moon Icon */}
      <FaMoon
        className={`absolute right-1 top-1 h-4 w-4 text-blue-300 transition-opacity ${
          isDark ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </button>
  )
}

export default ThemeToggle