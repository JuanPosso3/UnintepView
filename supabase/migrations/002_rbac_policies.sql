-- Migración 002: Control de Acceso Basado en Roles (RBAC) para incapacidades
-- Roles implementados:
--   - 'unidad_academica': Permisos completos (SELECT, INSERT, UPDATE, DELETE)
--   - 'docente': Consulta únicamente (SELECT)
--
-- Los roles se almacenan y verifican de forma segura a través de `app_metadata` en Supabase Auth
-- (auth.jwt() -> 'app_metadata' ->> 'role'). Los usuarios NO pueden modificar este campo desde el frontend.

-- 1. Mantener o habilitar Row Level Security (RLS) en la tabla incapacidades
alter table public.incapacidades enable row level security;

-- 2. Eliminar políticas permisivas anteriores de la migración inicial o versiones previas
drop policy if exists "authenticated_select_incapacidades" on public.incapacidades;
drop policy if exists "authenticated_insert_incapacidades" on public.incapacidades;
drop policy if exists "authenticated_update_incapacidades" on public.incapacidades;
drop policy if exists "authenticated_delete_incapacidades" on public.incapacidades;

drop policy if exists "incapacidades_select_authorized" on public.incapacidades;
drop policy if exists "incapacidades_insert_unidad_academica" on public.incapacidades;
drop policy if exists "incapacidades_update_unidad_academica" on public.incapacidades;
drop policy if exists "incapacidades_delete_unidad_academica" on public.incapacidades;

-- 3. POLÍTICA DE CONSULTA (SELECT):
-- Permitida para usuarios autenticados que posean el rol 'unidad_academica' o 'docente'.
-- Usuarios anónimos o autenticados sin rol autorizado no pueden leer ningún registro.
create policy "incapacidades_select_authorized"
  on public.incapacidades
  for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('unidad_academica', 'docente')
  );

-- 4. POLÍTICA DE CREACIÓN (INSERT):
-- Permitida exclusivamente para usuarios autenticados con rol 'unidad_academica'.
create policy "incapacidades_insert_unidad_academica"
  on public.incapacidades
  for insert
  to authenticated
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'unidad_academica'
  );

-- 5. POLÍTICA DE ACTUALIZACIÓN (UPDATE):
-- Permitida exclusivamente para usuarios autenticados con rol 'unidad_academica'.
create policy "incapacidades_update_unidad_academica"
  on public.incapacidades
  for update
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'unidad_academica'
  )
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'unidad_academica'
  );

-- 6. POLÍTICA DE ELIMINACIÓN (DELETE):
-- Permitida exclusivamente para usuarios autenticados con rol 'unidad_academica'.
create policy "incapacidades_delete_unidad_academica"
  on public.incapacidades
  for delete
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'unidad_academica'
  );
