import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import { useWorkflow, WORKFLOW_PATHS, DECISION_POINTS } from '../../contexts/WorkflowContext'
import { useAuth } from '../../contexts'
import { Button, Card, Divider, Stepper } from '../../components'

// Import the actual form components
import ProjectRequestForm from './ProjectRequestForm'
import LoanRequestForm from './LoanRequestForm'
import CarRequestForm from './CarRequestForm'
import ConferenceRequestForm from './ConferenceRequestForm'

/**
 * RequestWorkflowPage
 * Orchestrates the entire request workflow based on flowchart paths
 * Handles navigation between forms, decision points, and bundle preview
 */

// Form component mapping
const FORM_COMPONENTS = {
  project: ProjectRequestForm,
  loan: LoanRequestForm,
  car: CarRequestForm,
  conference: ConferenceRequestForm,
}

// Color mapping for visual styling
const pathColors = {
  primary: {
    bg: 'bg-primary-50',
    border: 'border-primary-200',
    text: 'text-primary-700',
    icon: 'text-primary-500',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    icon: 'text-blue-500',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    icon: 'text-purple-500',
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    text: 'text-teal-700',
    icon: 'text-teal-500',
  },
}

export default function RequestWorkflowPage() {
  const { pathId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const {
    currentPath,
    currentStepIndex,
    completedSteps,
    skippedSteps,
    bundleData,
    decisions,
    initWorkflow,
    getCurrentStep,
    saveFormData,
    saveDecision,
    goToNextStep,
    goToPreviousStep,
    getBundleDocuments,
    isWorkflowComplete,
    resetWorkflow,
    getProgress,
  } = useWorkflow()
  
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Initialize workflow when path changes
  useEffect(() => {
    if (pathId && WORKFLOW_PATHS[pathId]) {
      initWorkflow(pathId)
      setIsInitialized(true)
    } else {
      // Invalid path, redirect to hub
      navigate('/requests/new')
    }
  }, [pathId, initWorkflow, navigate])
  
  // Get current step info
  const currentStep = getCurrentStep()
  const pathConfig = WORKFLOW_PATHS[pathId]
  const colors = pathConfig ? pathColors[pathConfig.color] : pathColors.primary
  
  // Handle form submission from child forms
  const handleFormComplete = (formType, formData) => {
    saveFormData(formType, formData)
    goToNextStep()
  }
  
  // Handle decision selection
  const handleDecisionSelect = (decisionId, answer) => {
    saveDecision(decisionId, answer)
    goToNextStep(answer)
  }
  
  // Handle back navigation
  const handleBack = () => {
    if (currentStepIndex === 0) {
      // First step - go back to request hub
      resetWorkflow()
      navigate('/requests/new')
    } else {
      goToPreviousStep()
    }
  }
  
  // Handle workflow completion - submit all documents
  const handleSubmitBundle = () => {
    const documents = getBundleDocuments()
    console.log('Submitting bundle:', documents)
    
    // TODO: API call to submit all documents
    alert(`ส่งคำขอสำเร็จ! จำนวน ${documents.length} เอกสาร`)
    resetWorkflow()
    navigate('/requests')
  }
  
  // Render loading state
  if (!isInitialized || !currentPath || !currentStep) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-slate-300 mb-4"></i>
          <p className="text-slate-500">กำลังโหลด...</p>
        </div>
      </div>
    )
  }
  
  // Calculate steps for stepper display (exclude skipped steps)
  const visibleSteps = currentPath.steps
    .filter(step => !skippedSteps.includes(step.id))
    .map((step, index) => ({
      title: step.label,
      completed: completedSteps.includes(step.id),
    }))
  
  const currentVisibleIndex = currentPath.steps
    .filter(step => !skippedSteps.includes(step.id))
    .findIndex(step => step.id === currentStep.id) + 1
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-primary-500 transition"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
              <i className={`${currentPath.icon} ${colors.icon}`}></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{currentPath.name}</h1>
              <p className="text-sm text-slate-500">{currentPath.description}</p>
            </div>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="text-right">
          <p className="text-sm text-slate-500">ความคืบหน้า</p>
          <p className="text-lg font-bold text-primary-600">{getProgress()}%</p>
        </div>
      </div>

      {/* Stepper */}
      <Card className="mb-6">
        <Stepper steps={visibleSteps} currentStep={currentVisibleIndex} />
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Decision Point */}
        {currentStep.type === 'decision' && (
          <DecisionStep
            stepId={currentStep.id}
            onSelect={(answer) => handleDecisionSelect(currentStep.id, answer)}
            onBack={handleBack}
            colors={colors}
          />
        )}
        
        {/* Form Step */}
        {currentStep.form && (
          <FormStep
            formType={currentStep.form}
            initialData={bundleData[currentStep.form]}
            onComplete={(data) => handleFormComplete(currentStep.form, data)}
            onBack={handleBack}
            pathId={pathId}
            isEmbedded
          />
        )}
        
        {/* Attachments Step */}
        {currentStep.type === 'attachments' && (
          <AttachmentsStep
            initialData={bundleData.attachments}
            onComplete={(data) => {
              saveFormData('attachments', data)
              goToNextStep()
            }}
            onBack={handleBack}
            colors={colors}
          />
        )}
        
        {/* Bundle Preview */}
        {currentStep.type === 'preview' && (
          <BundlePreviewStep
            documents={getBundleDocuments()}
            onSubmit={handleSubmitBundle}
            onBack={handleBack}
            pathConfig={currentPath}
            colors={colors}
          />
        )}
      </div>
    </div>
  )
}

/**
 * DecisionStep Component
 * Renders a decision point with options
 */
function DecisionStep({ stepId, onSelect, onBack, colors }) {
  const decision = DECISION_POINTS[stepId]
  
  if (!decision) {
    return <div>Decision not found</div>
  }
  
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
          <i className={`fa-solid fa-circle-question text-2xl ${colors.icon}`}></i>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">{decision.question}</h2>
        {decision.description && (
          <p className="text-slate-500">{decision.description}</p>
        )}
      </div>
      
      <div className="space-y-3">
        {decision.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onSelect(option.value)}
            className="w-full p-4 rounded-xl border-2 border-slate-200 hover:border-primary-400 hover:bg-primary-50 transition-all flex items-center gap-4 group"
          >
            {option.icon && (
              <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                <i className={`${option.icon} text-xl text-slate-500 group-hover:text-primary-600`}></i>
              </div>
            )}
            <span className="flex-1 text-left font-medium text-slate-700 group-hover:text-primary-700">
              {option.label}
            </span>
            <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-primary-500"></i>
          </button>
        ))}
      </div>
      
      <Divider className="my-6" />
      
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i>
          ย้อนกลับ
        </Button>
      </div>
    </Card>
  )
}

/**
 * FormStep Component
 * Renders the appropriate form based on form type
 */
function FormStep({ formType, initialData, onComplete, onBack, pathId, isEmbedded }) {
  const FormComponent = FORM_COMPONENTS[formType]
  
  if (!FormComponent) {
    return <div>Form not found: {formType}</div>
  }
  
  // Pass workflow mode props to the form
  return (
    <FormComponent
      isEmbedded={isEmbedded}
      initialData={initialData}
      onComplete={onComplete}
      onBack={onBack}
      workflowPath={pathId}
    />
  )
}

/**
 * AttachmentsStep Component
 * Allows uploading additional attachments (expense form, schedule)
 */
function AttachmentsStep({ initialData, onComplete, onBack, colors }) {
  const [attachments, setAttachments] = useState({
    expenseForm: initialData?.expenseForm || null,
    scheduleForm: initialData?.scheduleForm || null,
  })
  const [errors, setErrors] = useState({})
  
  const handleFileChange = (field) => (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [field]: 'ไฟล์ไม่รองรับ กรุณาอัปโหลดไฟล์ PDF, Word หรือรูปภาพ'
        }))
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [field]: 'ไฟล์ใหญ่เกินไป (สูงสุด 10MB)'
        }))
        return
      }
      
      setErrors(prev => ({ ...prev, [field]: null }))
      setAttachments(prev => ({
        ...prev,
        [field]: {
          file,
          name: file.name,
          size: file.size,
          type: file.type,
        }
      }))
    }
  }
  
  const handleRemoveFile = (field) => () => {
    setAttachments(prev => ({ ...prev, [field]: null }))
  }
  
  const handleSubmit = () => {
    onComplete(attachments)
  }
  
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }
  
  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
          <i className={`fa-solid fa-paperclip text-2xl ${colors.icon}`}></i>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">แนบเอกสารเพิ่มเติม</h2>
        <p className="text-slate-500">อัปโหลดไฟล์แบบฟอร์มประมาณค่าใช้จ่าย และรายละเอียดกำหนดการ (ถ้ามี)</p>
      </div>
      
      <div className="space-y-6">
        {/* Expense Form Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <i className="fa-solid fa-calculator mr-2 text-orange-500"></i>
            แบบฟอร์มประมาณค่าใช้จ่าย
          </label>
          {attachments.expenseForm ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <i className="fa-solid fa-file-check text-green-600"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{attachments.expenseForm.name}</p>
                <p className="text-sm text-slate-500">{formatFileSize(attachments.expenseForm.size)}</p>
              </div>
              <button
                onClick={handleRemoveFile('expenseForm')}
                className="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center text-red-500 transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition">
              <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 mb-2"></i>
              <span className="text-slate-600 font-medium">คลิกเพื่ออัปโหลดไฟล์</span>
              <span className="text-xs text-slate-400 mt-1">PDF, Word, รูปภาพ (สูงสุด 10MB)</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange('expenseForm')}
                className="hidden"
              />
            </label>
          )}
          {errors.expenseForm && (
            <p className="text-sm text-red-500 mt-2">{errors.expenseForm}</p>
          )}
        </div>
        
        {/* Schedule Form Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <i className="fa-solid fa-calendar-days mr-2 text-blue-500"></i>
            รายละเอียดกำหนดการ
          </label>
          {attachments.scheduleForm ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <i className="fa-solid fa-file-check text-green-600"></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">{attachments.scheduleForm.name}</p>
                <p className="text-sm text-slate-500">{formatFileSize(attachments.scheduleForm.size)}</p>
              </div>
              <button
                onClick={handleRemoveFile('scheduleForm')}
                className="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center text-red-500 transition"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition">
              <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-400 mb-2"></i>
              <span className="text-slate-600 font-medium">คลิกเพื่ออัปโหลดไฟล์</span>
              <span className="text-xs text-slate-400 mt-1">PDF, Word, รูปภาพ (สูงสุด 10MB)</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange('scheduleForm')}
                className="hidden"
              />
            </label>
          )}
          {errors.scheduleForm && (
            <p className="text-sm text-red-500 mt-2">{errors.scheduleForm}</p>
          )}
        </div>
      </div>
      
      <Divider className="my-6" />
      
      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i>
          ย้อนกลับ
        </Button>
        <Button onClick={handleSubmit}>
          ดำเนินการต่อ
          <i className="fa-solid fa-arrow-right"></i>
        </Button>
      </div>
    </Card>
  )
}

/**
 * BundlePreviewStep Component
 * Shows all documents in the bundle for final review
 */
function BundlePreviewStep({ documents, onSubmit, onBack, pathConfig, colors }) {
  const [activeTab, setActiveTab] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Document type icons
  const docIcons = {
    project: 'fa-solid fa-file-contract',
    conference: 'fa-solid fa-users-rectangle',
    car: 'fa-solid fa-car',
    loan: 'fa-solid fa-money-bill-transfer',
    travel: 'fa-solid fa-plane-departure',
    'expense-attachment': 'fa-solid fa-calculator',
    'schedule-attachment': 'fa-solid fa-calendar-days',
  }
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    onSubmit()
  }
  
  if (documents.length === 0) {
    return (
      <Card className="text-center py-12">
        <i className="fa-solid fa-folder-open text-5xl text-slate-300 mb-4"></i>
        <h3 className="text-lg font-bold text-slate-600 mb-2">ไม่มีเอกสารในชุด</h3>
        <p className="text-slate-500 mb-6">กรุณากรอกข้อมูลในขั้นตอนก่อนหน้า</p>
        <Button variant="outline" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i>
          ย้อนกลับ
        </Button>
      </Card>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Bundle Summary */}
      <Card className={`${colors.bg} border ${colors.border}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
            <i className={`${pathConfig.icon} text-2xl ${colors.icon}`}></i>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800">ชุดเอกสารพร้อมส่ง</h2>
            <p className="text-slate-600">
              {pathConfig.name} • {documents.length} เอกสาร
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">เลขที่อ้างอิง</p>
            <p className="font-mono font-bold text-slate-800">
              REQ-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 10000)).padStart(4, '0')}
            </p>
          </div>
        </div>
      </Card>

      {/* Document Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Document List */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            เอกสารในชุด
          </h3>
          {documents.map((doc, index) => (
            <button
              key={doc.type}
              onClick={() => setActiveTab(index)}
              className={`
                w-full p-3 rounded-xl border-2 text-left transition-all flex items-center gap-3
                ${activeTab === index 
                  ? 'border-primary-400 bg-primary-50' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
                }
              `}
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${activeTab === index ? 'bg-primary-100' : 'bg-slate-100'}
              `}>
                <i className={`${docIcons[doc.type]} ${activeTab === index ? 'text-primary-600' : 'text-slate-500'}`}></i>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${activeTab === index ? 'text-primary-700' : 'text-slate-700'}`}>
                  {doc.label}
                </p>
                <p className="text-xs text-slate-500">
                  {doc.type.toUpperCase()}-REQ
                </p>
              </div>
              {activeTab === index && (
                <i className="fa-solid fa-chevron-right text-primary-500"></i>
              )}
            </button>
          ))}
        </div>

        {/* Document Preview */}
        <Card className="lg:col-span-3 bg-slate-100 border-none overflow-auto max-h-[calc(100vh-200px)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              ตัวอย่างเอกสาร
            </h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <i className="fa-solid fa-download"></i>
                ดาวน์โหลด
              </Button>
              <Button variant="outline" size="sm">
                <i className="fa-solid fa-print"></i>
                พิมพ์
              </Button>
            </div>
          </div>
          
          {/* Document Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="max-h-[600px] overflow-y-auto">
              <div className="p-6">
                {documents[activeTab] && (
                  <DocumentPreview document={documents[activeTab]} />
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <Card className="sticky bottom-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <i className="fa-solid fa-arrow-left"></i>
            ย้อนกลับแก้ไข
          </Button>
          
          <div className="flex gap-3">
            <Button variant="outline">
              <i className="fa-solid fa-floppy-disk"></i>
              บันทึกฉบับร่าง
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  ส่งคำขอทั้งหมด ({documents.length} เอกสาร)
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

/**
 * DocumentPreview Component
 * Renders a preview of a specific document
 */
function DocumentPreview({ document }) {
  const { type, label, data } = document
  
  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  
  // Format currency
  const formatCurrency = (amount) => {
    return (parseFloat(amount) || 0).toLocaleString('th-TH')
  }
  
  // Render based on document type
  switch (type) {
    case 'project':
      return (
        <div className="text-sm">
          <div className="text-center mb-6">
            <p className="text-xs text-slate-400 mb-1">บันทึกข้อความ</p>
            <h3 className="font-bold text-lg">ขออนุมัติดำเนินโครงการ</h3>
            <p className="text-slate-600">{data?.projectName || data?.subject || '-'}</p>
          </div>
          <Divider className="my-4" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">ชื่อโครงการ:</span>
              <span className="font-medium">{data?.projectName || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">งบประมาณ:</span>
              <span className="font-medium">{formatCurrency(data?.totalBudget)} บาท</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ระยะเวลา:</span>
              <span className="font-medium">{formatDate(data?.startDate)} - {formatDate(data?.endDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">แหล่งทุน:</span>
              <span className="font-medium">{data?.fundingSource || '-'}</span>
            </div>
          </div>
        </div>
      )
      
    case 'conference':
      return (
        <div className="text-sm">
          <div className="text-center mb-6">
            <p className="text-xs text-slate-400 mb-1">บันทึกข้อความ</p>
            <h3 className="font-bold text-lg">ขออนุมัติเข้าร่วมประชุม/เดินทางราชการ</h3>
            <p className="text-slate-600">{data?.eventName || '-'}</p>
          </div>
          <Divider className="my-4" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">ชื่องาน/ประชุม:</span>
              <span className="font-medium">{data?.eventName || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">สถานที่:</span>
              <span className="font-medium">{data?.eventLocation || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">วันที่เดินทาง:</span>
              <span className="font-medium">{formatDate(data?.travelStartDate)} - {formatDate(data?.travelEndDate)}</span>
            </div>
            <Divider className="my-3" />
            <p className="font-bold">สรุปค่าใช้จ่าย:</p>
            <table className="w-full text-xs">
              <tbody>
                <tr>
                  <td className="py-1">ค่าลงทะเบียน</td>
                  <td className="py-1 text-right">{formatCurrency(data?.registrationFee)} บาท</td>
                </tr>
                <tr>
                  <td className="py-1">ค่าเบี้ยเลี้ยง</td>
                  <td className="py-1 text-right">{formatCurrency(calculateAllowance(data, 'perDiem'))} บาท</td>
                </tr>
                <tr>
                  <td className="py-1">ค่าที่พัก</td>
                  <td className="py-1 text-right">{formatCurrency(calculateAllowance(data, 'accommodation'))} บาท</td>
                </tr>
                <tr>
                  <td className="py-1">ค่าพาหนะเดินทาง</td>
                  <td className="py-1 text-right">{formatCurrency(calculateTravel(data))} บาท</td>
                </tr>
                <tr>
                  <td className="py-1">เงินชดเชยพาหนะส่วนตัว</td>
                  <td className="py-1 text-right">{formatCurrency(data?.personalVehicleCompensation)} บาท</td>
                </tr>
                <tr>
                  <td className="py-1">ค่าธรรมเนียม/ค่าใช้จ่ายอื่นๆ</td>
                  <td className="py-1 text-right">{formatCurrency(calculateOtherExpenses(data))} บาท</td>
                </tr>
                <tr className="font-bold border-t border-slate-200">
                  <td className="py-2">รวมทั้งสิ้น</td>
                  <td className="py-2 text-right text-primary-600">{formatCurrency(calculateConferenceTotal(data))} บาท</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
      
    case 'car':
      return (
        <div className="text-sm">
          <div className="text-center mb-6">
            <p className="text-xs text-slate-400 mb-1">บันทึกข้อความ</p>
            <h3 className="font-bold text-lg">ขออนุญาตใช้รถยนต์ส่วนตัว</h3>
          </div>
          <Divider className="my-4" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">ทะเบียนรถ:</span>
              <span className="font-medium">{data?.licensePlate || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ยี่ห้อ/รุ่น:</span>
              <span className="font-medium">{data?.carBrand} {data?.carModel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ต้นทาง:</span>
              <span className="font-medium">{data?.origin || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ปลายทาง:</span>
              <span className="font-medium">{data?.destination || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ระยะทาง:</span>
              <span className="font-medium">{formatCurrency(data?.distance)} กม.</span>
            </div>
            <Divider className="my-3" />
            <div className="flex justify-between font-bold">
              <span>ค่าชดเชยน้ำมัน:</span>
              <span className="text-primary-600">{formatCurrency(data?.fuelCompensation)} บาท</span>
            </div>
          </div>
        </div>
      )
      
    case 'loan':
      return (
        <div className="text-sm">
          <div className="text-center mb-6">
            <p className="text-xs text-slate-400 mb-1">แบบฟอร์ม FOTO-04</p>
            <h3 className="font-bold text-lg">สัญญายืมเงิน</h3>
          </div>
          <Divider className="my-4" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">วัตถุประสงค์:</span>
              <span className="font-medium">{data?.purpose || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">เอกสารอ้างอิง:</span>
              <span className="font-medium">{data?.referenceDoc || '-'}</span>
            </div>
            <Divider className="my-3" />
            <p className="font-bold mb-2">รายการยืม:</p>
            {data?.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span>{item.description}</span>
                <span>{formatCurrency(item.amount)} บาท</span>
              </div>
            )) || <p className="text-slate-400">-</p>}
            <Divider className="my-3" />
            <div className="flex justify-between font-bold">
              <span>รวมยอดยืม:</span>
              <span className="text-primary-600">{formatCurrency(data?.totalAmount)} บาท</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>กำหนดคืน:</span>
              <span>{formatDate(data?.dueDate)}</span>
            </div>
          </div>
        </div>
      )
    
    case 'expense-attachment':
      return (
        <div className="text-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-calculator text-2xl text-orange-600"></i>
            </div>
            <h3 className="font-bold text-lg">แบบฟอร์มประมาณค่าใช้จ่าย</h3>
            <p className="text-slate-500 mt-2">ไฟล์แนบ</p>
          </div>
          <Divider className="my-4" />
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <i className="fa-solid fa-file-pdf text-xl text-orange-600"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{data?.name || 'expense-form.pdf'}</p>
              <p className="text-sm text-slate-500">
                {data?.size ? `${(data.size / 1024).toFixed(1)} KB` : 'ไฟล์แนบ'}
              </p>
            </div>
            <i className="fa-solid fa-check-circle text-green-500"></i>
          </div>
        </div>
      )
    
    case 'schedule-attachment':
      return (
        <div className="text-sm">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-calendar-days text-2xl text-blue-600"></i>
            </div>
            <h3 className="font-bold text-lg">รายละเอียดกำหนดการ</h3>
            <p className="text-slate-500 mt-2">ไฟล์แนบ</p>
          </div>
          <Divider className="my-4" />
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <i className="fa-solid fa-file-pdf text-xl text-blue-600"></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-800 truncate">{data?.name || 'schedule.pdf'}</p>
              <p className="text-sm text-slate-500">
                {data?.size ? `${(data.size / 1024).toFixed(1)} KB` : 'ไฟล์แนบ'}
              </p>
            </div>
            <i className="fa-solid fa-check-circle text-green-500"></i>
          </div>
        </div>
      )
      
    default:
      return (
        <div className="text-center py-12 text-slate-400">
          <i className="fa-solid fa-file text-4xl mb-4"></i>
          <p>ไม่สามารถแสดงตัวอย่างเอกสารได้</p>
        </div>
      )
  }
}

// Helper functions for calculations
function calculateAllowance(data, type) {
  if (!data?.allowances) return 0
  return data.allowances.reduce((sum, item) => {
    return sum + (parseFloat(item[type === 'perDiem' ? 'perDiemAmount' : 'accommodationAmount']) || 0)
  }, 0)
}

function calculateTravel(data) {
  if (!data?.travelItinerary) return 0
  return data.travelItinerary.reduce((sum, item) => sum + (parseFloat(item.fare) || 0), 0)
}

function calculateOtherExpenses(data) {
  if (!data?.otherExpenses) return 0
  return data.otherExpenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0)
}

function calculateConferenceTotal(data) {
  if (!data) return 0
  const registrationFee = parseFloat(data.registrationFee) || 0
  const perDiem = calculateAllowance(data, 'perDiem')
  const accommodation = calculateAllowance(data, 'accommodation')
  const travelFare = calculateTravel(data)
  const personalVehicle = parseFloat(data.personalVehicleCompensation) || 0
  const otherExpenses = calculateOtherExpenses(data)
  
  return registrationFee + perDiem + accommodation + travelFare + personalVehicle + otherExpenses
}
