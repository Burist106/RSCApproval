import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../contexts'
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Textarea, 
  Divider,
  FileUpload,
  ScheduleTable,
  ExpenseTable,
} from '../../components'

/**
 * ProjectRequestForm
 * Comprehensive project approval request form
 * Based on "บันทึกข้อความขออนุมัติโครงการ" template
 * 
 * Supports both standalone and embedded modes:
 * - Standalone: Full page with navigation
 * - Embedded: Used within RequestWorkflowPage
 */

// Mock parent projects
const parentProjects = [
  { value: 'royal-1', label: 'โครงการหลวงเพื่อพัฒนาการเกษตรยั่งยืน' },
  { value: 'royal-2', label: 'โครงการพระราชดำริเพื่อชุมชน' },
  { value: 'research-1', label: 'โครงการวิจัยและพัฒนา AI เพื่อการเกษตร' },
  { value: 'training-1', label: 'โครงการฝึกอบรมและพัฒนาบุคลากร' },
]

// Fiscal years
const fiscalYears = [
  { value: '2568', label: 'ปีงบประมาณ 2568' },
  { value: '2567', label: 'ปีงบประมาณ 2567' },
]

// Budget sources
const budgetSources = [
  { value: 'royal-fund', label: 'งบโครงการหลวง' },
  { value: 'university', label: 'งบมหาวิทยาลัย' },
  { value: 'external', label: 'งบภายนอก' },
  { value: 'other', label: 'อื่นๆ' },
]

// Initial form data factory
const getInitialFormData = () => ({
  // Header info
  documentNumber: '', // Auto-generated or manual
  fiscalYear: '2568',
  parentProject: '',
  budgetSource: 'royal-fund',
  
  // Sub-project details
  projectName: '',
  subProjectName: '',
  objectives: '',
  expectedOutcome: '',
  targetGroup: '',
  targetCount: '',
  
  // Location & Date
  location: '',
  province: '',
  startDate: '',
  endDate: '',
  
  // Schedule
  schedule: [],
  
  // Expenses
  expenses: [],
  
  // Attachments
  attachments: [],
  
  // Additional notes
  notes: '',
  
  // For bundle preview
  totalBudget: 0,
  fundingSource: '',
})

export default function ProjectRequestForm({ 
  isEmbedded = false, 
  initialData = null, 
  onComplete = null, 
  onBack = null,
  workflowPath = null 
}) {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  // Form state - merge initial data if provided
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return { ...getInitialFormData(), ...initialData }
    }
    return getInitialFormData()
  })

  // Update form data when initialData changes (for workflow mode)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  // Calculate total budget
  const totalBudget = useMemo(() => {
    return formData.expenses.reduce((sum, item) => sum + (item.amount || 0), 0)
  }, [formData.expenses])

  // Format date for display
  const formatThaiDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`
  }

  // Handle field change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle form submit
  const handleSubmit = () => {
    // Validate required fields
    if (!formData.subProjectName || !formData.objectives || !formData.startDate) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
      return
    }
    
    // Prepare data for bundle preview
    const submitData = {
      ...formData,
      projectName: formData.subProjectName,
      totalBudget: totalBudget,
      fundingSource: budgetSources.find(s => s.value === formData.budgetSource)?.label || '',
    }
    
    // If in embedded/workflow mode, call onComplete with form data
    if (isEmbedded && onComplete) {
      onComplete(submitData)
      return
    }
    
    // Standalone mode - regular submit
    console.log('Submit:', submitData)
    alert('ส่งคำขอเรียบร้อยแล้ว!')
    navigate('/requests')
  }

  // Handle back navigation
  const handleBack = () => {
    if (isEmbedded && onBack) {
      onBack()
    } else {
      navigate('/requests/new')
    }
  }

  // Handle save draft
  const handleSaveDraft = () => {
    console.log('Save draft:', formData)
    alert('บันทึกฉบับร่างเรียบร้อยแล้ว!')
  }

  return (
    <div className={isEmbedded ? "" : "max-w-7xl mx-auto"}>
      {/* Header - only show in standalone mode */}
      {!isEmbedded && (
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-primary-500 transition"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">
              <i className="fa-solid fa-file-contract mr-2 text-primary-500"></i>
              ขออนุมัติโครงการ
            </h1>
            <p className="text-sm text-slate-500">บันทึกข้อความขออนุมัติโครงการและโครงการย่อย</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <i className="fa-solid fa-floppy-disk"></i>
              บันทึกฉบับร่าง
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              <i className="fa-solid fa-paper-plane"></i>
              ส่งคำขอ
            </Button>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Section 1: Header Info */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm">1</span>
              ข้อมูลทั่วไป
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="ปีงบประมาณ"
                options={fiscalYears}
                value={formData.fiscalYear}
                onChange={(e) => handleChange('fiscalYear', e.target.value)}
                required
              />
              <Select
                label="แหล่งงบประมาณ"
                options={budgetSources}
                value={formData.budgetSource}
                onChange={(e) => handleChange('budgetSource', e.target.value)}
                required
              />
            </div>
            
            <div className="mt-4">
              <Select
                label="โครงการหลัก (ถ้ามี)"
                options={[{ value: '', label: '-- เลือกโครงการหลัก --' }, ...parentProjects]}
                value={formData.parentProject}
                onChange={(e) => handleChange('parentProject', e.target.value)}
              />
            </div>
          </Card>

          {/* Section 2: Sub-project Details */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm">2</span>
              รายละเอียดโครงการ/โครงการย่อย
            </h2>
            
            <div className="space-y-4">
              <Input
                label="ชื่อโครงการ/โครงการย่อย"
                placeholder="ระบุชื่อโครงการหรือกิจกรรม"
                value={formData.subProjectName}
                onChange={(e) => handleChange('subProjectName', e.target.value)}
                required
              />
              
              <Textarea
                label="วัตถุประสงค์"
                placeholder="ระบุวัตถุประสงค์ของโครงการ เช่น เพื่อจัดอบรม..., เพื่อพัฒนา..."
                rows={3}
                value={formData.objectives}
                onChange={(e) => handleChange('objectives', e.target.value)}
                required
              />
              
              <Textarea
                label="ผลที่คาดว่าจะได้รับ"
                placeholder="ระบุผลลัพธ์ที่คาดหวังจากโครงการ"
                rows={2}
                value={formData.expectedOutcome}
                onChange={(e) => handleChange('expectedOutcome', e.target.value)}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="กลุ่มเป้าหมาย"
                  placeholder="เช่น เกษตรกร, นักศึกษา, บุคลากร"
                  value={formData.targetGroup}
                  onChange={(e) => handleChange('targetGroup', e.target.value)}
                />
                <Input
                  label="จำนวน (คน)"
                  type="number"
                  placeholder="0"
                  value={formData.targetCount}
                  onChange={(e) => handleChange('targetCount', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Section 3: Location & Date */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm">3</span>
              สถานที่และวันที่ดำเนินการ
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="สถานที่"
                  placeholder="ระบุสถานที่จัดกิจกรรม"
                  icon="fa-solid fa-location-dot"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
                <Input
                  label="จังหวัด"
                  placeholder="ระบุจังหวัด"
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="วันที่เริ่มต้น"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
                <Input
                  label="วันที่สิ้นสุด"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Section 4: Schedule */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm">4</span>
              กำหนดการ
            </h2>
            
            <ScheduleTable
              items={formData.schedule}
              onChange={(items) => handleChange('schedule', items)}
            />
          </Card>

          {/* Section 5: Expenses */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm">5</span>
              งบประมาณค่าใช้จ่าย
            </h2>
            
            <ExpenseTable
              items={formData.expenses}
              onChange={(items) => handleChange('expenses', items)}
              showCategory={true}
            />
          </Card>

          {/* Section 6: Attachments */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm">6</span>
              เอกสารแนบ
            </h2>
            
            <FileUpload
              label=""
              files={formData.attachments}
              onChange={(files) => handleChange('attachments', files)}
              hint="แนบไฟล์ประกอบ เช่น รายละเอียดโครงการ, แผนงาน, ใบเสนอราคา"
            />
          </Card>

          {/* Section 7: Notes */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm">7</span>
              หมายเหตุเพิ่มเติม
            </h2>
            
            <Textarea
              placeholder="ระบุหมายเหตุหรือข้อมูลเพิ่มเติม (ถ้ามี)..."
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </Card>

          {/* Actions - Mobile/Embedded */}
          <div className={isEmbedded ? "flex gap-3 justify-end" : "xl:hidden flex gap-3"}>
            <Button variant="outline" onClick={handleBack}>
              {isEmbedded ? <><i className="fa-solid fa-arrow-left"></i> ย้อนกลับ</> : <><i className="fa-solid fa-floppy-disk"></i> บันทึกฉบับร่าง</>}
            </Button>
            {!isEmbedded && (
              <Button variant="outline" className="flex-1" onClick={handleSaveDraft}>
                <i className="fa-solid fa-floppy-disk"></i>
                บันทึกฉบับร่าง
              </Button>
            )}
            <Button variant="primary" className={isEmbedded ? "" : "flex-1"} onClick={handleSubmit}>
              <i className={`fa-solid ${isEmbedded ? 'fa-arrow-right' : 'fa-paper-plane'}`}></i>
              {isEmbedded ? 'บันทึกและไปขั้นตอนถัดไป' : 'ส่งคำขอ'}
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="xl:col-span-1">
          <div className="sticky top-4">
            <Card className="bg-slate-100 border-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <i className="fa-solid fa-eye mr-2"></i>
                  ตัวอย่างเอกสาร
                </h3>
                <Button variant="ghost" size="sm">
                  <i className="fa-solid fa-expand"></i>
                </Button>
              </div>
              
              {/* Document Preview */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Document Header */}
                <div className="bg-slate-800 text-white px-4 py-2 text-xs flex items-center gap-2">
                  <i className="fa-solid fa-file-pdf"></i>
                  <span>บันทึกข้อความ</span>
                </div>
                
                {/* Document Content */}
                <div className="p-4 text-xs leading-relaxed space-y-3 max-h-[600px] overflow-y-auto">
                  {/* Official Header */}
                  <div className="text-center border-b border-slate-200 pb-3">
                    <p className="font-bold text-sm">บันทึกข้อความ</p>
                  </div>
                  
                  {/* Metadata */}
                  <div className="space-y-1 text-slate-600">
                    <p><strong>ส่วนราชการ:</strong> ศูนย์ RSC มจธ.</p>
                    <p><strong>ที่:</strong> {formData.documentNumber || 'อว 7601/.....'}</p>
                    <p><strong>วันที่:</strong> {formatThaiDate(new Date().toISOString().split('T')[0])}</p>
                  </div>
                  
                  <Divider className="my-2" />
                  
                  {/* Subject */}
                  <div>
                    <p><strong>เรื่อง:</strong> ขออนุมัติ{formData.subProjectName || '.....................'}</p>
                  </div>
                  
                  {/* To */}
                  <div>
                    <p><strong>เรียน:</strong> ผู้อำนวยการศูนย์ RSC</p>
                  </div>
                  
                  <Divider className="my-2" />
                  
                  {/* Body */}
                  <div className="space-y-2 text-slate-700">
                    <p className="indent-8">
                      ตามที่ศูนย์ RSC ได้ดำเนินงาน
                      {formData.parentProject 
                        ? parentProjects.find(p => p.value === formData.parentProject)?.label 
                        : '.....................'
                      } 
                      ประจำปีงบประมาณ {formData.fiscalYear} นั้น
                    </p>
                    
                    <p className="indent-8">
                      บัดนี้ {user?.name || 'ข้าพเจ้า'} มีความประสงค์ขออนุมัติ
                      <strong>{formData.subProjectName || '.....................'}</strong>
                      {formData.objectives && (
                        <> โดยมีวัตถุประสงค์{formData.objectives}</>
                      )}
                      {formData.targetGroup && formData.targetCount && (
                        <> กลุ่มเป้าหมาย {formData.targetGroup} จำนวน {formData.targetCount} คน</>
                      )}
                      {formData.location && (
                        <> ณ {formData.location} {formData.province && `จังหวัด${formData.province}`}</>
                      )}
                      {formData.startDate && (
                        <> ในวันที่ {formatThaiDate(formData.startDate)}
                        {formData.endDate && formData.endDate !== formData.startDate && (
                          <> ถึงวันที่ {formatThaiDate(formData.endDate)}</>
                        )}
                        </>
                      )}
                    </p>
                    
                    {/* Budget Summary */}
                    {totalBudget > 0 && (
                      <p className="indent-8">
                        โดยใช้งบประมาณรวมทั้งสิ้น <strong className="text-primary-600">{totalBudget.toLocaleString()}</strong> บาท 
                        ({formData.budgetSource === 'royal-fund' ? 'งบโครงการหลวง' : 
                          formData.budgetSource === 'university' ? 'งบมหาวิทยาลัย' : 'งบภายนอก'})
                      </p>
                    )}
                    
                    {/* Schedule Summary */}
                    {formData.schedule.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium mb-1">กำหนดการ:</p>
                        <div className="pl-4 space-y-0.5">
                          {formData.schedule.map((item, idx) => (
                            <p key={idx} className="text-slate-600">
                              • {item.date && formatThaiDate(item.date)} {item.time && `เวลา ${item.time} น.`} {item.activity}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Expense Summary */}
                    {formData.expenses.length > 0 && (
                      <div className="mt-3">
                        <p className="font-medium mb-1">รายละเอียดค่าใช้จ่าย:</p>
                        <div className="border border-slate-200 rounded overflow-hidden">
                          <table className="w-full text-xs">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-2 py-1 text-left">รายการ</th>
                                <th className="px-2 py-1 text-right">จำนวนเงิน</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {formData.expenses.map((item, idx) => (
                                <tr key={idx}>
                                  <td className="px-2 py-1">{item.description || '-'}</td>
                                  <td className="px-2 py-1 text-right">{(item.amount || 0).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-primary-50">
                              <tr>
                                <td className="px-2 py-1 font-bold">รวม</td>
                                <td className="px-2 py-1 text-right font-bold text-primary-600">{totalBudget.toLocaleString()}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <p className="indent-8 mt-3">
                      จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ
                    </p>
                  </div>
                  
                  {/* Signature */}
                  <div className="mt-6 text-center">
                    <p className="mb-8">(ลงชื่อ)...................................</p>
                    <p>({user?.name || '..............................'})</p>
                    <p className="text-slate-500">ผู้ขออนุมัติ</p>
                  </div>
                  
                  {/* Approval Section */}
                  <div className="mt-6 pt-4 border-t border-dashed border-slate-300">
                    <p className="font-medium mb-2">ความเห็นผู้บังคับบัญชา</p>
                    <div className="h-16 border border-slate-200 rounded bg-slate-50"></div>
                    <div className="mt-4 text-center">
                      <p className="mb-8">(ลงชื่อ)...................................</p>
                      <p>(..............................)</p>
                      <p className="text-slate-500">ผู้อำนวยการศูนย์ RSC</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview Info */}
              <p className="text-xs text-slate-400 mt-3 text-center">
                * ตัวอย่างเอกสารจะอัพเดทตามข้อมูลที่กรอก
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
