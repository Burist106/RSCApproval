import { IconBox } from './ui'

/**
 * FeatureCard Component
 * Display feature/service card with icon
 * 
 * @param {string} icon - Font Awesome icon class
 * @param {string} color - Icon color variant
 * @param {string} title - Card title
 * @param {string} description - Card description
 */

export default function FeatureCard({ 
  icon, 
  color = 'primary', 
  title, 
  description 
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-card border border-slate-100 hover:shadow-card-hover hover:-translate-y-1 transition-all group">
      <IconBox 
        icon={icon} 
        color={color} 
        hoverInvert 
        className="mb-6" 
      />
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
