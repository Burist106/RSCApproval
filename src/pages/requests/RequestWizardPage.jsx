import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, Card, Input, Select, Textarea, Stepper, Divider } from '../../components'

/**
 * RequestWizardPage
 * Multi-step form wizard for creating requests
 * Supports: project, loan, car, travel
 */

// Request type configurations
const requestConfigs = {
  project: {
    title: 'ขออนุมัติโครงการ',
    icon: 'fa-solid fa-file-contract',
    color: 'primary',
    steps: [
      { title: 'ข้อมูลโครงการ' },
      { title: 'งบประมาณ' },
      { title: 'ตรวจสอบ' },
    ],
  },
  loan: {
    title: 'ยืมเงิน (FOTO-04)',
    icon: 'fa-solid fa-money-bill-transfer',
    color: 'blue',
    steps: [
      { title: 'รายละเอียด' },
      { title: 'รายการค่าใช้จ่าย' },
      { title: 'ตรวจสอบ' },
    ],
  },
  car: {
    title: 'ขอใช้รถยนต์ส่วนตัว',
    icon: 'fa-solid fa-car',
    color: 'purple',
    steps: [
      { title: 'ข้อมูลการเดินทาง' },
      { title: 'รายละเอียดรถ' },
      { title: 'ตรวจสอบ' },
    ],
  },
  travel: {
    title: 'เดินทางราชการ/ประชุม',
    icon: 'fa-solid fa-plane-departure',
    color: 'teal',
    steps: [
      { title: 'ข้อมูลการเดินทาง' },
      { title: 'ค่าใช้จ่าย' },
      { title: 'ตรวจสอบ' },
    ],
  },
}

export default function RequestWizardPage() {
  const { type } = useParams()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    project: '',
    startDate: '',
    endDate: '',
    amount: '',
    destination: '',
    purpose: '',
  })

  const config = requestConfigs[type] || requestConfigs.project

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < config.steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      navigate('/requests/new')
    }
  }

  const handleSubmit = () => {
    // TODO: Submit form data
    console.log('Submit:', formData)
    alert('ส่งคำขอเรียบร้อยแล้ว!')
    navigate('/requests')
  }

  const handleSaveDraft = () => {
    // TODO: Save draft
    console.log('Save draft:', formData)
    alert('บันทึกฉบับร่างเรียบร้อยแล้ว!')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-primary-500 transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{config.title}</h1>
          <p className="text-sm text-slate-500">กรอกข้อมูลให้ครบถ้วน</p>
        </div>
      </div>

      {/* Stepper */}
      <Card className="mb-6">
        <Stepper steps={config.steps} currentStep={currentStep} />
      </Card>

      {/* Form Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <Card className="lg:col-span-3">
          <h2 className="text-lg font-bold text-slate-800 mb-6">
            {config.steps[currentStep - 1].title}
          </h2>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Input
                label="เรื่อง"
                placeholder="ระบุชื่อเรื่องของคำขอ"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                required
              />
              
              {type === 'project' && (
                <Select
                  label="โครงการ"
                  options={[
                    { value: 'p1', label: 'โครงการหลวง A' },
                    { value: 'p2', label: 'โครงการหลวง B' },
                    { value: 'p3', label: 'โครงการพระราชดำริ C' },
                  ]}
                  value={formData.project}
                  onChange={(e) => handleChange('project', e.target.value)}
                />
              )}

              {(type === 'travel' || type === 'car') && (
                <>
                  <Input
                    label="สถานที่ปลายทาง"
                    placeholder="ระบุสถานที่"
                    icon="fa-solid fa-location-dot"
                    value={formData.destination}
                    onChange={(e) => handleChange('destination', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                </>
              )}

              <Textarea
                label="รายละเอียด/วัตถุประสงค์"
                placeholder="อธิบายรายละเอียดเพิ่มเติม..."
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
          )}

          {/* Step 2: Budget/Expenses */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {type === 'car' ? (
                <>
                  <Input
                    label="ทะเบียนรถ"
                    placeholder="เช่น กข 1234 กรุงเทพ"
                    value={formData.carPlate}
                    onChange={(e) => handleChange('carPlate', e.target.value)}
                  />
                  <Select
                    label="ประเภทรถ"
                    options={[
                      { value: 'sedan', label: 'รถเก๋ง' },
                      { value: 'pickup', label: 'รถกระบะ' },
                      { value: 'suv', label: 'รถ SUV' },
                    ]}
                  />
                  <Input
                    label="ระยะทาง (กม.)"
                    type="number"
                    placeholder="0"
                  />
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium">
                      <i className="fa-solid fa-calculator mr-2"></i>
                      ค่าชดเชยน้ำมันโดยประมาณ: <span className="font-bold">0 บาท</span>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-slate-700">รายการค่าใช้จ่าย</h3>
                    <Button variant="outline" size="sm">
                      <i className="fa-solid fa-plus"></i> เพิ่มรายการ
                    </Button>
                  </div>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-slate-600">รายการ</th>
                          <th className="px-4 py-3 text-right font-medium text-slate-600">จำนวนเงิน</th>
                          <th className="px-4 py-3 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="px-4 py-3 text-slate-600">ค่าเดินทาง</td>
                          <td className="px-4 py-3 text-right font-medium">5,000 บาท</td>
                          <td className="px-4 py-3 text-center">
                            <button className="text-slate-400 hover:text-red-500">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-slate-600">ค่าที่พัก</td>
                          <td className="px-4 py-3 text-right font-medium">3,000 บาท</td>
                          <td className="px-4 py-3 text-center">
                            <button className="text-slate-400 hover:text-red-500">
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                      <tfoot className="bg-slate-50">
                        <tr>
                          <td className="px-4 py-3 font-bold text-slate-800">รวมทั้งสิ้น</td>
                          <td className="px-4 py-3 text-right font-bold text-primary-600">8,000 บาท</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-green-500 text-xl"></i>
                  <div>
                    <p className="font-medium text-green-800">พร้อมส่งคำขอ</p>
                    <p className="text-sm text-green-600">กรุณาตรวจสอบข้อมูลก่อนกดส่ง</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">เรื่อง</span>
                  <span className="font-medium text-slate-800">{formData.subject || '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">รายละเอียด</span>
                  <span className="font-medium text-slate-800">{formData.description || '-'}</span>
                </div>
                {formData.destination && (
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">สถานที่</span>
                    <span className="font-medium text-slate-800">{formData.destination}</span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">จำนวนเงิน</span>
                  <span className="font-bold text-primary-600">8,000 บาท</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <Divider className="my-6" />
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleSaveDraft}>
              <i className="fa-solid fa-floppy-disk"></i>
              บันทึกฉบับร่าง
            </Button>
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button variant="outline" onClick={handleBack}>
                  <i className="fa-solid fa-arrow-left"></i>
                  ย้อนกลับ
                </Button>
              )}
              {currentStep < config.steps.length ? (
                <Button variant="primary" onClick={handleNext}>
                  ถัดไป
                  <i className="fa-solid fa-arrow-right"></i>
                </Button>
              ) : (
                <Button variant="primary" onClick={handleSubmit}>
                  <i className="fa-solid fa-paper-plane"></i>
                  ส่งคำขอ
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Preview */}
        <Card className="lg:col-span-2 bg-slate-100 border-none">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">
            ตัวอย่างเอกสาร
          </h3>
          <div className="bg-white rounded-xl p-6 shadow-sm min-h-[400px]">
            <div className="text-center mb-6">
              <p className="text-xs text-slate-400 mb-2">บันทึกข้อความ</p>
              <h4 className="font-bold text-slate-800">
                {formData.subject || 'เรื่อง...'}
              </h4>
            </div>
            <Divider className="my-4" />
            <p className="text-sm text-slate-600 leading-relaxed">
              {formData.description || 'รายละเอียด...'}
            </p>
            {formData.destination && (
              <p className="text-sm text-slate-600 mt-4">
                <strong>สถานที่:</strong> {formData.destination}
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
