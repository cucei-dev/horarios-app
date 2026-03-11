import { useState, useEffect } from 'react'
import { fetchCentros } from '../api/siiapi'
import type { Centro } from '../types'

interface State {
  centros: Centro[]
  loading: boolean
  error: string | null
}

export function useCentros() {
  const [state, setState] = useState<State>({ centros: [], loading: true, error: null })

  useEffect(() => {
    fetchCentros()
      .then((centros) => setState({ centros, loading: false, error: null }))
      .catch((e: Error) => setState({ centros: [], loading: false, error: e.message }))
  }, [])

  return state
}

