import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/auth/AuthContext'
import { IncapacidadFilters } from '@/components/incapacidades/IncapacidadFilters'
import { IncapacidadForm } from '@/components/incapacidades/IncapacidadForm'
import { IncapacidadList } from '@/components/incapacidades/IncapacidadList'
import { Alert } from '@/components/ui/alert'
import { ConfirmDialog, Dialog } from '@/components/ui/dialog'
import { formatFecha } from '@/lib/dates'
import { deleteIncapacidad, listIncapacidades, updateIncapacidad } from '@/services/incapacidades'
import { EMPTY_FILTERS, type Incapacidad, type IncapacidadFilters as Filters, type IncapacidadFormData } from '@/types/incapacidad'

function toFormValues(record: Incapacidad): IncapacidadFormData {
  return {
    nombre_estudiante: record.nombre_estudiante,
    numero_identificacion: record.numero_identificacion ?? '',
    programa: record.programa,
    semestre: record.semestre,
    jornada: record.jornada,
    tipo_incapacidad: record.tipo_incapacidad,
    fecha_inicio: record.fecha_inicio,
    fecha_fin: record.fecha_fin,
    observaciones: record.observaciones ?? '',
  }
}

export function ConsultarPage() {
  const { isAdmin } = useAuth()
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [records, setRecords] = useState<Incapacidad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<Incapacidad | null>(null)
  const [deleting, setDeleting] = useState<Incapacidad | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async (current: Filters) => {
    setLoading(true)
    setError(null)
    try {
      const data = await listIncapacidades(current)
      setRecords(data)
    } catch (err) {
      setRecords([])
      setError(err instanceof Error ? err.message : 'No se pudieron cargar las incapacidades.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load(filters)
    }, 250)
    return () => window.clearTimeout(timer)
  }, [filters, load])

  async function handleEdit(data: IncapacidadFormData) {
    if (!isAdmin || !editing) return
    try {
      await updateIncapacidad(editing.id, data)
      setEditing(null)
      setNotice('El registro se actualizó correctamente.')
      await load(filters)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo actualizar el registro.')
    }
  }

  async function handleDelete() {
    if (!isAdmin || !deleting) return
    try {
      await deleteIncapacidad(deleting.id)
      setNotice('El registro se eliminó correctamente.')
      setDeleting(null)
      await load(filters)
    } catch (err) {
      setDeleting(null)
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el registro.')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Consultar incapacidades</h2>
        <p className="text-sm text-slate-600">
          Combine filtros para encontrar registros. La fecha específica muestra incapacidades activas ese día.
        </p>
      </div>

      <IncapacidadFilters filters={filters} onChange={setFilters} onClear={() => setFilters(EMPTY_FILTERS)} />

      {notice ? <Alert variant="success">{notice}</Alert> : null}
      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {loading ? 'Consultando...' : `${records.length} registro${records.length === 1 ? '' : 's'} encontrado${records.length === 1 ? '' : 's'}`}
          {filters.fecha ? ` para el ${formatFecha(filters.fecha)}` : ''}
        </p>
      </div>

      <IncapacidadList
        records={records}
        loading={loading}
        canManage={isAdmin}
        onEdit={(record) => {
          if (!isAdmin) return
          setNotice(null)
          setEditing(record)
        }}
        onDelete={(record) => {
          if (!isAdmin) return
          setNotice(null)
          setDeleting(record)
        }}
      />

      {isAdmin && (
        <>
          <Dialog open={Boolean(editing)} title="Editar incapacidad" onClose={() => setEditing(null)}>
            {editing ? (
              <IncapacidadForm
                key={editing.id}
                initialValues={toFormValues(editing)}
                submitLabel="Guardar cambios"
                onSubmit={handleEdit}
                onCancel={() => setEditing(null)}
                resetOnSuccess={false}
              />
            ) : null}
          </Dialog>

          <ConfirmDialog
            open={Boolean(deleting)}
            title="Eliminar incapacidad"
            message="Esta acción no se puede deshacer. ¿Desea eliminar el registro seleccionado?"
            confirmLabel="Eliminar"
            cancelLabel="Cancelar"
            danger
            onConfirm={() => void handleDelete()}
            onCancel={() => setDeleting(null)}
          />
        </>
      )}
    </div>
  )
}
