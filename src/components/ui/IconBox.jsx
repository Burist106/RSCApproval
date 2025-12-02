/**
 * IconBox Component
 * Styled icon container with color variants
 * 
 * @param {string} color - 'primary' | 'blue' | 'purple' | 'teal' | 'green'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} hoverInvert - Invert colors on hover
 * @param {string} icon - Font Awesome icon class
 */

const colors = {
  primary: {
    base: 'bg-primary-100 text-primary-500',
    hover: 'group-hover:bg-primary-500 group-hover:text-white',
  },
  blue: {
    base: 'bg-blue-100 text-blue-600',
    hover: 'group-hover:bg-blue-600 group-hover:text-white',
  },
  purple: {
    base: 'bg-purple-100 text-purple-600',
    hover: 'group-hover:bg-purple-600 group-hover:text-white',
  },
  teal: {
    base: 'bg-teal-100 text-teal-600',
    hover: 'group-hover:bg-teal-600 group-hover:text-white',
  },
  green: {
    base: 'bg-green-100 text-green-600',
    hover: 'group-hover:bg-green-600 group-hover:text-white',
  },
}

const sizes = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-4xl',
}

export default function IconBox({ 
  color = 'primary', 
  size = 'md',
  hoverInvert = false,
  icon,
  className = '',
}) {
  const colorClasses = colors[color]
  
  return (
    <div className={`
      rounded-xl flex items-center justify-center transition-all
      ${sizes[size]}
      ${colorClasses.base}
      ${hoverInvert ? colorClasses.hover : ''}
      ${className}
    `}>
      <i className={icon}></i>
    </div>
  )
}
