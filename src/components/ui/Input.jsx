/**
 * Input Component
 * Reusable form input with label and error state
 * 
 * @param {string} label - Input label
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message
 * @param {string} icon - Font Awesome icon class (optional)
 * @param {string} className - Additional classes
 */

export default function Input({ 
  label,
  type = 'text',
  placeholder,
  error,
  icon,
  className = '',
  ...props 
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <i className={`${icon} text-slate-400`}></i>
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-xl border border-slate-200 
            bg-white text-slate-800 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
