import React from 'react'
import { FaSpinner } from 'react-icons/fa'

const LoadingSpinner = ({ message = 'Loading...', size = 'default' }) => {
  const sizeClasses = {
    small: 'text-lg',
    default: 'text-2xl',
    large: 'text-4xl'
  }

  const containerClasses = {
    small: 'py-4',
    default: 'py-8',
    large: 'py-16'
  }

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses[size]}`}>
      <FaSpinner className={`animate-spin text-blue-600 mb-4 ${sizeClasses[size]}`} />
      <p className="text-gray-600 animate-pulse">{message}</p>
    </div>
  )
}

const SkeletonCard = ({ className = "" }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="bg-gray-300 rounded-lg h-4 w-3/4 mb-2"></div>
    <div className="bg-gray-300 rounded-lg h-4 w-1/2 mb-2"></div>
    <div className="bg-gray-300 rounded-lg h-3 w-full"></div>
  </div>
)

const SkeletonProject = () => (
  <div className="animate-pulse bg-white rounded-xl shadow-lg overflow-hidden">
    <div className="bg-gray-300 h-48 w-full"></div>
    <div className="p-6">
      <div className="bg-gray-300 h-6 w-3/4 mb-3 rounded"></div>
      <div className="bg-gray-300 h-4 w-full mb-2 rounded"></div>
      <div className="bg-gray-300 h-4 w-2/3 mb-4 rounded"></div>
      <div className="flex space-x-2">
        <div className="bg-gray-300 h-6 w-16 rounded-full"></div>
        <div className="bg-gray-300 h-6 w-20 rounded-full"></div>
        <div className="bg-gray-300 h-6 w-18 rounded-full"></div>
      </div>
    </div>
  </div>
)

const SkeletonSkill = () => (
  <div className="animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-3">
        <div className="bg-gray-300 w-6 h-6 rounded"></div>
        <div className="bg-gray-300 h-4 w-20 rounded"></div>
      </div>
      <div className="bg-gray-300 h-4 w-8 rounded"></div>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-gray-300 h-2 rounded-full w-3/4"></div>
    </div>
  </div>
)

export { LoadingSpinner, SkeletonCard, SkeletonProject, SkeletonSkill }
export default LoadingSpinner