import type { HorariosResponse, Horario } from '../types'

const BASE = import.meta.env.VITE_HORARIOS_URL as string

interface HorariosParams {
  calendario_id: number
  edificio_id: number
  aula_id?: number
  dia?: number
}

export async function fetchAllHorarios(params: HorariosParams): Promise<Horario[]> {
  const results: Horario[] = []
  const limit = 100
  let skip = 0
  let total = Infinity

  while (results.length < total) {
    const url = new URL(`${BASE}/horarios`)
    url.searchParams.set('calendario_id', String(params.calendario_id))
    url.searchParams.set('edificio_id', String(params.edificio_id))
    if (params.aula_id != null) url.searchParams.set('aula_id', String(params.aula_id))
    if (params.dia != null) url.searchParams.set('dia', String(params.dia))
    url.searchParams.set('skip', String(skip))
    url.searchParams.set('limit', String(limit))

    const res = await fetch(url.toString())
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
    const data: HorariosResponse<Horario> = await res.json()

    total = data.total
    results.push(...data.results)
    skip += data.results.length

    if (data.results.length < limit) break
  }

  return results
}
