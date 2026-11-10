import assert from 'node:assert'
import { extractUserRole, formatRoleLabel } from './src/lib/auth-helpers.ts'

console.log('--- Iniciando Pruebas de Lógica RBAC ---')

// 1. Prueba de sesión nula
assert.strictEqual(extractUserRole(null), null, 'Debe retornar null si no hay sesión')
assert.strictEqual(formatRoleLabel(null), 'Sin rol autorizado', 'Label correcto para rol nulo')

// 2. Prueba de sesión sin metadatos de rol
const sessionWithoutRole = {
  user: {
    id: 'user-1',
    app_metadata: {},
    user_metadata: {},
  },
}
assert.strictEqual(extractUserRole(sessionWithoutRole), null, 'Debe ser null si app_metadata no tiene rol')

// 3. Prueba de seguridad: Intento de auto-asignación mediante user_metadata
const sessionWithSpoofedUserMetadata = {
  user: {
    id: 'user-2',
    app_metadata: {},
    user_metadata: { role: 'unidad_academica' }, // Un usuario intentando engañar la app
  },
}
assert.strictEqual(
  extractUserRole(sessionWithSpoofedUserMetadata),
  null,
  'CRÍTICO: No debe confiar en user_metadata bajo ninguna circunstancia',
)

// 4. Prueba de rol Docente válido
const sessionDocente = {
  user: {
    id: 'user-3',
    app_metadata: { role: 'docente' },
    user_metadata: {},
  },
}
assert.strictEqual(extractUserRole(sessionDocente), 'docente', 'Debe reconocer el rol docente')
assert.strictEqual(formatRoleLabel('docente'), 'Docente', 'Label correcto para docente')

// 5. Prueba de rol Unidad Académica válido
const sessionAdmin = {
  user: {
    id: 'user-4',
    app_metadata: { role: 'unidad_academica' },
    user_metadata: {},
  },
}
assert.strictEqual(extractUserRole(sessionAdmin), 'unidad_academica', 'Debe reconocer el rol unidad_academica')
assert.strictEqual(formatRoleLabel('unidad_academica'), 'Unidad Académica', 'Label correcto para unidad_academica')

// 6. Prueba de rol desconocido o malicioso
const sessionUnknownRole = {
  user: {
    id: 'user-5',
    app_metadata: { role: 'superadmin' },
    user_metadata: {},
  },
}
assert.strictEqual(extractUserRole(sessionUnknownRole), null, 'Debe rechazar roles desconocidos')

console.log('✓ Todas las pruebas de lógica RBAC se ejecutaron y pasaron exitosamente.')
