import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean
}

export function Textarea({ className, invalid, ...props }: Props) {
  return (
    <textarea
      className={cn(
        'min-h-24 w-full rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition',
        'placeholder:text-slate-400 focus:ring-2 focus:ring-teal-700/30',
        invalid ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-teal-700',
        className,
      )}
      {...props}
    />
  )
}
