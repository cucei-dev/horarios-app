import { useState, useMemo } from "react";
import { DIAS } from "../../types";
import { useHorarios } from "../../hooks/useHorarios";
import { ScheduleGrid } from "../../components/Schedule/ScheduleGrid";

interface DayViewProps {
  calendario_id: number;
  edificio_id: number;
}

export function DayView({ calendario_id, edificio_id }: DayViewProps) {
  const [selectedDia, setSelectedDia] = useState<number>(1);

  const {
    data: horarios = [],
    isLoading: loading,
    error,
  } = useHorarios({ calendario_id, edificio_id, dia: selectedDia });

  const aulaColumns = useMemo(() => {
    const seen = new Map<number, string>();
    for (const h of horarios) {
      if (!seen.has(h.aula_id)) seen.set(h.aula_id, h.aula.name);
    }
    return [...seen.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, label]) => ({ id, label }));
  }, [horarios]);

  const errorMessage = error instanceof Error ? error.message : 'Error desconocido';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-1 flex-wrap">
        {DIAS.map((dia) => (
          <button
            key={dia.id}
            onClick={() => setSelectedDia(dia.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
              selectedDia === dia.id
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "bg-[#1a1d27] border-[#2e3347] text-[#94a3b8] hover:border-indigo-500/50 hover:text-[#e2e8f0]"
            }`}
          >
            {dia.name}
          </button>
        ))}
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
          columns={aulaColumns}
          horarios={horarios}
          getColumnId={(h) => h.aula_id}
          emptyMessage={`No hay clases el ${DIAS.find((d) => d.id === selectedDia)?.name}.`}
        />
      )}
    </div>
  );
}
