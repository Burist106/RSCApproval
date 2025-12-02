/**
 * Stepper Component
 * Display workflow progress steps
 * 
 * @param {Array} steps - Array of step objects { title, description }
 * @param {number} currentStep - Current active step (1-indexed)
 * @param {string} orientation - 'horizontal' | 'vertical'
 */

export default function Stepper({ 
  steps = [], 
  currentStep = 1,
  orientation = 'horizontal',
  className = '' 
}) {
  const getStepStatus = (index) => {
    const stepNumber = index + 1
    if (stepNumber < currentStep) return 'done'
    if (stepNumber === currentStep) return 'active'
    return 'inactive'
  }

  const statusStyles = {
    done: {
      circle: 'bg-green-500 text-white border-green-500',
      line: 'bg-green-500',
      text: 'text-green-600',
    },
    active: {
      circle: 'bg-primary-500 text-white border-primary-500',
      line: 'bg-slate-200',
      text: 'text-primary-600',
    },
    inactive: {
      circle: 'bg-white text-slate-400 border-slate-200',
      line: 'bg-slate-200',
      text: 'text-slate-400',
    },
  }

  if (orientation === 'vertical') {
    return (
      <div className={`space-y-0 ${className}`}>
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          const styles = statusStyles[status]
          const isLast = index === steps.length - 1
          
          return (
            <div key={index} className="flex">
              <div className="flex flex-col items-center mr-4">
                <div className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm
                  ${styles.circle}
                `}>
                  {status === 'done' ? (
                    <i className="fa-solid fa-check"></i>
                  ) : (
                    index + 1
                  )}
                </div>
                {!isLast && (
                  <div className={`w-0.5 h-16 ${styles.line}`}></div>
                )}
              </div>
              
              <div className="pb-8">
                <h4 className={`font-bold ${styles.text}`}>{step.title}</h4>
                {step.description && (
                  <p className="text-sm text-slate-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const status = getStepStatus(index)
        const styles = statusStyles[status]
        const isLast = index === steps.length - 1
        
        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm
                ${styles.circle}
              `}>
                {status === 'done' ? (
                  <i className="fa-solid fa-check"></i>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`mt-2 text-sm font-medium ${styles.text}`}>
                {step.title}
              </span>
            </div>
            
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-4 ${styles.line}`}></div>
            )}
          </div>
        )
      })}
    </div>
  )
}
