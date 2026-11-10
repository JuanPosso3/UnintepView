import type { Session } from '@supabase/supabase-js'
import type { UserRole } from '@/types/auth'

/**
 * Extrae y valida el rol del usuario estrictamente desde app_metadata.
 * No se confía en user_metadata ya que los usuarios pueden editarlo directamente desde el cliente.
 */
export function extractUserRole(session: Session | null): UserRole | null {
  if (!session?.user) return null
  const role = session.user.app_metadata?.role
  if (role === 'unidad_academica' || role === 'docente') {
    return role
  }
  return null
}

export function formatRoleLabel(role: UserRole | null): string {
  if (role === 'unidad_academica') return 'Unidad Académica'
  if (role === 'docente') return 'Docente'
  return 'Sin rol autorizado'
}
