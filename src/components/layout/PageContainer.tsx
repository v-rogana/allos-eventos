import type { ReactNode } from 'react'

interface PageContainerProps {
  title: string
  subtitle?: string
  children: ReactNode
  action?: ReactNode
}

export default function PageContainer({ title, subtitle, children, action }: PageContainerProps) {
  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text">{title}</h1>
          {subtitle && <p className="text-text-secondary mt-1">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  )
}
