/**
 * Divider Component
 * Horizontal divider with optional text
 * 
 * @param {string} text - Optional text to display in the middle
 * @param {string} className - Additional classes
 */

export default function Divider({ text, className = '' }) {
  if (text) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 h-px bg-slate-200"></div>
        <span className="text-sm text-slate-400 font-medium">{text}</span>
        <div className="flex-1 h-px bg-slate-200"></div>
      </div>
    )
  }
  
  return <div className={`h-px bg-slate-200 ${className}`}></div>
}
