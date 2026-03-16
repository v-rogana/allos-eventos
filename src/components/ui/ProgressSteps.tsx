interface Step {
  label?: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number // 0-indexed
  className?: string
}

function ProgressSteps({ steps, currentStep, className = '' }: ProgressStepsProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const isLast = index === steps.length - 1

          return (
            <div key={index} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full
                    text-sm sm:text-base font-semibold
                    transition-colors duration-200 shrink-0
                    ${
                      isCompleted
                        ? 'bg-teal text-white'
                        : isActive
                          ? 'bg-teal text-white ring-4 ring-teal-light'
                          : 'bg-gray-200 text-text-secondary'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Label - hidden on mobile, shown on desktop */}
                {step.label && (
                  <span
                    className={`
                      hidden sm:block mt-2 text-xs text-center max-w-[80px]
                      ${
                        isCompleted || isActive
                          ? 'text-teal font-semibold'
                          : 'text-text-secondary'
                      }
                    `}
                  >
                    {step.label}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={`
                    flex-1 h-0.5 mx-1 sm:mx-2
                    transition-colors duration-200
                    ${index < currentStep ? 'bg-teal' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressSteps
