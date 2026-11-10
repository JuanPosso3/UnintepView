import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IncapacidadForm } from '@/components/incapacidades/IncapacidadForm'
import { Alert } from '@/components/ui/alert'
import { createIncapacidad } from '@/services/incapacidades'
import type { IncapacidadFormData } from '@/types/incapacidad'

export function RegistrarPage() {
  const [saved, setSaved] = useState(false)

  async function handleSubmit(data: IncapacidadFormData) {
    await createIncapacidad(data)
    setSaved(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Registrar incapacidad</h2>
          <p className="text-sm text-slate-600">Complete los datos del estudiante y el período de la incapacidad.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Volver al listado
        </Link>
      </div>

      {saved ? (
        <Alert variant="success">
          El registro quedó guardado. Puede capturar otra incapacidad o volver al listado para consultarla.
        </Alert>
      ) : null}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <IncapacidadForm submitLabel="Guardar incapacidad" onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
