import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Card, StatusBadge, Table, Input, Select } from '../../components'

/**
 * RequestListPage
 * List all requests for the researcher (My Requests)
 */

// Mock data
const mockRequests = [
  { id: 'BD-089', type: 'project', typeName: 'ขออนุมัติโครงการ', title: 'โครงการอบรม AI สำหรับเกษตรกร', status: 'pending', date: '2025-12-01', amount: 45000 },
  { id: 'BD-088', type: 'loan', typeName: 'ยืมเงิน', title: 'ค่าเดินทางประชุมวิชาการ', status: 'reviewing', date: '2025-11-30', amount: 12000 },
  { id: 'BD-087', type: 'car', typeName: 'ขอใช้รถยนต์', title: 'เดินทางไปพื้นที่โครงการหลวง', status: 'waiting_approval', date: '2025-11-28', amount: null },
  { id: 'BD-086', type: 'travel', typeName: 'เดินทางราชการ', title: 'ประชุมวิชาการ ณ กรุงเทพฯ', status: 'approved', date: '2025-11-25', amount: 8500 },
  { id: 'BD-085', type: 'project', typeName: 'ขออนุมัติโครงการ', title: 'โครงการพัฒนาแหล่งน้ำ', status: 'completed', date: '2025-11-20', amount: 150000 },
  { id: 'BD-084', type: 'loan', typeName: 'ยืมเงิน', title: 'ค่าวัสดุอุปกรณ์', status: 'rejected', date: '2025-11-15', amount: 25000 },
]

const typeOptions = [
  { value: 'all', label: 'ทุกประเภท' },
  { value: 'project', label: 'ขออนุมัติโครงการ' },
  { value: 'loan', label: 'ยืมเงิน' },
  { value: 'car', label: 'ขอใช้รถยนต์' },
  { value: 'travel', label: 'เดินทางราชการ' },
]

const statusOptions = [
  { value: 'all', label: 'ทุกสถานะ' },
  { value: 'draft', label: 'ฉบับร่าง' },
  { value: 'pending', label: 'รอตรวจสอบ' },
  { value: 'reviewing', label: 'กำลังตรวจสอบ' },
  { value: 'waiting_approval', label: 'รออนุมัติ' },
  { value: 'approved', label: 'อนุมัติแล้ว' },
  { value: 'rejected', label: 'ไม่อนุมัติ' },
  { value: 'completed', label: 'เสร็จสิ้น' },
]

const columns = [
  { key: 'id', label: 'เลขที่', width: 'w-24' },
  { 
    key: 'typeName', 
    label: 'ประเภท',
    render: (value) => (
      <span className="text-slate-600 font-medium">{value}</span>
    )
  },
  { 
    key: 'title', 
    label: 'เรื่อง',
    render: (value) => (
      <span className="font-medium text-slate-800">{value}</span>
    )
  },
  { 
    key: 'status', 
    label: 'สถานะ',
    render: (value) => <StatusBadge status={value} size="sm" />
  },
  { 
    key: 'amount', 
    label: 'จำนวนเงิน',
    width: 'w-28',
    render: (value) => value ? `${value.toLocaleString()} บาท` : '-'
  },
  { key: 'date', label: 'วันที่', width: 'w-28' },
]

export default function RequestListPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Filter requests
  const filteredRequests = mockRequests.filter((req) => {
    const matchSearch = req.title.toLowerCase().includes(search.toLowerCase()) ||
                       req.id.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || req.type === typeFilter
    const matchStatus = statusFilter === 'all' || req.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">คำขอของฉัน</h1>
          <p className="text-slate-500 text-sm">รายการคำขอทั้งหมดที่คุณสร้าง</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/requests/new')}
        >
          <i className="fa-solid fa-plus"></i>
          สร้างคำขอใหม่
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="ค้นหาเลขที่หรือชื่อเรื่อง..."
              icon="fa-solid fa-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select
            options={typeOptions}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
        </div>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          พบ {filteredRequests.length} รายการ
        </p>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredRequests}
        onRowClick={(row) => navigate(`/requests/${row.id}`)}
        emptyMessage="ไม่พบคำขอที่ตรงกับเงื่อนไข"
      />
    </div>
  )
}
