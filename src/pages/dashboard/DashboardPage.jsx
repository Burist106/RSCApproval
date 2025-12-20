import { useNavigate } from 'react-router'
import { useAuth } from '../../contexts'
import { Button, StatCard, Card, StatusBadge, Table } from '../../components'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

/**
 * Dashboard Page
 * Unified dashboard for all roles with role-specific content
 */

// ============ ข้อมูลสำหรับ นักวิจัย (Researcher) ============
const researcherBudget = {
  total: 1200000,  // งบประมาณที่ได้รับจัดสรร
  used: 350000,
  remaining: 850000
}

const researcherRequests = [
  { id: 'BD-089', type: 'ขออนุมัติโครงการ', title: 'โครงการอบรม AI สำหรับเกษตรกร', status: 'pending', date: '2025-12-01', amount: 45000, requester: 'สมชาย ใจดี' },
  { id: 'BD-088', type: 'ยืมเงิน', title: 'ค่าเดินทางประชุมวิชาการ', status: 'pending', date: '2025-11-30', amount: 12000, requester: 'สมชาย ใจดี' },
  { id: 'BD-087', type: 'ขอใช้รถยนต์', title: 'เดินทางไปพื้นที่โครงการหลวง', status: 'approved', date: '2025-11-28', amount: null, requester: 'สมชาย ใจดี' },
  { id: 'BD-086', type: 'เดินทางราชการ', title: 'ประชุมวิชาการ ณ กรุงเทพฯ', status: 'approved', date: '2025-11-25', amount: 8500, requester: 'สมชาย ใจดี' },
  { id: 'BD-085', type: 'ยืมเงิน', title: 'ค่าวัสดุทดลอง', status: 'rejected', date: '2025-11-24', amount: 5000, requester: 'สมชาย ใจดี' },
]

// ============ ข้อมูลสำหรับ Admin ============
const adminRequests = [
  { id: 'BD-095', type: 'ขออนุมัติโครงการ', title: 'โครงการพัฒนา Smart Farm', status: 'reviewing', date: '2025-12-02', amount: 250000, requester: 'ดร.วิชัย นักวิจัย' },
  { id: 'BD-094', type: 'ยืมเงิน', title: 'ค่าอุปกรณ์ IoT', status: 'reviewing', date: '2025-12-01', amount: 35000, requester: 'ดร.สมศรี ทดสอบ' },
  { id: 'BD-093', type: 'เดินทางราชการ', title: 'ประชุมที่ต่างประเทศ', status: 'reviewing', date: '2025-11-30', amount: 85000, requester: 'ดร.มานะ พากเพียร' },
  { id: 'BD-092', type: 'ขอใช้รถยนต์', title: 'ไปสำรวจพื้นที่', status: 'reviewing', date: '2025-11-29', amount: null, requester: 'สมชาย ใจดี' },
  { id: 'BD-091', type: 'ยืมเงิน', title: 'ค่าจ้างผู้ช่วยวิจัย', status: 'need-revision', date: '2025-11-28', amount: 15000, requester: 'ดร.วิชัย นักวิจัย' },
  { id: 'BD-090', type: 'ขออนุมัติโครงการ', title: 'โครงการวิจัยน้ำ', status: 'need-revision', date: '2025-11-27', amount: 180000, requester: 'ดร.สมศรี ทดสอบ' },
]

// ============ ข้อมูลสำหรับ ผอ.ศูนย์ (Director) ============
const directorBudget = {
  total: 7000000,
  used: 2500000,
  remaining: 4500000
}

// แปลงข้อมูลสำหรับ Stacked Bar Chart (งบใช้ไป + งบคงเหลือ = งบทั้งหมด)
const projectBudgets = [
  { name: 'AI เกษตรกร', used: 350000, remaining: 850000, total: 1200000 },
  { name: 'Smart Farm', used: 400000, remaining: 1100000, total: 1500000 },
  { name: 'IoT น้ำ', used: 350000, remaining: 450000, total: 800000 },
  { name: 'วิจัยดิน', used: 800000, remaining: 1200000, total: 2000000 },
  { name: 'Drone สำรวจ', used: 600000, remaining: 900000, total: 1500000 },
]

const directorRequests = [
  { id: 'BD-095', type: 'ขออนุมัติโครงการ', title: 'โครงการพัฒนา Smart Farm', status: 'pending', date: '2025-12-02', amount: 250000, requester: 'ดร.วิชัย นักวิจัย' },
  { id: 'BD-094', type: 'ยืมเงิน', title: 'ค่าอุปกรณ์ IoT', status: 'pending', date: '2025-12-01', amount: 35000, requester: 'ดร.สมศรี ทดสอบ' },
  { id: 'BD-093', type: 'เดินทางราชการ', title: 'ประชุมที่ต่างประเทศ', status: 'pending', date: '2025-11-30', amount: 85000, requester: 'ดร.มานะ พากเพียร' },
  { id: 'BD-089', type: 'ขออนุมัติโครงการ', title: 'โครงการอบรม AI สำหรับเกษตรกร', status: 'pending', date: '2025-12-01', amount: 45000, requester: 'สมชาย ใจดี' },
  { id: 'BD-088', type: 'ยืมเงิน', title: 'ค่าเดินทางประชุมวิชาการ', status: 'pending', date: '2025-11-30', amount: 12000, requester: 'สมชาย ใจดี' },
]

// Colors for charts
const COLORS = {
  used: '#f97316', // orange
  remaining: '#22c55e', // green
  budget: '#3b82f6', // blue
  remainingBar: '#86efac', // light green
}

// Format number to M (million)
const formatToM = (num) => (num / 1000000).toFixed(1) + 'M'
const formatToK = (num) => (num / 1000).toFixed(0) + 'K'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const role = user?.role || 'researcher'
  const isResearcher = role === 'researcher'
  const isAdmin = role === 'admin'
  const isDirector = role === 'director'

  // เลือกข้อมูลตาม Role
  const currentRequests = isResearcher ? researcherRequests : isAdmin ? adminRequests : directorRequests
  const currentBudget = isResearcher ? researcherBudget : directorBudget

  // นับสถิติตาม Role
  const researcherPending = researcherRequests.filter(r => r.status === 'pending').length
  const researcherApproved = researcherRequests.filter(r => r.status === 'approved').length
  const researcherRejected = researcherRequests.filter(r => r.status === 'rejected').length
  
  const adminReviewing = adminRequests.filter(r => r.status === 'reviewing').length
  const adminNeedRevision = adminRequests.filter(r => r.status === 'need-revision').length
  
  const directorPending = directorRequests.filter(r => r.status === 'pending').length

  // Role-specific stats
  const stats = {
    researcher: [
      { title: 'คำขอทั้งหมด', value: String(researcherRequests.length), icon: 'fa-solid fa-folder-open', color: 'slate' },
      { title: 'รออนุมัติ', value: String(researcherPending), icon: 'fa-solid fa-clock', color: 'amber' },
      { title: 'อนุมัติแล้ว', value: String(researcherApproved), icon: 'fa-solid fa-check-circle', color: 'green' },
      { title: 'งบคงเหลือ', value: formatToK(researcherBudget.remaining), icon: 'fa-solid fa-wallet', color: 'primary' },
    ],
    admin: [
      { title: 'รอตรวจสอบ', value: String(adminReviewing), icon: 'fa-solid fa-inbox', color: 'amber' },
      { title: 'ตรวจสอบวันนี้', value: '2', icon: 'fa-solid fa-check-double', color: 'blue' },
      { title: 'รอแก้ไข', value: String(adminNeedRevision), icon: 'fa-solid fa-pen-to-square', color: 'purple' },
      { title: 'ส่งต่อ ผอ.แล้ว', value: String(directorPending), icon: 'fa-solid fa-paper-plane', color: 'green' },
    ],
    director: [
      { title: 'รออนุมัติ', value: String(directorPending), icon: 'fa-solid fa-signature', color: 'primary' },
      { title: 'อนุมัติเดือนนี้', value: '12', icon: 'fa-solid fa-stamp', color: 'green' },
      { title: 'งบใช้ไป', value: formatToM(directorBudget.used), icon: 'fa-solid fa-coins', color: 'amber' },
      { title: 'งบคงเหลือ', value: formatToM(directorBudget.remaining), icon: 'fa-solid fa-piggy-bank', color: 'blue' },
    ],
  }

  const currentStats = stats[role]

  // Table columns - แต่ละ Role แสดงคอลัมน์ต่างกัน
  const baseColumns = [
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

  // Admin และ Director เห็นชื่อผู้ขอด้วย
  const columnsWithRequester = [
    { key: 'id', label: 'เลขที่', width: 'w-24' },
    { key: 'requester', label: 'ผู้ขอ', width: 'w-36' },
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

  const columns = isResearcher ? baseColumns : columnsWithRequester

  // Table titles
  const tableTitle = isResearcher ? 'คำขอของฉัน' : isAdmin ? 'รายการรอตรวจสอบ' : 'รายการรออนุมัติ'
  const viewAllPath = isResearcher ? '/requests' : isAdmin ? '/admin/inbox' : '/director/pending'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">
            ยินดีต้อนรับ, {user?.name || 'ผู้ใช้งาน'}
            {user?.roleLabel && <span className="ml-2 text-primary-500">({user.roleLabel})</span>}
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

        {isAdmin && (
          <Button 
            variant="primary" 
            onClick={() => navigate('/admin/inbox')}
            className="shadow-primary"
          >
            <i className="fa-solid fa-inbox"></i>
            ดูรายการทั้งหมด
          </Button>
        )}

        {isDirector && (
          <Button 
            variant="primary" 
            onClick={() => navigate('/director/pending')}
            className="shadow-primary"
          >
            <i className="fa-solid fa-signature"></i>
            รออนุมัติทั้งหมด
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity Table */}
      <Card padding="p-0">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{tableTitle}</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(viewAllPath)}
          >
            ดูทั้งหมด <i className="fa-solid fa-arrow-right ml-1"></i>
          </Button>
        </div>
        <Table 
          columns={columns}
          data={currentRequests.slice(0, 5)}
          onRowClick={(row) => navigate(`/requests/${row.id}`)}
        />
      </Card>

      {/* Budget Charts - แสดงเฉพาะ Researcher และ Director */}
      {(isResearcher || isDirector) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart - Budget Overview */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-chart-pie text-primary-500 mr-2"></i>
              {isResearcher ? 'งบประมาณโครงการของฉัน' : 'ภาพรวมงบประมาณศูนย์'}
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'งบที่ใช้ไป', value: currentBudget.used },
                      { name: 'งบคงเหลือ', value: currentBudget.remaining },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    <Cell fill={COLORS.used} />
                    <Cell fill={COLORS.remaining} />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => isDirector ? `${(value / 1000000).toFixed(2)} ล้านบาท` : `${(value / 1000).toFixed(0)} พันบาท`}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-slate-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xs text-slate-500">งบประมาณทั้งหมด</p>
                <p className="text-lg font-bold text-slate-800">
                  {isDirector ? formatToM(currentBudget.total) : formatToK(currentBudget.total)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">ใช้ไปแล้ว</p>
                <p className="text-lg font-bold text-orange-500">
                  {isDirector ? formatToM(currentBudget.used) : formatToK(currentBudget.used)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500">คงเหลือ</p>
                <p className="text-lg font-bold text-green-500">
                  {isDirector ? formatToM(currentBudget.remaining) : formatToK(currentBudget.remaining)}
                </p>
              </div>
            </div>
          </Card>

          {/* Bar Chart - Project Budgets (Director only) OR Request Summary (Researcher) */}
          {isDirector ? (
            <Card>
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                <i className="fa-solid fa-chart-bar text-blue-500 mr-2"></i>
                งบประมาณรายโครงการ
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={projectBudgets}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      type="number" 
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                      stroke="#94a3b8"
                      fontSize={12}
                      domain={[0, 'dataMax']}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={85}
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${(value / 1000000).toFixed(2)} ล้านบาท`,
                        name === 'used' ? 'งบใช้ไป' : 'งบคงเหลือ'
                      ]}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Legend 
                      formatter={(value) => (
                        <span className="text-slate-600">
                          {value === 'used' ? 'งบใช้ไปแล้ว' : 'งบคงเหลือ'}
                        </span>
                      )}
                    />
                    {/* Stacked Bar: งบใช้ไป (ส้ม) + งบคงเหลือ (เขียว) = งบทั้งหมด */}
                    <Bar 
                      dataKey="used" 
                      stackId="budget"
                      fill={COLORS.used} 
                      name="used"
                    />
                    <Bar 
                      dataKey="remaining" 
                      stackId="budget"
                      fill={COLORS.remaining} 
                      radius={[0, 4, 4, 0]}
                      name="remaining"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* Legend Summary */}
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.used }}></div>
                  <span className="text-sm text-slate-600">งบใช้ไปแล้ว</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS.remaining }}></div>
                  <span className="text-sm text-slate-600">งบคงเหลือ</span>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                <i className="fa-solid fa-chart-bar text-blue-500 mr-2"></i>
                สรุปคำขอของฉัน
              </h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'รออนุมัติ', count: researcherPending, fill: '#f59e0b' },
                      { name: 'อนุมัติแล้ว', count: researcherApproved, fill: '#22c55e' },
                      { name: 'ไม่อนุมัติ', count: researcherRejected, fill: '#ef4444' },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#94a3b8"
                      fontSize={12}
                      allowDecimals={false}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} รายการ`, 'จำนวน']}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Bar 
                      dataKey="count" 
                      radius={[4, 4, 0, 0]}
                    >
                      {[
                        { name: 'รออนุมัติ', count: researcherPending, fill: '#f59e0b' },
                        { name: 'อนุมัติแล้ว', count: researcherApproved, fill: '#22c55e' },
                        { name: 'ไม่อนุมัติ', count: researcherRejected, fill: '#ef4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Admin Section - แสดงสถิติการตรวจสอบ */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-chart-pie text-primary-500 mr-2"></i>
              สถานะรายการที่ต้องดำเนินการ
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'รอตรวจสอบ', value: adminReviewing },
                      { name: 'รอแก้ไข', value: adminNeedRevision },
                      { name: 'ส่งต่อ ผอ.แล้ว', value: directorPending },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name} (${value})`}
                    labelLine={false}
                  >
                    <Cell fill="#f59e0b" />
                    <Cell fill="#a855f7" />
                    <Cell fill="#22c55e" />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `${value} รายการ`}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-slate-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-list-check text-blue-500 mr-2"></i>
              สรุปประเภทคำขอ
            </h2>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'โครงการ', count: adminRequests.filter(r => r.type === 'ขออนุมัติโครงการ').length },
                    { name: 'ยืมเงิน', count: adminRequests.filter(r => r.type === 'ยืมเงิน').length },
                    { name: 'รถยนต์', count: adminRequests.filter(r => r.type === 'ขอใช้รถยนต์').length },
                    { name: 'เดินทาง', count: adminRequests.filter(r => r.type === 'เดินทางราชการ').length },
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} รายการ`, 'จำนวน']}
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
