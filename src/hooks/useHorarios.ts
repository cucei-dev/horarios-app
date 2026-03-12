import { useState, useEffect } from 'react'
import { fetchAllHorarios } from '../api/horariosApi'
import type { Horario } from '../types'

interface UseHorariosParams {
  calendario_id: number | null
  edificio_id: number | null
  dia?: number | null
  aula_id?: number | null
}

interface LoadedFor {
  calendario_id: number
  edificio_id: number
  dia: number | null | undefined
  aula_id: number | null | undefined
}

interface State {
  horarios: Horario[]
  error: string | null
  loadedFor: LoadedFor | null
}

function paramsMatch(a: LoadedFor | null, b: LoadedFor): boolean {
  return (
    a !== null &&
    a.calendario_id === b.calendario_id &&
    a.edificio_id === b.edificio_id &&
    a.dia === b.dia &&
    a.aula_id === b.aula_id
  )
}

export function useHorarios({ calendario_id, edificio_id, dia, aula_id }: UseHorariosParams) {
  const [state, setState] = useState<State>({ horarios: [], error: null, loadedFor: null })

  useEffect(() => {
    if (!calendario_id || !edificio_id) return
    fetchAllHorarios({ calendario_id, edificio_id, dia: dia ?? undefined, aula_id: aula_id ?? undefined })
      .then((horarios) =>
        setState({ horarios, error: null, loadedFor: { calendario_id, edificio_id, dia, aula_id } })
      )
      .catch((e: Error) =>
        setState({ horarios: [], error: e.message, loadedFor: { calendario_id, edificio_id, dia, aula_id } })
      )
  }, [calendario_id, edificio_id, dia, aula_id])

  if (!calendario_id || !edificio_id) return { horarios: [], loading: false, error: null }

  const target: LoadedFor = { calendario_id, edificio_id, dia, aula_id }
  const loading = !paramsMatch(state.loadedFor, target)

  return { horarios: state.horarios, loading, error: state.error }
}


