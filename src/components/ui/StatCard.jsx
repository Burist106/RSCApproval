/**
 * StatCard Component
 * Display statistics with icon and trend
 * 
 * @param {string} title - Stat title/label
 * @param {string|number} value - Stat value
 * @param {string} icon - Font Awesome icon class
 * @param {string} color - 'primary' | 'blue' | 'green' | 'purple' | 'amber'
 * @param {string} trend - Trend text (e.g., "+12%")
 * @param {boolean} trendUp - Trend direction
 */

const colors = {
  primary: {
    bg: 'bg-primary-50',
    icon: 'text-primary-500',
    value: 'text-primary-600',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    value: 'text-blue-600',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-500',
    value: 'text-green-600',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-500',
    value: 'text-purple-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-500',
    value: 'text-amber-600',
  },
  slate: {
    bg: 'bg-slate-50',
    icon: 'text-slate-500',
    value: 'text-slate-800',
  },
}

export default function StatCard({ 
  title,
  value,
  icon,
  color = 'slate',
  trend,
  trendUp = true,
  className = '' 
}) {
  const colorStyles = colors[color] || colors.slate
  
  return (
    <div className={`bg-white p-6 rounded-2xl border border-slate-100 shadow-card ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className={`text-2xl font-bold ${colorStyles.value}`}>
            {value}
          </h3>
          {trend && (
            <p className={`text-xs mt-2 ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
              <i className={`fa-solid ${trendUp ? 'fa-arrow-up' : 'fa-arrow-down'} mr-1`}></i>
              {trend}
            </p>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-xl ${colorStyles.bg} flex items-center justify-center`}>
            <i className={`${icon} text-xl ${colorStyles.icon}`}></i>
          </div>
        )}
      </div>
    </div>
  )
}
