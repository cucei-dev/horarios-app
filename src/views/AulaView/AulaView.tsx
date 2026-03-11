import { useState, useMemo } from 'react'
import type { Horario, Aula } from '../../types'
import { DIAS } from '../../types'
import { ScheduleGrid } from '../../components/Schedule/ScheduleGrid'

interface AulaViewProps {
  horarios: Horario[]
  aulas: Aula[]
}

const selectClass =
  'bg-[#22263a] border border-[#2e3347] text-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer min-w-[160px]'

export function AulaView({ horarios, aulas }: AulaViewProps) {
  const [selectedAula, setSelectedAula] = useState<number | null>(
    aulas.length > 0 ? aulas[0].id : null
  )

  const filtered = useMemo(
    () => (selectedAula ? horarios.filter((h) => h.aula_id === selectedAula) : []),
    [horarios, selectedAula]
  )

  const diasConClases = useMemo(() => {
    const ids = new Set(filtered.map((h) => h.dia))
    return DIAS.filter((d) => ids.has(d.id)).map((d) => ({ id: d.id, label: d.name }))
  }, [filtered])

  const aulaName = aulas.find((a) => a.id === selectedAula)?.name ?? ''

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
            {aulas.length === 0 && <option value="">Sin aulas</option>}
            {aulas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">▾</span>
        </div>
      </div>

      <ScheduleGrid
        columns={diasConClases}
        horarios={filtered}
        getColumnId={(h) => h.dia}
        emptyMessage={selectedAula ? `No hay clases en el aula ${aulaName}.` : 'Selecciona un aula.'}
      />
    </div>
  )
}
