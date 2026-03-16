interface BadgeProps {
  children: React.ReactNode
  variant?: 'teal' | 'terracotta' | 'promocional' | 'comunitario' | 'corporativo' | 'institucional' | 'gray' | 'amber' | 'green' | 'red' | 'purple' | 'blue' | 'rose'
  className?: string
}

const variantClasses: Record<string, string> = {
  teal: 'bg-teal-light text-teal-dark',
  terracotta: 'bg-terracotta-light text-terracotta',
  promocional: 'bg-teal-light text-cat-promocional',
  comunitario: 'bg-amber-100 text-cat-comunitario',
  corporativo: 'bg-purple-100 text-cat-corporativo',
  institucional: 'bg-blue-100 text-cat-institucional',
  gray: 'bg-gray-100 text-text-secondary',
  amber: 'bg-amber-100 text-amber-800',
  green: 'bg-green-100 text-green-800',
  red: 'bg-red-100 text-red-800',
  purple: 'bg-purple-100 text-purple-800',
  blue: 'bg-blue-100 text-blue-800',
  rose: 'bg-rose-100 text-rose-800',
}

function Badge({ children, variant = 'teal', className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-semibold whitespace-nowrap
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

export default Badge
