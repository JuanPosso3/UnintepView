import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'La aplicación no está configurada. Defina VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env.',
    )
  }
  return supabase
}

export function mapSupabaseError(error: { message?: string; code?: string } | null): string {
  if (!error) {
    return 'Ocurrió un error inesperado. Intente de nuevo.'
  }

  const message = error.message?.toLowerCase() ?? ''

  if (message.includes('failed to fetch') || message.includes('network')) {
    return 'No se pudo conectar con el servidor. Verifique su conexión e intente de nuevo.'
  }

  if (message.includes('invalid login credentials')) {
    return 'Correo o contraseña incorrectos.'
  }

  if (message.includes('email not confirmed')) {
    return 'La cuenta aún no está confirmada. Confirme el correo en Supabase o desactive la confirmación de email para la cuenta compartida.'
  }

  if (error.code === '42501' || message.includes('row-level security')) {
    return 'No tiene permisos para realizar esta acción. Esta operación requiere el rol de Unidad Académica.'
  }

  return 'No se pudo completar la operación. Intente de nuevo o revise la configuración de Supabase.'
}
