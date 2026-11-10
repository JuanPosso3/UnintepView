# Gestión de incapacidades (Control de Acceso Basado en Roles - RBAC)

Aplicación web institucional para que la Unidad Académica registre y gestione incapacidades estudiantiles, y los docentes consulten oportunamente el estado de sus estudiantes.

Toda la interfaz de usuario se encuentra en español. El acceso y autorización se gestionan mediante Supabase Auth y Row Level Security (RLS) en PostgreSQL, distinguiendo de forma estricta entre dos roles.

## Roles del Sistema

| Rol | Identificador | Permisos | Acceso a interfaz |
|---|---|---|---|
| **Unidad Académica** | `unidad_academica` | `SELECT`, `INSERT`, `UPDATE`, `DELETE` | Consulta y Registro de incapacidades. Acciones de edición y eliminación disponibles. |
| **Docente** | `docente` | `SELECT` únicamente | Solo Consulta de incapacidades con todos los filtros de búsqueda. Sin acceso a registro, edición ni eliminación. |

### Medidas de Seguridad de los Roles
- Los roles se almacenan en `raw_app_meta_data` (`app_metadata` en el JWT).
- **Nunca se confía en `user_metadata`** ni en valores enviados por el cliente: los usuarios no pueden modificar `app_metadata` a través del cliente de Supabase.
- Si una cuenta no tiene asignado uno de los dos roles autorizados, el sistema bloquea el acceso mostrando un mensaje claro en español.
- Si un docente intenta acceder directamente por URL a `/registrar`, la aplicación lo redirige a la página de consulta `/`.
- Si se intenta llamar a la API de Supabase para insertar, actualizar o eliminar con el rol docente o sin rol, PostgreSQL rechaza la petición a nivel de base de datos con un error de RLS (código `42501`).

---

## Funcionalidad

- **Inicio de sesión** con correo institucional y contraseña para las dos cuentas compartidas.
- **Consulta con filtros combinables** para ambos roles:
  - Nombre del estudiante (búsqueda parcial).
  - Número de identificación (búsqueda parcial).
  - Programa académico (`Sistemas`, `Electricidad`).
  - Semestre (`1` a `10`).
  - Jornada (`Diurna`, `Nocturna`).
  - Tipo de incapacidad (`Médica`, `Laboral`, `Otra`).
  - Búsqueda por fecha específica con período inclusivo (`fecha_inicio <= fecha AND fecha_fin >= fecha`).
  - Atajo rápido **Incapacidades de hoy**.
- **Registro de incapacidades** (exclusivo para Unidad Académica): captura completa y validación de campos y fechas.
- **Edición y eliminación con confirmación** (exclusivo para Unidad Académica).
- **Diseño responsivo**: vista de tabla optimizada en escritorio y tarjetas legibles en dispositivos móviles.

---

## Estructura del Proyecto

```
src/
  auth/
    AuthContext.tsx              # Contexto de autenticación y carga de rol
  lib/
    auth-helpers.ts              # Extracción segura de app_metadata y etiquetas
    supabase.ts                  # Cliente de Supabase y mapeo de errores en español
    validations.ts               # Reglas de validación de formularios
    dates.ts                     # Formato y utilidades de fechas en español
    utils.ts                     # Funciones utilitarias de estilos
  config/
    academic-options.ts          # Programas, semestres, jornadas y tipos
  services/
    incapacidades.ts             # Consultas, guardado, edición y borrado
  types/
    auth.ts                      # Tipos de roles ('unidad_academica' | 'docente')
    incapacidad.ts               # Tipos de incapacidades, filtros y formularios
  pages/
    LoginPage.tsx                # Pantalla de ingreso en español
    ConsultarPage.tsx            # Vista compartida de consulta con acciones condicionales
    RegistrarPage.tsx            # Formulario de registro (protegido por rol)
  components/
    incapacidades/
      IncapacidadFilters.tsx     # Filtros combinables y atajo de hoy
      IncapacidadForm.tsx        # Formulario de registro y edición
      IncapacidadList.tsx        # Tabla escritorio / tarjetas móvil con RBAC
    layout/
      AppLayout.tsx              # Barra superior con rol actual y navegación dinámica
    ui/                          # Componentes base (Alert, Button, Dialog, Input, etc.)
supabase/
  migrations/
    001_create_incapacidades.sql # Creación de tabla e índices con RLS
    002_rbac_policies.sql        # Políticas RLS estrictas por rol
  assign_roles.sql               # Script SQL para asignar roles a las dos cuentas
  seed.sql                       # Datos de prueba ficticios
```

---

## Configuración y Base de Datos (Supabase)

### 1. Variables de Entorno

Copie `.env.example` a `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...   # Clave anon pública, NUNCA use service_role
```

### 2. Aplicar Migraciones

En el **SQL Editor** del Dashboard de Supabase, ejecute en orden:
1. `supabase/migrations/001_create_incapacidades.sql` (crea la tabla e índices).
2. `supabase/migrations/002_rbac_policies.sql` (aplica las políticas RLS definitivas).
3. (Opcional) `supabase/seed.sql` para cargar registros de prueba.

### 3. Configurar Cuentas y Asignar Roles

Cree dos usuarios en **Authentication > Users** (uno para la Unidad Académica y otro para Docentes).

Luego, en el **SQL Editor** de Supabase, ejecute `supabase/assign_roles.sql` sustituyendo los correos de sus cuentas:

```sql
-- 1. Rol administrativo para Unidad Académica
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'unidad_academica')
where email = 'unidad.academica@unintep.edu.co';

-- 2. Rol de consulta para Docentes
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'docente')
where email = 'docentes@unintep.edu.co';
```

Alternativamente, puede asignarlos desde la interfaz gráfica de Supabase:
- Ir a **Authentication** > **Users**.
- Seleccionar el usuario y ubicar la sección de metadatos de la aplicación (**App Metadata**).
- Agregar `"role": "unidad_academica"` o `"role": "docente"`.

---

## Ejecución del Proyecto

Requisitos: Node.js 20 o superior.

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción y verificar TypeScript
npm run build

# Ejecutar verificación de pruebas RBAC
node --experimental-strip-types test-rbac.ts
```

---

## Matriz de Verificación de Seguridad

| Escenario | Unidad Académica | Docente | Usuario sin Rol |
|---|---|---|---|
| Iniciar sesión | Sí | Sí | Sí (ve pantalla de acceso denegado) |
| Consultar registros (SELECT) | Permitido por RLS | Permitido por RLS | Bloqueado por RLS |
| Usar filtros y búsqueda de hoy | Disponible | Disponible | Bloqueado |
| Ver enlace "Registrar incapacidad" | Visible | Oculto | Oculto |
| Acceder a la ruta `/registrar` | Acceso permitido | Redirige a `/` | Redirige a `/login` / Bloqueado |
| Ver botones "Editar" y "Eliminar" | Visibles | Ocultos | Ocultos |
| Crear registro (INSERT API) | Permitido por RLS | Rechazado (Error 42501) | Rechazado (Error 42501) |
| Actualizar registro (UPDATE API) | Permitido por RLS | Rechazado (Error 42501) | Rechazado (Error 42501) |
| Borrar registro (DELETE API) | Permitido por RLS | Rechazado (Error 42501) | Rechazado (Error 42501) |
| Manipulación de `user_metadata` | No altera permisos | No altera permisos | No altera permisos |
