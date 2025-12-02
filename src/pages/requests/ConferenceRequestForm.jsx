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
  ExpenseTable,
} from '../../components'
import TravelTable from '../../components/ui/TravelTable'
import AllowanceTable from '../../components/ui/AllowanceTable'
import AttendeeTable from '../../components/ui/AttendeeTable'

/**
 * ConferenceRequestForm
 * Comprehensive conference/travel approval request form
 * Based on "แบบขออนุมัติเข้าร่วมประชุม/สัมมนา/เดินทางไปราชการ" template
 * 
 * Supports both standalone and embedded modes:
 * - Standalone: Full page with navigation
 * - Embedded: Used within RequestWorkflowPage
 */

// Request types
const requestTypes = [
  { value: 'conference', label: 'เข้าร่วมประชุม' },
  { value: 'seminar', label: 'เข้าร่วมสัมมนา' },
  { value: 'training', label: 'เข้าร่วมฝึกอบรม' },
  { value: 'workshop', label: 'เข้าร่วม Workshop' },
  { value: 'official-travel', label: 'เดินทางไปราชการ' },
  { value: 'site-visit', label: 'ไปศึกษาดูงาน' },
  { value: 'other', label: 'อื่นๆ' },
]

// Mock parent projects
const parentProjects = [
  { value: '', label: '-- เลือกโครงการ --' },
  { value: 'royal-1', label: 'โครงการหลวงเพื่อพัฒนาการเกษตรยั่งยืน' },
  { value: 'royal-2', label: 'โครงการพระราชดำริเพื่อชุมชน' },
  { value: 'research-1', label: 'โครงการวิจัยและพัฒนา AI เพื่อการเกษตร' },
  { value: 'training-1', label: 'โครงการฝึกอบรมและพัฒนาบุคลากร' },
]

// Budget sources
const budgetSources = [
  { value: 'royal-fund', label: 'งบโครงการหลวง' },
  { value: 'university', label: 'งบมหาวิทยาลัย' },
  { value: 'external', label: 'งบภายนอก' },
  { value: 'personal', label: 'ไม่ใช้งบประมาณ (ส่วนตัว)' },
]

// Travel regions
const travelRegions = [
  { value: 'domestic', label: 'ในประเทศ' },
  { value: 'international', label: 'ต่างประเทศ' },
]

// Initial form state
const getInitialFormData = () => ({
  // Header info
  documentNumber: '',
  requestType: 'conference',
  travelRegion: 'domestic',
  
  // Conference/Event details
  eventName: '',
  organizer: '',
  eventLocation: '',
  eventProvince: '',
  eventCountry: 'ไทย',
  eventStartDate: '',
  eventEndDate: '',
  registrationFee: 0,
  
  // Travel details
  travelStartDate: '',
  travelEndDate: '',
  departureLocation: 'สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง',
  
  // Budget info
  parentProject: '',
  budgetSource: 'royal-fund',
  
  // Purpose
  purpose: '',
  expectedOutcome: '',
  
  // Attendees
  attendees: [],
  
  // Travel itinerary
  travelItinerary: [],
  
  // Allowances
  allowances: [],
  
  // Other expenses
  otherExpenses: [],

  // Personal vehicle compensation
  personalVehicleCompensation: 0,

  // Attachments
  attachments: [],
  
  // Additional notes
  notes: '',
})

export default function ConferenceRequestForm({ 
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

  // Calculate totals
  const calculations = useMemo(() => {
    const travelFare = formData.travelItinerary.reduce((sum, item) => sum + (parseFloat(item.fare) || 0), 0)
    const perDiem = formData.allowances.reduce((sum, item) => sum + (parseFloat(item.perDiemAmount) || 0), 0)
    const accommodation = formData.allowances.reduce((sum, item) => sum + (parseFloat(item.accommodationAmount) || 0), 0)
    const otherExpenses = formData.otherExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
    const registrationFee = parseFloat(formData.registrationFee) || 0
    const personalVehicleCompensation = parseFloat(formData.personalVehicleCompensation) || 0
    
    const grandTotal = travelFare + perDiem + accommodation + otherExpenses + registrationFee + personalVehicleCompensation
    
    return {
      travelFare,
      perDiem,
      accommodation,
      otherExpenses,
      personalVehicleCompensation,
      registrationFee,
      grandTotal
    }
  }, [formData])

  // Format date for display
  const formatThaiDate = (dateStr) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`
  }

  // Calculate number of days
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  // Handle field change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // If in embedded/workflow mode, call onComplete with form data
    if (isEmbedded && onComplete) {
      onComplete(formData)
      return
    }
    
    // Standalone mode - regular submit
    console.log('Form data:', formData)
    alert('ส่งคำขออนุมัติเรียบร้อยแล้ว')
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

  // Get request type label
  const getRequestTypeLabel = () => {
    const type = requestTypes.find(t => t.value === formData.requestType)
    return type?.label || '-'
  }

  // Get budget source label
  const getBudgetSourceLabel = () => {
    const source = budgetSources.find(s => s.value === formData.budgetSource)
    return source?.label || '-'
  }

  // Get project name
  const getProjectName = () => {
    const project = parentProjects.find(p => p.value === formData.parentProject)
    return project?.label || '-'
  }

  return (
    <div className={isEmbedded ? "" : "max-w-7xl mx-auto"}>
      {/* Header - only show in standalone mode */}
      {!isEmbedded && (
        <div className="mb-6">
          <button 
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            กลับหน้าเลือกประเภทคำขอ
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            แบบขออนุมัติเข้าร่วมประชุม/สัมมนา/เดินทางไปราชการ
          </h1>
          <p className="text-gray-600 mt-1">
            กรอกข้อมูลสำหรับขออนุมัติเข้าร่วมประชุม สัมมนา หรือเดินทางไปราชการ
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Form Input */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* Section 1: Basic Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                ข้อมูลเอกสาร
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="เลขที่เอกสาร"
                  placeholder="ระบบจะสร้างให้อัตโนมัติ"
                  value={formData.documentNumber}
                  onChange={(e) => handleChange('documentNumber', e.target.value)}
                  disabled
                />
                <Select
                  label="ประเภทการเดินทาง"
                  options={requestTypes}
                  value={formData.requestType}
                  onChange={(e) => handleChange('requestType', e.target.value)}
                  required
                />
                <Select
                  label="ภูมิภาค"
                  options={travelRegions}
                  value={formData.travelRegion}
                  onChange={(e) => handleChange('travelRegion', e.target.value)}
                  required
                />
                <Select
                  label="แหล่งงบประมาณ"
                  options={budgetSources}
                  value={formData.budgetSource}
                  onChange={(e) => handleChange('budgetSource', e.target.value)}
                  required
                />
                <div className="md:col-span-2">
                  <Select
                    label="โครงการที่เบิกจ่าย"
                    options={parentProjects}
                    value={formData.parentProject}
                    onChange={(e) => handleChange('parentProject', e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Section 2: Event Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                รายละเอียดงาน/กิจกรรม
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="ชื่องาน/กิจกรรม"
                    placeholder="เช่น การประชุมวิชาการระดับชาติ ครั้งที่ 1"
                    value={formData.eventName}
                    onChange={(e) => handleChange('eventName', e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="หน่วยงานผู้จัด"
                    placeholder="เช่น มหาวิทยาลัยเกษตรศาสตร์"
                    value={formData.organizer}
                    onChange={(e) => handleChange('organizer', e.target.value)}
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    label="สถานที่จัดงาน"
                    placeholder="เช่น โรงแรมเซ็นทารา แกรนด์ เซ็นทรัลพลาซา ลาดพร้าว"
                    value={formData.eventLocation}
                    onChange={(e) => handleChange('eventLocation', e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="จังหวัด"
                  placeholder="เช่น กรุงเทพมหานคร"
                  value={formData.eventProvince}
                  onChange={(e) => handleChange('eventProvince', e.target.value)}
                  required
                />
                {formData.travelRegion === 'international' && (
                  <Input
                    label="ประเทศ"
                    placeholder="เช่น ญี่ปุ่น"
                    value={formData.eventCountry}
                    onChange={(e) => handleChange('eventCountry', e.target.value)}
                    required
                  />
                )}
                <Input
                  label="วันที่เริ่มงาน"
                  type="date"
                  value={formData.eventStartDate}
                  onChange={(e) => handleChange('eventStartDate', e.target.value)}
                  required
                />
                <Input
                  label="วันที่สิ้นสุดงาน"
                  type="date"
                  value={formData.eventEndDate}
                  onChange={(e) => handleChange('eventEndDate', e.target.value)}
                  required
                />
                <Input
                  label="ค่าลงทะเบียน (บาท)"
                  type="number"
                  placeholder="0"
                  value={formData.registrationFee}
                  onChange={(e) => handleChange('registrationFee', e.target.value)}
                />
              </div>
            </Card>

            {/* Section 3: Travel Period */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                ระยะเวลาการเดินทาง
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="วันที่เริ่มเดินทาง"
                  type="date"
                  value={formData.travelStartDate}
                  onChange={(e) => handleChange('travelStartDate', e.target.value)}
                  required
                />
                <Input
                  label="วันที่สิ้นสุดการเดินทาง"
                  type="date"
                  value={formData.travelEndDate}
                  onChange={(e) => handleChange('travelEndDate', e.target.value)}
                  required
                />
                <div className="md:col-span-2">
                  <Input
                    label="สถานที่ออกเดินทาง"
                    placeholder="เช่น สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง"
                    value={formData.departureLocation}
                    onChange={(e) => handleChange('departureLocation', e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Travel days info */}
              {formData.travelStartDate && formData.travelEndDate && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <i className="fa-solid fa-info-circle"></i>
                    <span className="font-medium">
                      จำนวนวันเดินทาง: {calculateDays(formData.travelStartDate, formData.travelEndDate)} วัน
                    </span>
                  </div>
                </div>
              )}
            </Card>

            {/* Section 4: Purpose */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                วัตถุประสงค์และผลที่คาดว่าจะได้รับ
              </h2>
              
              <div className="space-y-4">
                <Textarea
                  label="วัตถุประสงค์ในการเดินทาง"
                  placeholder="ระบุวัตถุประสงค์ในการเดินทาง เช่น เพื่อเข้าร่วมประชุมและนำเสนอผลงานวิจัย..."
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  rows={4}
                  required
                />
                <Textarea
                  label="ผลที่คาดว่าจะได้รับ"
                  placeholder="ระบุผลที่คาดว่าจะได้รับจากการเดินทาง เช่น ได้รับความรู้ใหม่ๆ ในการพัฒนางานวิจัย..."
                  value={formData.expectedOutcome}
                  onChange={(e) => handleChange('expectedOutcome', e.target.value)}
                  rows={4}
                  required
                />
              </div>
            </Card>

            {/* Section 5: Attendees */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">5</span>
                รายชื่อผู้เดินทาง
              </h2>
              
              <AttendeeTable
                value={formData.attendees}
                onChange={(value) => handleChange('attendees', value)}
              />
            </Card>

            {/* Section 6: Travel Itinerary */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                รายการเดินทาง (ค่าพาหนะ)
              </h2>
              
              <TravelTable
                value={formData.travelItinerary}
                onChange={(value) => handleChange('travelItinerary', value)}
              />
            </Card>

            {/* Section 7: Allowances */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">7</span>
                ค่าเบี้ยเลี้ยงและค่าที่พัก
              </h2>
              
              <AllowanceTable
                value={formData.allowances}
                onChange={(value) => handleChange('allowances', value)}
              />
            </Card>

            {/* Section 8: Other Expenses */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">8</span>
                ค่าใช้จ่ายอื่นๆ
              </h2>
              
              <ExpenseTable
                value={formData.otherExpenses}
                onChange={(value) => handleChange('otherExpenses', value)}
              />
            </Card>

            {/* Section 9: Attachments */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">9</span>
                เอกสารแนบ
              </h2>
              
              <FileUpload
                value={formData.attachments}
                onChange={(files) => handleChange('attachments', files)}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                maxSize={10}
                multiple
              />
              
              <div className="mt-3 text-sm text-gray-500">
                <p className="font-medium mb-1">เอกสารที่ควรแนบ:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>หนังสือเชิญเข้าร่วมงาน / กำหนดการ</li>
                  <li>โปรแกรมการประชุม/สัมมนา</li>
                  <li>รายละเอียดค่าลงทะเบียน (ถ้ามี)</li>
                  <li>ใบเสนอราคาที่พัก (ถ้ามี)</li>
                  <li>เอกสารอื่นๆ ที่เกี่ยวข้อง</li>
                </ul>
              </div>
            </Card>

            {/* Section 10: Additional Notes */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">10</span>
                หมายเหตุเพิ่มเติม
              </h2>
              
              <Textarea
                placeholder="ระบุข้อมูลหรือหมายเหตุเพิ่มเติม (ถ้ามี)"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
              />
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
              >
                {isEmbedded ? 'ย้อนกลับ' : 'ยกเลิก'}
              </Button>
              {!isEmbedded && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    // TODO: Save draft logic
                    alert('บันทึกฉบับร่างแล้ว')
                  }}
                >
                  <i className="fa-solid fa-save mr-2"></i>
                  บันทึกฉบับร่าง
                </Button>
              )}
              <Button type="submit">
                <i className={`fa-solid ${isEmbedded ? 'fa-arrow-right' : 'fa-paper-plane'} mr-2`}></i>
                {isEmbedded ? 'บันทึกและไปขั้นตอนถัดไป' : 'ส่งคำขออนุมัติ'}
              </Button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-eye text-primary-600"></i>
                  ตัวอย่างเอกสาร
                </h2>

                {/* Preview Document */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-xs leading-relaxed">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <p className="font-bold text-sm">บันทึกข้อความ</p>
                  </div>

                  {/* Document Info */}
                  <div className="space-y-1 mb-4">
                    <p><strong>ส่วนราชการ</strong> สถาบันวิจัยและพัฒนาแห่ง มจธ.</p>
                    <p><strong>ที่</strong> {formData.documentNumber || 'อว 7601/........'}</p>
                    <p><strong>วันที่</strong> {formatThaiDate(new Date().toISOString().split('T')[0])}</p>
                  </div>

                  <Divider className="my-3" />

                  {/* Subject */}
                  <p className="mb-4">
                    <strong>เรื่อง</strong> ขออนุมัติ{getRequestTypeLabel()}
                    {formData.eventName && ` "${formData.eventName}"`}
                  </p>

                  <p className="mb-4"><strong>เรียน</strong> ผู้อำนวยการสถาบันวิจัยและพัฒนาแห่ง มจธ.</p>

                  {/* Content */}
                  <div className="space-y-3 mb-4">
                    <p className="text-justify indent-8">
                      ด้วยข้าพเจ้า {user?.name || '....................'} 
                      ตำแหน่ง {user?.position || 'นักวิจัย'} 
                      มีความประสงค์ขออนุมัติ{getRequestTypeLabel()}
                      {formData.eventName && ` "${formData.eventName}"`}
                      {formData.organizer && ` จัดโดย ${formData.organizer}`}
                    </p>

                    {formData.eventLocation && (
                      <p className="indent-8">
                        <strong>สถานที่:</strong> {formData.eventLocation}
                        {formData.eventProvince && `, ${formData.eventProvince}`}
                        {formData.travelRegion === 'international' && formData.eventCountry && `, ${formData.eventCountry}`}
                      </p>
                    )}

                    {(formData.eventStartDate || formData.eventEndDate) && (
                      <p className="indent-8">
                        <strong>วันที่จัดงาน:</strong> {formatThaiDate(formData.eventStartDate)}
                        {formData.eventEndDate && formData.eventEndDate !== formData.eventStartDate && 
                          ` - ${formatThaiDate(formData.eventEndDate)}`}
                      </p>
                    )}

                    {(formData.travelStartDate || formData.travelEndDate) && (
                      <p className="indent-8">
                        <strong>ระยะเวลาเดินทาง:</strong> {formatThaiDate(formData.travelStartDate)}
                        {formData.travelEndDate && formData.travelEndDate !== formData.travelStartDate && 
                          ` - ${formatThaiDate(formData.travelEndDate)}`}
                        {formData.travelStartDate && formData.travelEndDate && 
                          ` (${calculateDays(formData.travelStartDate, formData.travelEndDate)} วัน)`}
                      </p>
                    )}
                  </div>

                  {/* Purpose */}
                  {formData.purpose && (
                    <div className="mb-4">
                      <p className="font-bold mb-1">วัตถุประสงค์:</p>
                      <p className="text-justify indent-8">{formData.purpose}</p>
                    </div>
                  )}

                  {/* Attendees */}
                  {formData.attendees.length > 0 && (
                    <div className="mb-4">
                      <p className="font-bold mb-1">รายชื่อผู้เดินทาง:</p>
                      <AttendeeTable value={formData.attendees} readOnly />
                    </div>
                  )}

                  {/* Budget Summary */}
                  <div className="mb-4">
                    <p className="font-bold mb-2">สรุปค่าใช้จ่าย:</p>
                    <div className="border border-gray-300 rounded">
                      <table className="w-full text-xs">
                        <tbody>
                          <tr>
                            <td className="px-2 py-1 border-b border-gray-200">ค่าลงทะเบียน</td>
                            <td className="px-2 py-1 border-b border-gray-200 text-right">
                              {calculations.registrationFee.toLocaleString()} บาท
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border-b border-gray-200">ค่าเบี้ยเลี้ยง</td>
                            <td className="px-2 py-1 border-b border-gray-200 text-right">
                              {calculations.perDiem.toLocaleString()} บาท
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border-b border-gray-200">ค่าที่พัก</td>
                            <td className="px-2 py-1 border-b border-gray-200 text-right">
                              {calculations.accommodation.toLocaleString()} บาท
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border-b border-gray-200">ค่าพาหนะเดินทาง</td>
                            <td className="px-2 py-1 border-b border-gray-200 text-right">
                              {calculations.travelFare.toLocaleString()} บาท
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border-b border-gray-200">เงินชดเชยพาหนะส่วนตัว</td>
                            <td className="px-2 py-1 border-b border-gray-200 text-right">
                              {calculations.personalVehicleCompensation.toLocaleString()} บาท
                            </td>
                          </tr>
                          <tr>
                            <td className="px-2 py-1 border-b border-gray-200">ค่าธรรมเนียม/ค่าใช้จ่ายอื่นๆ</td>
                            <td className="px-2 py-1 border-b border-gray-200 text-right">
                              {calculations.otherExpenses.toLocaleString()} บาท
                            </td>
                          </tr>
                          <tr className="bg-primary-50 font-bold">
                            <td className="px-2 py-1">รวมทั้งสิ้น</td>
                            <td className="px-2 py-1 text-right text-primary-700">
                              {calculations.grandTotal.toLocaleString()} บาท
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {formData.budgetSource && (
                      <p className="mt-2 text-gray-600">
                        <strong>แหล่งงบประมาณ:</strong> {getBudgetSourceLabel()}
                        {formData.parentProject && ` (${getProjectName()})`}
                      </p>
                    )}
                  </div>

                  <Divider className="my-3" />

                  {/* Signature */}
                  <div className="mt-6 text-center">
                    <p className="mb-8">จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ</p>
                    <div className="inline-block text-center">
                      <p className="mb-8">ลงชื่อ .................................</p>
                      <p>({user?.name || '.......................'})</p>
                      <p>{user?.position || 'นักวิจัย'}</p>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  {/* Approval Section */}
                  <div className="space-y-4">
                    <p className="font-bold">ความเห็นหัวหน้าโครงการ</p>
                    <div className="border border-gray-300 rounded p-3 min-h-16 bg-gray-50">
                      <p className="text-gray-400">รอการพิจารณา...</p>
                    </div>
                    <div className="text-center">
                      <p className="mb-6">ลงชื่อ .................................</p>
                      <p>(........................................)</p>
                      <p>หัวหน้าโครงการ</p>
                    </div>

                    <Divider className="my-3" />

                    <p className="font-bold">คำสั่งผู้อำนวยการ</p>
                    <div className="flex gap-4 mb-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" disabled className="rounded" />
                        <span>อนุมัติ</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" disabled className="rounded" />
                        <span>ไม่อนุมัติ</span>
                      </label>
                    </div>
                    <div className="border border-gray-300 rounded p-3 min-h-16 bg-gray-50">
                      <p className="text-gray-400">รอการพิจารณา...</p>
                    </div>
                    <div className="text-center">
                      <p className="mb-6">ลงชื่อ .................................</p>
                      <p>(........................................)</p>
                      <p>ผู้อำนวยการสถาบันวิจัยและพัฒนาแห่ง มจธ.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
