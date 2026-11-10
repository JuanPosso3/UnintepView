import type { SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean
}

export function Select({ className, invalid, children, ...props }: Props) {
  return (
    <select
      className={cn(
        'w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition',
        'focus:ring-2 focus:ring-teal-700/30',
        invalid ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-teal-700',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
