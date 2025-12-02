import { createContext, useContext, useState, useCallback } from 'react'

/**
 * WorkflowContext
 * Manages the entire request workflow based on the flowchart
 * 
 * 4 Main Paths:
 * - Path 1: ขอทุนสนับสนุนการประชุม/นำเสนอผลงาน (Conference Support)
 * - Path 2: ขอสำรองจ่าย/ยืมเงินทดรอง (Advance/Loan Request)
 * - Path 3: ขอเดินทางราชการ (Official Travel)
 * - Path 4: ขอเปิดโครงการวิจัย (Research Project)
 */

const WorkflowContext = createContext(null)

// Path configurations based on flowchart
export const WORKFLOW_PATHS = {
  // Path 1: ขออนุมัติโครงการ
  project: {
    id: 'project',
    name: 'ขออนุมัติโครงการ',
    description: 'Path 1: บันทึกข้อความขออนุมัติดำเนินโครงการ พร้อมรายละเอียดงบประมาณ',
    icon: 'fa-solid fa-file-contract',
    color: 'primary',
    steps: [
      { id: 'project-form', label: 'กรอกข้อมูลโครงการ', form: 'project' },
      { id: 'budget-decision', label: 'ต้องการยืมเงิน?', type: 'decision' },
      { id: 'loan-form', label: 'ขอยืมเงินทดรอง', form: 'loan', optional: true },
      { id: 'car-decision', label: 'ใช้รถส่วนตัว?', type: 'decision' },
      { id: 'car-form', label: 'ขอใช้รถส่วนตัว', form: 'car', optional: true },
      { id: 'bundle-preview', label: 'ตรวจสอบเอกสาร', type: 'preview' },
    ],
    documents: ['PROJECT-REQ', 'LOAN-REQ', 'CAR-REQ'],
  },
  // Path 2: สัญญายืมเงิน FOTO-04
  loan: {
    id: 'loan',
    name: 'สัญญายืมเงิน (FOTO-04)',
    description: 'Path 2: สัญญายืมเงินทดรองจ่ายสำหรับโครงการหรือกิจกรรม',
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
      { id: 'loan-form', label: 'ขอยืมเงินทดรอง', form: 'loan', optional: true },
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
      { id: 'expense-decision', label: 'ต้องการยืมเงิน?', type: 'decision' },
      { id: 'loan-form', label: 'ขอยืมเงินทดรอง', form: 'loan', optional: true },
      { id: 'car-decision', label: 'ใช้รถส่วนตัว?', type: 'decision' },
      { id: 'car-form', label: 'ขอใช้รถส่วนตัว', form: 'car', optional: true },
      { id: 'bundle-preview', label: 'ตรวจสอบเอกสาร', type: 'preview' },
    ],
    documents: ['CONF-REQ', 'LOAN-REQ', 'CAR-REQ'],
  },
}

// Decision points configuration
export const DECISION_POINTS = {
  'expense-decision': {
    question: 'คุณต้องการยืมเงินทดรองหรือไม่?',
    options: [
      { value: 'yes', label: 'ต้องการยืมเงินทดรอง', nextStep: 'loan-form', icon: 'fa-solid fa-money-bill-wave' },
      { value: 'no', label: 'ไม่ต้องการยืมเงิน', skipTo: 'car-decision', icon: 'fa-solid fa-xmark' },
    ],
  },
  'budget-decision': {
    question: 'โครงการนี้ต้องการยืมเงินทดรองหรือไม่?',
    options: [
      { value: 'yes', label: 'ต้องการยืมเงินทดรอง', nextStep: 'loan-form', icon: 'fa-solid fa-money-bill-wave' },
      { value: 'no', label: 'ไม่ต้องการยืมเงิน', skipTo: 'car-decision', icon: 'fa-solid fa-xmark' },
    ],
  },
  'loan-decision': {
    question: 'คุณต้องการยืมเงินทดรองหรือไม่?',
    description: 'สำหรับค่าน้ำมันหรือค่าใช้จ่ายอื่นๆ ในการเดินทาง',
    options: [
      { value: 'yes', label: 'ต้องการยืมเงินทดรอง (FOTO-04)', nextStep: 'loan-form', icon: 'fa-solid fa-money-bill-wave' },
      { value: 'no', label: 'ไม่ต้องการยืมเงิน', skipTo: 'bundle-preview', icon: 'fa-solid fa-xmark' },
    ],
  },
  'car-decision': {
    question: 'คุณจะใช้รถยนต์ส่วนตัวในการเดินทางหรือไม่?',
    options: [
      { value: 'yes', label: 'ใช้รถยนต์ส่วนตัว', nextStep: 'car-form', icon: 'fa-solid fa-car' },
      { value: 'no', label: 'ไม่ใช้รถส่วนตัว (รถหน่วยงาน/สาธารณะ/เครื่องบิน)', skipTo: 'bundle-preview', icon: 'fa-solid fa-bus' },
    ],
  },
  'reference-check': {
    question: 'คุณมีเอกสารอ้างอิงหรือไม่?',
    description: 'การยืมเงินทดรองต้องมีเอกสารอ้างอิง เช่น ใบอนุมัติเดินทาง หรือ ใบอนุมัติโครงการ',
    options: [
      { value: 'has-reference', label: 'มีเอกสารอ้างอิง', nextStep: 'loan-form', icon: 'fa-solid fa-file-check' },
      { value: 'no-reference', label: 'ยังไม่มี - สร้างคำขอใหม่', redirectTo: '/requests/new', icon: 'fa-solid fa-file-circle-plus' },
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
        // Find the target step
        const targetStepId = selectedOption.nextStep || selectedOption.skipTo
        const targetIndex = currentPath.steps.findIndex(s => s.id === targetStepId)
        
        if (targetIndex !== -1) {
          // Mark skipped steps
          for (let i = currentStepIndex + 1; i < targetIndex; i++) {
            setSkippedSteps(prev => [...prev, currentPath.steps[i].id])
          }
          setCurrentStepIndex(targetIndex)
          return
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
  const getBundleDocuments = useCallback(() => {
    const docs = []
    
    if (bundleData.project) {
      docs.push({ type: 'project', label: 'ขออนุมัติโครงการ', data: bundleData.project })
    }
    if (bundleData.conference) {
      docs.push({ type: 'conference', label: 'ขออนุมัติเข้าร่วมประชุม/เดินทาง', data: bundleData.conference })
    }
    if (bundleData.car) {
      docs.push({ type: 'car', label: 'ขอใช้รถยนต์ส่วนตัว', data: bundleData.car })
    }
    if (bundleData.loan) {
      docs.push({ type: 'loan', label: 'ขอยืมเงินทดรอง', data: bundleData.loan })
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
