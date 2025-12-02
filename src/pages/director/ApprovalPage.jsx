import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, Card, StatusBadge, Stepper, Divider, Textarea } from '../../components'

/**
 * ApprovalPage
 * Director page to approve or reject requests
 */

// Mock request data
const mockRequest = {
  id: 'BD-089',
  type: 'project',
  typeName: 'ขออนุมัติโครงการ',
  title: 'โครงการอบรม AI สำหรับเกษตรกร',
  description: 'จัดอบรมการใช้งาน AI สำหรับการเกษตรแก่เกษตรกรในพื้นที่โครงการหลวง จำนวน 50 คน เพื่อพัฒนาทักษะและเพิ่มผลผลิต',
  status: 'waiting_approval',
  createdAt: '2025-12-01 10:30',
  amount: 45000,
  project: 'โครงการหลวง A',
  creator: {
    name: 'ดร.สมชาย ใจดี',
    email: 'somchai@kmutt.ac.th',
    department: 'ศูนย์ RSC',
  },
  verifiedBy: {
    name: 'คุณสุดา ตรวจสอบ',
    date: '2025-12-01 14:30',
    comment: 'ตรวจสอบเอกสารครบถ้วน ถูกต้องตามระเบียบ',
  },
  expenses: [
    { name: 'ค่าวิทยากร', amount: 15000 },
    { name: 'ค่าอาหาร/เครื่องดื่ม', amount: 12500 },
    { name: 'ค่าเอกสารประกอบ', amount: 7500 },
    { name: 'ค่าเดินทาง', amount: 10000 },
  ],
  attachments: [
    { name: 'รายละเอียดโครงการ.pdf', size: '2.4 MB' },
    { name: 'งบประมาณ.xlsx', size: '156 KB' },
    { name: 'กำหนดการ.docx', size: '89 KB' },
  ],
}

const workflowSteps = [
  { title: 'สร้างคำขอ' },
  { title: 'ตรวจสอบ' },
  { title: 'อนุมัติ' },
  { title: 'เสร็จสิ้น' },
]

export default function ApprovalPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [comment, setComment] = useState('')

  const handleApprove = () => {
    alert('อนุมัติคำขอเรียบร้อยแล้ว!')
    navigate('/director/pending')
  }

  const handleReject = () => {
    if (!comment) {
      alert('กรุณาระบุเหตุผลก่อนไม่อนุมัติ')
      return
    }
    alert('ไม่อนุมัติคำขอแล้ว')
    navigate('/director/pending')
  }

  const handleRequestRevision = () => {
    if (!comment) {
      alert('กรุณาระบุหมายเหตุก่อนส่งกลับ')
      return
    }
    alert('ส่งกลับให้แก้ไขแล้ว')
    navigate('/director/pending')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/director/pending')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-primary-500 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-800">{mockRequest.id}</h1>
              <StatusBadge status={mockRequest.status} />
            </div>
            <p className="text-slate-500">{mockRequest.typeName} • พิจารณาอนุมัติ</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <i className="fa-solid fa-eye"></i>
            ดู Preview
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <Stepper steps={workflowSteps} currentStep={3} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Info */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-2">{mockRequest.title}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{mockRequest.description}</p>
            
            <Divider className="my-6" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">โครงการ</p>
                <p className="font-medium text-slate-800">{mockRequest.project}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">ผู้ขอ</p>
                <p className="font-medium text-slate-800">{mockRequest.creator.name}</p>
                <p className="text-xs text-slate-500">{mockRequest.creator.department}</p>
              </div>
            </div>
          </Card>

          {/* Budget Summary */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-coins mr-2 text-slate-400"></i>
              สรุปงบประมาณ
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">รายการ</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-slate-600">จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockRequest.expenses.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-slate-700">{item.name}</td>
                      <td className="px-4 py-3 text-right font-medium">{item.amount.toLocaleString()} บาท</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-primary-50">
                  <tr>
                    <td className="px-4 py-3 font-bold text-slate-800">รวมทั้งสิ้น</td>
                    <td className="px-4 py-3 text-right font-bold text-primary-600 text-xl">
                      {mockRequest.amount.toLocaleString()} บาท
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* Admin Verification */}
          <Card className="bg-blue-50 border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2">
              <i className="fa-solid fa-user-check mr-2"></i>
              ผลการตรวจสอบ
            </h3>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                {mockRequest.verifiedBy.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-blue-900">{mockRequest.verifiedBy.name}</p>
                <p className="text-xs text-blue-600 mb-2">{mockRequest.verifiedBy.date}</p>
                <p className="text-sm text-blue-800 bg-white p-3 rounded-lg">
                  "{mockRequest.verifiedBy.comment}"
                </p>
              </div>
            </div>
          </Card>

          {/* Attachments */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-paperclip mr-2 text-slate-400"></i>
              ไฟล์แนบ
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockRequest.attachments.map((file, idx) => (
                <button 
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-lg transition"
                >
                  <i className="fa-solid fa-file-pdf text-primary-500"></i>
                  <span className="text-sm text-slate-700">{file.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar - Actions */}
        <div className="space-y-6">
          {/* Amount Highlight */}
          <Card className="bg-primary-500 text-white">
            <p className="text-sm opacity-80 mb-1">ยอดขออนุมัติ</p>
            <p className="text-3xl font-bold">{mockRequest.amount.toLocaleString()}</p>
            <p className="text-sm opacity-80">บาท</p>
          </Card>

          {/* Comment */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-comment mr-2 text-slate-400"></i>
              ความเห็นผู้อนุมัติ
            </h3>
            <Textarea
              placeholder="ระบุความเห็นหรือเหตุผล (ถ้ามี)..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Card>

          {/* Actions */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">การดำเนินการ</h3>
            <div className="space-y-3">
              <Button 
                variant="primary" 
                className="w-full bg-green-500 hover:bg-green-600 shadow-none"
                onClick={handleApprove}
              >
                <i className="fa-solid fa-check-circle"></i>
                อนุมัติ
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-orange-500 hover:bg-orange-50"
                onClick={handleRequestRevision}
              >
                <i className="fa-solid fa-rotate-left"></i>
                ส่งกลับแก้ไข
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-red-500 hover:bg-red-50"
                onClick={handleReject}
              >
                <i className="fa-solid fa-times-circle"></i>
                ไม่อนุมัติ
              </Button>
            </div>
          </Card>

          {/* Quick Info */}
          <Card className="bg-slate-50">
            <h3 className="font-bold text-slate-800 mb-3 text-sm">ข้อมูลเพิ่มเติม</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">วันที่ขอ</span>
                <span className="text-slate-700">{mockRequest.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">งบคงเหลือ</span>
                <span className="text-green-600 font-medium">4,500,000 บาท</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">หลังอนุมัติ</span>
                <span className="text-blue-600 font-medium">4,455,000 บาท</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
