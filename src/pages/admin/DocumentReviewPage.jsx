import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, Card, StatusBadge, Stepper, Divider, Input, Textarea } from '../../components'

/**
 * DocumentReviewPage
 * Admin page to review and verify documents
 */

// Mock request data
const mockRequest = {
  id: 'BD-089',
  type: 'project',
  typeName: 'ขออนุมัติโครงการ',
  title: 'โครงการอบรม AI สำหรับเกษตรกร',
  description: 'จัดอบรมการใช้งาน AI สำหรับการเกษตรแก่เกษตรกรในพื้นที่โครงการหลวง จำนวน 50 คน เพื่อพัฒนาทักษะและเพิ่มผลผลิต',
  status: 'pending',
  createdAt: '2025-12-01 10:30',
  amount: 45000,
  project: 'โครงการหลวง A',
  creator: {
    name: 'สมชาย ใจดี',
    email: 'somchai@kmutt.ac.th',
    department: 'ศูนย์ RSC',
    phone: '02-xxx-xxxx',
  },
  attachments: [
    { name: 'รายละเอียดโครงการ.pdf', size: '2.4 MB', verified: true },
    { name: 'งบประมาณ.xlsx', size: '156 KB', verified: false },
    { name: 'กำหนดการ.docx', size: '89 KB', verified: false },
  ],
  checklist: [
    { id: 1, label: 'ข้อมูลครบถ้วน', checked: true },
    { id: 2, label: 'ลายเซ็นถูกต้อง', checked: false },
    { id: 3, label: 'งบประมาณตรงตามระเบียบ', checked: false },
    { id: 4, label: 'เอกสารแนบครบ', checked: false },
  ],
}

const workflowSteps = [
  { title: 'สร้างคำขอ' },
  { title: 'ตรวจสอบ' },
  { title: 'อนุมัติ' },
  { title: 'เสร็จสิ้น' },
]

export default function DocumentReviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [checklist, setChecklist] = useState(mockRequest.checklist)
  const [comment, setComment] = useState('')
  const [attachmentStatus, setAttachmentStatus] = useState(
    mockRequest.attachments.map(a => a.verified)
  )

  const handleCheckItem = (itemId) => {
    setChecklist(prev => prev.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    ))
  }

  const handleVerifyAttachment = (index) => {
    setAttachmentStatus(prev => {
      const newStatus = [...prev]
      newStatus[index] = !newStatus[index]
      return newStatus
    })
  }

  const allChecked = checklist.every(item => item.checked)
  const allAttachmentsVerified = attachmentStatus.every(v => v)

  const handleApprove = () => {
    alert('ส่งต่อไปยัง ผอ. เพื่อพิจารณาอนุมัติแล้ว')
    navigate('/admin/inbox')
  }

  const handleRequestRevision = () => {
    if (!comment) {
      alert('กรุณาระบุหมายเหตุก่อนส่งกลับแก้ไข')
      return
    }
    alert('ส่งกลับให้ผู้ขอแก้ไขแล้ว')
    navigate('/admin/inbox')
  }

  const handleReject = () => {
    if (!comment) {
      alert('กรุณาระบุเหตุผลก่อนปฏิเสธ')
      return
    }
    alert('ปฏิเสธคำขอแล้ว')
    navigate('/admin/inbox')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/inbox')}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-primary-500 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-800">{mockRequest.id}</h1>
              <StatusBadge status={mockRequest.status} />
            </div>
            <p className="text-slate-500">{mockRequest.typeName} • ตรวจสอบเอกสาร</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <Stepper steps={workflowSteps} currentStep={2} />
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
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">จำนวนเงิน</p>
                <p className="font-bold text-primary-600 text-lg">
                  {mockRequest.amount?.toLocaleString()} บาท
                </p>
              </div>
            </div>
          </Card>

          {/* Requester Info */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-user mr-2 text-slate-400"></i>
              ข้อมูลผู้ขอ
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">ชื่อ-นามสกุล</p>
                <p className="font-medium text-slate-800">{mockRequest.creator.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">หน่วยงาน</p>
                <p className="font-medium text-slate-800">{mockRequest.creator.department}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">อีเมล</p>
                <p className="font-medium text-slate-800">{mockRequest.creator.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">โทรศัพท์</p>
                <p className="font-medium text-slate-800">{mockRequest.creator.phone}</p>
              </div>
            </div>
          </Card>

          {/* Attachments */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-paperclip mr-2 text-slate-400"></i>
              ไฟล์แนบ
            </h3>
            <div className="space-y-2">
              {mockRequest.attachments.map((file, idx) => (
                <div 
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-xl transition ${
                    attachmentStatus[idx] ? 'bg-green-50' : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      attachmentStatus[idx] ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-500'
                    }`}>
                      <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-400">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-slate-400 hover:text-primary-500 p-2">
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button 
                      onClick={() => handleVerifyAttachment(idx)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        attachmentStatus[idx] 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-200 text-slate-600 hover:bg-green-500 hover:text-white'
                      }`}
                    >
                      {attachmentStatus[idx] ? (
                        <><i className="fa-solid fa-check mr-1"></i> ตรวจแล้ว</>
                      ) : (
                        'ยืนยัน'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar - Checklist & Actions */}
        <div className="space-y-6">
          {/* Checklist */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-list-check mr-2 text-slate-400"></i>
              รายการตรวจสอบ
            </h3>
            <div className="space-y-3">
              {checklist.map((item) => (
                <label 
                  key={item.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheckItem(item.id)}
                    className="w-5 h-5 rounded border-slate-300 text-green-500 focus:ring-green-500"
                  />
                  <span className={`text-sm ${item.checked ? 'text-green-600 line-through' : 'text-slate-700'}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            
            {allChecked && allAttachmentsVerified && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-700 font-medium">
                  <i className="fa-solid fa-circle-check mr-2"></i>
                  ตรวจสอบครบถ้วนแล้ว
                </p>
              </div>
            )}
          </Card>

          {/* Comment */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-comment mr-2 text-slate-400"></i>
              หมายเหตุ
            </h3>
            <Textarea
              placeholder="ระบุหมายเหตุหรือข้อเสนอแนะ..."
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Card>

          {/* Actions */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">การดำเนินการ</h3>
            <div className="space-y-2">
              <Button 
                variant="primary" 
                className="w-full"
                onClick={handleApprove}
                disabled={!allChecked || !allAttachmentsVerified}
              >
                <i className="fa-solid fa-paper-plane"></i>
                ส่งต่อให้ ผอ. อนุมัติ
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
                <i className="fa-solid fa-times"></i>
                ปฏิเสธคำขอ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
