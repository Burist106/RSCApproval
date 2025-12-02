/**
 * SectionHeader Component
 * Consistent section title and subtitle
 * 
 * @param {string} title - Section title
 * @param {string} subtitle - Section description
 * @param {string} className - Additional classes for container
 */

export default function SectionHeader({ 
  title, 
  subtitle,
  className = '' 
}) {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
      {subtitle && (
        <p className="text-slate-500 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  )
}
