import { useState, useMemo } from 'react'
import type { Horario, Aula } from '../../types'
import { DIAS } from '../../types'
import { ScheduleGrid } from '../../components/Schedule/ScheduleGrid'

interface DayViewProps {
  horarios: Horario[]
  aulas: Aula[]
}

export function DayView({ horarios, aulas }: DayViewProps) {
  const [selectedDia, setSelectedDia] = useState<number>(1)

  const filtered = useMemo(
    () => horarios.filter((h) => h.dia === selectedDia),
    [horarios, selectedDia]
  )

  // Only show aulas that have at least one class this day
  const aulaColumns = useMemo(() => {
    const idsWithClasses = new Set(filtered.map((h) => h.aula_id))
    const ordered = aulas
      .filter((a) => idsWithClasses.has(a.id))
      .sort((a, b) => a.name.localeCompare(b.name))
    return ordered.map((a) => ({ id: a.id, label: a.name }))
  }, [filtered, aulas])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 flex-wrap">
        {DIAS.map((dia) => (
          <button
            key={dia.id}
            onClick={() => setSelectedDia(dia.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
              selectedDia === dia.id
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-[#1a1d27] border-[#2e3347] text-[#94a3b8] hover:border-indigo-500/50 hover:text-[#e2e8f0]'
            }`}
          >
            {dia.name}
          </button>
        ))}
      </div>

      <ScheduleGrid
        columns={aulaColumns}
        horarios={filtered}
        getColumnId={(h) => h.aula_id}
        emptyMessage={`No hay clases el ${DIAS.find((d) => d.id === selectedDia)?.name}.`}
      />
    </div>
  )
}
