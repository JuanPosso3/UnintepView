import { NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/auth/AuthContext'
import { cn } from '@/lib/utils'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-white text-[#005C9E] shadow-xs' : 'text-teal-50 hover:bg-[#004B80]',
  )

export function AppLayout() {
  const { logout, isAdmin, roleLabel } = useAuth()

  return (
    <div className="min-h-svh bg-slate-50">
      <header className="bg-[#005C9E] text-white shadow-xs">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs uppercase tracking-wide text-teal-100">Departamento académico</p>
              <span className="inline-flex items-center rounded-full bg-[#004B80]/80 px-2 py-0.5 text-xs font-medium text-white border border-white/20">
                Rol: {roleLabel}
              </span>
            </div>
            <h1 className="text-lg font-semibold text-white">Gestión de incapacidades</h1>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            <NavLink to="/" end className={linkClass}>
              Consultar incapacidades
            </NavLink>
            {isAdmin && (
              <NavLink to="/registrar" className={linkClass}>
                Registrar incapacidad
              </NavLink>
            )}
            <Button variant="secondary" className="ml-auto sm:ml-2" onClick={() => void logout()}>
              Cerrar sesión
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
