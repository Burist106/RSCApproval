/**
 * Textarea Component
 * Reusable textarea with label
 * 
 * @param {string} label - Textarea label
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message
 * @param {number} rows - Number of rows
 */

export default function Textarea({ 
  label,
  placeholder,
  error,
  rows = 4,
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
      <textarea
        rows={rows}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-xl border border-slate-200 
          bg-white text-slate-800 placeholder-slate-400 resize-none
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
