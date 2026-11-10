-- ==============================================================================
-- Script de Asignación y Verificación de Roles en Supabase (RBAC)
-- Ejecutar en el SQL Editor del Dashboard de Supabase con permisos de administrador
-- ==============================================================================

-- Reemplace los siguientes correos electrónicos con los correos reales de sus dos cuentas compartidas:
-- Cuenta administrativa: 'unidad.academica@unintep.edu.co'
-- Cuenta de consulta:     'docentes@unintep.edu.co'

-- 1. Asignar rol 'unidad_academica' a la cuenta administrativa del departamento:
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'unidad_academica')
where email = 'unidad.academica@unintep.edu.co';

-- 2. Asignar rol 'docente' a la cuenta compartida de consulta docente:
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'docente')
where email = 'docentes@unintep.edu.co';

-- 3. Verificar que los roles hayan sido asignados correctamente:
select 
  id, 
  email, 
  raw_app_meta_data->>'role' as rol_asignado,
  last_sign_in_at
from auth.users
where email in ('unidad.academica@unintep.edu.co', 'docentes@unintep.edu.co');

-- NOTA DE SEGURIDAD:
-- Los roles quedan guardados en `raw_app_meta_data`, el cual se propaga como `app_metadata`
-- en los JWT emitidos por Supabase. Esta información NO puede ser modificada por los
-- usuarios mediante la API de cliente de Supabase (a diferencia de `user_metadata`).
-- Si una cuenta ya tenía una sesión activa, el usuario debe cerrar sesión e ingresar
-- de nuevo para que el JWT se actualice con los nuevos reclamos.
