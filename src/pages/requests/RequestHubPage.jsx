import { useNavigate } from 'react-router'
import { Card, IconBox } from '../../components'

/**
 * RequestHub Page
 * Select request type to create (Path 1-4 from flowchart)
 * Now uses workflow paths for proper document bundling
 */

const requestTypes = [
  {
    id: 'project',
    path: '/requests/workflow/project',
    icon: 'fa-solid fa-file-contract',
    color: 'primary',
    title: 'ขออนุมัติโครงการ',
    description: 'Path 1: บันทึกข้อความขออนุมัติดำเนินโครงการ พร้อมรายละเอียดงบประมาณ',
    features: ['กรอกข้อมูลโครงการ', 'ระบุงบประมาณ', 'ขอยืมเงินเริ่มต้น', 'Bundle Preview'],
    badge: 'Path 1',
  },
  {
    id: 'loan',
    path: '/requests/workflow/loan',
    icon: 'fa-solid fa-money-bill-transfer',
    color: 'blue',
    title: 'สัญญายืมเงิน (FOTO-04)',
    description: 'Path 2: สัญญายืมเงินทดรองจ่ายสำหรับโครงการหรือกิจกรรม',
    features: ['ตรวจสอบเอกสารอ้างอิง', 'กรอกข้อมูลยืมเงิน', 'พิมพ์ FOTO-04'],
    badge: 'Path 2',
  },
  {
    id: 'car',
    path: '/requests/workflow/car',
    icon: 'fa-solid fa-car',
    color: 'purple',
    title: 'ขออนุมัติใช้รถส่วนตัว',
    description: 'Path 3: ขออนุมัติใช้รถยนต์ส่วนตัวเดินทางไปราชการ',
    features: ['คำนวณระยะทาง', 'คำนวณค่าชดเชยน้ำมัน', 'แนบแผนที่เส้นทาง'],
    badge: 'Path 3',
  },
  {
    id: 'conference',
    path: '/requests/workflow/conference',
    icon: 'fa-solid fa-plane-departure',
    color: 'teal',
    title: 'ขออนุมัติประชุม/เดินทาง',
    description: 'Path 4: ขออนุมัติเข้าร่วมประชุม/สัมมนา หรือเดินทางไปราชการ',
    features: ['กรอกข้อมูลประชุม', 'ขอยืมเงินทดรอง', 'ขอใช้รถส่วนตัว', 'Bundle Preview'],
    badge: 'Path 4',
  },
]

const colorStyles = {
  primary: {
    border: 'hover:border-primary-500',
    bg: 'hover:bg-primary-50',
    text: 'group-hover:text-primary-600',
  },
  blue: {
    border: 'hover:border-blue-500',
    bg: 'hover:bg-blue-50',
    text: 'group-hover:text-blue-600',
  },
  purple: {
    border: 'hover:border-purple-500',
    bg: 'hover:bg-purple-50',
    text: 'group-hover:text-purple-600',
  },
  teal: {
    border: 'hover:border-teal-500',
    bg: 'hover:bg-teal-50',
    text: 'group-hover:text-teal-600',
  },
}

export default function RequestHubPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">สร้างคำขอใหม่</h1>
        <p className="text-slate-500">เลือกประเภทเอกสารที่ต้องการสร้าง</p>
      </div>

      {/* Request Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {requestTypes.map((type) => {
          const styles = colorStyles[type.color]
          return (
            <button
              key={type.id}
              onClick={() => navigate(type.path)}
              className={`
                group bg-white p-6 rounded-2xl border-2 border-slate-100 
                ${styles.border} ${styles.bg}
                text-left transition-all hover:shadow-lg hover:-translate-y-1 relative
              `}
            >
              {/* Path Badge */}
              {type.badge && (
                <span className="absolute top-3 right-3 text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                  {type.badge}
                </span>
              )}
              <div className="flex items-start gap-4">
                <IconBox 
                  icon={type.icon} 
                  color={type.color} 
                  size="md"
                  hoverInvert
                />
                <div className="flex-1">
                  <h3 className={`text-lg font-bold text-slate-800 ${styles.text} transition-colors`}>
                    {type.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 mb-4">
                    {type.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {type.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-current transition-colors mt-8"></i>
              </div>
            </button>
          )
        })}
      </div>

      {/* Help Text */}
      <div className="mt-10 text-center">
        <p className="text-sm text-slate-400">
          <i className="fa-solid fa-circle-info mr-2"></i>
          ไม่แน่ใจว่าต้องเลือกแบบไหน? <a href="#" className="text-primary-500 hover:underline">ดูคู่มือการใช้งาน</a>
        </p>
      </div>
    </div>
  )
}
