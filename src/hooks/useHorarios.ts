import { useState, useEffect } from 'react'
import { fetchAllHorarios } from '../api/horariosApi'
import type { Horario } from '../types'

interface UseHorariosParams {
  calendario_id: number | null
  edificio_id: number | null
}

interface State {
  horarios: Horario[]
  error: string | null
  loadedFor: { calendario_id: number; edificio_id: number } | null
}

export function useHorarios({ calendario_id, edificio_id }: UseHorariosParams) {
  const [state, setState] = useState<State>({ horarios: [], error: null, loadedFor: null })

  useEffect(() => {
    if (!calendario_id || !edificio_id) return
    fetchAllHorarios({ calendario_id, edificio_id })
      .then((horarios) =>
        setState({ horarios, error: null, loadedFor: { calendario_id, edificio_id } })
      )
      .catch((e: Error) =>
        setState({ horarios: [], error: e.message, loadedFor: { calendario_id, edificio_id } })
      )
  }, [calendario_id, edificio_id])

  if (!calendario_id || !edificio_id) return { horarios: [], loading: false, error: null }

  const loading =
    state.loadedFor?.calendario_id !== calendario_id ||
    state.loadedFor?.edificio_id !== edificio_id

  return { horarios: state.horarios, loading, error: state.error }
}

