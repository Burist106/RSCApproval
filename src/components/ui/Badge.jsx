/**
 * Badge Component
 * Display status badges or tags
 * 
 * @param {string} variant - 'primary' | 'success' | 'warning' | 'info'
 * @param {boolean} dot - Show status dot
 * @param {React.ReactNode} children
 */

const variants = {
  primary: 'bg-primary-50 border-primary-100 text-primary-500',
  success: 'bg-green-50 border-green-100 text-green-600',
  warning: 'bg-yellow-50 border-yellow-100 text-yellow-600',
  info: 'bg-blue-50 border-blue-100 text-blue-600',
}

const dotColors = {
  primary: 'bg-primary-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500',
}

export default function Badge({ 
  variant = 'primary', 
  dot = false,
  className = '',
  children 
}) {
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${variants[variant]} ${className}`}>
      {dot && <span className={`flex h-2 w-2 rounded-full ${dotColors[variant]}`}></span>}
      {children}
    </div>
  )
}
