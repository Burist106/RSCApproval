import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, Card, StatusBadge, Table, Input, Select } from '../../components'

/**
 * AdminInboxPage
 * Admin's inbox for pending document review
 */

// Mock pending requests for admin
const mockPendingRequests = [
  { id: 'BD-089', type: 'project', typeName: 'ขออนุมัติโครงการ', title: 'โครงการอบรม AI สำหรับเกษตรกร', status: 'pending', date: '2025-12-01', amount: 45000, requester: 'สมชาย ใจดี' },
  { id: 'BD-088', type: 'loan', typeName: 'ยืมเงิน', title: 'ค่าเดินทางประชุมวิชาการ', status: 'pending', date: '2025-11-30', amount: 12000, requester: 'ดร.มานี มานะ' },
  { id: 'BD-087', type: 'car', typeName: 'ขอใช้รถยนต์', title: 'เดินทางไปพื้นที่โครงการหลวง', status: 'pending', date: '2025-11-28', amount: null, requester: 'ผศ.สมศรี ศรีสม' },
  { id: 'BD-086', type: 'travel', typeName: 'เดินทางราชการ', title: 'ประชุมวิชาการ ณ กรุงเทพฯ', status: 'reviewing', date: '2025-11-25', amount: 8500, requester: 'รศ.สมหมาย หมายดี' },
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
    width: 'w-28',
    render: (value) => value ? `${value.toLocaleString()} บาท` : '-'
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
          // Navigate to review page
        }}
      >
        ตรวจสอบ
      </Button>
    )
  }
]

export default function AdminInboxPage() {
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">รอตรวจสอบ</h1>
        <p className="text-slate-500 text-sm">รายการคำขอที่รอการตรวจสอบเอกสาร</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-amber-50 border-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-inbox"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">8</p>
              <p className="text-xs text-amber-700">รอตรวจสอบ</p>
            </div>
          </div>
        </Card>
        <Card className="bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-eye"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">3</p>
              <p className="text-xs text-blue-700">กำลังตรวจสอบ</p>
            </div>
          </div>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-check"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">15</p>
              <p className="text-xs text-green-700">ตรวจสอบแล้ววันนี้</p>
            </div>
          </div>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <i className="fa-solid fa-paper-plane"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-xs text-purple-700">ส่งต่อแล้ว</p>
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
        onRowClick={(row) => navigate(`/admin/review/${row.id}`)}
        emptyMessage="ไม่มีคำขอที่รอตรวจสอบ"
      />
    </div>
  )
}
