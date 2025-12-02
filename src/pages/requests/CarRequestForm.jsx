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
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Form Section */}
        <div className="xl:col-span-3 space-y-6">
          
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
        <div className="xl:col-span-2">
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
                <div className="bg-purple-500 text-white px-4 py-2 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-car"></i>
                    <span className="font-medium">แบบขออนุมัติใช้รถยนต์ส่วนตัว</span>
                  </div>
                </div>
                
                {/* Document Content */}
                <div className="p-4 text-[10px] leading-relaxed space-y-3 max-h-[700px] overflow-y-auto">
                  {/* Header */}
                  <div className="text-center border-b border-slate-200 pb-3">
                    <p className="font-bold text-sm">แบบขออนุมัติใช้รถยนต์ส่วนตัวเดินทางไปราชการ</p>
                    <p className="text-slate-500 text-[9px]">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี</p>
                  </div>

                  {/* Date */}
                  <div className="text-right text-[9px]">
                    <p>วันที่ {formatThaiDateFull(new Date().toISOString().split('T')[0])}</p>
                  </div>

                  {/* To */}
                  <div>
                    <p><strong>เรียน</strong> ผู้อำนวยการศูนย์ RSC</p>
                  </div>

                  {/* Requester Info */}
                  <div className="bg-purple-50 p-2 rounded border border-purple-200 space-y-1">
                    <p>
                      <strong>ข้าพเจ้า</strong> {formData.requesterName || '....................................'}
                      <strong className="ml-2">ตำแหน่ง</strong> {formData.position || '......................'}
                    </p>
                    <p>
                      <strong>สังกัด</strong> {formData.department || '....................................'}
                    </p>
                  </div>

                  {/* Purpose */}
                  <div className="space-y-1">
                    <p>
                      <strong>มีความประสงค์ขออนุมัติใช้รถยนต์ส่วนตัว</strong> เพื่อเดินทางไปราชการ
                    </p>
                    <p>
                      <strong>เรื่อง</strong> {formData.tripPurpose || '....................................'}
                    </p>
                    <p>
                      <strong>ณ</strong> {formData.destination || '......................'} 
                      {formData.province && <span> จังหวัด{formData.province}</span>}
                    </p>
                  </div>

                  {/* Schedule */}
                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-[9px]">
                      <tbody>
                        <tr className="border-b border-slate-200">
                          <td className="px-2 py-1 bg-slate-50 font-medium w-24">ออกเดินทาง</td>
                          <td className="px-2 py-1">
                            วันที่ {formatThaiDate(formData.departureDate)} 
                            {formData.departureTime && ` เวลา ${formData.departureTime} น.`}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-2 py-1 bg-slate-50 font-medium">กลับถึง</td>
                          <td className="px-2 py-1">
                            วันที่ {formatThaiDate(formData.returnDate)} 
                            {formData.returnTime && ` เวลา ${formData.returnTime} น.`}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Passengers */}
                  {(formData.passengerCount || formData.passengers) && (
                    <div>
                      <p><strong>ผู้ร่วมเดินทาง</strong> {formData.passengerCount || '0'} คน</p>
                      {formData.passengers && <p className="text-slate-600 pl-2">{formData.passengers}</p>}
                    </div>
                  )}

                  {/* Car Info */}
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <p className="font-medium mb-1">ข้อมูลรถยนต์</p>
                    <div className="grid grid-cols-2 gap-1 text-[9px]">
                      <p><strong>ประเภท:</strong> {carTypes.find(t => t.value === formData.carType)?.label || '-'}</p>
                      <p><strong>ยี่ห้อ:</strong> {formData.carBrand || '-'}</p>
                      <p><strong>รุ่น:</strong> {formData.carModel || '-'}</p>
                      <p><strong>ทะเบียน:</strong> {formData.licensePlate || '-'}</p>
                      <p><strong>ขนาดเครื่องยนต์:</strong> {formData.engineSize ? `${formData.engineSize} ซีซี` : '-'}</p>
                    </div>
                  </div>

                  {/* Distance & Compensation */}
                  <div className="bg-purple-50 p-2 rounded border border-purple-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">ระยะทางไป-กลับ</p>
                        <p className="text-lg font-bold text-purple-700">{formData.distanceKm || 0} กม.</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">ค่าชดเชยน้ำมัน</p>
                        <p className="text-lg font-bold text-purple-700">{fuelCompensation.toLocaleString()} บาท</p>
                      </div>
                    </div>
                    <p className="text-[8px] text-purple-600 mt-1">
                      (อัตรา {FUEL_RATE} บาท/กม. × {formData.distanceKm || 0} กม.)
                    </p>
                  </div>

                  {/* Reason */}
                  <div>
                    <p className="font-medium">เหตุผลความจำเป็น:</p>
                    <p className="text-slate-600 pl-2">
                      ☑ {reasonOptions.find(r => r.value === formData.reason)?.label || '-'}
                      {formData.reason === 'other' && formData.reasonOther && (
                        <span>: {formData.reasonOther}</span>
                      )}
                    </p>
                  </div>

                  {/* Project */}
                  {formData.projectName && (
                    <div>
                      <p><strong>โครงการ:</strong> {formData.projectName}</p>
                      {formData.budgetSource && <p><strong>แหล่งงบประมาณ:</strong> {formData.budgetSource}</p>}
                    </div>
                  )}

                  {/* Declaration */}
                  <div className="text-[9px] text-slate-600 border-t border-slate-200 pt-2">
                    <p className="indent-4">
                      ข้าพเจ้าขอรับรองว่าจะใช้รถยนต์ส่วนตัวในการเดินทางไปราชการตามที่ระบุข้างต้น
                      และจะปฏิบัติตามระเบียบของทางราชการโดยเคร่งครัด
                    </p>
                  </div>

                  {/* Signatures */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="text-center">
                      <p className="mb-6">ลงชื่อ.................................</p>
                      <p>({formData.requesterName || '............................'})</p>
                      <p className="text-slate-500">ผู้ขออนุมัติ</p>
                    </div>
                    <div className="text-center">
                      <p className="mb-6">ลงชื่อ.................................</p>
                      <p>(............................)</p>
                      <p className="text-slate-500">ผู้บังคับบัญชา</p>
                    </div>
                  </div>

                  {/* Approval Section */}
                  <div className="border-t-2 border-slate-400 pt-2 mt-2">
                    <p className="font-bold text-center mb-2">ความเห็นผู้อนุมัติ</p>
                    <div className="space-y-2">
                      <div className="flex gap-4 text-[9px]">
                        <label className="flex items-center gap-1">
                          <span className="w-3 h-3 border border-slate-400 rounded-sm inline-block"></span>
                          อนุมัติ
                        </label>
                        <label className="flex items-center gap-1">
                          <span className="w-3 h-3 border border-slate-400 rounded-sm inline-block"></span>
                          ไม่อนุมัติ
                        </label>
                      </div>
                      <div className="h-12 border border-slate-200 rounded bg-slate-50"></div>
                    </div>
                    <div className="text-center mt-4">
                      <p className="mb-6">ลงชื่อ.................................</p>
                      <p>(............................)</p>
                      <p className="text-slate-500">ผู้อำนวยการศูนย์ RSC</p>
                      <p className="text-[9px] text-slate-400">วันที่...../...../.......</p>
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
