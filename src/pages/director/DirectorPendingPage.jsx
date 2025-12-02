import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Card, StatusBadge, Table, Input, Select } from '../../components'

/**
 * DirectorPendingPage
 * Director's list of requests pending approval
 */

// Mock pending requests for director approval
const mockPendingRequests = [
  { id: 'BD-089', type: 'project', typeName: 'ขออนุมัติโครงการ', title: 'โครงการอบรม AI สำหรับเกษตรกร', status: 'waiting_approval', date: '2025-12-01', amount: 45000, requester: 'ดร.สมชาย ใจดี', verifiedBy: 'คุณสุดา ตรวจสอบ' },
  { id: 'BD-085', type: 'loan', typeName: 'ยืมเงิน', title: 'ค่าจัดกิจกรรมฝึกอบรม', status: 'waiting_approval', date: '2025-11-29', amount: 32000, requester: 'ดร.มานี มานะ', verifiedBy: 'คุณสุดา ตรวจสอบ' },
  { id: 'BD-083', type: 'travel', typeName: 'เดินทางราชการ', title: 'ประชุมวิชาการนานาชาติ', status: 'waiting_approval', date: '2025-11-27', amount: 55000, requester: 'รศ.สมหมาย หมายดี', verifiedBy: 'คุณสุดา ตรวจสอบ' },
  { id: 'BD-081', type: 'car', typeName: 'ขอใช้รถยนต์', title: 'ลงพื้นที่ดอยอินทนนท์', status: 'waiting_approval', date: '2025-11-25', amount: 1200, requester: 'ผศ.สมศรี ศรีสม', verifiedBy: 'คุณวิไล ไวตรวจ' },
]

const typeOptions = [
  { value: 'all', label: 'ทุกประเภท' },
  { value: 'project', label: 'ขออนุมัติโครงการ' },
  { value: 'loan', label: 'ยืมเงิน' },
  { value: 'car', label: 'ขอใช้รถยนต์' },
  { value: 'travel', label: 'เดินทางราชการ' },
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
  { key: 'requester', label: 'ผู้ขอ' },
  { 
    key: 'amount', 
    label: 'จำนวนเงิน',
    width: 'w-32',
    render: (value) => (
      <span className="font-bold text-primary-600">
        {value ? `${value.toLocaleString()} บาท` : '-'}
      </span>
    )
  },
  { key: 'date', label: 'วันที่', width: 'w-28' },
  {
    key: 'actions',
    label: '',
    width: 'w-32',
    render: (_, row) => (
      <Button 
        variant="primary" 
        size="sm"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        พิจารณา
      </Button>
    )
  }
]

export default function DirectorPendingPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  // Filter requests
  const filteredRequests = mockPendingRequests.filter((req) => {
    const matchSearch = req.title.toLowerCase().includes(search.toLowerCase()) ||
                       req.id.toLowerCase().includes(search.toLowerCase()) ||
                       req.requester.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || req.type === typeFilter
    return matchSearch && matchType
  })

  // Calculate total amount
  const totalAmount = filteredRequests.reduce((sum, req) => sum + (req.amount || 0), 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">รออนุมัติ</h1>
        <p className="text-slate-500 text-sm">รายการที่ผ่านการตรวจสอบแล้ว รอพิจารณาอนุมัติ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-signature"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{mockPendingRequests.length}</p>
              <p className="text-xs text-purple-700">รออนุมัติ</p>
            </div>
          </div>
        </Card>
        <Card className="bg-primary-50 border-primary-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-coins"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{totalAmount.toLocaleString()}</p>
              <p className="text-xs text-primary-700">บาท (ยอดรวมรออนุมัติ)</p>
            </div>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-check-double"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">28</p>
              <p className="text-xs text-green-700">อนุมัติเดือนนี้</p>
            </div>
          </div>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-piggy-bank"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">4.5M</p>
              <p className="text-xs text-blue-700">งบคงเหลือ</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="ค้นหาเลขที่, ชื่อเรื่อง, หรือชื่อผู้ขอ..."
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
        onRowClick={(row) => navigate(`/director/approve/${row.id}`)}
        emptyMessage="ไม่มีคำขอที่รออนุมัติ"
      />
    </div>
  )
}
