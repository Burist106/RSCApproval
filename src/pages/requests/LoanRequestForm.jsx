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
  
  // วัตถุประสงค์
  purpose: '',
  
  // กิจกรรม
  activities: [
    { id: 1, name: '', amount: 0, note: '' }
  ],
  
  // ภายใต้โครงการ
  projectName: '',
  
  // ระยะเวลาและวันที่
  startDate: '',
  endDate: '',
  returnDate: '',
  
  // ประเภทเอกสาร/เงินยืม
  docType: 'FD01',
  fdNumber: '',
  planCode: '',
  fundCode: '',
  
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

  // Calculate total
  const totalAmount = useMemo(() => {
    return formData.activities.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
  }, [formData.activities])

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
    // Simplified for demo - would need full implementation for larger numbers
    return num.toLocaleString() + ' บาทถ้วน'
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
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Form Section */}
        <div className="xl:col-span-3 space-y-6">
          
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

          {/* Section 3: Purpose & Activities */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">3</span>
              วัตถุประสงค์และกิจกรรม
            </h2>
            
            <div className="space-y-4">
              <Textarea
                label="มีความประสงค์ขอยืมเงินจาก มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี เพื่อใช้ในกิจกรรมของส่วนงาน ดังนี้"
                value={formData.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                placeholder="ระบุวัตถุประสงค์การยืมเงิน..."
                rows={2}
              />

              {/* Activities Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">
                    <i className="fa-solid fa-list-check mr-2 text-slate-400"></i>
                    ชื่อกิจกรรม
                  </label>
                  <Button variant="outline" size="sm" onClick={handleAddActivity}>
                    <i className="fa-solid fa-plus"></i>
                    เพิ่มกิจกรรม
                  </Button>
                </div>
                
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-50">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-slate-700 w-16">#</th>
                        <th className="px-3 py-2 text-left font-medium text-slate-700">ชื่อกิจกรรม</th>
                        <th className="px-3 py-2 text-right font-medium text-slate-700 w-40">จำนวนเงินรวม (บาท)</th>
                        <th className="px-3 py-2 text-center font-medium text-slate-700 w-24">สหกรณ์</th>
                        <th className="px-3 py-2 w-12"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {formData.activities.map((activity, index) => (
                        <tr key={activity.id} className="group hover:bg-slate-50/50">
                          <td className="px-3 py-2 text-slate-400">{index + 1}</td>
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={activity.name}
                              onChange={(e) => handleActivityChange(index, 'name', e.target.value)}
                              placeholder="ระบุชื่อกิจกรรม..."
                              className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={activity.amount}
                              onChange={(e) => handleActivityChange(index, 'amount', e.target.value)}
                              placeholder="0"
                              className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-right"
                            />
                          </td>
                          <td className="px-2 py-2 text-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-blue-500 rounded border-slate-300 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveActivity(index)}
                              className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-full hover:bg-red-100 flex items-center justify-center text-slate-400 hover:text-red-500 transition mx-auto"
                              disabled={formData.activities.length === 1}
                            >
                              <i className="fa-solid fa-trash text-xs"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-blue-50">
                      <tr>
                        <td colSpan={2} className="px-3 py-2 font-bold text-slate-800 text-right">
                          รวมทั้งสิ้น
                        </td>
                        <td className="px-3 py-2 text-right font-bold text-blue-600 text-lg">
                          {totalAmount.toLocaleString()}
                        </td>
                        <td colSpan={2} className="px-3 py-2 text-sm text-slate-500">
                          บาท
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <Input
                label="ภายใต้โครงการ"
                value={formData.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
                placeholder="ชื่อโครงการ (ถ้ามี)"
              />

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

          {/* Section 4: Document Type */}
          <Card>
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm">4</span>
              ตัวอักษร/ตัวเลขระบุจำนวนเงิน
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="ประเภทเอกสาร"
                  options={loanDocTypes}
                  value={formData.docType}
                  onChange={(e) => handleChange('docType', e.target.value)}
                />
                <Input
                  label="หน่วยงาน (FD01)"
                  value={formData.fdNumber}
                  onChange={(e) => handleChange('fdNumber', e.target.value)}
                  placeholder="รหัสหน่วยงาน FD01"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="รหัสแผนงาน"
                  value={formData.planCode}
                  onChange={(e) => handleChange('planCode', e.target.value)}
                  placeholder="รหัสแผนงาน"
                />
                <Input
                  label="รหัสแหล่งเงิน"
                  value={formData.fundCode}
                  onChange={(e) => handleChange('fundCode', e.target.value)}
                  placeholder="รหัสแหล่งเงิน"
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
        <div className="xl:col-span-2">
          <div className="sticky top-4">
            <Card className="bg-slate-100 border-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  <i className="fa-solid fa-eye mr-2"></i>
                  ตัวอย่างเอกสาร FO-TO-04
                </h3>
                <Button variant="ghost" size="sm">
                  <i className="fa-solid fa-expand"></i>
                </Button>
              </div>
              
              {/* Document Preview - FO-TO-04 Style */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {/* Document Content */}
                <div className="max-h-[700px] overflow-y-auto">
                  <div className="p-5 text-[11px] leading-relaxed font-sarabun">
                    
                    {/* Header with Logo */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src="https://www.kmutt.ac.th/wp-content/uploads/2020/09/KMUTT_CI_Primary_Logo-Full.png" 
                          alt="KMUTT Logo" 
                          className="w-14 h-14 object-contain"
                        />
                        <div>
                          <p className="font-bold text-sm">มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี</p>
                          <p className="font-bold text-sm">สัญญาการยืมเงิน</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="border border-slate-400 px-3 py-1 text-xs font-bold">FO-TO-04</div>
                        <p className="mt-2 font-bold">กองคลัง</p>
                        <p className="text-slate-600">เลขที่รับ</p>
                      </div>
                    </div>

                    {/* To Line */}
                    <div className="flex justify-between border-b border-slate-300 pb-2 mb-2">
                      <p><span className="font-bold">เรียน</span> ........<span className="font-semibold">ผอ.สรบ.</span>........</p>
                      <p className="text-slate-600">เลขที่รับ</p>
                    </div>

                    {/* Borrower Info - Yellow Background */}
                    <div className="bg-amber-100 border border-amber-300 p-2 mb-2 text-[10px]">
                      <p>
                        <span className="font-bold">ข้าพเจ้า</span>...{formData.borrowerTitle}นำหน้า ชื่อ นามสกุล ผู้ยืม...<span className="font-bold">ตำแหน่ง</span>...ตำแหน่งในองค์กร(หัก)... <span className="font-bold">คณะ/สำนัก/กอง</span>...ชื่อหน่วยงานประธานคณะ/สำนัก (สรบ.)...
                      </p>
                      <p className="mt-1">
                        <span className="font-bold">ภาควิชา/สาขาวิชา/หน่วยงาน</span>........ชื่อหน่วยงานย่อย..........({formData.subUnit || 'RSC'}).....วันที่.........
                      </p>
                    </div>

                    {/* Purpose */}
                    <p className="mb-2">มีความประสงค์ขอยืมเงินจาก มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี เพื่อใช้ในกิจกรรมของส่วนงาน ดังนี้</p>

                    {/* Activities Table */}
                    <table className="w-full border-collapse border border-slate-400 text-[10px] mb-2">
                      <thead>
                        <tr className="bg-amber-100">
                          <th className="border border-slate-400 px-2 py-1 text-left">ชื่อกิจกรรม</th>
                          <th className="border border-slate-400 px-2 py-1 text-right w-28">จำนวนเงินรวม บาท</th>
                          <th className="border border-slate-400 px-2 py-1 text-center w-16">สหกรณ์</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.activities.map((act, idx) => (
                          <tr key={idx}>
                            <td className="border border-slate-400 px-2 py-1">{act.name || '.....................'}</td>
                            <td className="border border-slate-400 px-2 py-1 text-right">{act.amount ? parseFloat(act.amount).toLocaleString() : ''}</td>
                            <td className="border border-slate-400 px-2 py-1 text-center"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Project */}
                    <p className="mb-1"><span className="font-bold">ภายใต้โครงการ</span></p>
                    <p className="text-[9px] text-slate-500 mb-2">** ระบุระยะเวลาดำเนินงาน และวันที่ขอรับเงิน</p>

                    {/* Document Type Section - Yellow Background */}
                    <div className="bg-amber-100 border border-amber-300 p-2 mb-2 text-[10px]">
                      <p className="font-bold mb-1">ตัวอักษร ตัวเลขระบุจำนวนเงิน</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <p>○ เงินยืมอุดหนุนโครงการ บันทึกรับจ่ายเงิน หน่วยงาน (FD01)...........................รหัสหน่วยงาน (FD01)...........................</p>
                        <p></p>
                        <p>○ แผนงาน (FD02)...........................รหัสแผนงาน</p>
                        <p></p>
                        <p>○ แหล่งเงิน (FD05)...........................รหัสแหล่งเงิน</p>
                        <p></p>
                      </div>
                    </div>

                    {/* Amount Summary */}
                    <div className="bg-amber-100 border border-amber-300 p-2 mb-2 text-[10px] flex justify-between">
                      <p><span className="font-bold">บาท</span> จำนวนเงินรวม........<span className="font-bold text-blue-600">{totalAmount.toLocaleString()}</span>........บาท</p>
                    </div>

                    {/* Receipt & Declaration */}
                    <p className="text-[10px] mb-2">ตามใบเสร็จรับเงินเลขที่.............เล่มที่.............</p>
                    
                    <p className="text-[10px] mb-2">
                      เมื่อข้าพเจ้าได้รับเงินยืมตามสัญญานี้แล้ว ข้าพเจ้าจะเร่งดำเนินการตามวัตถุประสงค์ และจะจัดรับส่งหนังสือพร้อมยอดส่งคืนเงินสดส่วนที่เหลือ (ถ้ามี)
                    </p>
                    <p className="text-[10px] mb-2">ภายใน..........วัน (โปรดระบุเกณฑ์ที่ใช้ในการกำหนด)</p>
                    
                    <p className="text-[9px] text-slate-600 mb-3">
                      กรณีเป็นการยืมเงินตามหลักเกณฑ์เงินยืมโดยให้หน่วยงานเป็นผู้กำหนดการเงินปฏิบัติตามหลักเกณฑ์ ตามประกาศมหาวิทยาลัยฯ<br/>
                      เรื่อง การยืมเงินมหาวิทยาลัย พ.ศ.2551 ตามหมวดที่ 5
                    </p>

                    {/* Approval Section - 3 Columns */}
                    <table className="w-full border-collapse border border-slate-400 text-[9px] mb-3">
                      <thead>
                        <tr className="bg-amber-100">
                          <th className="border border-slate-400 px-2 py-1 text-center">เห็นสมควรอนุมัติ</th>
                          <th className="border border-slate-400 px-2 py-1 text-center">อนุมัติ/เห็นสมควรอนุมัติ</th>
                          <th className="border border-slate-400 px-2 py-1 text-center">อนุมัติ</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-400 px-2 py-3 text-center align-top">
                            <p>ลงชื่อ...E-sign... ผู้ยืมเงิน</p>
                            <p className="text-slate-500">(ลายเซ็น ช. มจธ.ศปรศ.)</p>
                            <p>วันที่...วันที่เสนอขอยืม e-sign</p>
                          </td>
                          <td className="border border-slate-400 px-2 py-3 text-center align-top">
                            <p>ลงชื่อ...E-sign (ผอ.ศูนย์)...</p>
                            <p className="text-slate-500">(ช. บุญจราศ ผอส ผสส และ สกส)</p>
                            <p>วันที่...วันที่เสนอขอยืม e-sign...</p>
                          </td>
                          <td className="border border-slate-400 px-2 py-3 text-center align-top">
                            <p>ลงชื่อ...Sign ผอ.สรบ....</p>
                            <p className="text-slate-500">(...สำเนาถูก ช. มจศศก. ของ สรบ....)</p>
                            <p>วันที่...วันที่อนุมัติขอยืม(สกเอง)...</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Proxy Section */}
                    <div className="border border-slate-400 p-2 mb-3 text-[10px]">
                      <p className="font-bold text-center mb-2">การมอบฉันทะ</p>
                      <p>(กรณีผู้ยืมเงินไม่สามารถมารับเงินได้ จึงมอบให้ นาย/นาง/นางสาว)</p>
                      <p className="mt-2">ลงชื่อ.........................................ผู้มอบฉันทะ ลงชื่อ.........................................ผู้รับมอบฉันทะ</p>
                      <p>วันที่.............(...........................)............... วันที่.............(...........................)...............</p>
                    </div>

                    {/* Treasury Section */}
                    <div className="border-t-2 border-slate-600 pt-2 mb-3">
                      <p className="font-bold text-center mb-2">ส่วนของกองคลัง</p>
                      <div className="flex gap-4 text-[10px] mb-2">
                        <p>○ จ่ายได้ตามที่อนุมัติแล้วข้างต้น</p>
                        <p>○ สัญญายืมเงินซ้ำจ่ายด้วย</p>
                        <p>สัญญายืมเลขที่...............................</p>
                      </div>
                      <div className="flex gap-4 text-[10px]">
                        <p>○ เงินสด</p>
                        <p>○ เช็คเลขที่</p>
                        <p>ลงวันที่...............................</p>
                      </div>
                    </div>

                    {/* Treasury Signatures */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[9px] mb-3">
                      <div>
                        <p>ลงชื่อ........................</p>
                        <p className="font-bold">ผู้อำนวยการกองคลัง</p>
                        <p>วันที่</p>
                      </div>
                      <div>
                        <p>ลงชื่อ........................</p>
                        <p className="font-bold">ผู้จัดทำเช็ค</p>
                        <p>วันที่</p>
                      </div>
                      <div>
                        <p>ลงชื่อ........................</p>
                        <p className="font-bold">ผู้ตรวจ</p>
                        <p></p>
                      </div>
                    </div>

                    {/* Receiver Confirmation */}
                    <div className="border-t border-slate-400 pt-2 mb-2 text-[10px]">
                      <p className="font-bold">ข้าพเจ้าได้รับเงินยืมจำนวน...........<span className="text-blue-600">{totalAmount.toLocaleString()}</span>...........บาท</p>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="text-center">
                          <p>ลงชื่อ........................</p>
                          <p>ผู้รับเงิน</p>
                          <p>วันที่</p>
                        </div>
                        <div className="text-center">
                          <p>ลงชื่อ........................</p>
                          <p>ผู้จ่ายเงิน</p>
                          <p>วันที่</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-400 pt-2 text-[9px]">
                      <p>ลงชื่อ........................ผู้บันทึกบัญชี วันที่........................</p>
                      <p className="text-right text-slate-500 mt-1">พลิกด้านหลัง</p>
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
