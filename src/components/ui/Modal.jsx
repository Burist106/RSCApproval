/**
 * Modal Component
 * Reusable modal wrapper with backdrop
 * 
 * @param {boolean} isOpen - Show/hide modal
 * @param {function} onClose - Close handler
 * @param {string} maxWidth - Max width class (default: max-w-md)
 * @param {React.ReactNode} children
 */

export default function Modal({ 
  isOpen, 
  onClose, 
  maxWidth = 'max-w-md',
  children 
}) {
  if (!isOpen) return null
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className={`bg-white p-8 rounded-2xl shadow-2xl w-full ${maxWidth} relative overflow-hidden animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>
        {children}
      </div>
    </div>
  )
}
