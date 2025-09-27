import React, { useState, useRef } from 'react'
import { FaUpload, FaImage, FaTrash, FaSpinner, FaCheck, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const ImageUpload = ({ 
  onUpload, 
  onDelete, 
  currentImage, 
  uploadType = 'general',
  className = '',
  placeholder = 'Click to upload image',
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp']
}) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const validateFile = (file) => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return 'Invalid file type. Please upload JPEG, PNG, or WebP images.'
    }

    // Check file size (convert MB to bytes)
    if (file.size > maxSize * 1024 * 1024) {
      return `File too large. Maximum size is ${maxSize}MB.`
    }

    return null
  }

  const handleFileSelect = async (file) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      setTimeout(() => setError(''), 5000)
      return
    }

    setError('')
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('type', uploadType)

      const response = await fetch('http://localhost:8000/api/v1/portfolio/upload/image/', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        onUpload && onUpload(result)
      } else {
        setError(result.error || 'Upload failed')
        setTimeout(() => setError(''), 5000)
      }
    } catch (err) {
      setError('Upload failed. Please try again.')
      setTimeout(() => setError(''), 5000)
    } finally {
      setUploading(false)
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDelete = async () => {
    if (currentImage && onDelete) {
      setUploading(true)
      try {
        await onDelete(currentImage)
      } catch (err) {
        setError('Failed to delete image')
        setTimeout(() => setError(''), 5000)
      } finally {
        setUploading(false)
      }
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        className="hidden"
      />

      <div
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-all duration-300 cursor-pointer
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${currentImage ? 'border-solid' : ''}
        `}
      >
        {currentImage ? (
          <div className="relative">
            <img
              src={currentImage}
              alt="Uploaded"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
              <div className="flex space-x-2 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    openFileDialog()
                  }}
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  disabled={uploading}
                >
                  <FaUpload />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete()
                  }}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  disabled={uploading}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <FaImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">{placeholder}</p>
            <p className="text-sm text-gray-500">
              Drag and drop or click to select
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Max size: {maxSize}MB • Formats: JPEG, PNG, WebP
            </p>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <FaSpinner className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
          >
            <FaTimes className="text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center"
          >
            <FaCheck className="text-green-500 mr-2" />
            <span className="text-green-700 text-sm">Upload successful!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ImageUpload