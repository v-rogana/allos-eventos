import { forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'cta' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-teal text-white hover:bg-teal-dark active:bg-teal-dark focus-visible:ring-teal',
  secondary:
    'border-2 border-teal text-teal bg-transparent hover:bg-teal-light active:bg-teal-light focus-visible:ring-teal',
  cta:
    'bg-terracotta text-white hover:brightness-110 active:brightness-90 focus-visible:ring-terracotta',
  ghost:
    'bg-transparent text-teal hover:bg-teal-light active:bg-teal-light focus-visible:ring-teal',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-7 py-3.5 text-lg rounded-lg',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center font-semibold
          transition-all duration-200 cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
