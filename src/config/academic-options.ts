export const PROGRAMAS = [
  { value: 'Ingeniería Informática', label: 'Ingeniería Informática' },
  { value: 'Diseño Visual Digital', label: 'Diseño Visual Digital' },
] as const

export const SEMESTRES = [
  { value: 1, label: '1er semestre' },
  { value: 2, label: '2do semestre' },
  { value: 3, label: '3er semestre' },
  { value: 4, label: '4to semestre' },
  { value: 5, label: '5to semestre' },
  { value: 6, label: '6to semestre' },
  { value: 7, label: '7mo semestre' },
  { value: 8, label: '8vo semestre' },
  { value: 9, label: '9no semestre' },
  { value: 10, label: '10mo semestre' },
] as const

export const JORNADAS = [
  { value: 'Diurna', label: 'Diurna' },
  { value: 'Nocturna', label: 'Nocturna' },
] as const

export const TIPOS_INCAPACIDAD = [
  { value: 'Médica', label: 'Médica' },
  { value: 'Laboral', label: 'Laboral' },
  { value: 'Otra', label: 'Otra' },
] as const

export type Programa = (typeof PROGRAMAS)[number]['value']
export type Jornada = (typeof JORNADAS)[number]['value']
export type TipoIncapacidad = (typeof TIPOS_INCAPACIDAD)[number]['value']
export type Semestre = (typeof SEMESTRES)[number]['value']

export function etiquetaSemestre(semestre: number): string {
  return SEMESTRES.find((item) => item.value === semestre)?.label ?? `Semestre ${semestre}`
}
