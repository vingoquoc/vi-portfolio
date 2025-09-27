import React, { useState, useRef } from 'react'
import { FaUpload, FaFile, FaTrash, FaSpinner, FaCheck, FaTimes, FaFilePdf, FaFileWord } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'

const FileUpload = ({ 
  onUpload, 
  onDelete, 
  currentFile, 
  className = '',
  placeholder = 'Click to upload file',
  maxSize = 10,
  acceptedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  fileTypeLabel = 'PDF or Word documents'
}) => {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return FaFilePdf
    if (fileType?.includes('word') || fileType?.includes('document')) return FaFileWord
    return FaFile
  }

  const getFileTypeFromName = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return 'application/pdf'
    if (ext === 'doc') return 'application/msword'
    if (ext === 'docx') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    return ''
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateFile = (file) => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `Invalid file type. Please upload ${fileTypeLabel}.`
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
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/api/v1/portfolio/upload/resume/', {
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
    if (currentFile && onDelete) {
      setUploading(true)
      try {
        await onDelete(currentFile)
      } catch (err) {
        setError('Failed to delete file')
        setTimeout(() => setError(''), 5000)
      } finally {
        setUploading(false)
      }
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const FileIcon = currentFile ? getFileIcon(getFileTypeFromName(currentFile.name)) : FaFile

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
          ${currentFile ? 'border-solid border-green-300 bg-green-50' : ''}
        `}
      >
        {currentFile ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileIcon className="text-2xl text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">{currentFile.name}</p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(currentFile.size)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openFileDialog()
                }}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                disabled={uploading}
                title="Replace file"
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
                title="Delete file"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <FaFile className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">{placeholder}</p>
            <p className="text-sm text-gray-500">
              Drag and drop or click to select
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Max size: {maxSize}MB • Formats: {fileTypeLabel}
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

export default FileUpload