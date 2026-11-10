import { JORNADAS, PROGRAMAS, SEMESTRES, TIPOS_INCAPACIDAD } from '@/config/academic-options'
import { parseISODate } from '@/lib/dates'
import type { IncapacidadFormData } from '@/types/incapacidad'

export type FieldErrors = Partial<Record<keyof IncapacidadFormData, string>>

export function validateIncapacidadForm(data: IncapacidadFormData): FieldErrors {
  const errors: FieldErrors = {}

  if (!data.nombre_estudiante.trim()) {
    errors.nombre_estudiante = 'El nombre del estudiante es obligatorio.'
  }

  if (!data.programa || !PROGRAMAS.some((item) => item.value === data.programa)) {
    errors.programa = 'Seleccione un programa.'
  }

  const semestreValido = SEMESTRES.some((item) => item.value === data.semestre)
  if (data.semestre === '' || !semestreValido) {
    errors.semestre = 'Seleccione un semestre.'
  }

  if (!data.jornada || !JORNADAS.some((item) => item.value === data.jornada)) {
    errors.jornada = 'Seleccione una jornada.'
  }

  if (
    !data.tipo_incapacidad ||
    !TIPOS_INCAPACIDAD.some((item) => item.value === data.tipo_incapacidad)
  ) {
    errors.tipo_incapacidad = 'Seleccione el tipo de incapacidad.'
  }

  if (!data.fecha_inicio) {
    errors.fecha_inicio = 'La fecha de inicio es obligatoria.'
  }

  if (!data.fecha_fin) {
    errors.fecha_fin = 'La fecha de fin es obligatoria.'
  }

  if (data.fecha_inicio && data.fecha_fin) {
    const inicio = parseISODate(data.fecha_inicio)
    const fin = parseISODate(data.fecha_fin)
    if (inicio && fin && fin < inicio) {
      errors.fecha_fin = 'La fecha de fin no puede ser anterior a la fecha de inicio.'
    }
  }

  return errors
}

export function hasFieldErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
