import { Button } from '@/components/ui/button'
import { TipoBadge } from '@/components/ui/badge'
import { etiquetaSemestre } from '@/config/academic-options'
import { formatFecha } from '@/lib/dates'
import type { Incapacidad } from '@/types/incapacidad'

type Props = {
  records: Incapacidad[]
  loading: boolean
  canManage?: boolean
  onEdit?: (record: Incapacidad) => void
  onDelete?: (record: Incapacidad) => void
}

export function IncapacidadList({ records, loading, canManage = false, onEdit, onDelete }: Props) {
  if (loading) {
    return <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">Cargando incapacidades...</p>
  }

  if (records.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
        No se encontraron incapacidades para los filtros seleccionados.
      </p>
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {records.map((record) => (
          <article key={record.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-slate-900">{record.nombre_estudiante}</h3>
                <p className="text-sm text-slate-500">
                  {record.numero_identificacion || 'Sin identificación'}
                </p>
              </div>
              <TipoBadge tipo={record.tipo_incapacidad} />
            </div>
            <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
              <div>
                <dt className="text-slate-500">Programa</dt>
                <dd>{record.programa}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Semestre</dt>
                <dd>{etiquetaSemestre(record.semestre)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Jornada</dt>
                <dd>{record.jornada}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Período</dt>
                <dd>
                  {formatFecha(record.fecha_inicio)} — {formatFecha(record.fecha_fin)}
                </dd>
              </div>
            </dl>
            {record.observaciones ? (
              <p className="mt-2 text-sm text-slate-600">{record.observaciones}</p>
            ) : null}
            {canManage && (
              <div className="mt-3 flex gap-2">
                <Button variant="outline" onClick={() => onEdit?.(record)}>
                  Editar
                </Button>
                <Button variant="danger" onClick={() => onDelete?.(record)}>
                  Eliminar
                </Button>
              </div>
            )}
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-3 font-medium">Estudiante</th>
              <th className="px-3 py-3 font-medium">Identificación</th>
              <th className="px-3 py-3 font-medium">Programa</th>
              <th className="px-3 py-3 font-medium">Semestre</th>
              <th className="px-3 py-3 font-medium">Jornada</th>
              <th className="px-3 py-3 font-medium">Tipo</th>
              <th className="px-3 py-3 font-medium">Inicio</th>
              <th className="px-3 py-3 font-medium">Fin</th>
              <th className="px-3 py-3 font-medium">Observaciones</th>
              {canManage && <th className="px-3 py-3 font-medium">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t border-slate-100">
                <td className="px-3 py-3 font-medium text-slate-900">{record.nombre_estudiante}</td>
                <td className="px-3 py-3">{record.numero_identificacion || '—'}</td>
                <td className="px-3 py-3">{record.programa}</td>
                <td className="px-3 py-3">{etiquetaSemestre(record.semestre)}</td>
                <td className="px-3 py-3">{record.jornada}</td>
                <td className="px-3 py-3">
                  <TipoBadge tipo={record.tipo_incapacidad} />
                </td>
                <td className="px-3 py-3 whitespace-nowrap">{formatFecha(record.fecha_inicio)}</td>
                <td className="px-3 py-3 whitespace-nowrap">{formatFecha(record.fecha_fin)}</td>
                <td className="max-w-48 px-3 py-3 text-slate-600">{record.observaciones || '—'}</td>
                {canManage && (
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <Button variant="outline" className="h-8 px-2 text-xs" onClick={() => onEdit?.(record)}>
                        Editar
                      </Button>
                      <Button variant="danger" className="h-8 px-2 text-xs" onClick={() => onDelete?.(record)}>
                        Eliminar
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
