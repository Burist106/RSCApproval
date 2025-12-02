/**
 * Select Component
 * Reusable select dropdown with label
 * 
 * @param {string} label - Select label
 * @param {Array} options - Array of { value, label }
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message
 * @param {string} icon - Font Awesome icon class (optional)
 */

export default function Select({ 
  label,
  options = [],
  placeholder = 'เลือก...',
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
        <select
          className={`
            w-full px-4 py-3 rounded-xl border border-slate-200 
            bg-white text-slate-800 appearance-none
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all cursor-pointer
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <i className="fa-solid fa-chevron-down text-slate-400 text-sm"></i>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
