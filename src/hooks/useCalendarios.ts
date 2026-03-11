import { useState, useEffect } from 'react'
import { fetchCalendarios } from '../api/siiapi'
import type { Calendario } from '../types'

interface State {
  calendarios: Calendario[]
  loading: boolean
  error: string | null
}

export function useCalendarios() {
  const [state, setState] = useState<State>({ calendarios: [], loading: true, error: null })

  useEffect(() => {
    fetchCalendarios()
      .then((calendarios) => setState({ calendarios, loading: false, error: null }))
      .catch((e: Error) => setState({ calendarios: [], loading: false, error: e.message }))
  }, [])

  return state
}

