import { useMemo, useState, type FormEvent } from 'react'
import { JORNADAS, PROGRAMAS, SEMESTRES, TIPOS_INCAPACIDAD } from '@/config/academic-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Alert } from '@/components/ui/alert'
import { hasFieldErrors, validateIncapacidadForm, type FieldErrors } from '@/lib/validations'
import { EMPTY_FORM, type IncapacidadFormData } from '@/types/incapacidad'

type Props = {
  initialValues?: IncapacidadFormData
  submitLabel: string
  onSubmit: (data: IncapacidadFormData) => Promise<void>
  onCancel?: () => void
  cancelLabel?: string
  resetOnSuccess?: boolean
}

export function IncapacidadForm({
  initialValues = EMPTY_FORM,
  submitLabel,
  onSubmit,
  onCancel,
  cancelLabel = 'Cancelar',
  resetOnSuccess = true,
}: Props) {
  const [form, setForm] = useState<IncapacidadFormData>(initialValues)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const isDirty = useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initialValues),
    [form, initialValues],
  )

  function update<K extends keyof IncapacidadFormData>(key: K, value: IncapacidadFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }))
    setSuccess(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (saving) return

    const nextErrors = validateIncapacidadForm(form)
    setErrors(nextErrors)
    setSubmitError(null)
    setSuccess(null)

    if (hasFieldErrors(nextErrors)) {
      return
    }

    setSaving(true)
    try {
      await onSubmit(form)
      setSuccess('La incapacidad se guardó correctamente.')
      if (resetOnSuccess) {
        setForm(EMPTY_FORM)
        setErrors({})
      }
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No se pudo guardar el registro.')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (!onCancel) return
    if (isDirty && !window.confirm('Hay cambios sin guardar. ¿Desea cancelar?')) {
      return
    }
    onCancel()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {success ? <Alert variant="success">{success}</Alert> : null}
      {submitError ? <Alert variant="error">{submitError}</Alert> : null}

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">Datos del estudiante</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="nombre_estudiante">Nombre del estudiante *</Label>
            <Input
              id="nombre_estudiante"
              value={form.nombre_estudiante}
              onChange={(event) => update('nombre_estudiante', event.target.value)}
              invalid={Boolean(errors.nombre_estudiante)}
              autoComplete="name"
            />
            {errors.nombre_estudiante ? (
              <p className="mt-1 text-sm text-red-700">{errors.nombre_estudiante}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="numero_identificacion">Número de identificación</Label>
            <Input
              id="numero_identificacion"
              value={form.numero_identificacion}
              onChange={(event) => update('numero_identificacion', event.target.value)}
              inputMode="numeric"
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-slate-500">Opcional. Se guarda como texto, incluyendo ceros a la izquierda.</p>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">Información académica</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="programa">Programa *</Label>
            <Select
              id="programa"
              value={form.programa}
              onChange={(event) => update('programa', event.target.value as IncapacidadFormData['programa'])}
              invalid={Boolean(errors.programa)}
            >
              <option value="">Seleccione</option>
              {PROGRAMAS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
            {errors.programa ? <p className="mt-1 text-sm text-red-700">{errors.programa}</p> : null}
          </div>
          <div>
            <Label htmlFor="semestre">Semestre *</Label>
            <Select
              id="semestre"
              value={form.semestre}
              onChange={(event) =>
                update('semestre', event.target.value ? Number(event.target.value) : '')
              }
              invalid={Boolean(errors.semestre)}
            >
              <option value="">Seleccione</option>
              {SEMESTRES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
            {errors.semestre ? <p className="mt-1 text-sm text-red-700">{errors.semestre}</p> : null}
          </div>
          <div>
            <Label htmlFor="jornada">Jornada *</Label>
            <Select
              id="jornada"
              value={form.jornada}
              onChange={(event) => update('jornada', event.target.value as IncapacidadFormData['jornada'])}
              invalid={Boolean(errors.jornada)}
            >
              <option value="">Seleccione</option>
              {JORNADAS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
            {errors.jornada ? <p className="mt-1 text-sm text-red-700">{errors.jornada}</p> : null}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-base font-semibold text-slate-900">Incapacidad</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="tipo_incapacidad">Tipo de incapacidad *</Label>
            <Select
              id="tipo_incapacidad"
              value={form.tipo_incapacidad}
              onChange={(event) =>
                update('tipo_incapacidad', event.target.value as IncapacidadFormData['tipo_incapacidad'])
              }
              invalid={Boolean(errors.tipo_incapacidad)}
            >
              <option value="">Seleccione</option>
              {TIPOS_INCAPACIDAD.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
            {errors.tipo_incapacidad ? (
              <p className="mt-1 text-sm text-red-700">{errors.tipo_incapacidad}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="fecha_inicio">Fecha de inicio *</Label>
            <Input
              id="fecha_inicio"
              type="date"
              value={form.fecha_inicio}
              onChange={(event) => update('fecha_inicio', event.target.value)}
              invalid={Boolean(errors.fecha_inicio)}
            />
            {errors.fecha_inicio ? <p className="mt-1 text-sm text-red-700">{errors.fecha_inicio}</p> : null}
          </div>
          <div>
            <Label htmlFor="fecha_fin">Fecha de fin *</Label>
            <Input
              id="fecha_fin"
              type="date"
              value={form.fecha_fin}
              onChange={(event) => update('fecha_fin', event.target.value)}
              invalid={Boolean(errors.fecha_fin)}
            />
            {errors.fecha_fin ? <p className="mt-1 text-sm text-red-700">{errors.fecha_fin}</p> : null}
          </div>
        </div>
        <div>
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={form.observaciones}
            onChange={(event) => update('observaciones', event.target.value)}
            placeholder="Comentarios administrativos breves (opcional)"
          />
        </div>
      </fieldset>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={handleCancel} disabled={saving}>
            {cancelLabel}
          </Button>
        ) : null}
        <Button type="submit" disabled={saving}>
          {saving ? 'Guardando...' : submitLabel}
        </Button>
      </div>
    </form>
  )
}
