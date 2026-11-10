import { cn } from '@/lib/utils'
import type { TipoIncapacidad } from '@/config/academic-options'

const styles: Record<TipoIncapacidad, string> = {
  Médica: 'bg-sky-100 text-sky-900',
  Laboral: 'bg-amber-100 text-amber-900',
  Otra: 'bg-slate-200 text-slate-800',
}

export function TipoBadge({ tipo }: { tipo: TipoIncapacidad }) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
        styles[tipo] ?? 'bg-slate-100 text-slate-700',
      )}
    >
      {tipo}
    </span>
  )
}
