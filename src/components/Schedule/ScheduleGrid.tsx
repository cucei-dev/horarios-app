import type { Horario } from '../../types'
import { ClassCard } from '../ClassCard/ClassCard'

interface Column {
  id: string | number
  label: string
}

interface ScheduleGridProps {
  columns: Column[]
  horarios: Horario[]
  /** Returns the column id for a given horario */
  getColumnId: (h: Horario) => string | number
  emptyMessage?: string
}

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function buildTimeSlots(horarios: Horario[]): string[] {
  const set = new Set<string>()
  for (const h of horarios) {
    set.add(h.hora_inicio)
    set.add(h.hora_fin)
  }
  return [...set].sort()
}

interface Slot {
  start: string
  end: string
  startMin: number
  endMin: number
}

function buildSlots(horarios: Horario[]): Slot[] {
  const times = buildTimeSlots(horarios)
  const slots: Slot[] = []
  for (let i = 0; i < times.length - 1; i++) {
    slots.push({
      start: times[i],
      end: times[i + 1],
      startMin: toMinutes(times[i]),
      endMin: toMinutes(times[i + 1]),
    })
  }
  return slots
}

export function ScheduleGrid({
  columns,
  horarios,
  getColumnId,
  emptyMessage = 'No hay clases para mostrar.',
}: ScheduleGridProps) {
  if (horarios.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-[#94a3b8] text-sm">
        {emptyMessage}
      </div>
    )
  }

  const slots = buildSlots(horarios)

  return (
    <div className="overflow-x-auto rounded-xl border border-[#2e3347]">
      <table className="border-collapse w-full min-w-max">
        <thead>
          <tr className="bg-[#1a1d27]">
            <th className="sticky left-0 z-10 bg-[#1a1d27] px-3 py-3 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider border-b border-r border-[#2e3347] min-w-[80px]">
              Hora
            </th>
            {columns.map((col) => (
              <th
                key={col.id}
                className="px-3 py-3 text-left text-xs font-semibold text-[#e2e8f0] uppercase tracking-wider border-b border-r border-[#2e3347] min-w-[180px] last:border-r-0"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot, i) => {
            const rowHorarios = horarios.filter(
              (h) =>
                toMinutes(h.hora_inicio) < slot.endMin &&
                toMinutes(h.hora_fin) > slot.startMin
            )

            return (
              <tr
                key={slot.start}
                className={i % 2 === 0 ? 'bg-[#0f1117]' : 'bg-[#12151f]'}
              >
                <td className="sticky left-0 z-10 px-3 py-2 text-xs text-[#94a3b8] font-mono border-r border-b border-[#2e3347] align-top whitespace-nowrap bg-inherit">
                  {slot.start.slice(0, 5)}
                  <span className="text-[#4a5270]"> – {slot.end.slice(0, 5)}</span>
                </td>
                {columns.map((col) => {
                  const cell = rowHorarios.filter((h) => getColumnId(h) === col.id)
                  return (
                    <td
                      key={col.id}
                      className="px-2 py-2 border-r border-b border-[#2e3347] align-top last:border-r-0"
                    >
                      {cell.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {cell.map((h) => (
                            <ClassCard key={h._id} horario={h} />
                          ))}
                        </div>
                      ) : null}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
