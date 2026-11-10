-- Tabla principal de incapacidades académicas
-- Ejecutar en el SQL Editor de Supabase o mediante la CLI.

create table if not exists public.incapacidades (
  id uuid primary key default gen_random_uuid(),
  nombre_estudiante text not null,
  numero_identificacion text,
  programa text not null,
  semestre integer not null,
  jornada text not null,
  tipo_incapacidad text not null,
  fecha_inicio date not null,
  fecha_fin date not null,
  observaciones text,
  created_at timestamptz not null default now(),

  constraint incapacidades_nombre_estudiante_chk
    check (char_length(btrim(nombre_estudiante)) > 0),

  constraint incapacidades_programa_chk
    check (programa in ('Ingeniería Informática', 'Diseño Visual Digital')),

  constraint incapacidades_semestre_chk
    check (semestre between 1 and 10),

  constraint incapacidades_jornada_chk
    check (jornada in ('Diurna', 'Nocturna')),

  constraint incapacidades_tipo_chk
    check (tipo_incapacidad in ('Médica', 'Laboral', 'Otra')),

  constraint incapacidades_fechas_chk
    check (fecha_fin >= fecha_inicio)
);

create index if not exists incapacidades_programa_idx
  on public.incapacidades (programa);

create index if not exists incapacidades_semestre_idx
  on public.incapacidades (semestre);

create index if not exists incapacidades_jornada_idx
  on public.incapacidades (jornada);

create index if not exists incapacidades_tipo_idx
  on public.incapacidades (tipo_incapacidad);

create index if not exists incapacidades_fechas_idx
  on public.incapacidades (fecha_inicio, fecha_fin);

create index if not exists incapacidades_created_at_idx
  on public.incapacidades (created_at desc);

create index if not exists incapacidades_nombre_idx
  on public.incapacidades (nombre_estudiante);

create index if not exists incapacidades_identificacion_idx
  on public.incapacidades (numero_identificacion);

alter table public.incapacidades enable row level security;

-- Acceso mediante Control de Acceso Basado en Roles (RBAC):
-- Roles autorizados: 'unidad_academica' (gestión total) y 'docente' (solo lectura).
-- Los roles se validan de forma segura a través de `app_metadata` en Supabase Auth.
-- No habilitar políticas para `anon`: el frontend no debe leer ni escribir sin iniciar sesión.

drop policy if exists "authenticated_select_incapacidades" on public.incapacidades;
drop policy if exists "authenticated_insert_incapacidades" on public.incapacidades;
drop policy if exists "authenticated_update_incapacidades" on public.incapacidades;
drop policy if exists "authenticated_delete_incapacidades" on public.incapacidades;

drop policy if exists "incapacidades_select_authorized" on public.incapacidades;
create policy "incapacidades_select_authorized"
  on public.incapacidades
  for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('unidad_academica', 'docente')
  );

drop policy if exists "incapacidades_insert_unidad_academica" on public.incapacidades;
create policy "incapacidades_insert_unidad_academica"
  on public.incapacidades
  for insert
  to authenticated
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'unidad_academica'
  );

drop policy if exists "incapacidades_update_unidad_academica" on public.incapacidades;
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

drop policy if exists "incapacidades_delete_unidad_academica" on public.incapacidades;
create policy "incapacidades_delete_unidad_academica"
  on public.incapacidades
  for delete
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'unidad_academica'
  );
