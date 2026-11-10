import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/auth/AuthContext'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/button'
import { ConsultarPage } from '@/pages/ConsultarPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegistrarPage } from '@/pages/RegistrarPage'

function ProtectedRoute() {
  const { session, isAuthorized, loading, configured, logout } = useAuth()

  if (!configured) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-50 text-slate-600">
        Cargando sesión...
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-slate-100 px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-800">
            Acceso no autorizado
          </div>
          <h1 className="text-xl font-semibold text-slate-900">Rol no configurado</h1>
          <p className="mt-2 text-sm text-slate-600">
            La cuenta con la que inició sesión (
            <strong className="font-medium text-slate-800">{session.user.email}</strong>) no tiene
            asignado un rol válido en el sistema (Unidad Académica o Docente).
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Por favor comuníquese con el administrador para que configure el rol correspondiente en los
            metadatos de la cuenta.
          </p>
          <div className="mt-6">
            <Button variant="outline" className="w-full" onClick={() => void logout()}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <Outlet />
}

function AdminRoute() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<ConsultarPage />} />
              <Route element={<AdminRoute />}>
                <Route path="/registrar" element={<RegistrarPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
