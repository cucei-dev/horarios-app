import { useState, useEffect } from 'react'
import { useCalendarios } from './hooks/useCalendarios'
import { useCentros } from './hooks/useCentros'
import { fetchAulas } from './api/siiapi'
import { Filters } from './components/Filters/Filters'
import { DayView } from './views/DayView/DayView'
import { AulaView } from './views/AulaView/AulaView'
import type { Aula } from './types'

type ViewMode = 'day' | 'aula'

function App() {
  const { calendarios, loading: loadingCals } = useCalendarios()
  const { centros, loading: loadingCentros } = useCentros()

  const [selectedCalendario, setSelectedCalendario] = useState<number | null>(null)
  const [selectedCentro, setSelectedCentro] = useState<number | null>(null)
  const [selectedEdificio, setSelectedEdificio] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('day')
  const [aulasState, setAulasState] = useState<{ aulas: Aula[]; loadedFor: number | null }>({
    aulas: [],
    loadedFor: null,
  })

  useEffect(() => {
    if (!selectedEdificio) return
    fetchAulas(selectedEdificio)
      .then((aulas) => setAulasState({ aulas, loadedFor: selectedEdificio }))
      .catch((e) => { console.error(e); setAulasState({ aulas: [], loadedFor: selectedEdificio }) })
  }, [selectedEdificio])

  const currentAulas = selectedEdificio ? aulasState.aulas : []
  const loadingAulas = !!(selectedEdificio && aulasState.loadedFor !== selectedEdificio)
  const isLoading = loadingCals || loadingCentros || loadingAulas

  return (
    <div className="min-h-screen bg-[#0f1117] text-[#e2e8f0] flex flex-col">
      {/* Navbar */}
      <header className="border-b border-[#2e3347] bg-[#1a1d27] px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">Horarios de Aulas</h1>
            <p className="text-xs text-[#94a3b8]">Consulta la disponibilidad de aulas</p>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="border-b border-[#2e3347] bg-[#12151f] px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex flex-col gap-4">
          <Filters
            calendarios={calendarios}
            centros={centros}
            selectedCalendario={selectedCalendario}
            selectedCentro={selectedCentro}
            selectedEdificio={selectedEdificio}
            onCalendarioChange={(id) => {
              setSelectedCalendario(id)
              setSelectedCentro(null)
              setSelectedEdificio(null)
            }}
            onCentroChange={(id) => {
              setSelectedCentro(id)
              setSelectedEdificio(null)
            }}
            onEdificioChange={setSelectedEdificio}
            loading={isLoading}
          />

          {/* View toggle */}
          {selectedEdificio && !loadingAulas && (
            <div className="flex gap-1 self-start bg-[#0f1117] rounded-lg p-1 border border-[#2e3347]">
              {(['day', 'aula'] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                    viewMode === mode
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-[#94a3b8] hover:text-[#e2e8f0]'
                  }`}
                >
                  {mode === 'day' ? 'Por Día' : 'Por Aula'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-6 py-6">
        <div className="max-w-screen-2xl mx-auto">
          {!selectedEdificio ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1d27] border border-[#2e3347] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-[#94a3b8] text-sm">
                Selecciona un calendario, centro universitario y edificio para ver los horarios.
              </p>
            </div>
          ) : loadingAulas ? (
            <div className="flex items-center justify-center h-64 gap-3">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[#94a3b8] text-sm">Cargando aulas...</span>
            </div>
          ) : viewMode === 'day' ? (
            <DayView
              calendario_id={selectedCalendario!}
              edificio_id={selectedEdificio}
            />
          ) : (
            <AulaView
              calendario_id={selectedCalendario!}
              edificio_id={selectedEdificio}
              aulas={currentAulas}
            />
          )}
        </div>
      </main>
    </div>
  )
}

export default App


