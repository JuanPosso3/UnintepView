import { JORNADAS, PROGRAMAS, SEMESTRES, TIPOS_INCAPACIDAD } from '@/config/academic-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { todayISO } from '@/lib/dates'
import type { IncapacidadFilters as Filters } from '@/types/incapacidad'

type Props = {
  filters: Filters
  onChange: (filters: Filters) => void
  onClear: () => void
}

export function IncapacidadFilters({ filters, onChange, onClear }: Props) {
  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold text-slate-900">Filtros de búsqueda</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => update('fecha', todayISO())}>
            Incapacidades de hoy
          </Button>
          <Button variant="outline" onClick={onClear}>
            Limpiar filtros
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="filtro_programa">Programa</Label>
          <Select
            id="filtro_programa"
            value={filters.programa}
            onChange={(event) => update('programa', event.target.value as Filters['programa'])}
          >
            <option value="">Todos</option>
            {PROGRAMAS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="filtro_semestre">Semestre</Label>
          <Select
            id="filtro_semestre"
            value={filters.semestre}
            onChange={(event) => update('semestre', event.target.value ? Number(event.target.value) : '')}
          >
            <option value="">Todos</option>
            {SEMESTRES.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="filtro_jornada">Jornada</Label>
          <Select
            id="filtro_jornada"
            value={filters.jornada}
            onChange={(event) => update('jornada', event.target.value as Filters['jornada'])}
          >
            <option value="">Todas</option>
            {JORNADAS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="filtro_tipo">Tipo de incapacidad</Label>
          <Select
            id="filtro_tipo"
            value={filters.tipo_incapacidad}
            onChange={(event) =>
              update('tipo_incapacidad', event.target.value as Filters['tipo_incapacidad'])
            }
          >
            <option value="">Todos</option>
            {TIPOS_INCAPACIDAD.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="filtro_nombre">Nombre del estudiante</Label>
          <Input
            id="filtro_nombre"
            value={filters.nombre_estudiante}
            onChange={(event) => update('nombre_estudiante', event.target.value)}
            placeholder="Búsqueda parcial"
          />
        </div>
        <div>
          <Label htmlFor="filtro_identificacion">Número de identificación</Label>
          <Input
            id="filtro_identificacion"
            value={filters.numero_identificacion}
            onChange={(event) => update('numero_identificacion', event.target.value)}
            placeholder="Búsqueda parcial"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="filtro_fecha">Fecha específica</Label>
          <Input
            id="filtro_fecha"
            type="date"
            value={filters.fecha}
            onChange={(event) => update('fecha', event.target.value)}
          />
          <p className="mt-1 text-xs text-slate-500">
            Muestra registros cuyo período incluye esa fecha (inicio y fin inclusive).
          </p>
        </div>
      </div>
    </section>
  )
}
