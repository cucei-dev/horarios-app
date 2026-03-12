import { useState, useMemo } from 'react'
import type { Aula } from '../../types'
import { DIAS } from '../../types'
import { useHorarios } from '../../hooks/useHorarios'
import { ScheduleGrid } from '../../components/Schedule/ScheduleGrid'

interface AulaViewProps {
  calendario_id: number
  edificio_id: number
  aulas: Aula[]
}

const selectClass =
  'bg-[#22263a] border border-[#2e3347] text-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer min-w-[160px]'

export function AulaView({ calendario_id, edificio_id, aulas }: AulaViewProps) {
  const sortedAulas = useMemo(
    () => [...aulas].sort((a, b) => a.name.localeCompare(b.name)),
    [aulas]
  )

  const [selectedAula, setSelectedAula] = useState<number | null>(
    sortedAulas.length > 0 ? sortedAulas[0].id : null
  )

  const { data: horarios = [], isLoading: loading, error } = useHorarios({
    calendario_id,
    edificio_id,
    aula_id: selectedAula,
  })

  const diasConClases = useMemo(() => {
    const ids = new Set(horarios.map((h) => h.dia))
    return DIAS.filter((d) => ids.has(d.id)).map((d) => ({ id: d.id, label: d.name }))
  }, [horarios])

  const aulaName = sortedAulas.find((a) => a.id === selectedAula)?.name ?? ''

  const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
          Aula
        </label>
        <div className="relative">
          <select
            className={selectClass}
            value={selectedAula ?? ''}
            onChange={(e) => setSelectedAula(e.target.value ? Number(e.target.value) : null)}
          >
            {sortedAulas.length === 0 && <option value="">Sin aulas</option>}
            {sortedAulas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">▾</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40 gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-[#94a3b8] text-sm">Cargando...</span>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-500/40 rounded-xl px-6 py-4 text-red-400 text-sm">
          <p className="font-medium mb-1">Error al cargar los horarios</p>
          <p className="text-red-500/80 text-xs">{errorMessage}</p>
        </div>
      ) : (
        <ScheduleGrid
          columns={diasConClases}
          horarios={horarios}
          getColumnId={(h) => h.dia}
          emptyMessage={selectedAula ? `No hay clases en el aula ${aulaName}.` : 'Selecciona un aula.'}
        />
      )}
    </div>
  )
}

