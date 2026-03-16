import { forwardRef, useId } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id ?? generatedId

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-text"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={`
            w-full px-4 py-2.5 rounded-lg border bg-surface text-text
            text-base font-[family-name:var(--font-body)]
            placeholder:text-text-secondary
            transition-colors duration-200 resize-y min-h-[100px]
            focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-terracotta ring-1 ring-terracotta' : 'border-border hover:border-teal'}
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          {...props}
        />

        {error && (
          <p id={`${textareaId}-error`} className="text-sm text-terracotta" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${textareaId}-helper`} className="text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
