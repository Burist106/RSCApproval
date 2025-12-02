import { useNavigate } from 'react-router'
import { useAuth } from '../../contexts'
import { Button, StatCard, Card, StatusBadge, Table } from '../../components'

/**
 * Dashboard Page
 * Unified dashboard for all roles with role-specific content
 */

// Mock data for recent requests
const recentRequests = [
  { id: 'BD-089', type: 'ขออนุมัติโครงการ', title: 'โครงการอบรม AI สำหรับเกษตรกร', status: 'pending', date: '2025-12-01', amount: 45000 },
  { id: 'BD-088', type: 'ยืมเงิน', title: 'ค่าเดินทางประชุมวิชาการ', status: 'reviewing', date: '2025-11-30', amount: 12000 },
  { id: 'BD-087', type: 'ขอใช้รถยนต์', title: 'เดินทางไปพื้นที่โครงการหลวง', status: 'approved', date: '2025-11-28', amount: null },
  { id: 'BD-086', type: 'เดินทางราชการ', title: 'ประชุมวิชาการ ณ กรุงเทพฯ', status: 'completed', date: '2025-11-25', amount: 8500 },
]

// Table columns definition
const columns = [
  { key: 'id', label: 'เลขที่', width: 'w-24' },
  { 
    key: 'type', 
    label: 'ประเภท',
    render: (value) => (
      <span className="text-slate-600 font-medium">{value}</span>
    )
  },
  { key: 'title', label: 'เรื่อง' },
  { 
    key: 'status', 
    label: 'สถานะ',
    render: (value) => <StatusBadge status={value} size="sm" />
  },
  { key: 'date', label: 'วันที่', width: 'w-28' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Role-specific stats
  const stats = {
    researcher: [
      { title: 'คำขอทั้งหมด', value: '12', icon: 'fa-solid fa-folder-open', color: 'slate' },
      { title: 'รออนุมัติ', value: '5', icon: 'fa-solid fa-clock', color: 'amber' },
      { title: 'อนุมัติแล้ว', value: '6', icon: 'fa-solid fa-check-circle', color: 'green' },
      { title: 'งบคงเหลือ', value: '1.2M', icon: 'fa-solid fa-wallet', color: 'primary' },
    ],
    admin: [
      { title: 'รอตรวจสอบ', value: '8', icon: 'fa-solid fa-inbox', color: 'amber' },
      { title: 'ตรวจสอบวันนี้', value: '3', icon: 'fa-solid fa-check-double', color: 'blue' },
      { title: 'รอแก้ไข', value: '2', icon: 'fa-solid fa-pen-to-square', color: 'purple' },
      { title: 'ส่งต่อแล้ว', value: '15', icon: 'fa-solid fa-paper-plane', color: 'green' },
    ],
    director: [
      { title: 'รออนุมัติ', value: '5', icon: 'fa-solid fa-signature', color: 'primary' },
      { title: 'อนุมัติเดือนนี้', value: '28', icon: 'fa-solid fa-stamp', color: 'green' },
      { title: 'งบประมาณใช้ไป', value: '2.5M', icon: 'fa-solid fa-coins', color: 'amber' },
      { title: 'งบคงเหลือ', value: '4.5M', icon: 'fa-solid fa-piggy-bank', color: 'blue' },
    ],
  }

  const currentStats = stats[user?.role] || stats.researcher
  const isResearcher = user?.role === 'researcher'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">
            ยินดีต้อนรับ, {user?.name || 'ผู้ใช้งาน'}
          </p>
        </div>
        
        {isResearcher && (
          <Button 
            variant="primary" 
            onClick={() => navigate('/requests/new')}
            className="shadow-primary"
          >
            <i className="fa-solid fa-plus"></i>
            สร้างคำขอใหม่
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Actions for Researcher */}
      {isResearcher && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card 
            hover 
            onClick={() => navigate('/requests/new?type=project')}
            className="text-center"
          >
            <div className="w-12 h-12 bg-primary-100 text-primary-500 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">
              <i className="fa-solid fa-file-contract"></i>
            </div>
            <p className="font-bold text-sm">ขออนุมัติโครงการ</p>
          </Card>
          <Card 
            hover 
            onClick={() => navigate('/requests/new?type=loan')}
            className="text-center"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">
              <i className="fa-solid fa-money-bill-transfer"></i>
            </div>
            <p className="font-bold text-sm">ยืมเงิน</p>
          </Card>
          <Card 
            hover 
            onClick={() => navigate('/requests/new?type=car')}
            className="text-center"
          >
            <div className="w-12 h-12 bg-purple-100 text-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">
              <i className="fa-solid fa-car"></i>
            </div>
            <p className="font-bold text-sm">ขอใช้รถยนต์</p>
          </Card>
          <Card 
            hover 
            onClick={() => navigate('/requests/new?type=travel')}
            className="text-center"
          >
            <div className="w-12 h-12 bg-teal-100 text-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 text-xl">
              <i className="fa-solid fa-plane-departure"></i>
            </div>
            <p className="font-bold text-sm">เดินทางราชการ</p>
          </Card>
        </div>
      )}

      {/* Recent Activity Table */}
      <Card padding="p-0">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {isResearcher ? 'คำขอล่าสุด' : 'รายการล่าสุด'}
          </h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(isResearcher ? '/requests' : user?.role === 'admin' ? '/admin/inbox' : '/director/pending')}
          >
            ดูทั้งหมด <i className="fa-solid fa-arrow-right ml-1"></i>
          </Button>
        </div>
        <Table 
          columns={columns}
          data={recentRequests}
          onRowClick={(row) => navigate(`/requests/${row.id}`)}
        />
      </Card>

      {/* Budget Chart Placeholder for Director */}
      {user?.role === 'director' && (
        <Card>
          <h2 className="text-lg font-bold text-slate-800 mb-4">งบประมาณรายโครงการ</h2>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
            <div className="text-center">
              <i className="fa-solid fa-chart-bar text-4xl mb-2"></i>
              <p className="text-sm">กราฟงบประมาณ (จะเพิ่มเติมภายหลัง)</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
