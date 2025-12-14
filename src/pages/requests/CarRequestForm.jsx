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
} from '../../components'

/**
 * CarRequestForm
 * แบบขออนุมัติใช้รถยนต์ส่วนตัวเดินทางไปราชการ
 * 
 * Supports both standalone and embedded modes:
 * - Standalone: Full page with navigation
 * - Embedded: Used within RequestWorkflowPage
 */

// อัตราค่าชดเชยน้ำมัน (บาท/กม.)
const FUEL_RATE = 4 // บาทต่อกิโลเมตร

// ประเภทรถ
const carTypes = [
  { value: 'sedan', label: 'รถยนต์นั่งส่วนบุคคล (เก๋ง)' },
  { value: 'pickup', label: 'รถยนต์บรรทุกส่วนบุคคล (กระบะ)' },
  { value: 'suv', label: 'รถยนต์ SUV / PPV' },
  { value: 'van', label: 'รถตู้' },
]

// เหตุผลการใช้รถส่วนตัว
const reasonOptions = [
  { value: 'no_public', label: 'ไม่มีรถยนต์ประจำทาง หรือมีแต่ต้องเสียเวลารอคอยมาก' },
  { value: 'no_university_car', label: 'ไม่มีรถยนต์ของมหาวิทยาลัย หรือมีแต่ไม่เพียงพอ' },
  { value: 'convenience', label: 'เพื่อความสะดวกและประหยัดเวลาในการเดินทาง' },
  { value: 'equipment', label: 'ต้องบรรทุกวัสดุ/อุปกรณ์จำนวนมาก' },
  { value: 'other', label: 'อื่นๆ (ระบุ)' },
]

// Initial form data factory
const getInitialFormData = (user) => ({
  // ข้อมูลผู้ขอ
  requesterName: user?.name || '',
  position: '',
  department: 'ศูนย์ RSC',
  
  // ข้อมูลการเดินทาง
  tripPurpose: '',
  destination: '',
  origin: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี',
  province: '',
  departureDate: '',
  departureTime: '',
  returnDate: '',
  returnTime: '',
  
  // ผู้ร่วมเดินทาง
  passengers: '',
  passengerCount: '',
  
  // ข้อมูลรถยนต์
  carType: 'sedan',
  carBrand: '',
  carModel: '',
  licensePlate: '',
  engineSize: '',
  
  // ระยะทาง
  distanceKm: '',
  distance: 0,
  
  // เหตุผล
  reason: 'no_university_car',
  reasonOther: '',
  
  // โครงการ
  projectName: '',
  budgetSource: '',
  
  // ค่าชดเชย
  fuelCompensation: 0,
  
  // เอกสารแนบ
  attachments: [],
})

export default function CarRequestForm({ 
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
      return { ...getInitialFormData(user), ...initialData }
    }
    return getInitialFormData(user)
  })

  // Update form data when initialData changes (for workflow mode)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  // Calculate fuel compensation
  const fuelCompensation = useMemo(() => {
    const distance = parseFloat(formData.distanceKm) || 0
    return distance * FUEL_RATE
  }, [formData.distanceKm])

  // Format Thai date
  const formatThaiDate = (dateStr) => {
    if (!dateStr) return '......./......./.......'
    const date = new Date(dateStr)
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 
                        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
    const day = date.getDate()
    const month = thaiMonths[date.getMonth()]
    const year = date.getFullYear() + 543
    return `${day} ${month} ${year}`
  }

  const formatThaiDateFull = (dateStr) => {
    if (!dateStr) return '.............................'
    const date = new Date(dateStr)
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
                        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']
    const day = date.getDate()
    const month = thaiMonths[date.getMonth()]
    const year = date.getFullYear() + 543
    return `${day} ${month} ${year}`
  }

  // Convert number to Thai text
  const numberToThaiText = (num) => {
    if (!num || num === 0) return 'ศูนย์บาทถ้วน'
    
    const ones = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
    const teens = ['สิบ', 'สิบเอ็ด', 'สิบสอง', 'สิบสาม', 'สิบสี่', 'สิบห้า', 'สิบหก', 'สิบเจ็ด', 'สิบแปด', 'สิบเก้า']
    const tens = ['', 'สิบ', 'ยี่สิบ', 'สามสิบ', 'สี่สิบ', 'ห้าสิบ', 'หกสิบ', 'เจ็ดสิบ', 'แปดสิบ', 'เก้าสิบ']
    
    const n = Math.floor(num)
    if (n < 10) return ones[n] + 'บาทถ้วน'
    if (n < 20) return teens[n - 10] + 'บาทถ้วน'
    if (n < 100) {
      const ten = Math.floor(n / 10)
      const one = n % 10
      return tens[ten] + (one === 1 ? 'เอ็ด' : ones[one]) + 'บาทถ้วน'
    }
    if (n < 1000) {
      const hundred = Math.floor(n / 100)
      const remainder = n % 100
      let result = ones[hundred] + 'ร้อย'
      if (remainder > 0) {
        if (remainder < 10) result += ones[remainder]
        else if (remainder < 20) result += teens[remainder - 10]
        else {
          const ten = Math.floor(remainder / 10)
          const one = remainder % 10
          result += tens[ten] + (one === 1 ? 'เอ็ด' : ones[one])
        }
      }
      return result + 'บาทถ้วน'
    }
    if (n < 10000) {
      const thousand = Math.floor(n / 1000)
      const remainder = n % 1000
      let result = ones[thousand] + 'พัน'
      if (remainder >= 100) {
        const hundred = Math.floor(remainder / 100)
        result += ones[hundred] + 'ร้อย'
      }
      const lastTwo = remainder % 100
      if (lastTwo > 0) {
        if (lastTwo < 10) result += ones[lastTwo]
        else if (lastTwo < 20) result += teens[lastTwo - 10]
        else {
          const ten = Math.floor(lastTwo / 10)
          const one = lastTwo % 10
          result += tens[ten] + (one === 1 ? 'เอ็ด' : ones[one])
        }
      }
      return result + 'บาทถ้วน'
    }
    // For larger numbers, return formatted
    return num.toLocaleString() + ' บาท'
  }

  // Handle field change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle submit
  const handleSubmit = () => {
    if (!formData.destination || !formData.departureDate || !formData.licensePlate) {
      alert('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน')
      return
    }
    
    // Prepare data for bundle preview
    const submitData = {
      ...formData,
      distance: parseFloat(formData.distanceKm) || 0,
      fuelCompensation: fuelCompensation,
    }
    
    // If in embedded/workflow mode, call onComplete with form data
    if (isEmbedded && onComplete) {
      onComplete(submitData)
      return
    }
    
    // Standalone mode - regular submit
    console.log('Submit:', submitData)
    alert('ส่งคำขอใช้รถยนต์ส่วนตัวเรียบร้อยแล้ว!')
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
              <i className="fa-solid fa-car mr-2 text-purple-500"></i>
              ขออนุมัติใช้รถยนต์ส่วนตัว
            </h1>
            <p className="text-sm text-slate-500">แบบขออนุมัติใช้รถยนต์ส่วนตัวเดินทางไปราชการ</p>
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          
          {/* Section 1: ข้อมูลผู้ขอ */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">1</span>
              ข้อมูลผู้ขอ
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ชื่อ-นามสกุล"
                  value={formData.requesterName}
                  onChange={(e) => handleChange('requesterName', e.target.value)}
                  placeholder="ชื่อ-นามสกุล ผู้ขอ"
                  required
                />
                <Input
                  label="ตำแหน่ง"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="ตำแหน่ง"
                />
              </div>
              <Input
                label="สังกัด/หน่วยงาน"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                placeholder="ชื่อหน่วยงาน"
              />
            </div>
          </Card>

          {/* Section 2: รายละเอียดการเดินทาง */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">2</span>
              รายละเอียดการเดินทาง
            </h2>
            
            <div className="space-y-4">
              <Textarea
                label="วัตถุประสงค์/เรื่องที่ไปราชการ"
                value={formData.tripPurpose}
                onChange={(e) => handleChange('tripPurpose', e.target.value)}
                placeholder="ระบุวัตถุประสงค์ในการเดินทาง เช่น ไปประชุม, ลงพื้นที่, อบรม..."
                rows={2}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="สถานที่ปลายทาง"
                  icon="fa-solid fa-location-dot"
                  value={formData.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  placeholder="ชื่อสถานที่"
                  required
                />
                <Input
                  label="จังหวัด"
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                  placeholder="จังหวัด"
                />
              </div>

              <Divider text="กำหนดการเดินทาง" className="my-4" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Input
                  label="วันที่ออกเดินทาง"
                  type="date"
                  value={formData.departureDate}
                  onChange={(e) => handleChange('departureDate', e.target.value)}
                  required
                />
                <Input
                  label="เวลา"
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) => handleChange('departureTime', e.target.value)}
                />
                <Input
                  label="วันที่กลับ"
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => handleChange('returnDate', e.target.value)}
                />
                <Input
                  label="เวลา"
                  type="time"
                  value={formData.returnTime}
                  onChange={(e) => handleChange('returnTime', e.target.value)}
                />
              </div>

              <Divider text="ผู้ร่วมเดินทาง" className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="จำนวนผู้ร่วมเดินทาง (คน)"
                  type="number"
                  value={formData.passengerCount}
                  onChange={(e) => handleChange('passengerCount', e.target.value)}
                  placeholder="0"
                />
                <div className="md:col-span-2">
                  <Textarea
                    label="รายชื่อผู้ร่วมเดินทาง"
                    value={formData.passengers}
                    onChange={(e) => handleChange('passengers', e.target.value)}
                    placeholder="ระบุรายชื่อผู้ร่วมเดินทาง (ถ้ามี)"
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section 3: ข้อมูลรถยนต์ */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">3</span>
              ข้อมูลรถยนต์
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="ประเภทรถ"
                  options={carTypes}
                  value={formData.carType}
                  onChange={(e) => handleChange('carType', e.target.value)}
                />
                <Input
                  label="ยี่ห้อ"
                  value={formData.carBrand}
                  onChange={(e) => handleChange('carBrand', e.target.value)}
                  placeholder="เช่น Toyota, Honda, Isuzu"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="รุ่น"
                  value={formData.carModel}
                  onChange={(e) => handleChange('carModel', e.target.value)}
                  placeholder="เช่น Vios, City, D-Max"
                />
                <Input
                  label="หมายเลขทะเบียน"
                  value={formData.licensePlate}
                  onChange={(e) => handleChange('licensePlate', e.target.value)}
                  placeholder="เช่น กข 1234 กรุงเทพ"
                  required
                />
                <Input
                  label="ขนาดเครื่องยนต์ (ซีซี)"
                  type="number"
                  value={formData.engineSize}
                  onChange={(e) => handleChange('engineSize', e.target.value)}
                  placeholder="เช่น 1500, 2000"
                />
              </div>
            </div>
          </Card>

          {/* Section 4: ระยะทางและค่าชดเชย */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">4</span>
              ระยะทางและค่าชดเชยน้ำมัน
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ระยะทางไป-กลับ (กิโลเมตร)"
                  type="number"
                  icon="fa-solid fa-road"
                  value={formData.distanceKm}
                  onChange={(e) => handleChange('distanceKm', e.target.value)}
                  placeholder="0"
                  required
                />
                <div className="flex items-end">
                  <div className="flex-1 bg-purple-50 border border-purple-200 rounded-xl p-4">
                    <p className="text-xs text-purple-600 mb-1">ค่าชดเชยน้ำมันเชื้อเพลิง (อัตรา {FUEL_RATE} บาท/กม.)</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {fuelCompensation.toLocaleString()} <span className="text-sm font-normal">บาท</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600">
                <p className="font-medium mb-2">
                  <i className="fa-solid fa-calculator mr-2 text-slate-400"></i>
                  การคำนวณ:
                </p>
                <p>ระยะทาง {formData.distanceKm || 0} กม. × {FUEL_RATE} บาท = <strong className="text-purple-600">{fuelCompensation.toLocaleString()} บาท</strong></p>
              </div>
            </div>
          </Card>

          {/* Section 5: เหตุผลความจำเป็น */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">5</span>
              เหตุผลความจำเป็น
            </h2>
            
            <div className="space-y-3">
              {reasonOptions.map((option) => (
                <label 
                  key={option.value}
                  className={`
                    flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition
                    ${formData.reason === option.value 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-slate-100 hover:border-purple-200 hover:bg-slate-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={option.value}
                    checked={formData.reason === option.value}
                    onChange={(e) => handleChange('reason', e.target.value)}
                    className="w-4 h-4 text-purple-500 mt-0.5"
                  />
                  <span className="text-sm text-slate-700">{option.label}</span>
                </label>
              ))}
              
              {formData.reason === 'other' && (
                <div className="pl-7">
                  <Input
                    placeholder="ระบุเหตุผลอื่นๆ..."
                    value={formData.reasonOther}
                    onChange={(e) => handleChange('reasonOther', e.target.value)}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Section 6: โครงการและแหล่งงบประมาณ */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">6</span>
              โครงการและแหล่งงบประมาณ
            </h2>
            
            <div className="space-y-4">
              <Input
                label="ชื่อโครงการ (ถ้ามี)"
                value={formData.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
                placeholder="ระบุชื่อโครงการที่เกี่ยวข้อง"
              />
              <Input
                label="แหล่งงบประมาณ"
                value={formData.budgetSource}
                onChange={(e) => handleChange('budgetSource', e.target.value)}
                placeholder="เช่น งบโครงการหลวง, งบมหาวิทยาลัย"
              />
            </div>
          </Card>

          {/* Section 7: เอกสารแนบ */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-sm">7</span>
              เอกสารแนบ
            </h2>
            
            <FileUpload
              files={formData.attachments}
              onChange={(files) => handleChange('attachments', files)}
              hint="แนบสำเนาทะเบียนรถ, แผนที่เส้นทาง, หนังสือเชิญประชุม หรือเอกสารอื่นๆ"
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
        <div>
          <div className="sticky top-4">
            <Card className="bg-slate-100 border-none p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <i className="fa-solid fa-eye mr-2"></i>
                  ตัวอย่างเอกสาร
                </h3>
                <Button variant="ghost" size="sm">
                  <i className="fa-solid fa-expand"></i>
                </Button>
              </div>
              
              {/* A4 Document Container */}
              <div className="flex justify-center">
              {/* Document Preview - A4 Size */}
              <div className="bg-white rounded-lg shadow-lg border border-slate-300 overflow-hidden w-full max-w-[595px]" style={{ aspectRatio: '210/297' }}>
                {/* Document Content */}
                <div className="h-full overflow-y-auto">
                  <div className="p-5 text-[11px] leading-relaxed font-sarabun">
                    
                    {/* Document Header with Logo */}
                    <div className="flex items-start justify-between mb-2">
                      {/* KMUTT Logo */}
                      <img 
                        src="https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png" 
                        alt="KMUTT Logo"
                        className="w-16 h-auto object-contain"
                      />
                      {/* Title */}
                      <div className="flex-1 text-center pt-2">
                        <h1 className="text-base font-bold">บันทึกข้อความ</h1>
                      </div>
                      {/* Spacer for balance */}
                      <div className="w-16"></div>
                    </div>

                    {/* Document Metadata */}
                    <div className="space-y-0.5 mt-4">
                      <div className="flex">
                        <span className="font-bold w-20">ส่วนงาน</span>
                        <span>ศูนย์ส่งเสริมและสนับสนุนโครงการหลวงและโครงการในพระราชดำริ โทร. 9682</span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-20">ที่</span>
                        <span>อว.xxxx.x.x/xxx/xx</span>
                        <span className="ml-auto">
                          <span className="font-bold">วันที่</span> {formatThaiDate(new Date().toISOString().split('T')[0])}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="font-bold w-20">เรื่อง</span>
                        <span>ขออนุมัติใช้รถยนต์ส่วนตัวและขออนุมัติค่าชดเชยพาหนะเดินทางในการเข้าร่วม{formData.tripPurpose || 'ประชุม/กิจกรรม'}</span>
                      </div>
                    </div>

                    {/* Horizontal Line */}
                    <div className="border-b-2 border-slate-400 my-3"></div>

                    {/* To */}
                    <div className="mb-4">
                      <span className="font-bold">เรียน</span>
                      <span className="ml-2">ผู้อำนวยการ สรบ. ผ่าน ผู้อำนวยการโครงการศูนย์ RSC</span>
                    </div>
                    
                    {/* Body Content */}
                    <div className="space-y-3 text-slate-800">
                      {/* Opening Paragraph - ข้าพเจ้า */}
                      <p className="text-justify" style={{ textIndent: '2.5em' }}>
                        ข้าพเจ้า{formData.requesterName || 'นางสาว/นาย...........................'} 
                        {' '}{formData.position || 'ผู้ช่วยนักวิจัย'} 
                        {' '}โครงการวิจัยเรื่อง "{formData.projectName || '......................................'}" 
                        {formData.department && <> สังกัด{formData.department}</>}
                        {' '}โดยมี{formData.passengers ? formData.passengers.split(',')[0] : '...........................'} เป็นหัวหน้าโครงการ
                      </p>
                      
                      {/* Research/Project details */}
                      <p className="text-justify" style={{ textIndent: '2.5em' }}>
                        ทั้งนี้นักวิจัยมีความจำเป็นต้องเดินทางไปเข้าร่วม{formData.tripPurpose || 'นำเสนอผลงานทางวิชาการ'} 
                        {' '}ใน "{formData.destination || 'การประชุมวิชาการ...'}" 
                        {formData.province && <> จังหวัด{formData.province}</>}
                        {' '}ระหว่างวันที่ {formatThaiDate(formData.departureDate)} 
                        {formData.returnDate && formData.returnDate !== formData.departureDate && (
                          <> - {formatThaiDate(formData.returnDate)}</>
                        )}
                        {' '}จึงขออนุมัติการเดินทางโดยรถยนต์ส่วนตัว 
                        และขออนุมัติค่าชดเชยพาหนะ เป็นระยะทางรวม ไม่เกิน <span className="font-semibold">{formData.distanceKm || '...'}</span> กิโลเมตร 
                        {' '}ประมาณการค่าใช้จ่ายเป็นเงินจำนวน <span className="font-semibold">{fuelCompensation.toLocaleString()}</span> บาท 
                        {' '}({numberToThaiText(fuelCompensation)}) โดยมีรายละเอียดดังนี้
                      </p>

                      {/* Table of travelers */}
                      <table className="w-full border-collapse border border-slate-400 text-[10px] my-3">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-slate-400 px-2 py-1 text-center w-16">ลำดับที่</th>
                            <th className="border border-slate-400 px-2 py-1 text-center">ชื่อ-สกุล</th>
                            <th className="border border-slate-400 px-2 py-1 text-center">ตำแหน่ง</th>
                            <th className="border border-slate-400 px-2 py-1 text-center w-28">ทะเบียนรถ</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-slate-400 px-2 py-1 text-center">1</td>
                            <td className="border border-slate-400 px-2 py-1">{formData.requesterName || '...........................'}</td>
                            <td className="border border-slate-400 px-2 py-1">{formData.position || 'หัวหน้าโครงการ'}</td>
                            <td className="border border-slate-400 px-2 py-1 text-center">{formData.licensePlate || '... .... ....'}</td>
                          </tr>
                          {formData.passengers && formData.passengers.split(',').slice(0, 3).map((passenger, idx) => (
                            <tr key={idx}>
                              <td className="border border-slate-400 px-2 py-1 text-center">{idx + 2}</td>
                              <td className="border border-slate-400 px-2 py-1">{passenger.trim()}</td>
                              <td className="border border-slate-400 px-2 py-1">ผู้ร่วมเดินทาง</td>
                              <td className="border border-slate-400 px-2 py-1 text-center">-</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Closing request */}
                      <p className="text-justify" style={{ textIndent: '2.5em' }}>
                        จึงเรียนมาเพื่อโปรดพิจารณาขออนุมัติการเดินทางโดยรถยนต์ส่วนตัว 
                        และขออนุมัติค่าชดเชยพาหนะเดินทางในการเข้าร่วมกิจกรรม ดังกล่าวจากงบประมาณ 
                        {formData.budgetSource || ' RD-xx_ชื่อแหล่งงบประมาณ'}
                      </p>
                      
                      {/* Final Closing */}
                      <p className="text-justify" style={{ textIndent: '2.5em' }}>
                        จึงเรียนมาเพื่อโปรดพิจารณาอนุมัติ
                      </p>
                    </div>
                    
                    {/* Requester Signature - Right aligned box, center text */}
                    <div className="mt-8 flex justify-end">
                      <div className="text-center">
                        <p className="mb-1">(ลงชื่อ) ............................................</p>
                        <p className="mb-1">( {formData.requesterName || '..........................................'} )</p>
                        <p className="text-slate-600">{formData.position || 'ตำแหน่งในองค์กร'}</p>
                        <p className="text-slate-500 text-[10px]">ผู้ขออนุมัติ (ผู้ประสานงาน / หัวหน้าโครงการ)</p>
                      </div>
                    </div>
                    
                    {/* RSC Director Opinion Section */}
                    <div className="mt-8 pt-4 border-t border-slate-300">
                      {/* Two signature columns with headers */}
                      <div className="flex justify-between">
                        {/* Left - RSC Director */}
                        <div className="text-center flex-1">
                          <p className="text-left mb-4">เรียน ผอ.สรบ เพื่อโปรดพิจารณาอนุมัติ</p>
                          <p className="mb-1">ลงชื่อ............................................</p>
                          <p className="mb-1">(นายศุเรนทร์ ฐปนางกูร)</p>
                          <p className="text-slate-600 text-[11px]">ผู้อำนวยการศูนย์ส่งเสริมและสนับสนุน</p>
                          <p className="text-slate-600 text-[11px]">มูลนิธิโครงการหลวงและโครงการตามพระราชดำริ</p>
                        </div>
                        
                        {/* Right - Institute Director Approval */}
                        <div className="text-center flex-1">
                          <p className="font-semibold mb-4">อนุมัติ</p>
                          <p className="mb-1">ลงชื่อ............................................</p>
                          <p className="mb-1">( ชื่อ นามสกุล )</p>
                          <p className="text-slate-600 text-[11px]">ผู้อำนวยการ</p>
                          <p className="text-slate-600 text-[11px]">สถาบันพัฒนาและฝึกอบรมโรงงานต้นแบบ</p>
                        </div>
                      </div>
                    </div>

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
