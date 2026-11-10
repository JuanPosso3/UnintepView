-- Datos ficticios para demostración. Ejecutar después de la migración.
-- No usar datos reales de estudiantes.

insert into public.incapacidades (
  nombre_estudiante,
  numero_identificacion,
  programa,
  semestre,
  jornada,
  tipo_incapacidad,
  fecha_inicio,
  fecha_fin,
  observaciones
) values
  (
    'Ana María Gómez Pérez',
    '1002345678',
    'Sistemas',
    3,
    'Diurna',
    'Médica',
    '2026-10-08',
    '2026-10-10',
    'Incapacidad de tres días. Ejemplo de rango inclusivo.'
  ),
  (
    'Carlos Andrés Ruiz',
    '0011223344',
    'Electricidad',
    5,
    'Nocturna',
    'Laboral',
    '2026-10-16',
    '2026-10-20',
    null
  ),
  (
    'Luisa Fernanda Castro',
    null,
    'Sistemas',
    1,
    'Diurna',
    'Otra',
    '2026-10-14',
    '2026-10-18',
    'Calamidad doméstica. Sin número de identificación en el registro.'
  );
