import type { Calendario, Centro, Edificio } from "../../types";

interface FiltersProps {
  calendarios: Calendario[];
  centros: Centro[];
  selectedCalendario: number | null;
  selectedCentro: number | null;
  selectedEdificio: number | null;
  onCalendarioChange: (id: number | null) => void;
  onCentroChange: (id: number | null) => void;
  onEdificioChange: (id: number | null) => void;
  loading?: boolean;
}

const selectClass =
  "w-full bg-[#22263a] border border-[#2e3347] text-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed appearance-none cursor-pointer";

export function Filters({
  calendarios,
  centros,
  selectedCalendario,
  selectedCentro,
  selectedEdificio,
  onCalendarioChange,
  onCentroChange,
  onEdificioChange,
  loading,
}: FiltersProps) {
  const edificios: Edificio[] = (
    centros.find((c) => c.id === selectedCentro)?.edificios ?? []
  )
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="flex flex-col gap-1 min-w-[160px] flex-1">
        <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
          Calendario
        </label>
        <div className="relative">
          <select
            className={selectClass}
            value={selectedCalendario ?? ""}
            disabled={loading || calendarios.length === 0}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              onCalendarioChange(val);
            }}
          >
            <option value="">Seleccionar...</option>
            {calendarios.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            ▾
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 min-w-[200px] flex-1">
        <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
          Centro Universitario
        </label>
        <div className="relative">
          <select
            className={selectClass}
            value={selectedCentro ?? ""}
            disabled={loading || !selectedCalendario}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              onCentroChange(val);
            }}
          >
            <option value="">Seleccionar...</option>
            {centros.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            ▾
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1 min-w-[160px] flex-1">
        <label className="text-xs font-medium text-[#94a3b8] uppercase tracking-wider">
          Edificio
        </label>
        <div className="relative">
          <select
            className={selectClass}
            value={selectedEdificio ?? ""}
            disabled={loading || !selectedCentro || edificios.length === 0}
            onChange={(e) => {
              const val = e.target.value ? Number(e.target.value) : null;
              onEdificioChange(val);
            }}
          >
            <option value="">Seleccionar...</option>
            {edificios.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            ▾
          </span>
        </div>
      </div>
    </div>
  );
}
