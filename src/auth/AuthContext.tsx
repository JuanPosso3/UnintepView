import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { extractUserRole, formatRoleLabel } from '@/lib/auth-helpers'
import { isSupabaseConfigured, mapSupabaseError, supabase } from '@/lib/supabase'
import type { UserRole } from '@/types/auth'

type AuthContextValue = {
  session: Session | null
  role: UserRole | null
  isAdmin: boolean
  isDocente: boolean
  isAuthorized: boolean
  roleLabel: string
  loading: boolean
  configured: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) {
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const role = useMemo(() => extractUserRole(session), [session])
  const isAdmin = role === 'unidad_academica'
  const isDocente = role === 'docente'
  const isAuthorized = role !== null
  const roleLabel = useMemo(() => formatRoleLabel(role), [role])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      role,
      isAdmin,
      isDocente,
      isAuthorized,
      roleLabel,
      loading,
      configured: isSupabaseConfigured,
      login: async (email, password) => {
        if (!supabase) {
          throw new Error('Supabase no está configurado.')
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          throw new Error(mapSupabaseError(error))
        }
      },
      logout: async () => {
        if (!supabase) return
        await supabase.auth.signOut()
      },
    }),
    [session, role, isAdmin, isDocente, isAuthorized, roleLabel, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return context
}
