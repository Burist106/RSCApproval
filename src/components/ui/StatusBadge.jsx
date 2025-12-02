/**
 * StatusBadge Component
 * Display workflow status with color coding
 * 
 * @param {string} status - 'draft' | 'pending' | 'reviewing' | 'approved' | 'rejected' | 'completed'
 * @param {string} size - 'sm' | 'md'
 */

const statusConfig = {
  draft: {
    label: 'ฉบับร่าง',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    icon: 'fa-solid fa-file-pen',
  },
  pending: {
    label: 'รอตรวจสอบ',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
    icon: 'fa-solid fa-clock',
  },
  reviewing: {
    label: 'กำลังตรวจสอบ',
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    icon: 'fa-solid fa-magnifying-glass',
  },
  waiting_approval: {
    label: 'รออนุมัติ',
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    icon: 'fa-solid fa-signature',
  },
  approved: {
    label: 'อนุมัติแล้ว',
    color: 'bg-green-50 text-green-600 border-green-200',
    icon: 'fa-solid fa-check-circle',
  },
  rejected: {
    label: 'ไม่อนุมัติ',
    color: 'bg-red-50 text-red-600 border-red-200',
    icon: 'fa-solid fa-times-circle',
  },
  revision: {
    label: 'ต้องแก้ไข',
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    icon: 'fa-solid fa-pen-to-square',
  },
  completed: {
    label: 'เสร็จสิ้น',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    icon: 'fa-solid fa-flag-checkered',
  },
}

const sizes = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
}

export default function StatusBadge({ 
  status = 'draft', 
  size = 'md',
  showIcon = true,
  className = '' 
}) {
  const config = statusConfig[status] || statusConfig.draft
  
  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full border font-medium
      ${config.color} ${sizes[size]} ${className}
    `}>
      {showIcon && <i className={`${config.icon} text-[0.7em]`}></i>}
      {config.label}
    </span>
  )
}
