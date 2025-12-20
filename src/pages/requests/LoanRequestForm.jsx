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
import { fdCodes, getFDByAcc, getAccOptions, formatCurrency, getFDsByAcc } from '../../data/fdCodes'

/**
 * LoanRequestForm
 * สัญญายืมเงิน FO-TO-04 form
 * Based on มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี template
 * 
 * Supports both standalone and embedded modes:
 * - Standalone: Full page with navigation
 * - Embedded: Used within RequestWorkflowPage
 */

// ประเภทเงินยืม
const loanDocTypes = [
  { value: 'FD01', label: 'เงินยืมอุดหนุนโครงการ (FD01)' },
  { value: 'FD02', label: 'แผนงาน (FD02)' },
  { value: 'FD05', label: 'แหล่งเงิน (FD05)' },
]

// หน่วยงาน
const departments = [
  { value: 'RSC', label: 'ศูนย์ RSC' },
  { value: 'KMUTT', label: 'มจธ.' },
]

// Initial form data factory
const getInitialFormData = (user) => ({
  // Header
  documentNumber: '',
  toDirector: 'ผอ.สรบ.',
  
  // ข้อมูลผู้ยืม
  borrowerTitle: 'นาย',
  borrowerFirstName: user?.name?.split(' ')[0] || '',
  borrowerLastName: user?.name?.split(' ')[1] || '',
  position: '',
  department: '',
  faculty: 'RSC',
  subUnit: 'RSC',
  
  // วัตถุประสงค์และจำนวนเงิน
  purpose: '',
  loanAmount: '',
  
  // ภายใต้โครงการ (auto-filled from ACC)
  projectName: '',
  documentSubject: '', // เรื่อง: ACC (รหัสโครงการ)
  
  // ระยะเวลาและวันที่
  startDate: '',
  endDate: '',
  returnDate: '',
  
  // ประเภทเอกสาร/เงินยืม (auto-filled from ACC)
  docType: 'FD01',
  fdNumber: '',
  planCode: '',
  fundCode: '',
  
  // ACC Selection (main field for auto-fill)
  selectedAcc: '',
  
  // ใบเสร็จรับเงินเลขที่
  receiptNumber: '',
  receiptBook: '',
  
  // วันที่ดำเนินการ
  operationDays: '',
  operationDaysText: '',
  
  // การมอบฉันทะ
  canCollectSelf: true,
  proxyTitle: '',
  proxyName: '',
  proxyIdCard: '',
  proxyReceiverTitle: '',
  proxyReceiverName: '',
  
  // เอกสารแนบ
  attachments: [],
  
  // For bundle preview
  totalAmount: 0,
  referenceDoc: '',
  items: [],
  dueDate: '',
})

export default function LoanRequestForm({ 
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

  // Calculate total from loanAmount
  const totalAmount = useMemo(() => {
    return parseFloat(formData.loanAmount) || 0
  }, [formData.loanAmount])

  // Convert number to Thai text (Full implementation)
  const numberToThaiText = (num) => {
    if (!num || num === 0) return 'ศูนย์บาทถ้วน'
    
    const ones = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า']
    
    const convertLessThanThousand = (n) => {
      if (n === 0) return ''
      
      let result = ''
      const hundred = Math.floor(n / 100)
      const remainder = n % 100
      const ten = Math.floor(remainder / 10)
      const one = remainder % 10
      
      if (hundred > 0) {
        result += ones[hundred] + 'ร้อย'
      }
      
      if (ten > 0) {
        if (ten === 1) {
          result += 'สิบ'
        } else if (ten === 2) {
          result += 'ยี่สิบ'
        } else {
          result += ones[ten] + 'สิบ'
        }
      }
      
      if (one > 0) {
        if (one === 1 && (ten > 0 || hundred > 0)) {
          result += 'เอ็ด'
        } else {
          result += ones[one]
        }
      }
      
      return result
    }
    
    const n = Math.floor(num)
    if (n === 0) return 'ศูนย์บาทถ้วน'
    
    let result = ''
    
    // ล้าน (Million)
    const million = Math.floor(n / 1000000)
    if (million > 0) {
      if (million > 999) {
        // Handle billion+ by recursion
        result += numberToThaiText(million).replace('บาทถ้วน', '') + 'ล้าน'
      } else {
        result += convertLessThanThousand(million) + 'ล้าน'
      }
    }
    
    // แสน, หมื่น, พัน (Hundred thousand, Ten thousand, Thousand)
    const thousand = Math.floor((n % 1000000) / 1000)
    if (thousand > 0) {
      result += convertLessThanThousand(thousand) + 'พัน'
    }
    
    // ร้อย, สิบ, หน่วย (Hundred, Ten, One)
    const remainder = n % 1000
    if (remainder > 0) {
      result += convertLessThanThousand(remainder)
    }
    
    // Fix: Thai numbering system uses different grouping
    // Re-implement with proper Thai grouping
    result = ''
    let remaining = n
    
    // ล้าน (1,000,000)
    const millions = Math.floor(remaining / 1000000)
    if (millions > 0) {
      if (millions >= 1000000) {
        result += numberToThaiText(millions).replace('บาทถ้วน', '') + 'ล้าน'
      } else {
        result += convertToThaiGroup(millions) + 'ล้าน'
      }
      remaining = remaining % 1000000
    }
    
    // แสน (100,000)
    const hundredThousands = Math.floor(remaining / 100000)
    if (hundredThousands > 0) {
      result += ones[hundredThousands] + 'แสน'
      remaining = remaining % 100000
    }
    
    // หมื่น (10,000)
    const tenThousands = Math.floor(remaining / 10000)
    if (tenThousands > 0) {
      result += ones[tenThousands] + 'หมื่น'
      remaining = remaining % 10000
    }
    
    // พัน (1,000)
    const thousands = Math.floor(remaining / 1000)
    if (thousands > 0) {
      result += ones[thousands] + 'พัน'
      remaining = remaining % 1000
    }
    
    // ร้อย (100)
    const hundreds = Math.floor(remaining / 100)
    if (hundreds > 0) {
      result += ones[hundreds] + 'ร้อย'
      remaining = remaining % 100
    }
    
    // สิบ (10)
    const tensDigit = Math.floor(remaining / 10)
    if (tensDigit > 0) {
      if (tensDigit === 1) {
        result += 'สิบ'
      } else if (tensDigit === 2) {
        result += 'ยี่สิบ'
      } else {
        result += ones[tensDigit] + 'สิบ'
      }
      remaining = remaining % 10
    }
    
    // หน่วย (1)
    if (remaining > 0) {
      if (remaining === 1 && n > 10) {
        result += 'เอ็ด'
      } else {
        result += ones[remaining]
      }
    }
    
    return result + 'บาทถ้วน'
    
    function convertToThaiGroup(n) {
      let r = ''
      let rem = n
      
      const hT = Math.floor(rem / 100000)
      if (hT > 0) { r += ones[hT] + 'แสน'; rem = rem % 100000 }
      
      const tT = Math.floor(rem / 10000)
      if (tT > 0) { r += ones[tT] + 'หมื่น'; rem = rem % 10000 }
      
      const th = Math.floor(rem / 1000)
      if (th > 0) { r += ones[th] + 'พัน'; rem = rem % 1000 }
      
      const h = Math.floor(rem / 100)
      if (h > 0) { r += ones[h] + 'ร้อย'; rem = rem % 100 }
      
      const t = Math.floor(rem / 10)
      if (t > 0) {
        if (t === 1) r += 'สิบ'
        else if (t === 2) r += 'ยี่สิบ'
        else r += ones[t] + 'สิบ'
        rem = rem % 10
      }
      
      if (rem > 0) {
        if (rem === 1 && n > 10) r += 'เอ็ด'
        else r += ones[rem]
      }
      
      return r
    }
  }

  // Format Thai date
  const formatThaiDate = (dateStr) => {
    if (!dateStr) return '....../....../......'
    const date = new Date(dateStr)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear() + 543
    return `${day}/${month}/${year}`
  }

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
        projectName: fdData.projectName,
        documentSubject: `${acc} (${fdData.projectCode})`, // เรื่อง: ACC (รหัสโครงการ)
        fdNumber: fdData.fdCode,
        planCode: fdData.planCode,      // รหัสแผนงาน (FD02) เช่น 30002000
        planName: fdData.planName,      // ชื่อแผนงาน
        fundCode: fdData.fundCode,      // รหัสแหล่งเงิน (FD05) เช่น S04
        fundName: fdData.fundName,      // ชื่อแหล่งเงิน
        // Additional fields from new data structure
        projectCode: fdData.projectCode,
        expenseCode: fdData.expenseCode,
        expenseName: fdData.expenseName,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        selectedAcc: acc,
        projectName: '',
        documentSubject: '',
        fdNumber: '',
        planCode: '',
        planName: '',
        fundCode: '',
        fundName: '',
        projectCode: '',
        expenseCode: '',
        expenseName: '',
      }))
    }
  }

  // Get selected FD data for display
  const selectedFDData = useMemo(() => {
    return getFDByAcc(formData.selectedAcc)
  }, [formData.selectedAcc])

  // Handle activity change
  const handleActivityChange = (index, field, value) => {
    const newActivities = [...formData.activities]
    newActivities[index] = { ...newActivities[index], [field]: value }
    setFormData(prev => ({ ...prev, activities: newActivities }))
  }

  // Add activity
  const handleAddActivity = () => {
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, { id: Date.now(), name: '', amount: 0, note: '' }]
    }))
  }

  // Remove activity
  const handleRemoveActivity = (index) => {
    if (formData.activities.length > 1) {
      const newActivities = formData.activities.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, activities: newActivities }))
    }
  }

  // Handle submit
  const handleSubmit = () => {
    // Prepare data for bundle preview
    const submitData = {
      ...formData,
      totalAmount: totalAmount,
      items: formData.activities.map(a => ({ description: a.name, amount: a.amount })),
      dueDate: formData.returnDate,
      referenceDoc: formData.projectName || 'ไม่ระบุ',
    }
    
    // If in embedded/workflow mode, call onComplete with form data
    if (isEmbedded && onComplete) {
      onComplete(submitData)
      return
    }
    
    // Standalone mode - regular submit
    console.log('Submit:', submitData)
    alert('ส่งสัญญายืมเงินเรียบร้อยแล้ว!')
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
              <i className="fa-solid fa-money-bill-transfer mr-2 text-blue-500"></i>
              สัญญายืมเงิน (FO-TO-04)
            </h1>
            <p className="text-sm text-slate-500">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี</p>
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
          
          {/* Section 1: Header Info */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">1</span>
                ข้อมูลเอกสาร
              </h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                FO-TO-04
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="เรียน"
                value={formData.toDirector}
                onChange={(e) => handleChange('toDirector', e.target.value)}
                placeholder="ผอ.สรบ."
              />
              <Input
                label="เลขที่รับ"
                value={formData.documentNumber}
                onChange={(e) => handleChange('documentNumber', e.target.value)}
                placeholder="เลขที่รับเอกสาร"
              />
            </div>
          </Card>

          {/* Section 2: Borrower Info */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">2</span>
              ข้อมูลผู้ยืม
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <Select
                  label="คำนำหน้า"
                  options={[
                    { value: 'นาย', label: 'นาย' },
                    { value: 'นาง', label: 'นาง' },
                    { value: 'นางสาว', label: 'นางสาว' },
                    { value: 'ดร.', label: 'ดร.' },
                    { value: 'ผศ.', label: 'ผศ.' },
                    { value: 'รศ.', label: 'รศ.' },
                    { value: 'ศ.', label: 'ศ.' },
                  ]}
                  value={formData.borrowerTitle}
                  onChange={(e) => handleChange('borrowerTitle', e.target.value)}
                />
                <Input
                  label="ชื่อ"
                  value={formData.borrowerFirstName}
                  onChange={(e) => handleChange('borrowerFirstName', e.target.value)}
                  placeholder="ชื่อ"
                  className="col-span-1"
                />
                <Input
                  label="นามสกุล"
                  value={formData.borrowerLastName}
                  onChange={(e) => handleChange('borrowerLastName', e.target.value)}
                  placeholder="นามสกุล"
                  className="col-span-1"
                />
                <Input
                  label="ผู้ยืม"
                  value="ผู้ยืม"
                  disabled
                  className="col-span-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ตำแหน่ง"
                  value={formData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  placeholder="ตำแหน่งในองค์กร/หน้าที่"
                />
                <Input
                  label="คณะ/สำนัก/กอง"
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="ชื่อหน่วยงานระดับคณะ/สำนัก (สรบ.)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ภาควิชา/สาขาวิชา/หน่วยงาน"
                  value={formData.faculty}
                  onChange={(e) => handleChange('faculty', e.target.value)}
                  placeholder="ภาควิชา/สาขาวิชา"
                />
                <Input
                  label="ชื่อหน่วยงานย่อย"
                  value={formData.subUnit}
                  onChange={(e) => handleChange('subUnit', e.target.value)}
                  placeholder="(RSC)"
                />
              </div>
            </div>
          </Card>

          {/* Section 3: ACC Selection & Purpose - MAIN INPUT */}
          <Card className="border-2 border-primary-200 bg-primary-50/30">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-primary-500 text-white rounded-lg flex items-center justify-center text-sm">3</span>
              เลือกโครงการและระบุเหตุผล
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium ml-auto">
                <i className="fa-solid fa-star mr-1"></i>
                ส่วนสำคัญ
              </span>
            </h2>
            
            <div className="space-y-4">
              {/* ACC Selection - Main dropdown */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  เลือกรหัส ACC / โครงการ <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
                  value={formData.selectedAcc}
                  onChange={(e) => handleAccChange(e.target.value)}
                >
                  <option value="">-- เลือกโครงการ --</option>
                  {getAccOptions().map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} (คงเหลือ: {formatCurrency(opt.remaining)} บาท)
                    </option>
                  ))}
                </select>
              </div>

              {/* Show selected project info */}
              {selectedFDData && (
                <div className="bg-white border border-primary-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-folder-open text-primary-600"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-800 text-sm">{selectedFDData.projectName}</h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                        <p className="text-slate-500">รหัสหน่วยงาน (FD01): <span className="text-slate-700 font-medium">{selectedFDData.fdCode}</span></p>
                        <p className="text-slate-500">รหัสแผนงาน (FD02): <span className="text-slate-700 font-medium">{selectedFDData.planCode}</span></p>
                        <p className="text-slate-500">รหัสโครงการ (FD03): <span className="text-slate-700 font-medium">{selectedFDData.projectCode}</span></p>
                        <p className="text-slate-500">รหัสหมวดรายจ่าย (FD04): <span className="text-slate-700 font-medium">{selectedFDData.expenseCode}</span></p>
                        <p className="text-slate-500">รหัสแหล่งเงิน (FD05): <span className="text-slate-700 font-medium">{selectedFDData.fundCode}</span></p>
                        <p className="text-slate-500">ปีงบประมาณ (FD06): <span className="text-slate-700 font-medium">{selectedFDData.fiscalYear}</span></p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs border-t border-slate-100 pt-2">
                        <p className="text-slate-500">แผนงาน: <span className="text-slate-700">{selectedFDData.planName}</span></p>
                        <p className="text-slate-500">หมวดรายจ่าย: <span className="text-slate-700">{selectedFDData.expenseName}</span></p>
                        <p className="text-slate-500">แหล่งเงิน: <span className="text-slate-700">{selectedFDData.fundName}</span></p>
                      </div>
                      <div className="flex gap-4 mt-3 pt-3 border-t border-slate-100">
                        <div className="text-center">
                          <p className="text-xs text-slate-500">งบประมาณ</p>
                          <p className="font-bold text-slate-800">{formatCurrency(selectedFDData.budget)} บาท</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">ใช้ไปแล้ว</p>
                          <p className="font-bold text-orange-600">{formatCurrency(selectedFDData.spent)} บาท</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-slate-500">คงเหลือ</p>
                          <p className="font-bold text-green-600">{formatCurrency(selectedFDData.budget - selectedFDData.spent)} บาท</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    จำนวนเงินที่ขอยืม (บาท) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={formData.loanAmount || ''}
                    onChange={(e) => handleChange('loanAmount', e.target.value)}
                    placeholder="0"
                  />
                  {selectedFDData && parseFloat(formData.loanAmount) > (selectedFDData.budget - selectedFDData.spent) && (
                    <p className="text-red-500 text-xs mt-1">
                      <i className="fa-solid fa-exclamation-triangle mr-1"></i>
                      จำนวนเงินเกินงบประมาณคงเหลือ!
                    </p>
                  )}
                </div>
                <div className="flex items-end">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 w-full">
                    <p className="text-xs text-slate-500 mb-1">จำนวนเงิน (ตัวอักษร)</p>
                    <p className="font-medium text-blue-700">{numberToThaiText(parseFloat(formData.loanAmount) || 0)}</p>
                  </div>
                </div>
              </div>

              {/* Purpose - Main input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  เหตุผลความจำเป็น <span className="text-red-500">*</span>
                </label>
                <Textarea
                  value={formData.purpose}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  placeholder="ระบุเหตุผลความจำเป็นในการยืมเงิน..."
                  rows={3}
                />
              </div>

              <p className="text-xs text-slate-500">
                ** ระบุระยะเวลาดำเนินงาน และวันที่ขอรับเงิน
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="วันที่เริ่มต้น"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
                <Input
                  label="วันที่สิ้นสุด"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
                <Input
                  label="วันที่ขอรับเงิน"
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => handleChange('returnDate', e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Section 4: Auto-filled Document Info */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">4</span>
              ข้อมูลเอกสาร (กรอกอัตโนมัติจากโครงการ)
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium ml-auto">
                <i className="fa-solid fa-magic mr-1"></i>
                Auto-fill
              </span>
            </h2>
            
            <div className="space-y-4">
              <Input
                label="เรื่อง"
                value={formData.documentSubject}
                disabled
                className="bg-slate-50"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="หน่วยงาน (FD01)"
                  value={formData.fdNumber}
                  disabled
                  className="bg-slate-50"
                />
                <Select
                  label="ประเภทเอกสาร"
                  options={loanDocTypes}
                  value={formData.docType}
                  onChange={(e) => handleChange('docType', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="รหัสแผนงาน (FD02)"
                  value={formData.planCode}
                  disabled
                  className="bg-slate-50"
                />
                <Input
                  label="แผนงาน"
                  value={formData.planName || ''}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="รหัสแหล่งเงิน (FD05)"
                  value={formData.fundCode}
                  disabled
                  className="bg-slate-50"
                />
                <Input
                  label="แหล่งเงิน"
                  value={formData.fundName || ''}
                  disabled
                  className="bg-slate-50"
                />
              </div>

              <Divider className="my-4" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="ตามใบเสร็จรับเงินเลขที่"
                  value={formData.receiptNumber}
                  onChange={(e) => handleChange('receiptNumber', e.target.value)}
                  placeholder="เลขที่ใบเสร็จ"
                />
                <Input
                  label="เล่มที่"
                  value={formData.receiptBook}
                  onChange={(e) => handleChange('receiptBook', e.target.value)}
                  placeholder="เล่มที่"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  เมื่อข้าพเจ้าได้รับเงินยืมตามสัญญานี้แล้ว ข้าพเจ้าจะเร่งดำเนินการตามวัตถุประสงค์ และจะจัดรับส่งหนังสือพร้อมยอดส่งคืนเงินสดส่วนที่เหลือ (ถ้ามี)
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <Input
                    label="ภายใน (วัน)"
                    type="number"
                    value={formData.operationDays}
                    onChange={(e) => handleChange('operationDays', e.target.value)}
                    placeholder="จำนวนวัน"
                  />
                  <Input
                    label="(โปรดระบุเกณฑ์ที่ใช้ในการกำหนด)"
                    value={formData.operationDaysText}
                    onChange={(e) => handleChange('operationDaysText', e.target.value)}
                    placeholder="เกณฑ์การกำหนดวัน"
                  />
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                กรณีเป็นการยืมเงินตามหลักเกณฑ์เงินยืมโดยให้หน่วยงานเป็นผู้กำหนดการเงินปฏิบัติตามหลักเกณฑ์ ตามประกาศมหาวิทยาลัยฯ
                <br />เรื่อง การยืมเงินมหาวิทยาลัย พ.ศ.2551 ตามหมวดที่ 5
              </p>
            </div>
          </Card>

          {/* Section 5: Proxy/Authorization */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">5</span>
              การมอบฉันทะ
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="collectType"
                    checked={formData.canCollectSelf}
                    onChange={() => handleChange('canCollectSelf', true)}
                    className="w-4 h-4 text-blue-500"
                  />
                  <span className="text-sm">กรณีผู้ยืมเงินไม่สามารถมารับเงินได้ จึงมอบให้ นาย/นาง/นางสาว</span>
                </label>
              </div>

              <div className="pl-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="คำนำหน้า"
                    options={[
                      { value: 'นาย', label: 'นาย' },
                      { value: 'นาง', label: 'นาง' },
                      { value: 'นางสาว', label: 'นางสาว' },
                    ]}
                    value={formData.proxyTitle}
                    onChange={(e) => handleChange('proxyTitle', e.target.value)}
                  />
                  <Input
                    label="ชื่อ-นามสกุล ผู้รับมอบ"
                    value={formData.proxyName}
                    onChange={(e) => handleChange('proxyName', e.target.value)}
                    placeholder="ชื่อ-นามสกุล"
                    className="col-span-2"
                  />
                </div>
                
                <Input
                  label="เลขบัตรประชาชน"
                  value={formData.proxyIdCard}
                  onChange={(e) => handleChange('proxyIdCard', e.target.value)}
                  placeholder="x-xxxx-xxxxx-xx-x"
                />

                <p className="text-sm text-slate-600">
                  เป็นผู้รับเงินแทนตามสัญญายืมเงินเลขที่ด้วยด้วยตัวเอง
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    label="คำนำหน้า"
                    options={[
                      { value: 'นาย', label: 'นาย' },
                      { value: 'นาง', label: 'นาง' },
                      { value: 'นางสาว', label: 'นางสาว' },
                    ]}
                    value={formData.proxyReceiverTitle}
                    onChange={(e) => handleChange('proxyReceiverTitle', e.target.value)}
                  />
                  <Input
                    label="ชื่อ-นามสกุล ผู้รับเงินแทน"
                    value={formData.proxyReceiverName}
                    onChange={(e) => handleChange('proxyReceiverName', e.target.value)}
                    placeholder="ชื่อ-นามสกุล"
                    className="col-span-2"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Section 6: Attachments */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">6</span>
              เอกสารแนบ
            </h2>
            
            <FileUpload
              files={formData.attachments}
              onChange={(files) => handleChange('attachments', files)}
              hint="แนบใบเสนอราคา, รายละเอียดค่าใช้จ่าย หรือเอกสารประกอบอื่นๆ"
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
        <div className="h-[calc(100vh-120px)]">
          <div className="sticky top-4 h-full flex flex-col">
            <Card className="bg-slate-100 border-none p-4 flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-3 shrink-0">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <i className="fa-solid fa-eye mr-2"></i>
                  ตัวอย่างเอกสาร FO-TO-04
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFullscreenPreview(true)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
                  title="ดู Preview แบบเต็มจอ"
                >
                  <i className="fa-solid fa-expand"></i>
                </button>
              </div>
              
              {/* Scrollable Preview Container */}
              <div className="flex-1 overflow-y-auto pr-2">
              {/* A4 Document Container */}
              <div className="flex justify-center">
              {/* Document Preview - FO-TO-04 Style - A4 Size */}
              <div className="bg-white rounded-lg shadow-lg border border-slate-300 w-full max-w-[595px]">
                {/* Document Content */}
                <div>
                  <div className="p-4 text-[9px] leading-relaxed font-sarabun">
                    
                    {/* Header - PDTI Style matching PDF */}
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png" 
                          alt="PDTI Logo" 
                          className="w-10 h-10 object-contain"
                        />
                        <div>
                          <p className="font-bold text-[10px]">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี</p>
                          <p className="font-bold text-[11px]">สัญญาการยืมเงิน</p>
                        </div>
                      </div>
                      <div className="text-right text-[8px]">
                        <div className="border border-slate-500 px-2 py-0.5 font-bold text-[9px] inline-block mb-0.5">FO-TO-04</div>
                        <p className="font-bold">กองคลัง</p>
                      </div>
                    </div>

                    {/* To Line with Document Number */}
                    <div className="flex justify-between items-center border-b border-slate-300 pb-1 mb-1">
                      <p><span className="font-bold">เรียน</span> {formData.toDirector || 'ผู้อำนวยการสถาบันพัฒนาและฝึกอบรมโรงงานต้นแบบ'}</p>
                      <p>เลขที่รับ <span className="border-b border-slate-400 px-2">{formData.documentNumber || '............'}</span></p>
                    </div>

                    {/* Borrower Info - Single line like PDF */}
                    <p className="mb-0.5">
                      <span className="font-bold">ข้าพเจ้า</span> <span className="border-b border-slate-400">{formData.borrowerTitle} {formData.borrowerFirstName} {formData.borrowerLastName || '...................'}</span>
                      {' '}<span className="font-bold">ตำแหน่ง</span> <span className="border-b border-slate-400">{formData.position || '............'}</span>
                      {' '}<span className="font-bold">คณะ/สำนัก/กอง (FD01)</span> <span className="border-b border-slate-400">{formData.department || '...................'}</span>
                    </p>
                    <p className="mb-1">
                      <span className="font-bold">ภาควิชา/สายวิชา/หน่วยงาน (FD01)</span> <span className="border-b border-slate-400">{formData.faculty || '............'}</span>
                      {' '}<span className="font-bold">วันที่</span> <span className="border-b border-slate-400">{formatThaiDate(formData.startDate)}</span>
                    </p>

                    {/* Purpose */}
                    <p className="mb-1">มีความประสงค์ขอยืมเงินจาก มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี เพื่อใช้ในกิจกรรมของส่วนงาน ดังนี้</p>

                    {/* Reason/Purpose - Single paragraph */}
                    <div className="mb-1 pl-2 border border-slate-200 p-1">
                      <p className="text-[8px]">{formData.purpose || 'ค่าใช้จ่ายเดินทางไป "........................................"'}</p>
                      <div className="flex justify-end mt-0.5">
                        <span className="font-bold text-right">{totalAmount ? totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2}) : ''}</span>
                      </div>
                    </div>

                    {/* Amount in Thai Text */}
                    <div className="flex justify-between items-center mb-1 bg-slate-50 px-2 py-0.5">
                      <p><span className="font-bold">(ตัวอักษร)</span> {numberToThaiText(totalAmount)}</p>
                      <p><span className="font-bold">บาท</span> <span className="font-bold text-blue-600">{totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span></p>
                    </div>

                    {/* Budget Source Section - matching PDF layout */}
                    <div className="border border-slate-400 p-1.5 mb-1 text-[8px]">
                      {/* Row 1: หน่วยงาน */}
                      <div className="flex items-baseline mb-0.5">
                        <span className="font-bold shrink-0">เงินยืมฉบับนี้เบิกจ่ายจาก</span>
                        <span className="shrink-0 ml-2">หน่วยงาน (FD01)</span>
                        <span className="border-b border-slate-400 flex-1 mx-1 text-center">{formData.department || 'สถาบันพัฒนาและฝึกอบรมโรงงานต้นแบบ'}</span>
                        <span className="shrink-0">รหัสหน่วยงาน(FD01)</span>
                        <span className="border-b border-slate-400 w-24 ml-1 text-center">{formData.fdNumber || ''}</span>
                      </div>
                      
                      {/* Row 2: แผนงาน */}
                      <div className="flex items-baseline mb-0.5">
                        <span className="shrink-0">○ แผนงาน (FD02)</span>
                        <span className="border-b border-slate-400 flex-1 mx-1">{formData.planName || 'งานวิจัยโครงการ'}</span>
                        <span className="shrink-0">รหัสแผนงาน</span>
                        <span className="border-b border-slate-400 w-20 ml-1 text-center">{formData.planCode || ''}</span>
                      </div>
                      
                      {/* Row 3: แหล่งเงิน */}
                      <div className="flex items-baseline mb-0.5">
                        <span className="shrink-0">○ แหล่งเงิน (FD05)</span>
                        <span className="border-b border-slate-400 flex-1 mx-1">{formData.fundName || 'รายรับจากงานวิจัยและวิชาการ'}</span>
                        <span className="shrink-0">รหัสแหล่งเงิน</span>
                        <span className="border-b border-slate-400 w-12 ml-1 text-center">{formData.fundCode || ''}</span>
                      </div>
                      
                      {/* Row 4: เรื่อง */}
                      <div className="flex items-baseline mb-0.5">
                        <span className="shrink-0">เรื่อง</span>
                        <span className="border-b border-slate-400 flex-1 ml-1">{formData.documentSubject || ''}</span>
                      </div>
                      
                      {/* Row 5: ตามใบเสร็จรับเงิน */}
                      <div className="flex items-baseline">
                        <span className="shrink-0">ตามใบเสร็จรับเงินเลขที่</span>
                        <span className="border-b border-slate-400 w-20 mx-1 text-center">{formData.receiptNumber || ''}</span>
                        <span className="shrink-0">เล่มที่</span>
                        <span className="border-b border-slate-400 w-16 mx-1 text-center">{formData.receiptBook || ''}</span>
                        <span className="shrink-0">วันที่</span>
                        <span className="border-b border-slate-400 flex-1 ml-1 text-center">{formatThaiDate(formData.returnDate)}</span>
                      </div>
                    </div>

                    {/* Terms */}
                    <p className="text-[8px] mb-0.5">
                      เมื่อข้าพเจ้าได้รับเงินยืมตามสัญญานี้แล้ว ข้าพเจ้าจะเร่งดำเนินการตามวัตถุประสงค์ และจะจัดรับส่งหนังสือพร้อมยอดส่งคืนเงินสดส่วนที่เหลือ (ถ้ามี)
                    </p>
                    <p className="text-[8px] mb-0.5">ภายใน <span className="border-b border-slate-400 px-1">{formData.operationDays || '......'}</span> วัน (โปรดดูหลักเกณฑ์ที่กำไปด้านหลัง)</p>
                    <p className="text-[7px] text-slate-500 mb-1">
                      กรณีไม่ดำเนินการตามเงื่อนไขที่กำหนด ข้าพเจ้ายอมให้มหาวิทยาลัยหักเงินเดือนตามข้อกำหนดการไม่ปฏิบัติตามเงื่อนไขตามประกาศมหาวิทยาลัย เรื่อง การยืมเงินมหาวิทยาลัย พ.ศ.2551 ตามนัยข้อ 5
                    </p>

                    {/* 4-Column Approval Signatures - matching PDF */}
                    <table className="w-full border-collapse border border-slate-400 text-[7px] mb-1">
                      <thead>
                        <tr>
                          <th className="border border-slate-400 px-1 py-0.5 text-center font-normal w-1/4"></th>
                          <th className="border border-slate-400 px-1 py-0.5 text-center font-bold w-1/4">เห็นสมควรอนุมัติ</th>
                          <th className="border border-slate-400 px-1 py-0.5 text-center font-bold w-1/4">อนุมัติ/เห็นสมควรอนุมัติ</th>
                          <th className="border border-slate-400 px-1 py-0.5 text-center font-bold w-1/4">อนุมัติ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-400 px-1 py-1 align-top text-center">
                            <p className="mb-1">ลงชื่อ .................................. ผู้ยืมเงิน</p>
                            <p className="mb-1">( {formData.borrowerTitle} {formData.borrowerFirstName} {formData.borrowerLastName || '..............................'} )</p>
                            <p className="text-left">วันที่</p>
                          </td>
                          <td className="border border-slate-400 px-1 py-1 align-top text-center">
                            <p className="mb-1">ลงชื่อ ..................................</p>
                            <p className="mb-1">( .......................................... )</p>
                            <p className="text-left">วันที่</p>
                          </td>
                          <td className="border border-slate-400 px-1 py-1 align-top text-center">
                            <p className="mb-1">ลงชื่อ ..................................</p>
                            <p className="mb-1">( นายศุเรนทร์ ฐปนางกูร )</p>
                            <p className="text-left">วันที่</p>
                          </td>
                          <td className="border border-slate-400 px-1 py-1 align-top text-center">
                            <p className="mb-1">ลงชื่อ</p>
                            <p className="mb-1">( ผศ.ดร.บุณยพัต สุภานิช )</p>
                            <p className="text-left">วันที่</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Proxy Section - matching PDF */}
                    <div className="border border-slate-400 p-1 mb-1 text-[8px]">
                      <p className="font-bold text-center mb-0.5">การมอบฉันทะ (กรณีผู้ยืมเงินไม่สามารถมารับเงินด้วยตนเอง)</p>
                      <p>ข้าพเจ้าไม่สามารถมารับเงินยืมได้ จึงมอบให้ {formData.proxyTitle || 'นาย/นาง/นางสาว'} <span className="border-b border-slate-400">{formData.proxyName || '........................'}</span> เป็นผู้มารับเงินตัดกล่าวแทนข้าพเจ้า</p>
                      <div className="flex justify-between mt-1 text-[7px]">
                        <div className="text-center">
                          <p>ลงชื่อ..........................ผู้มอบฉันทะ</p>
                          <p>(...............................)</p>
                          <p>วันที่...........................</p>
                        </div>
                        <div className="text-center">
                          <p>ลงชื่อ..........................ผู้รับมอบฉันทะ</p>
                          <p>(...............................)</p>
                          <p>วันที่...........................</p>
                        </div>
                      </div>
                    </div>

                    {/* Treasury Section - matching PDF exactly */}
                    <div className="border-t-2 border-slate-600 pt-1 mb-1">
                      {/* Header */}
                      <div className="bg-slate-200 text-center py-0.5 border border-slate-400 mb-0">
                        <p className="font-bold text-[8px]">ส่วนของกองคลัง</p>
                      </div>
                      
                      {/* First Row - Payment Info */}
                      <div className="border border-slate-400 border-t-0 text-[7px]">
                        <div className="flex">
                          <div className="w-[30%] p-1 border-r border-slate-400">
                            <p>จ่ายได้ตามที่อนุมัติแล้วข้างต้น</p>
                          </div>
                          <div className="w-[45%] p-1 border-r border-slate-400">
                            <p>สัญญาเงินยืมข้างต้นจ่ายด้วย</p>
                            <div className="flex gap-3 mt-0.5">
                              <span>○ เงินสด</span>
                              <span>○ เช็คเลขที่ .........................</span>
                            </div>
                          </div>
                          <div className="w-[25%] p-1">
                            <p>สัญญาเลขที่ ........../........</p>
                          </div>
                        </div>
                      </div>

                      {/* Second Row - Signatures */}
                      <div className="border border-slate-400 border-t-0 text-[7px]">
                        <div className="flex">
                          {/* Left - ผู้อำนวยการกองคลัง */}
                          <div className="w-[30%] p-1 border-r border-slate-400">
                            <p>ลงชื่อ ................................</p>
                            <p className="text-center">ผู้อำนวยการกองคลัง</p>
                            <p>วันที่ ................................</p>
                          </div>
                          {/* Middle - ธนาคาร + ผู้จัดทำเช็ค */}
                          <div className="w-[45%] p-1 border-r border-slate-400">
                            <p>ธนาคาร ............................................................. ลงวันที่ ........................</p>
                            <p>ลงชื่อ ............................................................. ผู้จัดทำเช็ค</p>
                            <p>วันที่ ................................</p>
                          </div>
                          {/* Right - ผู้ตรวจ */}
                          <div className="w-[25%] p-1">
                            <p>ลงชื่อ ................................</p>
                            <p className="text-center">ผู้ตรวจ</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Receiver Confirmation */}
                    <div className="border border-slate-400 p-1 text-[8px] mb-1">
                      <p className="mb-1">ข้าพเจ้าได้รับเงินยืมจำนวน <span className="border-b border-slate-400 px-4">{totalAmount.toLocaleString()}</span> บาท ( <span className="border-b border-slate-400 px-2">{numberToThaiText(totalAmount)}</span> )</p>
                      <div className="grid grid-cols-2 gap-6 text-[7px] mt-2">
                        <div className="text-center">
                          <p>ลงชื่อ .......................................... ผู้รับเงิน</p>
                          <p>( .......................................... )</p>
                          <p>วันที่ ........................................</p>
                        </div>
                        <div className="text-center">
                          <p>ลงชื่อ .......................................... ผู้จ่ายเงิน</p>
                          <p>( .......................................... )</p>
                          <p>วันที่ ........................................</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border border-slate-400 border-t-0">
                      <div className="flex justify-between items-center p-1 text-[7px]">
                        <p>ลงชื่อ ............................ ผู้บันทึกบัญชี วันที่ ............................</p>
                        <div className="text-right">
                          <p>พลิกด้านหลัง</p>
                        </div>
                      </div>
                      <div className="text-right pr-1 pb-0.5">
                        <p className="text-[7px] text-slate-500">ฉบับปรับปรุงเริ่มใช้ 1 ต.ค. 2565</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
              </div>
              </div>
              
              {/* Preview Info */}
              <p className="text-xs text-slate-400 mt-3 text-center shrink-0">
                * ตัวอย่างเอกสารจะอัพเดทตามข้อมูลที่กรอก
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {isFullscreenPreview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-100 rounded-xl w-full max-w-5xl max-h-[95vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-700">
                <i className="fa-solid fa-eye mr-2"></i>
                ตัวอย่างเอกสาร FO-TO-04 - สัญญายืมเงิน
              </h3>
              <button
                type="button"
                onClick={() => setIsFullscreenPreview(false)}
                className="w-10 h-10 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
                title="ปิด"
              >
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex justify-center">
                {/* A4 Document Preview - Same as normal preview but larger */}
                <div className="bg-white rounded-lg shadow-lg border border-slate-300 w-full max-w-[700px]">
                  <div className="p-6 text-[11px] leading-relaxed font-sarabun">
                    
                    {/* Header - PDTI Style matching PDF */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png" 
                          alt="PDTI Logo" 
                          className="w-14 h-14 object-contain"
                        />
                        <div>
                          <p className="font-bold text-[12px]">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี</p>
                          <p className="font-bold text-[14px]">สัญญาการยืมเงิน</p>
                        </div>
                      </div>
                      <div className="text-right text-[10px]">
                        <div className="border border-slate-500 px-3 py-1 font-bold text-[11px] inline-block mb-1">FO-TO-04</div>
                        <p className="font-bold">กองคลัง</p>
                      </div>
                    </div>

                    {/* To Line with Document Number */}
                    <div className="flex justify-between items-center border-b border-slate-300 pb-2 mb-2">
                      <p><span className="font-bold">เรียน</span> {formData.toDirector || 'ผู้อำนวยการสถาบันพัฒนาและฝึกอบรมโรงงานต้นแบบ'}</p>
                      <p>เลขที่รับ <span className="border-b border-slate-400 px-3">{formData.documentNumber || '............'}</span></p>
                    </div>

                    {/* Borrower Info - Single line like PDF */}
                    <p className="mb-1">
                      <span className="font-bold">ข้าพเจ้า</span> <span className="border-b border-slate-400">{formData.borrowerTitle} {formData.borrowerFirstName} {formData.borrowerLastName || '...................'}</span>
                      {' '}<span className="font-bold">ตำแหน่ง</span> <span className="border-b border-slate-400">{formData.position || '............'}</span>
                      {' '}<span className="font-bold">คณะ/สำนัก/กอง (FD01)</span> <span className="border-b border-slate-400">{formData.department || '...................'}</span>
                    </p>
                    <p className="mb-2">
                      <span className="font-bold">ภาควิชา/สายวิชา/หน่วยงาน (FD01)</span> <span className="border-b border-slate-400">{formData.faculty || '............'}</span>
                      {' '}<span className="font-bold">วันที่</span> <span className="border-b border-slate-400">{formatThaiDate(formData.startDate)}</span>
                    </p>

                    {/* Purpose */}
                    <p className="mb-2">มีความประสงค์ขอยืมเงินจาก มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี เพื่อใช้ในกิจกรรมของส่วนงาน ดังนี้</p>

                    {/* Reason/Purpose - Single paragraph */}
                    <div className="mb-2 pl-2 border border-slate-200 p-2 rounded">
                      <p className="text-[10px]">{formData.purpose || 'ค่าใช้จ่ายเดินทางไป "........................................"'}</p>
                      <div className="flex justify-end mt-1">
                        <span className="font-bold text-right">{totalAmount ? totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2}) : ''}</span>
                      </div>
                    </div>

                    {/* Amount in Thai Text */}
                    <div className="flex justify-between items-center mb-2 bg-slate-50 px-3 py-1 rounded">
                      <p><span className="font-bold">(ตัวอักษร)</span> {numberToThaiText(totalAmount)}</p>
                      <p><span className="font-bold">บาท</span> <span className="font-bold text-blue-600">{totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2})}</span></p>
                    </div>

                    {/* Budget Source Section - matching PDF layout */}
                    <div className="border border-slate-400 p-2 mb-2 text-[10px] rounded">
                      {/* Row 1: หน่วยงาน */}
                      <div className="flex items-baseline mb-1">
                        <span className="font-bold shrink-0">เงินยืมฉบับนี้เบิกจ่ายจาก</span>
                        <span className="shrink-0 ml-2">หน่วยงาน (FD01)</span>
                        <span className="border-b border-slate-400 flex-1 mx-1 text-center">{formData.department || 'สถาบันพัฒนาและฝึกอบรมโรงงานต้นแบบ'}</span>
                        <span className="shrink-0">รหัสหน่วยงาน(FD01)</span>
                        <span className="border-b border-slate-400 w-28 ml-1 text-center">{formData.fdNumber || ''}</span>
                      </div>
                      
                      {/* Row 2: แผนงาน */}
                      <div className="flex items-baseline mb-1">
                        <span className="shrink-0">○ แผนงาน (FD02)</span>
                        <span className="border-b border-slate-400 flex-1 mx-1">{formData.planName || 'งานวิจัยโครงการ'}</span>
                        <span className="shrink-0">รหัสแผนงาน</span>
                        <span className="border-b border-slate-400 w-24 ml-1 text-center">{formData.planCode || ''}</span>
                      </div>
                      
                      {/* Row 3: แหล่งเงิน */}
                      <div className="flex items-baseline mb-1">
                        <span className="shrink-0">○ แหล่งเงิน (FD05)</span>
                        <span className="border-b border-slate-400 flex-1 mx-1">{formData.fundName || 'รายรับจากงานวิจัยและวิชาการ'}</span>
                        <span className="shrink-0">รหัสแหล่งเงิน</span>
                        <span className="border-b border-slate-400 w-16 ml-1 text-center">{formData.fundCode || ''}</span>
                      </div>
                      
                      {/* Row 4: เรื่อง */}
                      <div className="flex items-baseline mb-1">
                        <span className="shrink-0">เรื่อง</span>
                        <span className="border-b border-slate-400 flex-1 ml-1">{formData.documentSubject || ''}</span>
                      </div>
                      
                      {/* Row 5: ตามใบเสร็จรับเงิน */}
                      <div className="flex items-baseline">
                        <span className="shrink-0">ตามใบเสร็จรับเงินเลขที่</span>
                        <span className="border-b border-slate-400 w-24 mx-1 text-center">{formData.receiptNumber || ''}</span>
                        <span className="shrink-0">เล่มที่</span>
                        <span className="border-b border-slate-400 w-20 mx-1 text-center">{formData.receiptBook || ''}</span>
                        <span className="shrink-0">วันที่</span>
                        <span className="border-b border-slate-400 flex-1 ml-1 text-center">{formatThaiDate(formData.returnDate)}</span>
                      </div>
                    </div>

                    {/* Terms */}
                    <p className="text-[10px] mb-1">
                      เมื่อข้าพเจ้าได้รับเงินยืมตามสัญญานี้แล้ว ข้าพเจ้าจะเร่งดำเนินการตามวัตถุประสงค์ และจะจัดรับส่งหนังสือพร้อมยอดส่งคืนเงินสดส่วนที่เหลือ (ถ้ามี)
                    </p>
                    <p className="text-[10px] mb-1">ภายใน <span className="border-b border-slate-400 px-2">{formData.operationDays || '......'}</span> วัน (โปรดดูหลักเกณฑ์ที่กำหนดไว้ด้านหลัง)</p>
                    <p className="text-[9px] text-slate-500 mb-2">
                      กรณีไม่ดำเนินการตามเงื่อนไขที่กำหนด ข้าพเจ้ายอมให้มหาวิทยาลัยหักเงินเดือนตามข้อกำหนดการไม่ปฏิบัติตามเงื่อนไขตามประกาศมหาวิทยาลัย เรื่อง การยืมเงินมหาวิทยาลัย พ.ศ.2551 ตามนัยข้อ 5
                    </p>

                    {/* 4-Column Approval Signatures - matching PDF */}
                    <table className="w-full border-collapse border border-slate-400 text-[9px] mb-2">
                      <thead>
                        <tr>
                          <th className="border border-slate-400 px-2 py-1 text-center font-normal w-1/4"></th>
                          <th className="border border-slate-400 px-2 py-1 text-center font-bold w-1/4">เห็นสมควรอนุมัติ</th>
                          <th className="border border-slate-400 px-2 py-1 text-center font-bold w-1/4">อนุมัติ/เห็นสมควรอนุมัติ</th>
                          <th className="border border-slate-400 px-2 py-1 text-center font-bold w-1/4">อนุมัติ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-400 px-2 py-2 align-top text-center">
                            <p className="mb-2">ลงชื่อ .................................. ผู้ยืมเงิน</p>
                            <p className="mb-2">( {formData.borrowerTitle} {formData.borrowerFirstName} {formData.borrowerLastName || '..............................'} )</p>
                            <p className="text-left">วันที่</p>
                          </td>
                          <td className="border border-slate-400 px-2 py-2 align-top text-center">
                            <p className="mb-2">ลงชื่อ ..................................</p>
                            <p className="mb-2">( .......................................... )</p>
                            <p className="text-left">วันที่</p>
                          </td>
                          <td className="border border-slate-400 px-2 py-2 align-top text-center">
                            <p className="mb-2">ลงชื่อ ..................................</p>
                            <p className="mb-2">( นายศุเรนทร์ ฐปนางกูร )</p>
                            <p className="text-left">วันที่</p>
                          </td>
                          <td className="border border-slate-400 px-2 py-2 align-top text-center">
                            <p className="mb-2">ลงชื่อ</p>
                            <p className="mb-2">( ผศ.ดร.บุณยพัต สุภานิช )</p>
                            <p className="text-left">วันที่</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Proxy Section - matching PDF */}
                    <div className="border border-slate-400 p-2 mb-2 text-[10px] rounded">
                      <p className="font-bold text-center mb-1">การมอบฉันทะ (กรณีผู้ยืมเงินไม่สามารถมารับเงินด้วยตนเอง)</p>
                      <p>ข้าพเจ้าไม่สามารถมารับเงินยืมได้ จึงมอบให้ {formData.proxyTitle || 'นาย/นาง/นางสาว'} <span className="border-b border-slate-400">{formData.proxyName || '........................'}</span> เป็นผู้มารับเงินตัดกล่าวแทนข้าพเจ้า</p>
                      <div className="flex justify-between mt-2 text-[9px]">
                        <div className="text-center">
                          <p>ลงชื่อ..........................ผู้มอบฉันทะ</p>
                          <p>(...............................)</p>
                          <p>วันที่...........................</p>
                        </div>
                        <div className="text-center">
                          <p>ลงชื่อ..........................ผู้รับมอบฉันทะ</p>
                          <p>(...............................)</p>
                          <p>วันที่...........................</p>
                        </div>
                      </div>
                    </div>

                    {/* Treasury Section - matching PDF exactly */}
                    <div className="border-t-2 border-slate-600 pt-2 mb-2">
                      {/* Header */}
                      <div className="bg-slate-200 text-center py-1 border border-slate-400 mb-0">
                        <p className="font-bold text-[10px]">ส่วนของกองคลัง</p>
                      </div>
                      
                      {/* First Row - Payment Info */}
                      <div className="border border-slate-400 border-t-0 text-[9px]">
                        <div className="flex">
                          <div className="w-[30%] p-2 border-r border-slate-400">
                            <p>จ่ายได้ตามที่อนุมัติแล้วข้างต้น</p>
                          </div>
                          <div className="w-[45%] p-2 border-r border-slate-400">
                            <p>สัญญาเงินยืมข้างต้นจ่ายด้วย</p>
                            <div className="flex gap-4 mt-1">
                              <span>○ เงินสด</span>
                              <span>○ เช็คเลขที่ .........................</span>
                            </div>
                          </div>
                          <div className="w-[25%] p-2">
                            <p>สัญญาเลขที่ ........../........</p>
                          </div>
                        </div>
                      </div>

                      {/* Second Row - Signatures */}
                      <div className="border border-slate-400 border-t-0 text-[9px]">
                        <div className="flex">
                          {/* Left - ผู้อำนวยการกองคลัง */}
                          <div className="w-[30%] p-2 border-r border-slate-400">
                            <p>ลงชื่อ ........................................</p>
                            <p className="text-center">ผู้อำนวยการกองคลัง</p>
                            <p>วันที่ ........................................</p>
                          </div>
                          {/* Middle - ธนาคาร + ผู้จัดทำเช็ค */}
                          <div className="w-[45%] p-2 border-r border-slate-400">
                            <p>ธนาคาร ................................................................. ลงวันที่ ............................</p>
                            <p>ลงชื่อ ................................................................. ผู้จัดทำเช็ค</p>
                            <p>วันที่ ........................................</p>
                          </div>
                          {/* Right - ผู้ตรวจ */}
                          <div className="w-[25%] p-2">
                            <p>ลงชื่อ ........................................</p>
                            <p className="text-center">ผู้ตรวจ</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Receiver Confirmation */}
                    <div className="border border-slate-400 p-2 text-[10px] mb-2">
                      <p className="mb-2">ข้าพเจ้าได้รับเงินยืมจำนวน <span className="border-b border-slate-400 px-4">{totalAmount.toLocaleString()}</span> บาท ( <span className="border-b border-slate-400 px-2">{numberToThaiText(totalAmount)}</span> )</p>
                      <div className="grid grid-cols-2 gap-8 text-[9px] mt-2">
                        <div className="text-center">
                          <p>ลงชื่อ .......................................... ผู้รับเงิน</p>
                          <p>( .......................................... )</p>
                          <p>วันที่ ........................................</p>
                        </div>
                        <div className="text-center">
                          <p>ลงชื่อ .......................................... ผู้จ่ายเงิน</p>
                          <p>( .......................................... )</p>
                          <p>วันที่ ........................................</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border border-slate-400">
                      <div className="flex justify-between items-center p-2 text-[9px]">
                        <p>ลงชื่อ ............................ ผู้บันทึกบัญชี วันที่ ............................</p>
                        <div className="text-right">
                          <p>พลิกด้านหลัง</p>
                        </div>
                      </div>
                      <div className="text-right pr-2 pb-1">
                        <p className="text-[8px] text-slate-500">ฉบับปรับปรุงเริ่มใช้ 1 ต.ค. 2565</p>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 flex justify-end gap-3">
              <Button 
                variant="secondary" 
                onClick={() => setIsFullscreenPreview(false)}
              >
                <i className="fa-solid fa-times mr-2"></i>
                ปิด
              </Button>
              <Button variant="primary">
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