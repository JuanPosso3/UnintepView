import type { Jornada, Programa, TipoIncapacidad } from '@/config/academic-options'

export type Incapacidad = {
  id: string
  nombre_estudiante: string
  numero_identificacion: string | null
  programa: Programa
  semestre: number
  jornada: Jornada
  tipo_incapacidad: TipoIncapacidad
  fecha_inicio: string
  fecha_fin: string
  observaciones: string | null
  created_at: string
}

export type IncapacidadFormData = {
  nombre_estudiante: string
  numero_identificacion: string
  programa: Programa | ''
  semestre: number | ''
  jornada: Jornada | ''
  tipo_incapacidad: TipoIncapacidad | ''
  fecha_inicio: string
  fecha_fin: string
  observaciones: string
}

export type IncapacidadFilters = {
  programa: Programa | ''
  semestre: number | ''
  jornada: Jornada | ''
  tipo_incapacidad: TipoIncapacidad | ''
  nombre_estudiante: string
  numero_identificacion: string
  fecha: string
}

export const EMPTY_FILTERS: IncapacidadFilters = {
  programa: '',
  semestre: '',
  jornada: '',
  tipo_incapacidad: '',
  nombre_estudiante: '',
  numero_identificacion: '',
  fecha: '',
}

export const EMPTY_FORM: IncapacidadFormData = {
  nombre_estudiante: '',
  numero_identificacion: '',
  programa: '',
  semestre: '',
  jornada: '',
  tipo_incapacidad: '',
  fecha_inicio: '',
  fecha_fin: '',
  observaciones: '',
}
