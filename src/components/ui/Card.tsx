interface CardProps {
  children: React.ReactNode
  padding?: boolean
  border?: boolean
  shadow?: boolean
  className?: string
}

function Card({
  children,
  padding = true,
  border = true,
  shadow = true,
  className = '',
}: CardProps) {
  return (
    <div
      className={`
        bg-surface rounded-xl
        ${padding ? 'p-4 sm:p-6' : ''}
        ${border ? 'border border-border' : ''}
        ${shadow ? 'shadow-sm' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export default Card
