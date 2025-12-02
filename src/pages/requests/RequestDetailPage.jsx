import { useNavigate, useParams } from 'react-router'
import { Button, Card, StatusBadge, Stepper, Divider } from '../../components'

/**
 * RequestDetailPage
 * View request details and track status
 */

// Mock request data
const mockRequest = {
  id: 'BD-089',
  type: 'project',
  typeName: 'ขออนุมัติโครงการ',
  title: 'โครงการอบรม AI สำหรับเกษตรกร',
  description: 'จัดอบรมการใช้งาน AI สำหรับการเกษตรแก่เกษตรกรในพื้นที่โครงการหลวง จำนวน 50 คน เพื่อพัฒนาทักษะและเพิ่มผลผลิต',
  status: 'reviewing',
  createdAt: '2025-12-01 10:30',
  updatedAt: '2025-12-01 14:15',
  amount: 45000,
  project: 'โครงการหลวง A',
  creator: {
    name: 'ดร.สมชาย ใจดี',
    department: 'ศูนย์ RSC',
  },
  timeline: [
    { step: 'สร้างคำขอ', date: '2025-12-01 10:30', user: 'ดร.สมชาย ใจดี', status: 'done' },
    { step: 'Admin ตรวจสอบ', date: '2025-12-01 14:15', user: 'คุณสุดา ตรวจสอบ', status: 'active' },
    { step: 'ผอ. อนุมัติ', date: '-', user: '-', status: 'pending' },
    { step: 'ออกเอกสาร', date: '-', user: '-', status: 'pending' },
  ],
  attachments: [
    { name: 'รายละเอียดโครงการ.pdf', size: '2.4 MB' },
    { name: 'งบประมาณ.xlsx', size: '156 KB' },
  ],
}

const workflowSteps = [
  { title: 'สร้างคำขอ' },
  { title: 'ตรวจสอบ' },
  { title: 'อนุมัติ' },
  { title: 'เสร็จสิ้น' },
]

export default function RequestDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  // In real app, fetch request by id
  const request = mockRequest

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-primary-500 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-bold text-slate-800">{request.id}</h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-slate-500">{request.typeName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <i className="fa-solid fa-print"></i>
            พิมพ์
          </Button>
          <Button variant="outline">
            <i className="fa-solid fa-download"></i>
            ดาวน์โหลด PDF
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
          สถานะการดำเนินการ
        </h2>
        <Stepper steps={workflowSteps} currentStep={2} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Info */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4">{request.title}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">{request.description}</p>
            
            <Divider className="my-6" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">โครงการ</p>
                <p className="font-medium text-slate-800">{request.project}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">จำนวนเงิน</p>
                <p className="font-bold text-primary-600 text-lg">
                  {request.amount?.toLocaleString()} บาท
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">ผู้สร้าง</p>
                <p className="font-medium text-slate-800">{request.creator.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">หน่วยงาน</p>
                <p className="font-medium text-slate-800">{request.creator.department}</p>
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
              {request.attachments.map((file, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 text-primary-500 rounded-lg flex items-center justify-center">
                      <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-400">{file.size}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-primary-500">
                    <i className="fa-solid fa-download"></i>
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">
              <i className="fa-solid fa-clock-rotate-left mr-2 text-slate-400"></i>
              ประวัติการดำเนินการ
            </h3>
            <div className="space-y-4">
              {request.timeline.map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0
                    ${item.status === 'done' ? 'bg-green-100 text-green-600' : 
                      item.status === 'active' ? 'bg-primary-100 text-primary-600' : 
                      'bg-slate-100 text-slate-400'}
                  `}>
                    {item.status === 'done' ? (
                      <i className="fa-solid fa-check"></i>
                    ) : item.status === 'active' ? (
                      <i className="fa-solid fa-spinner fa-spin"></i>
                    ) : (
                      <i className="fa-solid fa-circle"></i>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm">{item.step}</p>
                    <p className="text-xs text-slate-500">{item.user}</p>
                    <p className="text-xs text-slate-400">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Actions */}
          <Card>
            <h3 className="font-bold text-slate-800 mb-4">การดำเนินการ</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <i className="fa-solid fa-pen-to-square w-5"></i>
                แก้ไขคำขอ
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-500 hover:bg-red-50">
                <i className="fa-solid fa-trash w-5"></i>
                ยกเลิกคำขอ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
