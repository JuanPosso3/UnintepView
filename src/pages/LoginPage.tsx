import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { Alert } from '@/components/ui/alert'
import edificioImg from '@/assets/edificio1.webp'

export function LoginPage() {
  const { session, configured, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (session) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col lg:flex-row">
      {/* =========================================================================
          PANEL IZQUIERDO: Identidad Institucional (52% a 54% en escritorio)
          ========================================================================= */}
      <section className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#073B63] via-[#005C9E] to-[#082F49] text-white p-6 sm:p-10 lg:p-12 xl:p-14 w-full lg:w-[52%] xl:w-[54%] shrink-0">
        {/* Patrón de textura geométrica sutil para profundidad institucional */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"
          aria-hidden="true"
        />

        {/* Resplandor ambiental para acentuar el contraste y la riqueza tonal */}
        <div
          className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#005C9E]/40 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-[#082F49]/80 blur-3xl"
          aria-hidden="true"
        />

        {/* Contenido del panel izquierdo */}
        <div className="relative z-10 flex flex-col justify-between h-full space-y-6 sm:space-y-8 lg:space-y-6">
          {/* A. Barra superior institucional */}
          <header className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-sm">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10" />
                <path d="M6 10h10" />
                <path d="M6 14h6" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                SISTEMA ACADÉMICO
              </p>
              <p className="text-[11px] font-medium text-sky-200/70 tracking-wider uppercase">
                Departamento Académico
              </p>
            </div>
          </header>

          {/* B. Título principal y C. Fotografía institucional */}
          <div className="flex flex-col justify-center flex-1 space-y-6 lg:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Gestión de incapacidades
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-sky-100/85 leading-relaxed max-w-lg">
                Una plataforma centralizada para la gestión y seguimiento de incapacidades del personal académico.
              </p>
            </div>

            {/* Fotografía institucional edificio1.webp */}
            <div className="relative group w-full aspect-[16/9] xl:aspect-[16/10] 2xl:aspect-[16/10] overflow-hidden rounded-2xl border border-white/20 bg-[#073B63]/60 shadow-2xl shadow-[#082F49]/50">
              <img
                src={edificioImg}
                alt="Institución Universitaria de Roldanillo"
                className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="eager"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#082F49]/40 via-transparent to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* D. Identificación inferior */}
          <footer className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sky-200/75">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-100/90">
              GESTIÓN · CONTROL · SEGUIMIENTO
            </span>
            <span className="text-[11px] font-normal text-sky-200/60 tracking-normal">
              Institución Universitaria de Roldanillo - UNINTEP
            </span>
          </footer>
        </div>
      </section>

      {/* =========================================================================
          PANEL DERECHO: Formulario de Autenticación
          ========================================================================= */}
      <section className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 bg-white min-h-[520px]">
        <div className="w-full max-w-md mx-auto">
          {/* 3.1 Encabezado del formulario */}
          <div className="mb-7">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172B3A] tracking-tight">
              Bienvenido
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-[#64748B]">
              Ingresa con tus credenciales institucionales.
            </p>
          </div>

          {/* Validación de configuración de Supabase */}
          {!configured ? (
            <Alert variant="error" className="mb-6">
              Faltan variables de entorno. Copie <code>.env.example</code> a <code>.env</code> y agregue
              la URL y la clave anónima de Supabase.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {error ? (
                <div
                  className="rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800 flex items-start gap-2.5 shadow-xs"
                  role="alert"
                >
                  <svg
                    className="h-5 w-5 text-red-600 shrink-0 mt-0.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="leading-snug">{error}</span>
                </div>
              ) : null}

              {/* 3.2 Campo de correo electrónico */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#172B3A] mb-1.5"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="usuario@institucion.edu.co"
                    required
                    className="w-full h-11 rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-3.5 text-sm text-[#172B3A] placeholder:text-slate-400 focus:border-[#005C9E] focus:outline-none focus:ring-3 focus:ring-[#005C9E]/15 transition-all duration-150"
                  />
                </div>
              </div>

              {/* 3.3 Campo de contraseña */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#172B3A] mb-1.5"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••••"
                    required
                    className="w-full h-11 rounded-lg border border-[#E2E8F0] bg-white pl-10 pr-10 text-sm text-[#172B3A] placeholder:text-slate-400 focus:border-[#005C9E] focus:outline-none focus:ring-3 focus:ring-[#005C9E]/15 transition-all duration-150"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                        <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                        <line x1="2" x2="22" y1="2" y2="22" />
                      </svg>
                    ) : (
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* 3.4 Botón principal */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-[#005C9E] hover:bg-[#074779] active:bg-[#073B63] px-4 text-sm font-semibold text-white shadow-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005C9E] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Ingresando...</span>
                  </>
                ) : (
                  <span>Iniciar sesión</span>
                )}
              </button>

              {/* 3.5 Texto inferior de seguridad */}
              <div className="pt-2 flex items-center justify-center gap-1.5 text-xs text-[#64748B]">
                <svg
                  className="h-3.5 w-3.5 text-slate-400 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Acceso exclusivo para personal autorizado</span>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
