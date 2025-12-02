/**
 * Button Component
 * Reusable button with multiple variants
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} pill - Use pill shape (rounded-full)
 * @param {string} className - Additional classes
 * @param {React.ReactNode} children
 */

const variants = {
  primary: 'bg-primary-500 text-white shadow-xl shadow-primary-200 hover:bg-primary-600',
  secondary: 'bg-slate-900 text-white hover:bg-primary-500',
  outline: 'border border-slate-200 text-slate-600 hover:bg-slate-50',
  ghost: 'text-slate-600 hover:bg-slate-100',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-2.5 font-medium',
  lg: 'px-8 py-4 text-lg font-bold',
}

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  pill = false,
  className = '',
  children,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 transition-all'
  const shapeClass = pill ? 'rounded-full' : 'rounded-xl'
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${shapeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
