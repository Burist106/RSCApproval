/**
 * StepCircle Component
 * Display process step with number and description
 * 
 * @param {number} step - Step number
 * @param {string} status - 'default' | 'active' | 'done'
 * @param {string} title - Step title
 * @param {string} description - Step description
 */

const statusStyles = {
  default: 'bg-slate-50 text-slate-400',
  active: 'bg-primary-50 text-primary-500',
  done: 'bg-green-50 text-green-500',
}

export default function StepCircle({ 
  step, 
  status = 'default', 
  title, 
  description 
}) {
  return (
    <div className="relative bg-white p-4">
      <div className={`
        w-24 h-24 border-4 border-white shadow-card-hover rounded-full 
        flex items-center justify-center mx-auto mb-6 text-3xl font-bold
        ${statusStyles[status]}
      `}>
        {step}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  )
}
