import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  variant?: 'success' | 'error' | 'info'
  children: ReactNode
  className?: string
}

const variants = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-red-200 bg-red-50 text-red-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
}

export function Alert({ variant = 'info', children, className }: Props) {
  return (
    <div className={cn('rounded-md border px-3 py-2 text-sm', variants[variant], className)} role="status">
      {children}
    </div>
  )
}
