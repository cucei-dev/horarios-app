import type { Horario } from '../../types'

interface ClassCardProps {
  horario: Horario
}

const COLORS = [
  'border-indigo-500/60 bg-indigo-500/10',
  'border-violet-500/60 bg-violet-500/10',
  'border-sky-500/60 bg-sky-500/10',
  'border-emerald-500/60 bg-emerald-500/10',
  'border-amber-500/60 bg-amber-500/10',
  'border-rose-500/60 bg-rose-500/10',
  'border-cyan-500/60 bg-cyan-500/10',
  'border-fuchsia-500/60 bg-fuchsia-500/10',
]

function colorFor(nrc: string) {
  let hash = 0
  for (let i = 0; i < nrc.length; i++) hash = (hash * 31 + nrc.charCodeAt(i)) | 0
  return COLORS[Math.abs(hash) % COLORS.length]
}

export function ClassCard({ horario }: ClassCardProps) {
  const { seccion } = horario
  const inscritos = seccion.cupos - seccion.cupos_disponibles
  const color = colorFor(seccion.nrc)

  return (
    <div className={`rounded-md border ${color} p-2 text-xs flex flex-col gap-1 h-full min-h-[80px]`}>
      <div className="flex items-center justify-between gap-1">
        <span className="font-bold text-[#e2e8f0] truncate">{seccion.nrc}</span>
        <span className="text-[#94a3b8] whitespace-nowrap shrink-0">
          {inscritos}/{seccion.cupos}
        </span>
      </div>
      <p className="font-medium text-[#c8d3e8] leading-tight line-clamp-2">
        {seccion.materia.name}
      </p>
      <p className="text-[#94a3b8] truncate mt-auto">{seccion.profesor.name}</p>
      <p className="text-[#6b7a99] text-[10px]">
        {horario.hora_inicio.slice(0, 5)} – {horario.hora_fin.slice(0, 5)}
      </p>
    </div>
  )
}
