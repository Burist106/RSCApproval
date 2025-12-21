import { createContext, useContext, useState, useCallback } from 'react'

/**
 * WorkflowContext
 * Manages the entire request workflow based on the flowchart
 * 
 * 4 Main Paths:
 * - Path 1: ขออนุมัติโครงการ (Project Request) - Full Bundle
 * - Path 2: สัญญายืมเงิน (Loan Request - FOTO-04)
 * - Path 3: ขอใช้รถส่วนตัว (Personal Car Request)
 * - Path 4: ขออนุมัติประชุม/เดินทาง (Conference/Travel Request)
 * 
 * Workflow:
 * - B-Level (นักวิจัย): สร้างและติดตามคำขอ
 * - Admin (เจ้าหน้าที่): ตรวจสอบเอกสารเบื้องต้น (Screening)
 * - A-Level (ผอ.ศูนย์): พิจารณาอนุมัติ
 * 
 * Approval Logic:
 * - ≤ 50,000 บาท: APPROVED (อนุมัติ)
 * - > 50,000 บาท: AGREED (เห็นชอบ - ต้องส่งต่อ)
 */

const WorkflowContext = createContext(null)

// Path configurations based on flowchart
export const WORKFLOW_PATHS = {
  // Path 1: ขออนุมัติโครงการ (Full Bundle)
  // Documents: 1.บันทึกโครงการ 2.ใช้รถส่วนตัว 3.ประชุม/อบรม 4.FOTO-04 5.ประมาณค่าใช้จ่าย 6.กำหนดการ
  project: {
    id: 'project',
    name: 'ขออนุมัติโครงการ',
    description: 'Path 1: บันทึกข้อความขออนุมัติดำเนินโครงการ (Bundle เต็มรูปแบบ)',
    icon: 'fa-solid fa-file-contract',
    color: 'primary',
    steps: [
      { id: 'project-form', label: 'กรอกข้อมูลโครงการ', form: 'project' },
      { id: 'car-decision', label: 'ใช้รถส่วนตัว?', type: 'decision' },
      { id: 'car-form', label: 'ขอใช้รถส่วนตัว', form: 'car', optional: true },
      { id: 'conference-decision', label: 'มีการประชุม/อบรม?', type: 'decision' },
      { id: 'conference-form', label: 'แบบขอเข้าร่วมประชุม/อบรม', form: 'conference', optional: true },
      { id: 'loan-decision', label: 'ต้องการยืมเงิน?', type: 'decision' },
      { id: 'loan-form', label: 'สัญญายืมเงิน (FOTO-04)', form: 'loan', optional: true },
      { id: 'attachments', label: 'แนบเอกสารเพิ่มเติม', type: 'attachments' },
      { id: 'bundle-preview', label: 'ตรวจสอบเอกสาร', type: 'preview' },
    ],
    documents: ['PROJECT-REQ', 'CAR-REQ', 'CONF-REQ', 'LOAN-REQ', 'EXPENSE-FORM', 'SCHEDULE-FORM'],
  },
  // Path 2: สัญญายืมเงิน FOTO-04 (อ้างอิงโครงการเดิม)
  loan: {
    id: 'loan',
    name: 'สัญญายืมเงิน (FOTO-04)',
    description: 'Path 2: สัญญายืมเงินทดรองจ่าย อ้างอิงรหัสโครงการเดิม',
    icon: 'fa-solid fa-money-bill-transfer',
    color: 'blue',
    steps: [
      { id: 'reference-check', label: 'เลือกเอกสารอ้างอิง', type: 'decision' },
      { id: 'loan-form', label: 'กรอกข้อมูลยืมเงิน', form: 'loan' },
      { id: 'bundle-preview', label: 'ตรวจสอบเอกสาร', type: 'preview' },
    ],
    documents: ['LOAN-REQ'],
  },
  // Path 3: ขออนุมัติใช้รถส่วนตัว
  car: {
    id: 'car',
    name: 'ขออนุมัติใช้รถส่วนตัว',
    description: 'Path 3: ขออนุมัติใช้รถยนต์ส่วนตัวเดินทางไปราชการ',
    icon: 'fa-solid fa-car',
    color: 'purple',
    steps: [
      { id: 'car-form', label: 'กรอกข้อมูลรถยนต์', form: 'car' },
      { id: 'loan-decision', label: 'ต้องการยืมเงิน?', type: 'decision' },
      { id: 'loan-form', label: 'สัญญายืมเงิน (FOTO-04)', form: 'loan', optional: true },
      { id: 'bundle-preview', label: 'ตรวจสอบเอกสาร', type: 'preview' },
    ],
    documents: ['CAR-REQ', 'LOAN-REQ'],
  },
  // Path 4: ขออนุมัติประชุม/เดินทาง
  conference: {
    id: 'conference',
    name: 'ขออนุมัติประชุม/เดินทาง',
    description: 'Path 4: ขออนุมัติเข้าร่วมประชุม/สัมมนา หรือเดินทางไปราชการ',
    icon: 'fa-solid fa-plane-departure',
    color: 'teal',
    steps: [
      { id: 'conference-form', label: 'กรอกข้อมูลการประชุม/เดินทาง', form: 'conference' },
      { id: 'car-decision', label: 'ใช้รถส่วนตัว?', type: 'decision' },
      { id: 'car-form', label: 'ขอใช้รถส่วนตัว', form: 'car', optional: true },
      { id: 'loan-decision', label: 'ต้องการยืมเงิน?', type: 'decision' },
      { id: 'loan-form', label: 'สัญญายืมเงิน (FOTO-04)', form: 'loan', optional: true },
      { id: 'bundle-preview', label: 'ตรวจสอบเอกสาร', type: 'preview' },
    ],
    documents: ['CONF-REQ', 'CAR-REQ', 'LOAN-REQ'],
  },
}

// Decision points configuration
export const DECISION_POINTS = {
  'car-decision': {
    question: 'คุณจะใช้รถยนต์ส่วนตัวในการเดินทางหรือไม่?',
    description: 'หากใช้รถส่วนตัว จะต้องกรอกแบบฟอร์มขอใช้รถยนต์ส่วนตัวเพิ่มเติม',
    options: [
      { value: 'yes', label: 'ใช้รถยนต์ส่วนตัว', nextStep: 'car-form', icon: 'fa-solid fa-car' },
      { value: 'no', label: 'ไม่ใช้รถส่วนตัว (รถหน่วยงาน/สาธารณะ/เครื่องบิน)', skipToNext: true, icon: 'fa-solid fa-bus' },
    ],
  },
  'conference-decision': {
    question: 'โครงการนี้มีการเข้าร่วมประชุม/อบรม/สัมมนาหรือไม่?',
    description: 'หากมี จะต้องกรอกแบบขออนุมัติเข้าร่วมประชุม/อบรม/สัมมนาในประเทศ',
    options: [
      { value: 'yes', label: 'มีการประชุม/อบรม/สัมมนา', nextStep: 'conference-form', icon: 'fa-solid fa-users-rectangle' },
      { value: 'no', label: 'ไม่มี', skipToNext: true, icon: 'fa-solid fa-xmark' },
    ],
  },
  'loan-decision': {
    question: 'คุณต้องการยืมเงินทดรองหรือไม่?',
    description: 'สำหรับค่าใช้จ่ายในการเดินทาง ค่าลงทะเบียน หรือค่าใช้จ่ายอื่นๆ',
    options: [
      { value: 'yes', label: 'ต้องการยืมเงินทดรอง (FOTO-04)', nextStep: 'loan-form', icon: 'fa-solid fa-money-bill-wave' },
      { value: 'no', label: 'ไม่ต้องการยืมเงิน', skipToNext: true, icon: 'fa-solid fa-xmark' },
    ],
  },
  'reference-check': {
    question: 'คุณมีเอกสารอ้างอิงหรือไม่?',
    description: 'การยืมเงินทดรองต้องมีเอกสารอ้างอิง เช่น ใบอนุมัติเดินทาง หรือ ใบอนุมัติโครงการ',
    options: [
      { value: 'has-reference', label: 'มีเอกสารอ้างอิง (เลือกรหัสโครงการ)', nextStep: 'loan-form', icon: 'fa-solid fa-file-check' },
      { value: 'no-reference', label: 'ยังไม่มี - สร้างคำขอโครงการใหม่', redirectTo: '/requests/workflow/project', icon: 'fa-solid fa-file-circle-plus' },
    ],
  },
}

export function WorkflowProvider({ children }) {
  // Current workflow state
  const [currentPath, setCurrentPath] = useState(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState([])
  const [skippedSteps, setSkippedSteps] = useState([])
  
  // Form data for all documents in the bundle
  const [bundleData, setBundleData] = useState({
    conference: null,
    loan: null,
    car: null,
    project: null,
    travel: null,
  })
  
  // Decision answers
  const [decisions, setDecisions] = useState({})
  
  // Initialize workflow for a specific path
  const initWorkflow = useCallback((pathId) => {
    const path = WORKFLOW_PATHS[pathId]
    if (!path) return false
    
    setCurrentPath(path)
    setCurrentStepIndex(0)
    setCompletedSteps([])
    setSkippedSteps([])
    setBundleData({
      conference: null,
      loan: null,
      car: null,
      project: null,
      travel: null,
    })
    setDecisions({})
    
    return true
  }, [])
  
  // Get current step
  const getCurrentStep = useCallback(() => {
    if (!currentPath) return null
    return currentPath.steps[currentStepIndex]
  }, [currentPath, currentStepIndex])
  
  // Save form data for a specific form type
  const saveFormData = useCallback((formType, data) => {
    setBundleData(prev => ({
      ...prev,
      [formType]: data,
    }))
  }, [])
  
  // Save decision answer
  const saveDecision = useCallback((decisionId, answer) => {
    setDecisions(prev => ({
      ...prev,
      [decisionId]: answer,
    }))
  }, [])
  
  // Navigate to next step based on decision
  const goToNextStep = useCallback((decisionAnswer = null) => {
    if (!currentPath) return
    
    const currentStep = getCurrentStep()
    
    // Mark current step as completed
    setCompletedSteps(prev => [...prev, currentStep.id])
    
    // If this is a decision step, handle navigation based on answer
    if (currentStep.type === 'decision' && decisionAnswer) {
      const decision = DECISION_POINTS[currentStep.id]
      const selectedOption = decision.options.find(opt => opt.value === decisionAnswer)
      
      if (selectedOption) {
        // Handle skipToNext - skip to the next step that isn't the optional form
        if (selectedOption.skipToNext) {
          // Find the next non-optional step or the next decision/preview step
          let nextIndex = currentStepIndex + 1
          while (nextIndex < currentPath.steps.length) {
            const nextStep = currentPath.steps[nextIndex]
            // Skip optional form steps
            if (nextStep.optional) {
              setSkippedSteps(prev => [...prev, nextStep.id])
              nextIndex++
            } else {
              break
            }
          }
          if (nextIndex < currentPath.steps.length) {
            setCurrentStepIndex(nextIndex)
            return
          }
        }
        
        // Handle nextStep - go to specific step
        if (selectedOption.nextStep) {
          const targetIndex = currentPath.steps.findIndex(s => s.id === selectedOption.nextStep)
          if (targetIndex !== -1) {
            // Mark steps in between as skipped
            for (let i = currentStepIndex + 1; i < targetIndex; i++) {
              setSkippedSteps(prev => [...prev, currentPath.steps[i].id])
            }
            setCurrentStepIndex(targetIndex)
            return
          }
        }
        
        // Handle skipTo (legacy) - go to specific step, skipping in between
        if (selectedOption.skipTo) {
          const targetIndex = currentPath.steps.findIndex(s => s.id === selectedOption.skipTo)
          if (targetIndex !== -1) {
            for (let i = currentStepIndex + 1; i < targetIndex; i++) {
              setSkippedSteps(prev => [...prev, currentPath.steps[i].id])
            }
            setCurrentStepIndex(targetIndex)
            return
          }
        }
      }
    }
    
    // Default: go to next step
    if (currentStepIndex < currentPath.steps.length - 1) {
      // Check if next step should be skipped
      let nextIndex = currentStepIndex + 1
      while (nextIndex < currentPath.steps.length) {
        const nextStep = currentPath.steps[nextIndex]
        if (nextStep.optional && skippedSteps.includes(nextStep.id)) {
          nextIndex++
        } else {
          break
        }
      }
      setCurrentStepIndex(nextIndex)
    }
  }, [currentPath, currentStepIndex, getCurrentStep, skippedSteps])
  
  // Go back to previous step
  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      // Find the previous non-skipped step
      let prevIndex = currentStepIndex - 1
      while (prevIndex >= 0 && skippedSteps.includes(currentPath.steps[prevIndex].id)) {
        prevIndex--
      }
      if (prevIndex >= 0) {
        // Remove from completed
        setCompletedSteps(prev => prev.filter(id => id !== currentPath.steps[currentStepIndex].id))
        setCurrentStepIndex(prevIndex)
      }
    }
  }, [currentPath, currentStepIndex, skippedSteps])
  
  // Get all completed documents in bundle
  // ลำดับเอกสารตามที่กำหนด:
  // 1. บันทึกข้อความขออนุมัติโครงการ
  // 2. บันทึกข้อความขออนุมัติใช้รถส่วนตัว
  // 3. แบบขออนุมัติเข้าร่วมประชุม/อบรม/สัมมนาในประเทศ
  // 4. สัญญายืมเงิน FOTO-04
  // 5. แนบไฟล์แบบฟอร์มประมาณค่าใช้จ่าย
  // 6. แนบไฟล์รายละเอียดกำหนดการ
  const getBundleDocuments = useCallback(() => {
    const docs = []
    
    // 1. บันทึกข้อความขออนุมัติโครงการ
    if (bundleData.project) {
      docs.push({ type: 'project', label: 'บันทึกข้อความขออนุมัติโครงการ', data: bundleData.project })
    }
    
    // 2. บันทึกข้อความขออนุมัติใช้รถส่วนตัว
    if (bundleData.car) {
      docs.push({ type: 'car', label: 'บันทึกข้อความขอใช้รถยนต์ส่วนตัว', data: bundleData.car })
    }
    
    // 3. แบบขออนุมัติเข้าร่วมประชุม/อบรม/สัมมนาในประเทศ
    if (bundleData.conference) {
      docs.push({ type: 'conference', label: 'แบบขออนุมัติเข้าร่วมประชุม/อบรม/สัมมนาในประเทศ', data: bundleData.conference })
    }
    
    // 4. สัญญายืมเงิน FOTO-04
    if (bundleData.loan) {
      docs.push({ type: 'loan', label: 'สัญญายืมเงินทดรองจ่าย (FOTO-04)', data: bundleData.loan })
    }
    
    // 5. แนบไฟล์แบบฟอร์มประมาณค่าใช้จ่าย (จาก attachments)
    if (bundleData.attachments?.expenseForm) {
      docs.push({ type: 'expense-attachment', label: 'แบบฟอร์มประมาณค่าใช้จ่าย', data: bundleData.attachments.expenseForm })
    }
    
    // 6. แนบไฟล์รายละเอียดกำหนดการ (จาก attachments)
    if (bundleData.attachments?.scheduleForm) {
      docs.push({ type: 'schedule-attachment', label: 'รายละเอียดกำหนดการ', data: bundleData.attachments.scheduleForm })
    }
    
    return docs
  }, [bundleData])
  
  // Check if workflow is complete
  const isWorkflowComplete = useCallback(() => {
    if (!currentPath) return false
    const currentStep = getCurrentStep()
    return currentStep?.type === 'preview'
  }, [currentPath, getCurrentStep])
  
  // Reset workflow
  const resetWorkflow = useCallback(() => {
    setCurrentPath(null)
    setCurrentStepIndex(0)
    setCompletedSteps([])
    setSkippedSteps([])
    setBundleData({
      conference: null,
      loan: null,
      car: null,
      project: null,
      travel: null,
    })
    setDecisions({})
  }, [])
  
  // Calculate progress percentage
  const getProgress = useCallback(() => {
    if (!currentPath) return 0
    const totalSteps = currentPath.steps.length - skippedSteps.length
    const completed = completedSteps.length
    return Math.round((completed / totalSteps) * 100)
  }, [currentPath, completedSteps, skippedSteps])
  
  const value = {
    // State
    currentPath,
    currentStepIndex,
    completedSteps,
    skippedSteps,
    bundleData,
    decisions,
    
    // Actions
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
    
    // Constants
    WORKFLOW_PATHS,
    DECISION_POINTS,
  }
  
  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}

export function useWorkflow() {
  const context = useContext(WorkflowContext)
  if (!context) {
    throw new Error('useWorkflow must be used within a WorkflowProvider')
  }
  return context
}

export default WorkflowContext
