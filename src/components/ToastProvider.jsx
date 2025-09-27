import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaExclamationTriangle, FaInfo, FaTimes } from 'react-icons/fa'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const Toast = ({ toast, onRemove }) => {
  const icons = {
    success: FaCheck,
    error: FaExclamationTriangle,
    info: FaInfo,
    warning: FaExclamationTriangle
  }

  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-black'
  }

  const Icon = icons[toast.type] || FaInfo

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5 }}
      transition={{ duration: 0.3 }}
      className={`max-w-sm w-full ${colors[toast.type]} shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <Icon className="h-5 w-5" />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">
              {toast.title}
            </p>
            {toast.message && (
              <p className="mt-1 text-sm opacity-90">
                {toast.message}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => onRemove(toast.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium hover:opacity-75 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    const duration = toast.duration || 5000
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const removeAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  // Convenience methods
  const success = useCallback((title, message, options = {}) => {
    return addToast({ ...options, type: 'success', title, message })
  }, [addToast])

  const error = useCallback((title, message, options = {}) => {
    return addToast({ ...options, type: 'error', title, message })
  }, [addToast])

  const info = useCallback((title, message, options = {}) => {
    return addToast({ ...options, type: 'info', title, message })
  }, [addToast])

  const warning = useCallback((title, message, options = {}) => {
    return addToast({ ...options, type: 'warning', title, message })
  }, [addToast])

  const value = {
    addToast,
    removeToast,
    removeAllToasts,
    success,
    error,
    info,
    warning
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-0 right-0 z-50 p-6 sm:p-6">
        <div className="flex flex-col space-y-4">
          <AnimatePresence>
            {toasts.map(toast => (
              <Toast
                key={toast.id}
                toast={toast}
                onRemove={removeToast}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider