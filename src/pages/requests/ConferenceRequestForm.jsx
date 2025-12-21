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
import { getAccOptions, getFDByAcc, formatCurrency } from '../../data/fdCodes'

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
  
  // ACC Selection (รหัสงบประมาณ)
  selectedAcc: '',
  documentSubject: '', // เรื่อง: ACC (รหัสโครงการ)
  parentProject: '',
  fdNumber: '',
  planCode: '',
  planName: '',
  fundCode: '',
  fundName: '',
  projectCode: '',
  
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
  
  // Fullscreen preview state
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false)
  
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

  // Get ACC options for dropdown
  const accOptions = useMemo(() => {
    return [
      { value: '', label: '-- เลือกรหัสงบประมาณ (ACC) --' },
      ...getAccOptions()
    ]
  }, [])

  // Get selected FD data for display
  const selectedFDData = useMemo(() => {
    return getFDByAcc(formData.selectedAcc)
  }, [formData.selectedAcc])

  // Handle field change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle ACC selection - auto-fill related fields
  const handleAccChange = (acc) => {
    const fdData = getFDByAcc(acc)
    if (fdData) {
      setFormData(prev => ({
        ...prev,
        selectedAcc: acc,
        parentProject: fdData.projectName,
        documentSubject: acc, // แสดงแค่ ACC ไม่ต้องมีวงเล็บรหัสโครงการ
        fdNumber: fdData.fdCode,
        planCode: fdData.planCode,
        planName: fdData.planName,
        fundCode: fdData.fundCode,
        fundName: fdData.fundName,
        projectCode: fdData.projectCode,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        selectedAcc: acc,
        parentProject: '',
        documentSubject: '',
        fdNumber: '',
        planCode: '',
        planName: '',
        fundCode: '',
        fundName: '',
        projectCode: '',
      }))
    }
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

  // Fill demo data for presentation
  const fillDemoData = () => {
    const demoData = {
      parentProject: 'royal-1',
      eventName: 'การประชุมวิชาการนานาชาติด้านเกษตรอัจฉริยะ Smart Agriculture 2025',
      organizer: 'สมาคมวิศวกรรมเกษตรแห่งประเทศไทย ร่วมกับ มหาวิทยาลัยเกษตรศาสตร์',
      eventLocation: 'โรงแรมเซ็นทารา แกรนด์ แอท เซ็นทรัลเวิลด์',
      eventProvince: 'กรุงเทพมหานคร',
      travelRegion: 'domestic',
      eventStartDate: '2025-02-10',
      eventEndDate: '2025-02-12',
      travelStartDate: '2025-02-10',
      travelEndDate: '2025-02-12',
      participationType: 'presenter',
      presentationTitle: 'การประยุกต์ใช้ AI ในการพยากรณ์ผลผลิตพืชไร่บนพื้นที่สูง',
      registrationFee: '3500',
      selectedAcc: 'ACC-RSC-001',
      travelItinerary: [
        { date: '2025-02-10', from: 'มจธ. บางมด', to: 'โรงแรมเซ็นทารา เซ็นทรัลเวิลด์', vehicle: 'รถไฟฟ้า BTS', fare: 60 },
        { date: '2025-02-12', from: 'โรงแรมเซ็นทารา เซ็นทรัลเวิลด์', to: 'มจธ. บางมด', vehicle: 'รถไฟฟ้า BTS', fare: 60 },
      ],
      allowances: [
        { date: '2025-02-10', perDiemAmount: 240, accommodationAmount: 0, perDiemNote: 'วันแรกของการประชุม' },
        { date: '2025-02-11', perDiemAmount: 240, accommodationAmount: 1800, perDiemNote: 'วันที่สองของการประชุม' },
        { date: '2025-02-12', perDiemAmount: 240, accommodationAmount: 0, perDiemNote: 'วันสุดท้าย' },
      ],
      otherExpenses: [
        { description: 'ค่าถ่ายเอกสารประกอบการนำเสนอ', amount: 500 },
        { description: 'ค่าจัดทำโปสเตอร์', amount: 1200 },
      ],
      notes: 'การประชุมนี้เป็นเวทีสำคัญในการเผยแพร่ผลงานวิจัยของศูนย์ RSC และสร้างเครือข่ายความร่วมมือกับหน่วยงานต่างๆ',
    }
    setFormData(prev => ({ ...prev, ...demoData }))
  }

  return (
    <div className={isEmbedded ? "" : "max-w-7xl mx-auto"}>
      {/* Header - only show in standalone mode */}
      {!isEmbedded && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left"></i>
              กลับหน้าเลือกประเภทคำขอ
            </button>
            <Button variant="ghost" onClick={fillDemoData} className="text-amber-600 hover:bg-amber-50">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
              Fill Demo
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            แบบขออนุมัติเข้าร่วมประชุม/สัมมนา/เดินทางไปราชการ
          </h1>
          <p className="text-gray-600 mt-1">
            กรอกข้อมูลสำหรับขออนุมัติเข้าร่วมประชุม สัมมนา หรือเดินทางไปราชการ
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column - Form Input */}
          <div className="space-y-6 order-2 xl:order-1">
            
            {/* Section 1: Requester Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                ข้อมูลผู้ขออนุมัติ
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ชื่อ-นามสกุล"
                  value={user?.name || ''}
                  disabled
                  helper="ดึงจากข้อมูลผู้ใช้อัตโนมัติ"
                />
                <Input
                  label="ตำแหน่ง"
                  value={user?.position || 'นักวิจัย'}
                  disabled
                  helper="ดึงจากข้อมูลผู้ใช้อัตโนมัติ"
                />
                <Input
                  label="ภาควิชา/กอง/ส่วน/ศูนย์/งาน"
                  value="RSC"
                  disabled
                />
                <Input
                  label="คณะ/สำนัก"
                  value="สรบ."
                  disabled
                />
              </div>
            </Card>

            {/* Section 2: Basic Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
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
                {/* ACC Selection */}
                <div className="md:col-span-2">
                  <Select
                    label="รหัสงบประมาณ (ACC)"
                    options={accOptions}
                    value={formData.selectedAcc}
                    onChange={(e) => handleAccChange(e.target.value)}
                    required
                  />
                </div>
                
                {/* Show selected ACC info */}
                {selectedFDData && (
                  <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <i className="fa-solid fa-circle-info text-blue-500"></i>
                      <span className="font-semibold text-blue-800">ข้อมูลโครงการที่เลือก</span>
                      <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                        <i className="fa-solid fa-magic mr-1"></i>
                        Auto-fill
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-slate-500">ACC:</span>
                        <span className="ml-2 font-medium text-slate-800">{formData.selectedAcc}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">รหัสโครงการ:</span>
                        <span className="ml-2 font-medium text-slate-800">{selectedFDData.projectCode}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-slate-500">ชื่อโครงการ:</span>
                        <span className="ml-2 font-medium text-slate-800">{selectedFDData.projectName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">งบประมาณ:</span>
                        <span className="ml-2 font-semibold text-green-600">{formatCurrency(selectedFDData.budget)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">คงเหลือ:</span>
                        <span className="ml-2 font-semibold text-blue-600">{formatCurrency(selectedFDData.budget - selectedFDData.spent)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Section 3: Event Details */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">3</span>
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
              </div>
            </Card>

            {/* Section 4: Travel Period */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">4</span>
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
                    placeholder="เช่น มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี"
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

            {/* Section 5: Purpose */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">5</span>
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

            {/* Section 6: Attendees */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">6</span>
                รายชื่อผู้เดินทาง
              </h2>
              
              <p className="text-sm text-gray-500 mb-4">
                กรณีมีผู้เดินทางมากกว่า 1 คน ให้เพิ่มรายชื่อผู้ร่วมเดินทางทั้งหมด
              </p>
              
              <AttendeeTable
                value={formData.attendees}
                onChange={(value) => handleChange('attendees', value)}
              />
            </Card>

            {/* Section 7: Expense Estimate */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">7</span>
                ประมาณการค่าใช้จ่าย
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="1. ค่าลงทะเบียน (บาท)"
                  type="number"
                  placeholder="0"
                  value={formData.registrationFee}
                  onChange={(e) => handleChange('registrationFee', e.target.value)}
                />
              </div>

              {/* Allowances Subsection */}
              <div className="mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">2. ค่าเบี้ยเลี้ยงและค่าที่พัก</h3>
                <AllowanceTable
                  value={formData.allowances}
                  onChange={(value) => handleChange('allowances', value)}
                />
              </div>

              {/* Travel Itinerary Subsection */}
              <div className="mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">3. ค่าพาหนะเดินทาง</h3>
                <TravelTable
                  value={formData.travelItinerary}
                  onChange={(value) => handleChange('travelItinerary', value)}
                />
              </div>

              {/* Personal Vehicle Compensation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="4. เงินชดเชยพาหนะส่วนตัว (บาท)"
                  type="number"
                  placeholder="0"
                  value={formData.personalVehicleCompensation}
                  onChange={(e) => handleChange('personalVehicleCompensation', e.target.value)}
                  helper="กรณีใช้รถยนต์ส่วนตัวในการเดินทาง"
                />
              </div>

              {/* Other Expenses Subsection */}
              <div className="mb-4">
                <h3 className="text-md font-medium text-gray-800 mb-3">5. ค่าธรรมเนียม/ค่าใช้จ่ายอื่นๆ</h3>
                <ExpenseTable
                  value={formData.otherExpenses}
                  onChange={(value) => handleChange('otherExpenses', value)}
                />
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-md font-semibold text-gray-900 mb-3">สรุปค่าใช้จ่ายทั้งหมด</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ค่าลงทะเบียน</span>
                    <span>{calculations.registrationFee.toLocaleString()} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าเบี้ยเลี้ยง</span>
                    <span>{calculations.perDiem.toLocaleString()} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าที่พัก</span>
                    <span>{calculations.accommodation.toLocaleString()} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าพาหนะเดินทาง</span>
                    <span>{calculations.travelFare.toLocaleString()} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span>เงินชดเชยพาหนะส่วนตัว</span>
                    <span>{calculations.personalVehicleCompensation.toLocaleString()} บาท</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ค่าธรรมเนียม/ค่าใช้จ่ายอื่นๆ</span>
                    <span>{calculations.otherExpenses.toLocaleString()} บาท</span>
                  </div>
                  <Divider className="my-2" />
                  <div className="flex justify-between font-bold text-lg text-primary-700">
                    <span>รวมทั้งสิ้น</span>
                    <span>{calculations.grandTotal.toLocaleString()} บาท</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Section 8: Attachments */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">8</span>
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

            {/* Section 9: Additional Notes */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">9</span>
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
            <div className="flex justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={fillDemoData}
                className="text-amber-600 hover:bg-amber-50"
              >
                <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                Fill Demo
              </Button>
              <div className="flex gap-2">
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
          </div>

          {/* Right Column - Preview */}
          <div className="order-1 xl:order-2">
            <div className="sticky top-4">
              <Card className="p-4 max-h-[calc(100vh-120px)] flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <i className="fa-solid fa-eye text-primary-600"></i>
                    ตัวอย่างเอกสาร (2 หน้า)
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsFullscreenPreview(true)}
                    className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-500 transition"
                    title="ดูแบบเต็มจอ"
                  >
                    <i className="fa-solid fa-expand"></i>
                  </button>
                </div>

                {/* Scrollable Preview Container */}
                <div className="flex-1 overflow-y-auto pr-2">
                {/* A4 Document Container - Page 1: Main Form */}
                <div className="flex justify-center mb-4">
                <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-full max-w-[595px]">
                  <div>
                    <div className="p-4 text-[9px] leading-relaxed font-sarabun">
                      {/* Form Header - Form number on right */}
                      <div className="flex justify-end items-start mb-1">
                        <span className="text-[8px]">HR-SD-S-F13-00-01 R01-TH</span>
                      </div>

                      {/* Title with Logo */}
                      <div className="flex items-center gap-2 mb-2">
                        <img 
                          src="https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png" 
                          alt="KMUTT Logo" 
                          className="w-10 h-10 object-contain"
                        />
                        <div className="flex-1 text-center">
                          <p className="font-bold text-[11px]">แบบขออนุมัติเข้าร่วมประชุม / อบรม / สัมมนา{formData.travelRegion === 'international' ? 'ต่างประเทศ' : 'ในประเทศ'}</p>
                          <p className="text-[10px]">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี</p>
                        </div>
                      </div>

                      {/* Date Row - Right aligned */}
                      <div className="flex justify-end mb-2 text-[9px]">
                        <div className="flex gap-1">
                          <span className="font-bold">วันที่</span>
                          <span className="border-b border-gray-400 min-w-[100px] text-center">{formatThaiDate(new Date().toISOString().split('T')[0])}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-1 text-[9px]">
                        <span className="font-bold">เรื่อง</span>
                        <span>ขออนุมัติเข้าร่วมประชุม / อบรม / สัมมนา{formData.travelRegion === 'international' ? 'ต่างประเทศ' : 'ในประเทศ'}</span>
                      </div>

                      <div className="flex gap-2 mb-3 text-[9px]">
                        <span className="font-bold">เรียน</span>
                        <span className="border-b border-gray-400 flex-1">ผู้อำนวยการ สรบ. ผ่าน ผอ.ศูนย์ RSC</span>
                      </div>

                      <Divider className="my-2" />

                      {/* Personal Info + Event Details - Single paragraph like PDF */}
                      <div className="mb-3 text-[9px] leading-relaxed">
                        {/* First line: ข้าพเจ้า + ตำแหน่ง - full width with indent */}
                        <div className="flex pl-8">
                          <span className="font-bold">ข้าพเจ้า</span>
                          <span className="border-b border-gray-400 flex-1 mx-1 text-center">{user?.name || '.....................'}</span>
                          <span className="font-bold">ตำแหน่ง</span>
                          <span className="border-b border-gray-400 flex-1 mx-1 text-center">{user?.position || 'นักวิจัย'}</span>
                        </div>
                        {/* Second line onwards: continuous text */}
                        <p className="text-justify mt-1">
                          <span className="font-bold">ภาควิชา/กอง/ส่วน/ศูนย์/งาน</span>
                          <span className="border-b border-gray-400 mx-1">RSC</span>
                          <span className="font-bold">คณะ/สำนัก</span>
                          <span className="border-b border-gray-400 mx-1">สรบ.</span>
                          มีความประสงค์จะเข้าร่วม
                          ประชุม / อบรม / สัมมนา เรื่อง{' '}
                          <span className="border-b border-gray-400">{formData.eventName || '.....................'}</span>
                          {formData.purpose && ` ${formData.purpose}`}
                          {' '}ระหว่างวันที่{' '}
                          <span className="border-b border-gray-400">
                            {formData.eventStartDate ? formatThaiDate(formData.eventStartDate) : '...............'}
                            {formData.eventEndDate && formData.eventEndDate !== formData.eventStartDate && `-${formatThaiDate(formData.eventEndDate)}`}
                          </span>
                          {' '}สถานที่จัดประชุม/อบรม/สัมมนา{' '}
                          <span className="border-b border-gray-400">
                            ณ {formData.eventLocation || '...............'}
                            {formData.eventProvince && ` จังหวัด${formData.eventProvince}`}
                            {formData.travelRegion === 'international' && formData.eventCountry && ` ประเทศ${formData.eventCountry}`}
                          </span>
                          {' '}จัดโดย{' '}
                          <span className="border-b border-gray-400">{formData.organizer || '.....................'}</span>
                          {' '}มีจำนวนผู้เดินทางทั้งหมด{' '}
                          <span className="border-b border-gray-400 px-1">{formData.attendees.length > 0 ? formData.attendees.length : 1}</span>
                          {' '}คน
                        </p>
                      </div>

                      {/* Expense Estimate */}
                      <div className="mb-3">
                        <p className="font-bold mb-1 text-[9px]">ประมาณการค่าใช้จ่ายประกอบด้วย</p>
                        <div className="space-y-0.5 text-[9px] pl-2">
                          <div className="flex">
                            <span className="w-6">1.</span>
                            <span className="w-40">ค่าลงทะเบียน</span>
                            <span>เป็นเงิน</span>
                            <span className="border-b border-gray-400 w-20 text-right mx-2">{calculations.registrationFee > 0 ? calculations.registrationFee.toLocaleString() : '-'}</span>
                            <span>บาท</span>
                          </div>
                          <div className="flex">
                            <span className="w-6">2.</span>
                            <span className="w-40">ค่าเบี้ยเลี้ยง</span>
                            <span>เป็นเงิน</span>
                            <span className="border-b border-gray-400 w-20 text-right mx-2">{calculations.perDiem > 0 ? calculations.perDiem.toLocaleString() : '-'}</span>
                            <span>บาท</span>
                          </div>
                          <div className="flex">
                            <span className="w-6">3.</span>
                            <span className="w-40">ค่าที่พัก</span>
                            <span>เป็นเงิน</span>
                            <span className="border-b border-gray-400 w-20 text-right mx-2">{calculations.accommodation > 0 ? calculations.accommodation.toLocaleString() : '-'}</span>
                            <span>บาท</span>
                          </div>
                          <div className="flex">
                            <span className="w-6">4.</span>
                            <span className="w-40">ค่าพาหนะเดินทาง</span>
                            <span>เป็นเงิน</span>
                            <span className="border-b border-gray-400 w-20 text-right mx-2">{calculations.travelFare > 0 ? calculations.travelFare.toLocaleString() : '-'}</span>
                            <span>บาท</span>
                          </div>
                          <div className="flex">
                            <span className="w-6">5.</span>
                            <span className="w-40">เงินชดเชยพาหนะส่วนตัว</span>
                            <span>เป็นเงิน</span>
                            <span className="border-b border-gray-400 w-20 text-right mx-2">{calculations.personalVehicleCompensation > 0 ? calculations.personalVehicleCompensation.toLocaleString() : '-'}</span>
                            <span>บาท</span>
                          </div>
                          <div className="flex">
                            <span className="w-6">6.</span>
                            <span className="w-40">ค่าธรรมเนียม/ค่าใช้จ่ายอื่นๆ</span>
                            <span>เป็นเงิน</span>
                            <span className="border-b border-gray-400 w-20 text-right mx-2">{calculations.otherExpenses > 0 ? calculations.otherExpenses.toLocaleString() : '-'}</span>
                            <span>บาท</span>
                          </div>
                          <div className="flex font-bold bg-yellow-50 p-1 rounded">
                            <span className="w-6"></span>
                            <span className="w-40">รวมค่าใช้จ่ายทั้งหมด</span>
                            <span>เป็นเงิน</span>
                            <span className="border-b border-gray-400 w-20 text-right mx-2">{calculations.grandTotal.toLocaleString()}</span>
                            <span>บาท</span>
                          </div>
                        </div>
                      </div>

                      {/* Request Section */}
                      <div className="mb-3 text-[9px]">
                        <p className="mb-1">ข้าพเจ้าเห็นว่าการประชุม/อบรม/สัมมนาดังกล่าว จะเป็นประโยชน์ต่อมหาวิทยาลัยฯ จึงเรียนมาเพื่อ</p>
                        <p className="mb-1 pl-4">1. ขออนุญาตให้เข้าร่วมประชุม/อบรม/สัมมนา ตามวันเวลาดังกล่าว และถือว่าเป็นการไปปฏิบัติงาน</p>
                        <p className="mb-1 pl-4">
                          2. ขออนุมัติค่าใช้จ่ายในการประชุม/อบรม/สัมมนาครั้งนี้ ตามการจ่ายจริง จากรหัสงบประมาณ{' '}
                          <span className="border-b border-gray-400 font-medium">{formData.documentSubject || '.....................'}</span>
                        </p>
                      </div>

                      {/* Requester Signature */}
                      <div className="flex justify-end mb-3">
                        <div className="text-center text-[9px]">
                          <p className="mb-4">ลงนาม .................................</p>
                          <p className="text-[8px] text-gray-500">(ผู้เข้าร่วมประชุม/อบรม/สัมมนา)</p>
                        </div>
                      </div>

                      {/* Note */}
                      <p className="text-[8px] text-gray-500 mb-2">
                        หมายเหตุ: กรณีมีผู้เข้าร่วมประชุม/อบรม/สัมมนา มากกว่า 1 คน โปรดแนบรายชื่อประกอบแบบขออนุมัตินี้
                      </p>

                      <Divider className="my-2" />

                      {/* Supervisor Comments Section - Table Format like PDF */}
                      <div className="text-[8px]">
                        <p className="font-bold mb-2">ความเห็นของผู้บังคับบัญชา</p>
                        
                        {/* Full Table with all columns */}
                        <div className="border border-gray-400">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-400 px-1 py-1 text-center w-24"></th>
                                <th className="border border-gray-400 px-1 py-1 text-center w-12">อนุมัติ</th>
                                <th className="border border-gray-400 px-1 py-1 text-center w-12">ไม่อนุมัติ</th>
                                <th className="border border-gray-400 px-1 py-1 text-center">ความเห็นเพิ่มเติม</th>
                                <th className="border border-gray-400 px-1 py-1 text-center w-24">ลงนาม</th>
                                <th className="border border-gray-400 px-1 py-1 text-center w-16">ตำแหน่ง</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-400 px-1 py-2 text-[7px]">ผู้บังคับบัญชา</td>
                                <td className="border border-gray-400 px-1 py-2 text-center">
                                  <span className="inline-block w-4 h-4 border border-gray-400"></span>
                                </td>
                                <td className="border border-gray-400 px-1 py-2 text-center">
                                  <span className="inline-block w-4 h-4 border border-gray-400"></span>
                                </td>
                                <td className="border border-gray-400 px-1 py-2"></td>
                                <td className="border border-gray-400 px-1 py-2 text-center">
                                  <p className="text-[7px]">(นายศุเรนทร์ ฐปนางกูร)</p>
                                </td>
                                <td className="border border-gray-400 px-1 py-2 text-center text-[7px]">ผอ.ศูนย์ คกล.</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-400 px-1 py-2 text-[7px]">ผู้บังคับบัญชา<br/>ระดับเหนือขึ้นไป</td>
                                <td className="border border-gray-400 px-1 py-2 text-center">
                                  <span className="inline-block w-4 h-4 border border-gray-400"></span>
                                </td>
                                <td className="border border-gray-400 px-1 py-2 text-center">
                                  <span className="inline-block w-4 h-4 border border-gray-400"></span>
                                </td>
                                <td className="border border-gray-400 px-1 py-2"></td>
                                <td className="border border-gray-400 px-1 py-2 text-center"></td>
                                <td className="border border-gray-400 px-1 py-2 text-center"></td>
                              </tr>
                              <tr>
                                <td className="border border-gray-400 px-1 py-2 text-[7px]">ผู้บังคับบัญชา<br/>ระดับสูงสุด</td>
                                <td className="border border-gray-400 px-1 py-2 text-center">
                                  <span className="inline-block w-4 h-4 border border-gray-400"></span>
                                </td>
                                <td className="border border-gray-400 px-1 py-2 text-center">
                                  <span className="inline-block w-4 h-4 border border-gray-400"></span>
                                </td>
                                <td className="border border-gray-400 px-1 py-2"></td>
                                <td className="border border-gray-400 px-1 py-2 text-center">
                                  <p className="text-[7px]">(ผศ.ดร.บุณยพัต สุภานิช)</p>
                                </td>
                                <td className="border border-gray-400 px-1 py-2 text-center text-[7px]">ผอ.สรบ.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <p className="text-center text-[8px] text-gray-400 mt-2">- หน้า 1/2 -</p>
                    </div>
                  </div>
                </div>
                </div>

                {/* A4 Document Container - Page 2: Attendees List */}
                {(formData.attendees.length > 1 || formData.attendees.length === 0) && (
                <div className="flex justify-center mt-4">
                <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-full max-w-[595px]">
                  <div>
                    <div className="p-4 text-[9px] leading-relaxed font-sarabun">
                      {/* Form Header */}
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[8px] text-gray-500">HR-SD-S-F13-00-01 R01-TH</span>
                      </div>

                      {/* Title */}
                      <p className="font-bold text-center text-[11px] mb-6">รายชื่อผู้ร่วมเดินทาง</p>

                      {/* Attendees List */}
                      <div className="space-y-4">
                        {formData.attendees.length > 0 ? (
                          formData.attendees.map((attendee, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex gap-2">
                                <span className="font-bold w-4">{index + 1}.</span>
                                <span className="font-bold">ชื่อ-นามสกุล</span>
                                <span className="border-b border-gray-400 flex-1">{attendee.name || '.....................'}</span>
                              </div>
                              <div className="flex gap-2 pl-5">
                                <span className="font-bold">ตำแหน่ง</span>
                                <span className="border-b border-gray-400 flex-1">{attendee.position || '.....................'}</span>
                              </div>
                              <div className="flex gap-2 pl-5">
                                <span className="font-bold">หน่วยงาน</span>
                                <span className="border-b border-gray-400 flex-1">{attendee.department || 'ศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ, สรบ.'}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="space-y-1">
                              <div className="flex gap-2">
                                <span className="font-bold w-4">1.</span>
                                <span className="font-bold">ชื่อ-นามสกุล</span>
                                <span className="border-b border-gray-400 flex-1">{user?.name || '.....................'}</span>
                              </div>
                              <div className="flex gap-2 pl-5">
                                <span className="font-bold">ตำแหน่ง</span>
                                <span className="border-b border-gray-400 flex-1">{user?.position || 'นักวิจัย'}</span>
                              </div>
                              <div className="flex gap-2 pl-5">
                                <span className="font-bold">หน่วยงาน</span>
                                <span className="border-b border-gray-400 flex-1">ศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ, สรบ.</span>
                              </div>
                            </div>
                            {[2, 3].map(num => (
                              <div key={num} className="space-y-1">
                                <div className="flex gap-2">
                                  <span className="font-bold w-4">{num}.</span>
                                  <span className="font-bold">ชื่อ-นามสกุล</span>
                                  <span className="border-b border-gray-400 flex-1">.......................</span>
                                </div>
                                <div className="flex gap-2 pl-5">
                                  <span className="font-bold">ตำแหน่ง</span>
                                  <span className="border-b border-gray-400 flex-1">.......................</span>
                                </div>
                                <div className="flex gap-2 pl-5">
                                  <span className="font-bold">หน่วยงาน</span>
                                  <span className="border-b border-gray-400 flex-1">.......................</span>
                                </div>
                              </div>
                            ))}
                          </>
                        )}
                      </div>

                      <p className="text-center text-[8px] text-gray-400 mt-6">- หน้า 2/2 -</p>
                    </div>
                  </div>
                </div>
                </div>
                )}
                </div>
                
                <p className="text-[10px] text-gray-400 mt-2 text-center shrink-0">
                  * ตัวอย่างจะอัพเดทตามข้อมูลที่กรอก
                </p>
              </Card>
            </div>
          </div>
        </div>
      </form>

      {/* Fullscreen Preview Modal */}
      {isFullscreenPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 shrink-0">
              <h3 className="text-lg font-bold text-slate-800">
                <i className="fa-solid fa-file-alt mr-2 text-primary-500"></i>
                ตัวอย่างเอกสาร - แบบขออนุมัติเข้าร่วมประชุม/สัมมนา
              </h3>
              <button
                type="button"
                onClick={() => setIsFullscreenPreview(false)}
                className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            
            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
              <div className="flex flex-col items-center gap-6">
                {/* Page 1 - Main Form */}
                <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-full max-w-[700px]">
                  <div className="p-6 text-[11px] leading-relaxed font-sarabun">
                    {/* Form Header - Form number on right */}
                    <div className="flex justify-end items-start mb-2">
                      <span className="text-[10px]">HR-SD-S-F13-00-01 R01-TH</span>
                    </div>

                    {/* Title with Logo */}
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src="https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png" 
                        alt="KMUTT Logo" 
                        className="w-14 h-14 object-contain"
                      />
                      <div className="flex-1 text-center">
                        <p className="font-bold text-[13px]">แบบขออนุมัติเข้าร่วมประชุม / อบรม / สัมมนา{formData.travelRegion === 'international' ? 'ต่างประเทศ' : 'ในประเทศ'}</p>
                        <p className="text-[12px]">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี</p>
                      </div>
                    </div>

                    {/* Date Row - Right aligned */}
                    <div className="flex justify-end mb-3">
                      <div className="flex gap-2">
                        <span className="font-bold">วันที่</span>
                        <span className="border-b border-gray-400 min-w-[120px] text-center">{formatThaiDate(new Date().toISOString().split('T')[0])}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-2">
                      <span className="font-bold">เรื่อง</span>
                      <span>ขออนุมัติเข้าร่วมประชุม / อบรม / สัมมนา{formData.travelRegion === 'international' ? 'ต่างประเทศ' : 'ในประเทศ'}</span>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <span className="font-bold">เรียน</span>
                      <span className="border-b border-gray-400 flex-1">ผู้อำนวยการ สรบ. ผ่าน ผอ.ศูนย์ RSC</span>
                    </div>

                    <Divider className="my-3" />

                    {/* Personal Info + Event Details - Single paragraph like PDF */}
                    <div className="mb-4 leading-relaxed">
                      {/* First line: ข้าพเจ้า + ตำแหน่ง - full width with indent */}
                      <div className="flex pl-8">
                        <span className="font-bold">ข้าพเจ้า</span>
                        <span className="border-b border-gray-400 flex-1 mx-2 text-center">{user?.name || '.....................'}</span>
                        <span className="font-bold">ตำแหน่ง</span>
                        <span className="border-b border-gray-400 flex-1 mx-2 text-center">{user?.position || 'นักวิจัย'}</span>
                      </div>
                      {/* Second line onwards: continuous text */}
                      <p className="text-justify mt-2">
                        <span className="font-bold">ภาควิชา/กอง/ส่วน/ศูนย์/งาน</span>
                        <span className="border-b border-gray-400 mx-2">RSC</span>
                        <span className="font-bold">คณะ/สำนัก</span>
                        <span className="border-b border-gray-400 mx-2">สรบ.</span>
                        มีความประสงค์จะเข้าร่วม
                        ประชุม / อบรม / สัมมนา เรื่อง{' '}
                        <span className="border-b border-gray-400">{formData.eventName || '.....................'}</span>
                        {formData.purpose && ` ${formData.purpose}`}
                        {' '}ระหว่างวันที่{' '}
                        <span className="border-b border-gray-400">
                          {formData.eventStartDate ? formatThaiDate(formData.eventStartDate) : '...............'}
                          {formData.eventEndDate && formData.eventEndDate !== formData.eventStartDate && `-${formatThaiDate(formData.eventEndDate)}`}
                        </span>
                        {' '}สถานที่จัดประชุม/อบรม/สัมมนา{' '}
                        <span className="border-b border-gray-400">
                          ณ {formData.eventLocation || '...............'}
                          {formData.eventProvince && ` จังหวัด${formData.eventProvince}`}
                          {formData.travelRegion === 'international' && formData.eventCountry && ` ประเทศ${formData.eventCountry}`}
                        </span>
                        {' '}จัดโดย{' '}
                        <span className="border-b border-gray-400">{formData.organizer || '.....................'}</span>
                        {' '}มีจำนวนผู้เดินทางทั้งหมด{' '}
                        <span className="border-b border-gray-400 px-2">{formData.attendees.length > 0 ? formData.attendees.length : 1}</span>
                        {' '}คน
                      </p>
                    </div>

                    {/* Expense Estimate */}
                    <div className="mb-4">
                      <p className="font-bold mb-2">ประมาณการค่าใช้จ่ายประกอบด้วย</p>
                      <div className="space-y-1 pl-2">
                        <div className="flex">
                          <span className="w-6">1.</span>
                          <span className="w-44">ค่าลงทะเบียน</span>
                          <span>เป็นเงิน</span>
                          <span className="border-b border-gray-400 w-24 text-right mx-2">{calculations.registrationFee > 0 ? calculations.registrationFee.toLocaleString() : '-'}</span>
                          <span>บาท</span>
                        </div>
                        <div className="flex">
                          <span className="w-6">2.</span>
                          <span className="w-44">ค่าเบี้ยเลี้ยง</span>
                          <span>เป็นเงิน</span>
                          <span className="border-b border-gray-400 w-24 text-right mx-2">{calculations.perDiem > 0 ? calculations.perDiem.toLocaleString() : '-'}</span>
                          <span>บาท</span>
                        </div>
                        <div className="flex">
                          <span className="w-6">3.</span>
                          <span className="w-44">ค่าที่พัก</span>
                          <span>เป็นเงิน</span>
                          <span className="border-b border-gray-400 w-24 text-right mx-2">{calculations.accommodation > 0 ? calculations.accommodation.toLocaleString() : '-'}</span>
                          <span>บาท</span>
                        </div>
                        <div className="flex">
                          <span className="w-6">4.</span>
                          <span className="w-44">ค่าพาหนะเดินทาง</span>
                          <span>เป็นเงิน</span>
                          <span className="border-b border-gray-400 w-24 text-right mx-2">{calculations.travelFare > 0 ? calculations.travelFare.toLocaleString() : '-'}</span>
                          <span>บาท</span>
                        </div>
                        <div className="flex">
                          <span className="w-6">5.</span>
                          <span className="w-44">เงินชดเชยพาหนะส่วนตัว</span>
                          <span>เป็นเงิน</span>
                          <span className="border-b border-gray-400 w-24 text-right mx-2">{calculations.personalVehicleCompensation > 0 ? calculations.personalVehicleCompensation.toLocaleString() : '-'}</span>
                          <span>บาท</span>
                        </div>
                        <div className="flex">
                          <span className="w-6">6.</span>
                          <span className="w-44">ค่าธรรมเนียม/ค่าใช้จ่ายอื่นๆ</span>
                          <span>เป็นเงิน</span>
                          <span className="border-b border-gray-400 w-24 text-right mx-2">{calculations.otherExpenses > 0 ? calculations.otherExpenses.toLocaleString() : '-'}</span>
                          <span>บาท</span>
                        </div>
                        <div className="flex font-bold bg-yellow-50 p-1 rounded">
                          <span className="w-6"></span>
                          <span className="w-44">รวมค่าใช้จ่ายทั้งหมด</span>
                          <span>เป็นเงิน</span>
                          <span className="border-b border-gray-400 w-24 text-right mx-2">{calculations.grandTotal.toLocaleString()}</span>
                          <span>บาท</span>
                        </div>
                      </div>
                    </div>

                    {/* Request Section */}
                    <div className="mb-4">
                      <p className="mb-2">ข้าพเจ้าเห็นว่าการประชุม/อบรม/สัมมนาดังกล่าว จะเป็นประโยชน์ต่อมหาวิทยาลัยฯ จึงเรียนมาเพื่อ</p>
                      <p className="mb-1 pl-4">1. ขออนุญาตให้เข้าร่วมประชุม/อบรม/สัมมนา ตามวันเวลาดังกล่าว และถือว่าเป็นการไปปฏิบัติงาน</p>
                      <p className="mb-1 pl-4">
                        2. ขออนุมัติค่าใช้จ่ายในการประชุม/อบรม/สัมมนาครั้งนี้ ตามการจ่ายจริง จากรหัสงบประมาณ{' '}
                        <span className="border-b border-gray-400 font-medium">{formData.documentSubject || '.....................'}</span>
                      </p>
                    </div>

                    {/* Requester Signature */}
                    <div className="flex justify-end mb-4">
                      <div className="text-center">
                        <p className="mb-4">ลงนาม .................................</p>
                        <p className="text-[10px] text-gray-500">(ผู้เข้าร่วมประชุม/อบรม/สัมมนา)</p>
                      </div>
                    </div>

                    {/* Note */}
                    <p className="text-[10px] text-gray-500 mb-3">
                      หมายเหตุ: กรณีมีผู้เข้าร่วมประชุม/อบรม/สัมมนา มากกว่า 1 คน โปรดแนบรายชื่อประกอบแบบขออนุมัตินี้
                    </p>

                    <Divider className="my-3" />

                    {/* Supervisor Comments Section - Table Format like PDF */}
                    <div className="text-[10px]">
                      <p className="font-bold mb-2">ความเห็นของผู้บังคับบัญชา</p>
                      
                      {/* Full Table with all columns */}
                      <div className="border border-gray-400">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-400 px-2 py-1 text-center w-24"></th>
                              <th className="border border-gray-400 px-2 py-1 text-center w-14">อนุมัติ</th>
                              <th className="border border-gray-400 px-2 py-1 text-center w-14">ไม่อนุมัติ</th>
                              <th className="border border-gray-400 px-2 py-1 text-center">ความเห็นเพิ่มเติม</th>
                              <th className="border border-gray-400 px-2 py-1 text-center w-28">ลงนาม</th>
                              <th className="border border-gray-400 px-2 py-1 text-center w-20">ตำแหน่ง</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-400 px-2 py-2 text-[9px]">ผู้บังคับบัญชา</td>
                              <td className="border border-gray-400 px-2 py-2 text-center">
                                <span className="inline-block w-4 h-4 border border-gray-400"></span>
                              </td>
                              <td className="border border-gray-400 px-2 py-2 text-center">
                                <span className="inline-block w-4 h-4 border border-gray-400"></span>
                              </td>
                              <td className="border border-gray-400 px-2 py-2"></td>
                              <td className="border border-gray-400 px-2 py-2 text-center">
                                <p className="text-[9px]">(นายศุเรนทร์ ฐปนางกูร)</p>
                              </td>
                              <td className="border border-gray-400 px-2 py-2 text-center text-[9px]">ผอ.ศูนย์ คกล.</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-400 px-2 py-2 text-[9px]">ผู้บังคับบัญชา<br/>ระดับเหนือขึ้นไป</td>
                              <td className="border border-gray-400 px-2 py-2 text-center">
                                <span className="inline-block w-4 h-4 border border-gray-400"></span>
                              </td>
                              <td className="border border-gray-400 px-2 py-2 text-center">
                                <span className="inline-block w-4 h-4 border border-gray-400"></span>
                              </td>
                              <td className="border border-gray-400 px-2 py-2"></td>
                              <td className="border border-gray-400 px-2 py-2 text-center"></td>
                              <td className="border border-gray-400 px-2 py-2 text-center"></td>
                            </tr>
                            <tr>
                              <td className="border border-gray-400 px-2 py-2 text-[9px]">ผู้บังคับบัญชา<br/>ระดับสูงสุด</td>
                              <td className="border border-gray-400 px-2 py-2 text-center">
                                <span className="inline-block w-4 h-4 border border-gray-400"></span>
                              </td>
                              <td className="border border-gray-400 px-2 py-2 text-center">
                                <span className="inline-block w-4 h-4 border border-gray-400"></span>
                              </td>
                              <td className="border border-gray-400 px-2 py-2"></td>
                              <td className="border border-gray-400 px-2 py-2 text-center">
                                <p className="text-[9px]">(ผศ.ดร.บุณยพัต สุภานิช)</p>
                              </td>
                              <td className="border border-gray-400 px-2 py-2 text-center text-[9px]">ผอ.สรบ.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <p className="text-center text-[10px] text-gray-400 mt-3">- หน้า 1/2 -</p>
                  </div>
                </div>

                {/* Page 2 - Attendees List */}
                {(formData.attendees.length > 1 || formData.attendees.length === 0) && (
                <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-full max-w-[700px]">
                  <div className="p-6 text-[11px] leading-relaxed font-sarabun">
                    {/* Form Header */}
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[10px] text-gray-500">HR-SD-S-F13-00-01 R01-TH</span>
                    </div>

                    {/* Title */}
                    <p className="font-bold text-center text-[13px] mb-6">รายชื่อผู้ร่วมเดินทาง</p>

                    {/* Attendees List */}
                    <div className="space-y-4">
                      {formData.attendees.length > 0 ? (
                        formData.attendees.map((attendee, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex gap-2">
                              <span className="font-bold w-6">{index + 1}.</span>
                              <span className="font-bold">ชื่อ-นามสกุล</span>
                              <span className="border-b border-gray-400 flex-1">{attendee.name || '.....................'}</span>
                            </div>
                            <div className="flex gap-2 pl-6">
                              <span className="font-bold">ตำแหน่ง</span>
                              <span className="border-b border-gray-400 flex-1">{attendee.position || '.....................'}</span>
                            </div>
                            <div className="flex gap-2 pl-6">
                              <span className="font-bold">หน่วยงาน</span>
                              <span className="border-b border-gray-400 flex-1">{attendee.department || 'ศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ, สรบ.'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="space-y-1">
                            <div className="flex gap-2">
                              <span className="font-bold w-6">1.</span>
                              <span className="font-bold">ชื่อ-นามสกุล</span>
                              <span className="border-b border-gray-400 flex-1">{user?.name || '.....................'}</span>
                            </div>
                            <div className="flex gap-2 pl-6">
                              <span className="font-bold">ตำแหน่ง</span>
                              <span className="border-b border-gray-400 flex-1">{user?.position || 'นักวิจัย'}</span>
                            </div>
                            <div className="flex gap-2 pl-6">
                              <span className="font-bold">หน่วยงาน</span>
                              <span className="border-b border-gray-400 flex-1">ศูนย์ส่งเสริมและสนับสนุนมูลนิธิโครงการหลวงและโครงการตามพระราชดำริ, สรบ.</span>
                            </div>
                          </div>
                          {[2, 3].map(num => (
                            <div key={num} className="space-y-1">
                              <div className="flex gap-2">
                                <span className="font-bold w-6">{num}.</span>
                                <span className="font-bold">ชื่อ-นามสกุล</span>
                                <span className="border-b border-gray-400 flex-1">.......................</span>
                              </div>
                              <div className="flex gap-2 pl-6">
                                <span className="font-bold">ตำแหน่ง</span>
                                <span className="border-b border-gray-400 flex-1">.......................</span>
                              </div>
                              <div className="flex gap-2 pl-6">
                                <span className="font-bold">หน่วยงาน</span>
                                <span className="border-b border-gray-400 flex-1">.......................</span>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>

                    <p className="text-center text-[10px] text-gray-400 mt-6">- หน้า 2/2 -</p>
                  </div>
                </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 shrink-0">
              <Button variant="outline" onClick={() => setIsFullscreenPreview(false)}>
                <i className="fa-solid fa-times mr-2"></i>
                ปิด
              </Button>
              <Button variant="primary" onClick={() => window.print()}>
                <i className="fa-solid fa-print mr-2"></i>
                พิมพ์
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
