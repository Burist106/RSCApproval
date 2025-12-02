import { useState, useRef } from 'react'

/**
 * FileUpload Component
 * Drag-and-drop file upload with preview
 * 
 * @param {string} label - Input label
 * @param {string} accept - Accepted file types
 * @param {boolean} multiple - Allow multiple files
 * @param {number} maxSize - Max file size in MB
 * @param {array} files - Controlled files array
 * @param {function} onChange - Change handler
 * @param {string} hint - Help text
 */

export default function FileUpload({
  label,
  accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png',
  multiple = true,
  maxSize = 10, // MB
  files = [],
  onChange,
  hint,
  className = '',
}) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }

  const handleInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    handleFiles(selectedFiles)
  }

  const handleFiles = (newFiles) => {
    // Validate file size
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน ${maxSize} MB`)
        return false
      }
      return true
    })

    if (onChange) {
      if (multiple) {
        onChange([...files, ...validFiles])
      } else {
        onChange(validFiles.slice(0, 1))
      }
    }
  }

  const handleRemove = (index) => {
    if (onChange) {
      const newFiles = files.filter((_, i) => i !== index)
      onChange(newFiles)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    if (['pdf'].includes(ext)) return 'fa-solid fa-file-pdf text-red-500'
    if (['doc', 'docx'].includes(ext)) return 'fa-solid fa-file-word text-blue-500'
    if (['xls', 'xlsx'].includes(ext)) return 'fa-solid fa-file-excel text-green-500'
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'fa-solid fa-file-image text-purple-500'
    return 'fa-solid fa-file text-slate-400'
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-slate-200 hover:border-primary-300 hover:bg-slate-50'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />
        
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className={`fa-solid fa-cloud-arrow-up text-xl ${isDragging ? 'text-primary-500' : 'text-slate-400'}`}></i>
        </div>
        
        <p className="text-sm font-medium text-slate-700 mb-1">
          {isDragging ? 'วางไฟล์ที่นี่' : 'คลิกหรือลากไฟล์มาวาง'}
        </p>
        <p className="text-xs text-slate-400">
          รองรับไฟล์ PDF, Word, Excel, รูปภาพ (ขนาดไม่เกิน {maxSize} MB)
        </p>
      </div>
      
      {hint && (
        <p className="text-xs text-slate-400 mt-2">{hint}</p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group"
            >
              <i className={`${getFileIcon(file.name)} text-lg`}></i>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index)
                }}
                className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
