import { mapSupabaseError, requireSupabase } from '@/lib/supabase'
import type { Incapacidad, IncapacidadFilters, IncapacidadFormData } from '@/types/incapacidad'

function toPayload(data: IncapacidadFormData) {
  return {
    nombre_estudiante: data.nombre_estudiante.trim(),
    numero_identificacion: data.numero_identificacion.trim() || null,
    programa: data.programa,
    semestre: data.semestre,
    jornada: data.jornada,
    tipo_incapacidad: data.tipo_incapacidad,
    fecha_inicio: data.fecha_inicio,
    fecha_fin: data.fecha_fin,
    observaciones: data.observaciones.trim() || null,
  }
}

export async function listIncapacidades(filters: IncapacidadFilters): Promise<Incapacidad[]> {
  const client = requireSupabase()
  let query = client.from('incapacidades').select('*').order('created_at', { ascending: false })

  if (filters.programa) {
    query = query.eq('programa', filters.programa)
  }
  if (filters.semestre !== '') {
    query = query.eq('semestre', filters.semestre)
  }
  if (filters.jornada) {
    query = query.eq('jornada', filters.jornada)
  }
  if (filters.tipo_incapacidad) {
    query = query.eq('tipo_incapacidad', filters.tipo_incapacidad)
  }
  if (filters.nombre_estudiante.trim()) {
    query = query.ilike('nombre_estudiante', `%${filters.nombre_estudiante.trim()}%`)
  }
  if (filters.numero_identificacion.trim()) {
    query = query.ilike('numero_identificacion', `%${filters.numero_identificacion.trim()}%`)
  }
  if (filters.fecha) {
    query = query.lte('fecha_inicio', filters.fecha).gte('fecha_fin', filters.fecha)
  }

  const { data, error } = await query
  if (error) {
    throw new Error(mapSupabaseError(error))
  }
  return (data ?? []) as Incapacidad[]
}

export async function getIncapacidad(id: string): Promise<Incapacidad> {
  const client = requireSupabase()
  const { data, error } = await client.from('incapacidades').select('*').eq('id', id).single()
  if (error || !data) {
    throw new Error(mapSupabaseError(error))
  }
  return data as Incapacidad
}

export async function createIncapacidad(form: IncapacidadFormData): Promise<Incapacidad> {
  const client = requireSupabase()
  const { data, error } = await client.from('incapacidades').insert(toPayload(form)).select('*').single()
  if (error || !data) {
    throw new Error(mapSupabaseError(error))
  }
  return data as Incapacidad
}

export async function updateIncapacidad(id: string, form: IncapacidadFormData): Promise<Incapacidad> {
  const client = requireSupabase()
  const { data, error } = await client
    .from('incapacidades')
    .update(toPayload(form))
    .eq('id', id)
    .select('*')
    .single()
  if (error || !data) {
    throw new Error(mapSupabaseError(error))
  }
  return data as Incapacidad
}

export async function deleteIncapacidad(id: string): Promise<void> {
  const client = requireSupabase()
  const { error } = await client.from('incapacidades').delete().eq('id', id)
  if (error) {
    throw new Error(mapSupabaseError(error))
  }
}
