/**
 * Card Component
 * Reusable card container with variants
 * 
 * @param {string} variant - 'default' | 'bordered' | 'elevated'
 * @param {boolean} hover - Enable hover effect
 * @param {string} padding - Padding class override
 * @param {string} className - Additional classes
 * @param {function} onClick - Click handler
 */

const variants = {
  default: 'bg-white border border-slate-100',
  bordered: 'bg-white border-2 border-slate-200',
  elevated: 'bg-white shadow-card',
}

export default function Card({ 
  variant = 'default',
  hover = false,
  padding = 'p-6',
  className = '',
  onClick,
  children,
  ...props 
}) {
  const hoverClasses = hover 
    ? 'hover:shadow-card-hover hover:-translate-y-1 cursor-pointer transition-all' 
    : ''
  
  const Component = onClick ? 'button' : 'div'
  
  return (
    <Component 
      className={`rounded-2xl ${variants[variant]} ${padding} ${hoverClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  )
}
